var express = require("express");
var bodyParser = require("body-parser");
var expressSession = require('express-session');
const MongoStore = require('connect-mongo')(expressSession);
// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
const mongoose = require('./config/database');
const User = mongoose.models.User;
const Post = mongoose.models.Post;
db = mongoose.connection;


const sessionStore = new MongoStore({ mongooseConnection: db, collection: 'sessions' });


var posts;

var app = express();
app.use(bodyParser.json());
var distDir = __dirname + "/dist/aureblog";
app.use(express.static(distDir));



app.use(expressSession({
  secret: "cats",
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // Equals 1 day (1 day * 24 hr/1 day * 60 min/1 hr * 60 sec/1 min * 1000 ms / 1 sec)
  }
}));
app.use(bodyParser.urlencoded({ extended: true }));


const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const verifyCallback = (username, password, done) => {

  User.findOne({ username: username })
    .then((user) => {

      if (!user) {
        console.log("no user" + username);
        return done("Unknown user", false)
      }

      const isValid = validPassword(password, user.hash, user.salt);

      if (isValid) {
        return done(null, user);
      } else {
        console.log("no password" + password);
        return done('Incorrect password', false);
      }
    })
    .catch((err) => {
      done(err);
    });

}
const strategy = new LocalStrategy(verifyCallback);
passport.use(strategy);
app.use(passport.initialize());
app.use(passport.session());
db.once('open', function () {
  // we're connected
  // Initialize the app.
  var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });
});

//////////////////////////////////////////////////


function validPassword(password, hash, salt) {
  return password === hash;
}

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((userId, done) => {
  User.findById(userId)
    .then((user) => {
      done(null, user);
    })
    .catch(err => done(err))
});

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({ "error": message });
};

isAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    console.log("we are authenticted")
    next();
  } else {
    console.log("we are not authenticated")
    req.session.returnTo = req.url;
    res.status(401).json({});
  }
}

/////////////////////////////////////////////////////
// login functions
app.get('/api/checkauth',
  isAuth, (req, res, next) => {
    console.log("api/checkauth: user is " + req.user);
    //res.status(200).json({message:"authenticated!"});
    res.json({ username: req.user.username, admin: req.user.admin })
  }
);

app.get('/api/register', (req, res, next) => {
  const form = '<h1>Register Page</h1><form method="post" action="register">\
                  Enter Username:<br><input type="text" name="username">\
                  <br>Enter Password:<br><input type="password" name="password">\
                  <br><br><input type="submit" value="Submit"></form>';

  res.send(form);
});

app.post('/api/register', (req, res, next) => {
  //const saltHash = genPassword(req.body.pw);
  //const salt = saltHash.salt;
  //const hash = saltHash.hash;
  const newUser = new User({
    username: req.body.username,
    hash: req.body.password,
    salt: "salt",
    admin: false
  });
  newUser.save()
    .then((user) => {
      console.log(user);
    });
  res.redirect('/');
});

const auth = () => {
  return (req, res, next) => {
    passport.authenticate('local', (error, user, info) => {
      console.log("error:" + error)
      if (error) {
        res.status(401).json(error);
      } else {
        req.login(user, function (error) {
          if (error) return next(error);
          next();
        });
      }
    })(req, res, next);
  }
}

app.post('/api/login', auth(), (req, res) => {
  console.log("going through /api/login")
  res.status(200).json({ username: req.user.username, admin: req.user.admin });
});

app.get('/api/logout', function (req, res) {
  console.log("trying to logout")
  req.logout();
  //res.redirect('/');
  res.json("logged out");
});

//////////////////////////////////////////////////////
// functional apis
/*  "/api/posts"
 *    GET: finds all posts
 *    POST: creates a new post
 *  "/api/articles"
 *    GET
 *    POST
 */

app.get("/api/posts", isAuth, async function (req, res) {
  let { page = 1, limit = 10, startDate = "0001-01-01", endDate = '9999-12-31', ratings = '1, 2, 3, 4, 5', partialTitle = '', director = '', award = '' } = req.query;
  let nbPages;
  if (endDate == '') {
    endDate = '9999-12-31'
  }
  if (partialTitle === '') {
    partialTitle = '.*';
  }
  const ratingsArray = ratings.split(',');
  console.log("entering get api/posts for page " + page + " and limit " + limit + "and startDate " + startDate + " and endDate " + endDate + " and ratings " + ratings + " and partialTitle " + partialTitle);
  const options = {
    page: page,
    limit: limit,
    //    collation: {
    //      locale: 'en'
    //    }
    sort: { 'date': -1, 'title': 1 },
  };
  try {
    //    posts = await Post.find({ date: { $gt: startDate } }).limit(limit * 1)
    //      .skip((page - 1) * limit);
    //    // get total documents in the Posts collection 
    //    const count = await Post.countDocuments();
    // , $lte: endDate
    // date: { $gte: startDate },
    let queryParams = { rating: { $in: ratingsArray } };
    let dateParams = { $gte: startDate };
    dateParams.$lte = endDate;
    let titleParams = { $regex: partialTitle, $options: 'i' };
    if (director !== '') {
      queryParams.directors = director;
    }
    if (award !== '') {
      queryParams.awards = award;
    }
    queryParams.date = dateParams;
    queryParams.title = titleParams;
    Post.paginate(queryParams, options, function (err, result) {
      posts = result.docs;
      nbPages = result.totalPages;
      console.log(posts);
      res.status(200).json({
        posts,
        nbPages: nbPages, //Math.ceil(count / limit),
        currentPage: parseInt(page)
      });
    });

  }
  catch (err) {
    handleError(res, err.message, "Failed to get posts.");
  }
});


app.post("/api/posts", async function (req, res) {
  console.log("the title is" + req.body.title);
  const post = new Post(req.body);

  try {
    await post.save();
    res.status(201).send(post);
  } catch (err) {
    res.status(500).send(err);
  }
});

/*  "/api/posts/:id"
 *    GET: find contact by id
 *    PUT: update contact by id
 *    DELETE: deletes contact by id
 */

app.get("/api/posts/:id", async function (req, res) {
  console.log("getting single post ");
  try {
    const post = await Post.findById(req.params.id)
    //wait postModel.save()
    res.status(200).json(post);
  } catch (err) {
    res.status(500).send(err)
  }
});

app.put("/api/posts/:id", async function (req, res) {
  console.log("updating single post " + req.body.title);
  try {
    await Post.findByIdAndUpdate(req.params.id, req.body)
    //wait postModel.save()
    res.send("updated")
  } catch (err) {
    res.status(500).send(err)
  }
});

app.delete("/api/posts/:id", async function (req, res) {
  console.log("deleting single post " + req.params.id);
  try {
    await Post.findByIdAndDelete(req.params.id)
    //wait postModel.save()
    res.json(req.params.id);
  } catch (err) {
    res.status(500).send(err)
  }
});
//////////////////////////////////////////////////
// posts API ROUTES BELOW
app.get('/*', function (req, res) {
  console.log("redirect to angular")
  res.sendFile(__dirname + '/dist/aureblog/index.html');
});

