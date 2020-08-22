const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const UserSchema = new Schema({
  firstName: String,
  lastName: String,
  userName: String,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    min: 6,
    max: 50,
    required: true,
  },
  confirmed: {
    type: Boolean,
    default: false,
  },
  image: String,
  gender: {
    type: String,
    default: "Male",
  },
  age: Number,
  followerCount: Number,
  followers: [],
  createdAt: String,
});

module.exports = User = mongoose.model("user", UserSchema);
