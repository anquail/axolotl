const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();

// handles requests to login
// router.post('/login',
//   userController.checkUser,
//   userController.findInterests,
//   userController.addUser,
//   (req, res) => {
//     return res.status(200).json(res.locals.user)//.redirect('/homepage-url');
//   }
// );

router.post(
  "/interests",
  userController.addInterests,
  userController.addBio,
  userController.getUserInfo,
  userController.findInterests,
  (req, res) => {
    return res.status(200).json(res.locals.user);
  }
);

// handles get requests for user profile
router.post("/profile", userController.checkProfile, (req, res) => {
  return res.status(200).json(res.locals.profile); //.redirect('/matches-url');
});

// handles post request to create/edit user profile
router.post("/new-profile", userController.addProfile, (req, res) => {
  return res.status(200).json(res.locals.profile); //.redirect('/matches-url');
});

// handles requests to get all users
router.get("/users", userController.getAllUsers, (req, res) => {
  return res.status(200).json(res.locals.allUsers);
});

router.post("/users", userController.getAllPotentials, (req, res) => {
  return res.status(200).json(res.locals.potentials);
});

// handles post requests to matches table
router.post("/potential-matches", userController.addPotential, (req, res) => {
  res.status(200).json();
});

// handles requests to get all matches
router.post(
  "/matches",
  (req, res, next) => {
    console.log(req.body);
    return next();
  },
  userController.returnMatches,
  // userController.filterMatches, // do not use this middleware anymore
  (req, res) => {
    console.log("SERVER-SIDE MATCHES:", res.locals.matches);
    return res.status(200).json(res.locals.matches);
  }
);

// // original code to handle matches
// router.post('/matches',
//   (req, res, next) => {
//     console.log(req.body)
//     return next();
//   },
//   userController.filterMatches,
//   (req, res) => {
//     console.log('SERVER-SIDE FILTERED MATCHES:', res.locals.filteredMatches);
//     return res.status(200).json(res.locals.filteredMatches);
//   }
// );

router.post(
  "/swipe",
  userController.checkForSwipe,
  userController.updateSwipes,
  userController.checkIfMatchMade,
  userController.updateMatches,
  (req, res) => {
    console.log("completed swipe updates");
    return res.status(200).json(res.locals.matches);
  }
);

module.exports = router;
