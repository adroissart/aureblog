const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

//require('dotenv').config();
const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/test";
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(() => console.log("Database Connected Successfully"))
    .catch(err => console.log(err));
//const connection = mongoose.createConnection(process.env.MONGODB_URI || "mongodb://localhost:27017/test", {
//    useNewUrlParser: true, 
//    useFindAndModify: false 
//});

// Creates simple schema for a User.  The hash and salt are derived from the user's given password when they register
const UserSchema = new mongoose.Schema({
    username: String,
    hash: String,
    salt: String,
    admin: Boolean
});
const User = mongoose.model('User', UserSchema);

const postSchema = new mongoose.Schema({
    title: String,
    date: String,
    content: String,
    rating: Number,
    imageurl: String,
    directors: [String],
    awards: [String],
    year: Number,
    tags: [String]
});
postSchema.plugin(mongoosePaginate);
const Post = mongoose.model('Post', postSchema);

// Expose the connection
module.exports = mongoose;