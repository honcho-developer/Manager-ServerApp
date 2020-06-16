const mongoose = require("mongoose");

const directData = new mongoose.Schema({
  user_name: { type: String, required: true   },
  user_product: { type: String, required: true   },
  user_price: { type: String, required: true   },
  photo: { type: String, required: true   },
  date: { type: Date, default: Date.now }
});

const Direct = mongoose.model("direct", directData);

module.exports = Direct;
