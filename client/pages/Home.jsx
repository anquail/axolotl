import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import UserCard from "../components/UserCard.jsx";
import fetch from "isomorphic-fetch";

const Home = ({ user, interests, interestIdx, setInterestIdx }) => {
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
  } else if (!Object.keys(user).length) {
    return <h1>Loading...</h1>;
  } else {
    return (
      <div>
        <h1>OUT OF MATCHES</h1>
        <button onClick={() => setInterestIdx(0)}>Refresh Matches</button>
      </div>
    );
  }
};
export default Home;
