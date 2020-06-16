const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
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
  }
});

const User = mongoose.model("user", userSchema);

module.exports = User;
