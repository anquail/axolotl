import React, { useReducer, useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import fetch from "isomorphic-fetch";
import InterestsContainer from "../components/InterestsContainer.jsx";

const Profile = ({ user, history, setUser }) => {
  // if (user === undefined) history.push("/");

  const [submitting, setSubmitting] = useState(false);
  const [profileData, setProfileData] = useState({
    bio: user.bio || "",
    frontend: user.frontend,
    backend: user.backend,
  });
  console.log(profileData);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitting(true);

    console.log("userNameId: ", document.getElementById("userNameId"));

    // store profile info submitted by user
    // const profileInfo = {
    //   profile: formData,
    //   username: props.user,
    // }

    // post user data to server
    fetch("http://localhost:8080/users/new-profile", {
      method: "POST",
      body: JSON.stringify({
        // profile: formData,
        username: user.username,
      }),
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((json) => {
        console.log("json: ", json);
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
            />
          </label>
        </fieldset>
        <fieldset className="tallFieldSet">
          <label>
            <p>Interests:</p>
            <InterestsContainer />
          </label>
        </fieldset>
        <button type="submit">Submit</button>
      </form>
      {submitting && <div>Submtting Info...</div>}
    </div>
  );
};
export default withRouter(Profile);
