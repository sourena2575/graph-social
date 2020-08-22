const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ChatSchema = new Schema({
  userName: String,
  message: String,
  channelId: String,
  createdAt: String,
  updatedAt: String,
});
module.exports = Chat = mongoose.model("chat", ChatSchema);
