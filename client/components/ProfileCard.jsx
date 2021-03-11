import React from "react";

const ProfileCard = ({ match, user, setMatches }) => {
  const { githubavatar, interests, username } = match;

  const handleRemove = () => {
    fetch("/users/deletematch", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user._id,
        targetId: match._id,
      }),
    })
      .then((res) => res.json())
      .then((newMatches) => setMatches(newMatches))
      .catch((e) => console.log(e));
  };

  return (
    <div className="profile-card profile-card-container">
      <img className="profile-card-pic" src={githubavatar} alt="profile pic" />
      <div className="profile-card-copy">
        <h3>{username}</h3>
        <p>{interests}</p>
        <button onClick={handleRemove}>X</button>
      </div>
    </div>
  );
};

export default ProfileCard;
