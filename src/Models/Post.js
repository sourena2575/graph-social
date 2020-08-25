const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  userName: String,
  body: String,
  createdAt: String,
  updatedAt: String,
});

module.exports = Post = mongoose.model("post", PostSchema);
