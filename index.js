var express = require('express'); 
var app = express(); 
const flash = require("req-flash");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
var Direct = require('./models/directSchema');
const User = require("./models/adminSchema");
const db = process.env.MONGODB_URL;


// Set EJS as templating engine 
app.set('view engine', 'ejs'); 

app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
express().get('/cool', (req, res) => res.send(cool()))


mongoose
  .connect(
    db ||
      "mongodb+srv://manager:1995onos@manager1-kqycy.mongodb.net/directData?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  )
  .then(res => {
    console.log("connected");
  })
  .catch(err => {
    console.log({ err });
  });
  app.get('/', (req, res)=>{ 
  
    // The render method takes the name of the HTML 
    // page to be rendered as input. 
    // This page should be in views folder in 
    // the root directory. 
    // We can pass multiple properties and values 
    // as an object, here we are passing the only name 
    res.render('login'); 
      
    }); 

  // require('./utils/utils')

app.get("/", (req, res) => {
  res.send("Successful Deployment");
  User.find({}, (err, users) => {
    if (users) {
      console.log(users);
    }
  });
});

app.post("/login", async (req, res) => {
  console.log({ username, password });
  User.findOne({ username, password }, (err, users) => {
    if (users) {
      res.send(users);
      res.render('home', { users: users });
      
    } else {
      console.error("User not found");
      
    }
  });
});
app.get('/add_direct', function(req, res) {
  Direct.find(function(err, users) {
      if (err) {
          console.log(err);
      } else {
          res.render('home', { users: users });
          console.log(users);
      }
  });
});
  app.post("/add_direct", async (req, res) => {
    const {
      user_name,
      user_product,
      user_price,
      
    } = req.body;
    const newDirect = await new Direct({
      user_name,
      user_product,
      user_price,
      
    });
    newDirect
      .save()
      .then(newRes => {
        res.send(newRes);
        
      })
      .catch(err => {
        console.log("Error", err);
      });
  });

  app.get('/display', function(req, res) {
    Direct.find(function(err, users) {
        if (err) {
            console.log(err);
        } else {
            res.render('display', { users: users });
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

app.put("/edit/:id", (req, res) => {
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
  var server = app.listen(4000, function(){ 
    console.log('listining to port 4000') 
  }); 
  