import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import fetch from "isomorphic-fetch";
import InterestsContainer from "../components/InterestsContainer.jsx";

const Profile = ({ user, setUser }) => {
  const [submitting, setSubmitting] = useState(false);
  const [profileData, setProfileData] = useState({
    bio: user.bio || "",
    frontend: user.frontend,
    backend: user.backend,
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitting(true);

    // post user data to server
    fetch("http://localhost:8080/users/interests", {
      method: "POST",
      body: JSON.stringify({
        _id: user._id,
        frontEnd: profileData.frontend,
        backEnd: profileData.backend,
        bio: profileData.bio,
      }),
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
    })
      .then((res) => res.json())
      .then((newUser) => {
        console.log(newUser);
        setUser(newUser);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleChange = (event) => {
    setProfileData({
      ...profileData,
      bio: event.target.value,
    });
  };

  return (
    <div className="profile">
      <h2>Profile Information</h2>
      <div style={{ height: "25px" }}>
        <h4>{user.username ? user.username : null}</h4>
      </div>

      <form onSubmit={handleSubmit}>
        <fieldset className="tallFieldSet">
          <label>
            <p>Bio</p>

            <textarea
              className="bigInput"
              name="userInterest1"
              id="userNameInterest1Id"
              onChange={handleChange}
              value={profileData.bio}
              style={{ fontSize: "16px" }}
            />
          </label>
        </fieldset>
        <fieldset className="tallFieldSet">
          <label>
            <p>Interests:</p>
            <InterestsContainer
              frontend={profileData.frontend}
              backend={profileData.backend}
              setProfileData={setProfileData}
              profileData={profileData}
            />
          </label>
        </fieldset>
        <button type="submit">Submit</button>
      </form>
      {submitting && <div>Submtted!</div>}
    </div>
  );
};
export default withRouter(Profile);
