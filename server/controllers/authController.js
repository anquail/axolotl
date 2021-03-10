const axios = require("axios");
const fetch = require("node-fetch");
const jwt = require("jsonwebtoken");
const client_id = process.env.GH_CLIENT_ID;
const client_secret = process.env.GH_CLIENT_SECRET;
const jwtSecret = "super-secret-secret";

const authController = {};

authController.getToken = (req, res, next) => {
  console.log(req.query);
  axios
    .post("https://github.com/login/oauth/access_token", {
      client_id: client_id,
      client_secret: client_secret,
      code: req.query.code,
    })
    .then((response) => new URLSearchParams(response.data))
    .then((params) => {
      res.locals.token = params.get("access_token");
      //   console.log(params.get("access_token"));
      return next();
    })
    // .then((params) => {
    //   console.log("ACCESS_TOKEN: ", params.get("access_token"));
    //   // SET COOKIE HERE??
    //   res.locals.token = params.get("access_token");
    //   return next();
    //   //   return res.status(200).json(params.get("access_token"));
    // })
    .catch((error) =>
      next({ log: "error in authController.getToken", message: { err: error } })
    );
};

authController.getUserFromGH = (req, res, next) => {
  fetch(`https://api.github.com/user`, {
    headers: {
      Authorization: `token ${res.locals.token}`,
    },
  })
    .then((resp) => resp.json())
    .then((user) => {
      res.locals.user = user;
      return next();
    })
    .catch((error) =>
      next({
        log: "error in authController.getUser",
        message: { err: error },
      })
    );
};

authController.addJWT = (req, res, next) => {
  const { login, id } = res.locals.user;

  jwt.sign(
    { login, id },
    jwtSecret,
    {
      expiresIn: "1h",
    },
    (err, token) => {
      if (err) {
        return res.status(400).json("error creating jwt");
      }
      res.cookie("jwt", token, { httpOnly: true });
      return next();
    }
  );
};

authController.verifyJWT = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return res.json();
  }

  // Verify Token
  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (!decoded) return res.json();
    const { login, id } = decoded;
    res.locals.jwtInfo = { login, id };

    return next();
  });
};

module.exports = authController;
