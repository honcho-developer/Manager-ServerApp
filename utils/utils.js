let User = require("../models/adminSchema");

let user = {
  username: "Admin",
  email: "admin@gmail.com",
  password: 'admin',
  role: "admin"
};

User.create(user, e => {
  if (e) {
    throw e;
  }
  console.table(user);
});