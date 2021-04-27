const db = require("../models/userModels");

const userController = {};

// checks the database for the user: TESTED 3/7 5PM
userController.checkUser = (req, res, next) => {
  const username = res.locals.jwtInfo.login; // save Github username on req.body
  const statement = `SELECT p.*, i.frontend, i.backend FROM people AS p LEFT JOIN interests AS i ON i._id = p._id WHERE username = $1`;

  db.query(statement, [username], (err, result) => {
    if (err) {
      console.log("check user error obj\n", err);

      return next({
        log: "There was an error with the checkUser query.",
        message: {
          err: "An error occurred with the checkUser query.",
        },
      });
    } else {
      if (!result.rows.length) {
        // if the user is not in the database, add them
        return next();
      } else {
        // if the user is in the database, send back user information and rediret to home page
        // res.locals.user = result.rows[0];
        return res.redirect("http://localhost:8080");
      }
    }
  });
};

userController.findInterests = (req, res, next) => {
  if (!res.locals.user) return next();
  const username = [res.locals.user._id]; // save Github username on req.body
  const statement = `SELECT p.*, i1.frontend, i1.backend FROM interests AS i1 INNER JOIN interests AS i2 ON i1.frontend = i2.frontend OR i1.backend = i2.backend INNER JOIN people AS p ON i1._id = p._id WHERE i2._id = $1`;

  db.query(statement, username, (err, result) => {
    if (err) {
      console.log("check user error obj\n", err);
      return next({
        log: "There was an error with the findInterests query.",
        message: {
          err: "An error occurred with the findInterests query.",
        },
      });
    } else {
      if (!result.rows.length) {
        return res.status(200).json(res.locals.user);
      } else {
        const interestsArr = result.rows.filter(
          (obj) => `${obj._id}` != res.locals.user._id
        );
        res.locals.user.interests = interestsArr;
        return res.status(200).json(res.locals.user);
      }
    }
  });
};
// adds user to the database upon first OAuth: TESTED 3/7 5PM
userController.addUser = (req, res, next) => {
  const userInfo = [
    res.locals.jwtInfo.login,
    res.locals.token,
    // github avatar url
    res.locals.user.avatar_url,
    // req.body.githubUserInfo.profileLink
    res.locals.user.url,
  ];
  const statement = `INSERT INTO people (username, token, githubavatar, githublink) VALUES($1, $2, $3, $4) RETURNING *`;

  db.query(statement, userInfo, (err, result) => {
    if (err) {
      console.log("check user error obj\n", err);
      return next({
        log: "There was an error with the addUser query.",
        message: {
          err: "An error occurred with the addUser query.",
        },
      });
    } else {
      res.locals.user = result.rows[0];
      return next();
    }
  });
};

userController.getCurUser = (req, res, next) => {
  if (!res.locals.jwtInfo) return res.json(false);
  const username = res.locals.jwtInfo.login;
  const statement = `SELECT p.*, i.frontend, i.backend FROM people AS p LEFT JOIN interests AS i ON i._id = p._id WHERE username = $1`;
  db.query(statement, [username], (err, result) => {
    if (err)
      return next({
        log: "There was an error with the getCurUser query.",
        message: {
          err: "An error occurred with the getCurUser query.",
        },
      });
    res.locals.user = result.rows[0];
    return next();
  });
};

userController.getUserInfo = (req, res, next) => {
  const userId = req.body._id * 1;
  const statement = `SELECT p.*, i.frontend, i.backend FROM people AS p LEFT JOIN interests AS i ON i._id = p._id WHERE p._id = $1`;
  db.query(statement, [userId], (err, result) => {
    if (err)
      return next({
        log: "There was an error with the getUserInfo query.",
        message: {
          err: "An error occurred with the getUserInfo query.",
        },
      });
    res.locals.user = result.rows[0];
    return next();
  });
};

userController.addInterests = (req, res, next) => {
  const defaultInterests = { _id: "", frontEnd: false, backEnd: false };
  Object.keys(req.body).forEach((key) => {
    defaultInterests[key] = req.body[key];
  });

  const userInfo = [
    defaultInterests._id,
    defaultInterests.frontEnd,
    defaultInterests.backEnd,
  ];
  const statement = `INSERT INTO interests (_id, frontend, backend) VALUES($1, $2, $3) ON CONFLICT (_id) DO UPDATE SET frontend = EXCLUDED.frontend, backend = EXCLUDED.backend RETURNING *`;

  db.query(statement, userInfo, (err, result) => {
    if (err) {
      console.log("check user error obj\n", err);
      return next({
        log: "There was an error with the addInterests query.",
        message: {
          err: "An error occurred with the addInterests query.",
        },
      });
    } else {
      return next();
    }
  });
};

userController.addBio = (req, res, next) => {
  const userInfo = [req.body.bio];
  const statement = `UPDATE people SET bio = $1 WHERE people._id = ${req.body._id} RETURNING *`;
  db.query(statement, userInfo, (err, result) => {
    if (err) {
      console.log("check user error obj\n", err);
      return next({
        log: "There was an error with the addBio query.",
        message: {
          err: "An error occurred with the addBio query.",
        },
      });
    } else {
      return next();
    }
  });
};
// checks if user has a profile in the database
userController.checkProfile = (req, res, next) => {
  const username = [req.body.username];
  const statement = `SELECT user_profile FROM people WHERE username = $1`;

  db.query(statement, username, (err, result) => {
    if (err) {
      return next({
        log: "There was an error with the checkProfile query.",
        message: {
          err: "An error occurred with the checkProfile query.",
        },
      });
    } else {
      // if the user doesn't have a profile set up, res.locals.profile will be empty and the user info page will display nothing. otherwise, user info page should display data on res.locals.profile
      res.locals.profile = result.rows[0];
      return next();
    }
  });
};

// adds user profile to the database: TESTED 3/7 5:30PM
userController.addProfile = (req, res, next) => {
  const profile = [req.body.profile, req.body.username]; // profile must be JSON object
  const statement = `UPDATE people SET user_profile = $1 WHERE username = $2 RETURNING user_profile`;

  db.query(statement, profile, (err, result) => {
    if (err) {
      return next({
        log: "There was an error with the addProfile query.",
        message: {
          err: "An error occurred with the addProfile query.",
        },
      });
    } else {
      res.locals.profile = result.rows[0];
      return next();
    }
  });
};

// gets all users to display on swipe screen: TESTED 3/7 5:30PM
userController.getAllUsers = (req, res, next) => {
  const statement = `SELECT * FROM people`;
  db.query(statement, (err, result) => {
    if (err) {
      return next({
        log: "There was an error with the getAllUsers query.",
        message: {
          err: "An error occurred with the getAllUsers query.",
        },
      });
    } else {
      if (!result.rows.length) {
        return res
          .status(400)
          .json({ err: "There are no users in the database." });
      } else {
        res.locals.allUsers = result.rows;
        return next();
      }
    }
  });
};

// inserts pair into potentials table
userController.addPotential = (req, res, next) => {
  const potentialPair = [
    req.body.userId,
    req.body.username,
    req.body.potentialMatchId,
    req.body.potentialMatchUsername,
  ]; // req.body.userId is people._id of user, req.body.potentialMatchId is people._id of potential match
  const statement = `INSERT INTO potentials (_id, username, potential_matches_id, potential_matches_username) VALUES($1, $2, $3, $4) RETURNING *`;

  db.query(statement, potentialPair, (err, result) => {
    if (err) {
      return next({
        log: "There was an error with the addPotential query.",
        message: {
          err: "An error occurred with the addPotential query.",
        },
      });
    } else {
      return next(); // should also remove from allUsers list for current user -> stretch?
    }
  });
};

/**
 * ************************************************************************
 *
 * @description MIDDLEWARE FOR FILTERING MATCHES
 *
 * ************************************************************************
 */

// returns user's matches. need to be filtered from allUsers on state

userController.filterMatches = (req, res, next) => {
  const user = [req.body.userId];
  const statement = `SELECT potential_matches_id, potential_matches_username FROM potentials WHERE _id = $1`;

  db.query(statement, user, (err, result) => {
    if (err) {
      return next({
        log: "There was an error with the getMatches query.",
        message: {
          err: "An error occurred with the getMatches query.",
        },
      });
    } else {
      if (!result.rows.length) {
        return res
          .status(400)
          .json({ err: "The query to filter matches returned nothing." });
      } else {
        res.locals.filteredMatches = result.rows;
        return next();
      }
    }
  });
};

/**
 * ************************************************************************
 *
 * @description MIDDLEWARE FOR MANAGING SWIPING
 *
 * ************************************************************************
 */

userController.checkForSwipe = (req, res, next) => {
  const queryInfo = [req.body.userId, req.body.targetId];
  const statement = `SELECT * FROM matches where user_id = $1 AND target_id = $2`;

  db.query(statement, queryInfo, (err, result) => {
    if (err) {
      return next({
        log: "There was an error with the checkForSwipe query",
        message: {
          err: "An error occurred with the checkForSwipe query",
        },
      });
    } else {
      res.locals.swipes = result.rows;
      return next();
    }
  });
};

userController.updateSwipes = (req, res, next) => {
  const queryInfo = [req.body.userId, req.body.targetId];
  let statement;
  if (res.locals.swipes.length === 0) {
    statement = `INSERT INTO matches (user_id, target_id, swipe, match_status) VALUES ($1, $2, TRUE, FALSE) RETURNING *`;
  } else {
    statement = `UPDATE matches SET swipe = TRUE WHERE user_id = $1 AND target_id = $2`;
  }
  db.query(statement, queryInfo, (err, result) => {
    if (err) {
      return next({
        log: "There was an error with the updateSwipes query",
        message: {
          err: "An error occurred with the updateSwipes query",
        },
      });
    } else {
      res.locals.swipes = result.rows;
      return next();
    }
  });
};

userController.checkIfMatchMade = (req, res, next) => {
  const queryInfo = [req.body.userId, req.body.targetId];
  const statement = `SELECT * FROM matches WHERE (user_id = $1 AND target_id = $2) OR (user_id = $2 AND target_id = $1)`;

  db.query(statement, queryInfo, (err, result) => {
    if (err) {
      return next({
        log: "There was an error with the checkIfMatchMade query",
        message: {
          err: "An error occurred with the checkIfMatchMade query",
        },
      });
    } else {
      res.locals.matches = result.rows;
      return next();
    }
  });
};

userController.updateMatches = (req, res, next) => {
  const queryInfo = [req.body.userId, req.body.targetId];
  const statement = `UPDATE matches set match_status = TRUE WHERE (user_id = $1 AND target_id = $2) OR (user_id = $2 AND target_id = $1)`;

  if (
    res.locals.matches.length === 2 &&
    res.locals.matches[0].swipe &&
    res.locals.matches[1].swipe
  ) {
    db.query(statement, queryInfo, (err, result) => {
      if (err) {
        return next({
          log: "There was an error with the updateMatches query",
          message: {
            err: "An error occurred with the updateMatches query",
          },
        });
      } else {
        return next();
      }
    });
  } else {
    return next();
  }
};

userController.returnMatches = (req, res, next) => {
  const queryInfo = [req.body.userId];
  const statement = `SELECT target_id, people.* FROM matches LEFT JOIN people ON people._id = matches.target_id WHERE match_status = TRUE AND user_id = $1;`;

  db.query(statement, queryInfo, (err, result) => {
    if (err) {
      return next({
        log: "There was an error with the returnMatches query\n" + err,
        message: {
          err: "An error occurred with the returnMatches query",
        },
      });
    } else {
      res.locals.matches = result.rows;
      return next();
    }
  });
};

// return all potential users (not current user, not currently matched, and share interests with main user)
userController.getAllPotentials = (req, res, next) => {
  const queryInfo = [
    req.body.userId,
    req.body.interest_frontEnd,
    req.body.interest_backend,
  ];
  const statement = `SELECT * FROM people ppl LEFT JOIN interests i ON i._id = ppl._id WHERE ppl._id <> $1 AND ppl._id NOT IN (SELECT target_ID FROM matches WHERE user_id = $1) AND i.frontend = $2 AND i.backend = $3;`;

  db.query(statement, queryInfo, (err, result) => {
    if (err) {
      return next({
        log: "There was an error with the getAllPotentials query\n" + err,
        message: {
          err: "An error occurred with the getAllPotentials query",
        },
      });
    } else {
      res.locals.potentials = result.rows;
      return next();
    }
  });
};

userController.removeMatch = (req, res, next) => {
  const queryInfo = [req.body.userId, req.body.targetId];
  const statement = `DELETE FROM matches WHERE (user_id = $1 AND target_id = $2) OR (user_id = $2 AND target_id = $1);`;

  db.query(statement, queryInfo, (err, result) => {
    if (err) {
      return next({
        log: "There was an error with the removeMatch query\n" + err,
        message: {
          err: "An error occurred with the removeMatch query",
        },
      });
    } else {
      res.locals.potentials = result.rows;
      return next();
    }
  });
};

module.exports = userController;
