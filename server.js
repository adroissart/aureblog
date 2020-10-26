var express = require("express");
var bodyParser = require("body-parser");
var expressSession = require('express-session')
//const mongoose = require('mongoose');
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

          if (!user) { return done(null, false) }
          
          const isValid = validPassword(password, user.hash, user.salt);
          
          if (isValid) {
              return done(null, user);
          } else {
              return done(null, false);
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



isAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
      console.log("we are authenticted")
      next();
  } else {
      console.log("we are not authenticated")
      req.session.returnTo = req.url;
      const link = '<h1>please authenticate</h1><a href=\'/login\'>login</a>'
      res.status(401).json({"link":link});
  }
}




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

const isLoggedIn = (req, res, next) => {
  console.log("is logged in")
  if(req.isAuthenticated()){
      return next()
  }
  return res.status(400).json({"statusCode" : 400, "message" : "not authenticated"})
}


db.once('open', function() {
  // we're connected!
    
    // Initialize the app.
    var server = app.listen(process.env.PORT || 8080, function () {
      var port = server.address().port;
      console.log("App now running on port", port);
    });
});


// Connect to the database before starting the application server.
//mongoconnection.MongoClient.connect(process.env.MONGOconnection_URI || "mongoconnection://localhost:27017/test", function (err, client) {
//  if (err) {
//    console.log(err);
//    process.exit(1);
//  }

//  // Save database object from the callback for reuse.
//  db = client.db();
//  console.log("Database connection ready");

//  // Initialize the app.
//  var server = app.listen(process.env.PORT || 8080, function () {
//    var port = server.address().port;
//    console.log("App now running on port", port);
//  });
//});



// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
    console.log("ERROR: " + reason);
    res.status(code || 500).json({"error": message});
  };

app.get('/test',
    isAuth, (req, res, next) => {
      console.log("are we authenticated?");
      res.status(200).json({"state":"authenticated!"});
    }
);
app.get('/test3',
    passport.authenticate('local', { successRedirect: '/',
                                      failureRedirect: '/test4'})
);
app.get('/test4', function(req, res) {
  console.log("test4");
  res.send("failure on login")
});
app.get('/test2',function(req, res) {
  console.log("test2");
  const axios = require('axios')

  axios.post('http://localhost:5000/login', {
    username: 'admin',
    password: 'admin'
  })
  .then((res) => {
    //console.log(`statusCode: ${res.statusCode}`)
    //console.log(res)
    console.log('OK')
  })
  .catch((error) => {
    console.error(error)
  })
});
// register
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
      admin: true
  });

  newUser.save()
      .then((user) => {
          console.log(user);
      });

  res.redirect('/login');
});
// login
app.post('/api/login',
  passport.authenticate('local', 
//      { failureRedirect: '/login',
//        successReturnToOrRedirect: '/' }
  ),
  function(req, res) {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    // res.redirect('/users/' + req.user.username);
    console.log("logged user "+req.user)
    res.json("user authenticated")
  }
);
app.get('/api/login', (req, res, next) => {
   
  const form = '<h1>Login Page</h1><form method="POST" action="/login">\
  Enter Username:<br><input type="text" name="username">\
  <br>Enter Password:<br><input type="password" name="password">\
  <br><br><input type="submit" value="Submit"></form>';

  res.send(form);


});
app.get('/api/logout', function(req, res){
  console.log("trying to logout")
  req.logout();
  //res.redirect('/');
  res.json("logged out");
});
  
  /*  "/api/posts"
   *    GET: finds all posts
   *    POST: creates a new contact
   */
  
  app.get("/api/posts", isAuth, async function(req, res) {
    console.log("entering get api/posts");
//    db.collection(POSTS_COLLECTION).find({}).toArray(function(err, docs) {
//      if (err) {
//        handleError(res, err.message, "Failed to get posts.");
//      } else {
//        res.status(200).json(docs);
//      }
//    });
    try {
      posts = await Post.find({});
      console.log(posts);
      res.status(200).send(posts);
    }
    catch(err) {
      handleError(res, err.message, "Failed to get posts.");
    }
  });
  
  app.post("/api/posts", async function(req, res) {
    console.log("the title is"+req.body.title);
    const post = new Post(req.body);

    try {
      await post.save();
      res.status(201).send(post);
    } catch (err) {
      res.status(500).send(err);
    }
 //   var newPost = req.body;
 //   newPost.createDate = new Date();
 // 
 //   if (!req.body.title) {
 //     handleError(res, "Invalid user input", "Must provide a title.", 400);
 //   } else {
 //     db.collection(POSTS_COLLECTION).insertOne(newPost, function(err, doc) {
 //       if (err) {
 //         handleError(res, err.message, "Failed to create new post.");
 //       } else {
 //         res.status(201).json(doc.ops[0]);
 //       }
 //     });
 //   }
  });
  
  /*  "/api/posts/:id"
   *    GET: find contact by id
   *    PUT: update contact by id
   *    DELETE: deletes contact by id
   */
  
  app.get("/api/posts/:id", async function(req, res) {
 //   db.collection(POSTS_COLLECTION).findOne({ _id: new ObjectID(req.params.id) }, function(err, doc) {
 //     if (err) {
 //       handleError(res, err.message, "Failed to get contact");
 //     } else {
 //       res.status(200).json(doc);
 //     }
 //   });
      console.log("getting single post ");
      try {
        const post = await Post.findById(req.params.id)
        //wait postModel.save()
        res.status(200).json(post);
      } catch (err) {
        res.status(500).send(err)
      }
  });
  
  app.put("/api/posts/:id", async function(req, res) {
    console.log("updating single post "+req.body.title);
    try {
      await Post.findByIdAndUpdate(req.params.id, req.body)
      //wait postModel.save()
      res.send("updated")
    } catch (err) {
      res.status(500).send(err)
    }
//   var updateDoc = req.body;
//    delete updateDoc._id;
//  
//    db.collection(POSTS_COLLECTION).updateOne({_id: new ObjectID(req.params.id)}, updateDoc, function(err, doc) {
//      if (err) {
//        handleError(res, err.message, "Failed to update contact");
//      } else {
//        updateDoc._id = req.params.id;
//        res.status(200).json(updateDoc);
//      }
//    });
  });
  
  app.delete("/api/posts/:id", async function(req, res) {
    console.log("deleting single post "+req.params.id);
    try {
      await Post.findByIdAndDelete(req.params.id)
      //wait postModel.save()
      res.json(req.params.id);
    } catch (err) {
      res.status(500).send(err)
    }
//    db.collection(POSTS_COLLECTION).deleteOne({_id: new ObjectID(req.params.id)}, function(err, result) {
//      if (err) {
//        handleError(res, err.message, "Failed to delete contact");
//      } else {
//        res.status(200).json(req.params.id);
//      }
//    });
  });

// posts API ROUTES BELOW
app.get('/*', function(req,res) {
  console.log("redirect to angular")
  res.sendFile(__dirname+'/dist/aureblog/index.html');
});

