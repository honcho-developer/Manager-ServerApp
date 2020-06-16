const mongoose = require("mongoose");

const directData = new mongoose.Schema({
  user_name: String,
  user_product: String,
  user_price: String,
  // photo: {
  //   path: {
  //     type: String,
  //     required: true,
  //     trim: true,
  //   },
  //   originalname: {
  //     type: String,
  //     required: true,
  //   },
  // },
  date: { type: Date, default: Date.now }
});

const Direct = mongoose.model("direct", directData);

module.exports = Direct;
