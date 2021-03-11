import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import UserCard from "../components/UserCard.jsx";
import fetch from "isomorphic-fetch";

const Home = ({ user, setUser }) => {
  const [loggingIn, setLoggingIn] = useState(false);

  useEffect(() => {
    if (!Object.keys(user).length) {
      setLoggingIn(true);
      fetch("/api/currentUser")
        .then((res) => res.json())
        .then((data) => {
          console.log("data from fetch /currentUser is", data);
          setUser(data);
          setLoggingIn(false);
          // props.history.push("/home");
        })
        .catch((error) => console.log("error in fetch /currentUser", error));
    }
  }, []);

  const [potentialMatches, setPotentialMatches] = useState({});
  const [loaded, setLoaded] = useState(false);
  const [moreMatches, setMoreMatches] = useState(true);

  async function getData() {
    try {
      const allUsers = await fetch("/users/users");
      const allUsersJson = await allUsers.json();
      console.log("LINE 56: ", await allUsersJson);
      const currPotMatch = allUsersJson.shift(); //can randomize to pick user
      setPotentialMatches({
        allPotMatches: allUsersJson,
        currPotMatch: currPotMatch,
        // loaded: true,
      });
      setLoaded(true);
      setMoreMatches(true);
    } catch (err) {
      console.log(err);
    }
  }
  useEffect(() => {
    getData();
  }, []);

  const handleSwipe = (e, decision) => {
    //decision will be a string, 'reject' or 'accept' will matter when we have data, doesnt for now

    if (decision === "accept") {
      const newCurrMatch = potentialMatches.allPotMatches.shift();
      if (!newCurrMatch) {
        console.log("NO MORE MATCHES");
        setMoreMatches(false);
      } else {
        setPotentialMatches({
          ...potentialMatches,
          currPotMatch: newCurrMatch,
        });
      }
      fetch("/users/potential-matches", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // PASS ONLY USER ID IN REQ BODY
          userId: user._id,
          username: user.username,
          potentialMatchId: potentialMatches.currPotMatch._id,
          potentialMatchUsername: potentialMatches.currPotMatch.username,
        }),
      });
    } else {
      const newCurrMatch = potentialMatches.allPotMatches.shift();
      if (!newCurrMatch) {
        console.log("NO MORE MATCHES");
        setMoreMatches(false);
      } else {
        setPotentialMatches({
          ...potentialMatches,
          currPotMatch: newCurrMatch,
        });
      }
    }
  };

  if (Object.keys(user).length && moreMatches) {
    return (
      <div className="mainContainer">
        {loaded ? (
          <UserCard
            currPotMatch={potentialMatches.currPotMatch}
            handleSwipe={handleSwipe}
          />
        ) : null}
      </div>
    );
  } else if (loggingIn) {
    return <h1>Loading...</h1>;
  } else if (!Object.keys(user).length) {
    return <h1>YOU NEED TO LOG IN</h1>;
  } else {
    return (
      <div>
        <h1>OUT OF MATCHES</h1>
        <button onClick={getData}>Refresh Matches</button>
      </div>
    );
  }
};
export default withRouter(Home);
