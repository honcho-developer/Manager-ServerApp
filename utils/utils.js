let User = require("../models/adminSchema");

let user = {
  email: "admin@gmail.com",
  password: 'admin',

};

User.create(user, e => {
  if (e) {
    throw e;
  }
  console.table(user);
});