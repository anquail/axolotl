import React, { useState, useEffect } from "react";
import { Switch, Route, Link, withRouter } from "react-router-dom";
import Login from "./pages/login.jsx";
import MainContainer from "./components/MainContainer.jsx";
import NavBar from "./components/NavBar.jsx";
import Home from "./pages/Home.jsx";
import Profile from "./pages/Profile.jsx";
import Matches from "./pages/Matches.jsx";

const App = React.memo(({ history }) => {
  const [user, setUser] = useState(null);
  const [interests, setInterests] = useState([]);
  const [interestIdx, setInterestIdx] = useState(0);
  const [loggingIn, setLoggingIn] = useState(false);

  useEffect(() => {
    if (!user) {
      setLoggingIn(true);
      fetch("/api/currentUser")
        .then((res) => res.json())
        .then((data) => {
          if (data === false) return history.push("/login");
          else {
            setUser(data);
            setLoggingIn(false);
            setInterests(data.interests);
            history.push("/home");
          }
        })
        .catch((error) => console.log("error in fetch /currentUser", error));
    }
  }, []);
  if (!user) {
    return (
      <div>
        <Switch>
          <Route exact path="/login">
            <Login />
          </Route>
        </Switch>
      </div>
    );
  }
  return (
    <div className="mainContainer">
      <NavBar />
      <Switch>
        <Route exact path="/home">
          <Home
            user={user}
            setUser={setUser}
            interests={interests}
            setInterests={setInterests}
            interestIdx={interestIdx}
            setInterestIdx={setInterestIdx}
          />
        </Route>
        <Route path="/profile">
          <Profile user={user} setUser={setUser} />
        </Route>
        <Route path="/matches">
          <Matches user={user} />
        </Route>
        {/* <Route path="/main" exact>
          <MainContainer
            user={user}
            setUser={setUser}
            interests={interests}
            setInterests={setInterests}
            loggingIn={loggingIn}
            setLoggingIn={setLoggingIn}
          />
        </Route> */}
        {/* <Route path="/login" exact>
          <Login />
        </Route> */}
      </Switch>
    </div>
  );
});

export default withRouter(App);
