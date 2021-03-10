import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import UserCard from "../components/UserCard.jsx";
import fetch from "isomorphic-fetch";
import regeneratorRuntime from "regenerator-runtime";

//Functional Component
const Home = (props) => {
  const { user } = props;

  useEffect(() => {
    if (user.username === undefined) props.history.push("/");
  }, [user]);

  // if (user.username === undefined) props.history.push("/");

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

  if (moreMatches) {
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
