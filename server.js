const express = require("express");
const app = express();
const flash = require("req-flash");
const path = require("path");
const multer = require('multer')
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const Direct = require("./models/directSchema");
const User = require("./models/adminSchema");
const db = process.env.MONGODB_URL;

// Set EJS as templating engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose
  .connect(
    db ||
      "mongodb+srv://manager:1995onos@manager1-kqycy.mongodb.net/directData?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then((res) => {
    console.log("connected");
  })
  .catch((err) => {
    console.log({ err });
  });

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'uploads/')

    },
    filename: function(req, file, cb){
        cb(null, file.originalname)
    }
});

const upload = multer({
    storage: storage
})
app.post("/add", (req, res) => {
    upload(req, res, (err) => {
     if(err) {
       res.status(400).send("Something went wrong!");
     }
     res.send(req.file);
   });
 });
app.get("/", (req, res) => {
  // The render method takes the name of the HTML
  // page to be rendered as input.
  // This page should be in views folder in
  // the root directory.
  // We can pass multiple properties and values
  // as an object, here we are passing the only name
  res.render("clientView");
});

// require('./utils/utils')
app.get("/login", (req, res) => {
  User.find(function (err, users) {
    if (err) {
      console.log(err);
    } else {
      res.render("login", { users: users });
      console.log(users);
    }
  });
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  console.log({ username, password });
  User.findOne({ username, password }, (err, users) => {
    if (users === req.body) {
      res.send(users);
      
    } else {
      res.render("home", { users: users });
      console.error("User not found");
    }
  });
});
app.get("/add_direct", function (req, res) {
  Direct.find(function (err, users) {
    if (err) {
      console.log(err);
    } else {
      res.render("home", { users: users });
      console.log(users);
    }
  });
});
app.post("/add_direct", function (req, res){
  
    console.log(req.body);

    const mybodydata = {
        user_name: req.body.user_name,
        user_product: req.body.user_product,
        user_price: req.body.user_price,
        
    }
    const direct = Direct(mybodydata);
    //var data = UsersModel(req.body);
    direct.save(function(err) {
        if (err) {

            res.render('home', { message: 'User registered not successfully!' });
        } else {

            res.render('home', { message: 'User registered successfully!' });
        }
    })
});

app.get("/display", function (req, res) {
  Direct.find(function (err, users) {
    if (err) {
      console.log(err);
    } else {
      res.render("display", { users: users });
      console.log(users);
    }
  });
});

app.delete("/deleteAll", (req, res) => {
  Direct.deleteMany({}, (err, removed) => {
    if (err) {
      return err;
    } else {
      res.send(removed);
    }
  });
});

app.delete("/deleteOne/:id", (req, res) => {
  console.log(req.params);
  Direct.findByIdAndRemove(req.params.id, (err, removed) => {
    if (err) {
      return err;
    } else {
      res.send(removed);
    }
  });
});

app.get('/edit/:id', function(req, res) {
  console.log(req.params.id);
  UsersModel.findById(req.params.id, function(err, user) {
      if (err) {
          console.log(err);
      } else {
          console.log(user);

          res.render('edit-form', { userDetail: user });
      }
  });
});
app.post("/edit/:id", (req, res) => {
  console.log(req.params);
  Direct.findByIdAndUpdate(req.params.id, req.body, (err, updated) => {
    if (err) {
      return err;
    } else {
      console.log(updated);
      res.send(updated);
    }
  });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
