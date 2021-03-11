import React from "react";
//import "./ProfileCard.css";

const ProfileCard = ({ match }) => {
  const { githubavatar, interests, username } = match;
  return (
    <div className="profile-card profile-card-container">
      <img className="profile-card-pic" src={githubavatar} alt="profile pic" />
      <div className="profile-card-copy">
        <h3>{username}</h3>
        <p>{interests}</p>
      </div>
    </div>
  );
};

export default ProfileCard;
