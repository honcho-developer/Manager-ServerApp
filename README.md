# Manager-App

DataBase App created using Node.js, Express, Mongo DB and EJS.

##Table of contents
* [General info](#general-info)
* [Technologies](#technologies)
* [Setup](#setup)

## General info
Introduction :
This app was created for the aim of performing CRUD operations and also with the abilities of addding image to the database.

This app is based on my collective knowledge of a full stack developer.

Frontend inspired by me.


## Technologies
Project is created with:
* EJS is a simple templating language that lets you generate HTML markup with plain JavaScript.

* mongoose: Mongoose provides a straight-forward, schema-based solution to model your application data. It includes built-in type casting, validation, query building, business logic hooks and more, out of the box.

* cors: Cross-Origin Resource Sharing (CORS) is a mechanism that uses additional HTTP headers to tell browsers to give a web application running at one origin, access to selected resources from a different origin. 

* Multer: Our image upload library. It handles getting formdata from requests. 

* Express: The very popular web framework that sits on top of Node.js.

* Body-parser: Extracts the entire body portion of an incoming request stream and exposes it on req.body as something easier to interface with.

* morgan: Express middleware for logging network requests.

* bcrypt: The inbuilt crypto module's randomBytes interface is used to obtain secure random numbers.

* req-flash: Unopinionated middleware for creating flash messages of all types for Express apps.

* express-session: This handles all things for us, i.e., creating the session, setting the session cookie and creating the session object in req object. Whenever we make a request from the same client again, we will have their session information stored with us (given that the server was not restarted).


## Setup
To run this project, install it locally using npm:
$ cloning it, from the repo.
$ npm install
$ npm start
Note npm start will start the server which is; server.js



This app is deployed on heroku, check it out.
https://da-managerboard.herokuapp.com



Happy Coding








