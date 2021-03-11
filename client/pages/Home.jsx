import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import UserCard from "../components/UserCard.jsx";
import fetch from "isomorphic-fetch";

const Home = ({ user, setUser }) => {
  const [loggingIn, setLoggingIn] = useState(false);
  const [interests, setInterests] = useState([]);
  const [interestIdx, setInterestIdx] = useState(0);

  useEffect(() => {
    if (!Object.keys(user).length) {
      setLoggingIn(true);
      fetch("/api/currentUser")
        .then((res) => res.json())
        .then((data) => {
          console.log("data from fetch /currentUser is", data);
          setUser(data);
          setLoggingIn(false);
          setInterests(data.interests);
        })
        .catch((error) => console.log("error in fetch /currentUser", error));
    }
  }, []);

  const handleSwipe = (e, decision) => {
    if (decision === "accept") {
      fetch("/users/swipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user._id,
          targetId: interests[interestIdx]._id,
        }),
      });
    }
    setInterestIdx(interestIdx + 1);
  };

  if (Object.keys(user).length && interests[interestIdx]) {
    return (
      <div className="mainContainer">
        <UserCard
          curInterest={interests[interestIdx]}
          handleSwipe={handleSwipe}
        />
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
        <button onClick={() => setInterestIdx(0)}>Refresh Matches</button>
      </div>
    );
  }
};
export default withRouter(Home);
