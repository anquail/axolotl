import React, { useEffect } from "react";
import ProfileCard from "../components/ProfileCard.jsx";
import { withRouter } from "react-router-dom";
import ProfilePicture from "../components/ProfilePicture.jsx";

function Matches({ user, matches, setMatches, history }) {
  if (user.username === undefined) history.push("/");

  useEffect(() => {
    fetch("/users/matches", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user._id,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) setMatches(data);
      })
      .catch((err) => {
        console.log(err, "match error!");
      });
  }, []);

  const generateProfileCards = () => {
    if (matches.length)
      return matches.map((match, i) => (
        <ProfileCard
          key={`ProfileCard ${i}`}
          user={user}
          match={match}
          setMatches={setMatches}
        />
      ));
  };

  return (
    <div className="matches">
      <h3>Hello {user.username}</h3>
      <ProfilePicture image={user.githubavatar} />
      <h2>Matches</h2>
      <hr className="rounded" className="divcolor"></hr>
      <div>{generateProfileCards()}</div>
    </div>
  );
}

export default withRouter(Matches);
