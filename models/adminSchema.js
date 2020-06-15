const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 50
  },
  email: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 50
  },
  password: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 50
  },
  role: {
    type: String,
    default: "user",
    enum: ["user", "admin"]
  }
});

const User = mongoose.model("user", userSchema);

module.exports = User;
