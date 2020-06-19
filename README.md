# Manager-App

Download Express JS CRUD and JSON API Using Mongo DB and EJS.


Multer: Our image upload library. It handles getting formdata from requests. 


Body-parser: Extracts the entire body portion of an incoming request stream and exposes it on req.body as something easier to interface with.
Express: The very popular web framework that sits on top of Node.js.


morgan: Express middleware for logging network requests.

crypto: Deals with cryptography, and has a wide range of other functions, some of which you’ll see here

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