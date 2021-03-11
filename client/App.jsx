import React, { useState, useEffect } from "react";
import { Switch, Route, Link, withRouter } from "react-router-dom";
import Login from "./pages/login.jsx";
import NavBar from "./components/NavBar.jsx";
import Home from "./pages/Home.jsx";
import Profile from "./pages/Profile.jsx";
import Matches from "./pages/Matches.jsx";
import fetch from "node-fetch";

const App = React.memo((props) => {
  const [user, setUser] = useState({});

  return (
    <div className="mainContainer">
      <Switch>
        <Route exact path="/home">
          <NavBar />
          <Home user={user} setUser={setUser} />
        </Route>
        <Route path="/profile">
          <NavBar />
          <Profile user={user} setUser={setUser} />
        </Route>
        <Route path="/matches">
          <NavBar />
          <Matches user={user} />
        </Route>
        <Route path="/">
          <Login user={user} />
        </Route>
      </Switch>
    </div>
  );
});

export default withRouter(App);
