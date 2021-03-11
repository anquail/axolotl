import React, { useState, useEffect } from "react";
import { Switch, Route, Link, withRouter } from "react-router-dom";
import NavBar from "./NavBar.jsx";
import Home from "../pages/Home.jsx";
import Profile from "../pages/Profile.jsx";
import Matches from "../pages/Matches.jsx";

function MainContainer({
  history,
  user,
  setUser,
  interests,
  setInterests,
  loggingIn,
  setLoggingIn,
}) {
  useEffect(() => {
    if (!Object.keys(user).length) {
      setLoggingIn(true);
      fetch("/api/currentUser")
        .then((res) => res.json())
        .then((data) => {
          setUser(data);
          setLoggingIn(false);
          setInterests(data.interests);
          history.push("/home");
        })
        .catch((error) => console.log("error in fetch /currentUser", error));
    }
  }, []);

  return <div></div>;
}

export default withRouter(MainContainer);
