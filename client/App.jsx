import React, { useState, useEffect } from "react";
import { Switch, Route, withRouter } from "react-router-dom";
import Login from "./pages/login.jsx";
import NavBar from "./components/NavBar.jsx";
import Home from "./pages/Home.jsx";
import Profile from "./pages/Profile.jsx";
import Matches from "./pages/Matches.jsx";

const App = React.memo(({ history }) => {
  const [user, setUser] = useState(null);
  const [interests, setInterests] = useState([]);
  const [interestIdx, setInterestIdx] = useState(0);
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    if (!user) {
      fetch("/api/currentUser")
        .then((res) => res.json())
        .then((data) => {
          if (data === false) return history.push("/login");
          else {
            setUser(data);
            setInterests(data.interests);
            history.push("/home");
          }
        })
        .catch((error) => console.log("error in fetch /currentUser", error));
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetch("/users/matches", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user._id,
          //request more info to populate profile cards
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (Array.isArray(data)) setMatches(data);
        })
        .catch((err) => {
          console.log(err, "matche error!");
        });
    }
  }, [user]);

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
          <Matches user={user} matches={matches} setMatches={setMatches} />
        </Route>
      </Switch>
    </div>
  );
});

export default withRouter(App);
