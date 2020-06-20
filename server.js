const express = require("express");
const app = express();
const session = require('express-session')
const flash = require('req-flash');
const cookieParser = require('cookie-parser');
const multer = require("multer");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const Direct = require("./models/directSchema");
const User = require("./models/adminSchema");
const db = process.env.MONGODB_URL;



// Set EJS as templating engine
app.set("view engine", "ejs");
app.set("views",__dirname + "/views");
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: false }));
app.use("/uploads", express.static("uploads"));
app.use(cookieParser())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())


//Using express-session
app.use(session({
  secret: 'djhxcvxfgshajfgjhgsjhfgsakjeauytsdfy',
  resave: false,
  saveUninitialized: true
  }));

   // Using req-flash, Global variables
app.use(flash());
 
app.use(function(req, res, next){
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});



// Connecting to database.

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

// Using Multer to UPLOAD IMAGE, this is used in the 'add_direct route'

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



//Getting the index file, which is 'clientView'
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

//Getting LOGIN 

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


// Posting LOGIN
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
      res.render("main", { req: req  }, );
      user
      .save()
      .then(result => {
        console.log(result)
        res.render("main", { req: req  }, );
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


//Getting display, which is the 'main route'
app.get("/main", function (req, res) {
  Direct.find(function (err, users) {
    if (err) {
      console.log(err);
    } else {
      res.render("main", { users: users });
      console.log(users);
    }
  });
});


// Getting The form route, which is 'home'
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


// Posting the form route

app.post("/add_direct", upload.single("photo"), function (req, res) {

  const mybody = {
    user_name: req.body.user_name,
    user_product: req.body.user_product,
    user_price: req.body.user_price,
    photo: req.file.path,
  };
  const direct = Direct(mybody);
  //var data = UsersModel(req.body);
  direct.save(function (err) {
    if (err) {
      res.send(err)
      res.render("home", { message: "User registered not successfully!" });
    } else {
      res.render("main", { message: "Product added successfully!" });
    }
  });
});


// Getting all product, which is the 'display route'
app.get("/display", function (req, res) {
  if(req.query.search){
    const regex = new RegExp(escapeRegex(req.query.search), 'gi');
    Direct.find({user_name: regex}, function (err, users) {
      if (err) {
        console.log(err);
      } else {
        var noMatch;

        if(Direct.length < 1){
           noMatch = "No products found, please search name of product.";        
        }
        res.render("display", { users: users, noMatch: noMatch });
        console.log(users);
      }
    });
  }else{
    Direct.find(function (err, users) {
    if (err) {
      console.log(err);
    } else {
      res.render("display", { users: users });
      console.log(users);
    }
  });
  }
  
});

// Regular expression, to fiter the search field in display route
function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};


// DeleteAll route
app.get("/deleteAll", (req, res) => {
  Direct.deleteMany((req.params), ( removed) => {
    if (removed) {
      
      res.send(removed);
      
    } else {
      res.render("main", { message: "Delete All Succesful" });
    }
  });
});

// Delete by :id route

app.get("/deleteOne/:id", (req, res) => {
  console.log(req.params);
  Direct.findByIdAndRemove(req.params.id, ( removed) => {
    if (removed) {
      res.send(removed);
      
      req.flash('error_msg', 'Record Not Deleted');
      res.render('home');
    } else {
      
      res.render("main", { message: " Delete Succesful" });
    
    }
  });
  
});


// Getting the edit/:id route
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


// postint the edit/:id route
app.post('/edit/:id' ,upload.single("photo"), function(req, res) {
  const mybodydata = {
      user_name: req.body.user_name,
      user_product: req.body.user_product,
      user_price: req.body.user_price,
      photo: req.file.path,
    };
    const direct = Direct(mybodydata);
  Direct.findByIdAndUpdate(req.params.id, mybodydata, function(err) {
    
  //var data = UsersModel(req.body);
  if (err) {
    res.render('edit/');
} else {

  res.render("main", { message: "Changes Saved" });
}
})
});



// Local host port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
