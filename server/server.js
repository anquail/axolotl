/**
 * ************************************************************************
 *
 * @description IMPORTS AND SERVER SETUP
 *
 * ************************************************************************
 */

const express = require("express");
const path = require("path");
const fetch = require("node-fetch"); // allows requests to be made in dev mode
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const dbRouter = require("./routes/databaseRoutes");
const authController = require("./controllers/authController");
const userController = require("./controllers/userController");

const app = express();
const PORT = 3000;

// parses incoming request bodies
app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

/**
 * ************************************************************************
 *
 * @description OAUTH ROUTES
 *
 * ************************************************************************
 */

app.use("/users", dbRouter);

// OAUTH LOGIN REQUEST

// authorized routes

//fyi stored in .env locals to keep secret had to install dotenv, and write in gitgnore
const client_id = process.env.GH_CLIENT_ID;
const client_secret = process.env.GH_CLIENT_SECRET;

// app.get('/login/home', (req, res) => {
//   res.status(200).redirect('/login')
// })

//redirect to request Github acess this should probably be on client side
app.get(
  "/login/auth",
  authController.getToken,
  authController.getUserFromGH,
  userController.checkUser,
  userController.addUser,
  authController.addJWT,
  (req, res) => {
    res.status(200).json(res.locals.user);
  }
);

app.get(
  "/currentUser",
  authController.verifyJWT,
  userController.checkUser,
  (req, res) => {
    res.status(200).json(res.locals.user);
  }
);

/**
 * ************************************************************************
 *
 * @description BOILERPLATE ROUTES/MIDDLEWARE
 *
 * ************************************************************************
 */

app.use("/build", express.static(path.join(__dirname, "../build")));

// serves index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/index.html"));
});

// catch-all route handler for requests to unknown routes
app.use((req, res) => res.status(404).send("This page does not exist."));

// global error handler
app.use((err, req, res, next) => {
  const defaultErr = {
    log: "Express error handler caught unknown error",
    status: 500,
    message: { err: "An error occurred" },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log("Error message: ", errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

// starts server
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});

module.export = app;
