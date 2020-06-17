const express = require("express");
const app = express();
const session = require('express-session')
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const path = require("path");
const multer = require("multer");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const Direct = require("./models/directSchema");
const User = require("./models/adminSchema");
const { renderFile } = require("ejs");
const db = process.env.MONGODB_URL;



// Set EJS as templating engine
app.set("view engine", "ejs");
app.set("views",__dirname + "/views");
app.use(express.urlencoded({ extended: false }));
app.use("/uploads", express.static("uploads"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())


app.use(cookieParser("secret_passcode"));
app.use(session({
  secret: "secret_passcode",
  cookie: {
    maxAge: 4000000
  },
  resave: false,
  saveUninitialized: false
}));
app.use(flash());
app.use((req, res, next) => {
  res.locals.flashMessages = req.flash();
  next();
});





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

//UPLOAD IMAGE

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  //reject file type
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1045 * 1045 * 5,
  },
  fileFilter: fileFilter,
});

app.post("/add", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      res.status(400).send("Something went wrong!");
    }
    res.send(req.file);
  });
});
app.get("/", function (req, res) {
  Direct.find(function (err, users) {
    if (err) {
      console.log(err);
    } else {
      res.render("clientView", { users: users });
      console.log(users);
    }
  });
});

//SIGNUP
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

app.post("/login", (req, res, next) => {
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) {
      return res.status(500).json({
        err: err,
      });
    } else {
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      user
      .save()
      .then(result => {
        console.log(result)
        res.render("home", { req: req  }, );
      })
      .catch(err => {
        console.log(err)
        err.status(err).json({
         err: err
        })
      })
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
app.post("/add_direct", upload.single("photo"), function (req, res) {

  const mybodydata = {
    user_name: req.body.user_name,
    user_product: req.body.user_product,
    user_price: req.body.user_price,
    photo: req.file.path,
  };
  const direct = Direct(mybodydata);
  //var data = UsersModel(req.body);
  direct.save(function (err) {
    if (err) {
      res.render("home", { message: "User registered not successfully!" });
    } else {
      res.render("home", { message: "User registered successfully!" });
    }
  });
});

//FILTER FUNCTION
// const search = (e) => {
//   e.target.name
//   console.log(search)
// }

// app.get('/filter', (req, res) => {

//   const {db} = req.baseUrl
//   db.collection('mydb').find().toArray((err, result) => {
//     if (err) return console.log(err)
//     // renders index.ejs
//     res.render('index.ejs', {mydb: result})
//   })
// })

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

app.get("/deleteAll", (req, res) => {
  Direct.deleteMany((req.params), ( removed) => {
    if (removed) {
      
      res.send(removed);
      
    } else {
      res.render('home');
    }
  });
});

app.get("/deleteOne/:id", (req, res) => {
  console.log(req.params);
  Direct.findByIdAndRemove(req.params.id, ( removed) => {
    if (removed) {
      res.send(removed);
      
    } else {
      res.render('home');
    }
  });
  
});

app.get("/edit/:id", function (req, res) {
  console.log(req.params.id);
  Direct.findById(req.params.id, function (err, user) {
    if (err) {
      console.log(err);
    } else {
      console.log(user);
      res.render("edit", { userDetail: user });
    }
  });
});
app.post('/edit/:id', upload.single("photo"), function(req, res) {
  Direct.findByIdAndUpdate(req.params.id, req.body, function(err) {
      if (err) {
          
          res.render('edit/' + req.params.id);
      } else {
          
          res.render('home');
      }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
