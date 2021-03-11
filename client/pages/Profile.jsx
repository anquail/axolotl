import React, { useReducer, useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import fetch from "isomorphic-fetch";
import regeneratorRuntime from "regenerator-runtime";
import InterestsContainer from "../components/InterestsContainer.jsx";

const formReducer = (state, event) => {
  return {
    ...state,
    [event.name]: event.value,
  };
};

const Profile = ({ user, history, setUser }) => {
  if (user === undefined) history.push("/");

  const [formData, setFormData] = useReducer(formReducer, {});
  const [submitting, setSubmitting] = useState(false);
  const [components, setComponents] = useState({ bio: "", interests: {} });

  useEffect(() => {
    if (!Object.keys(user).length) {
      fetch("/api/currentUser")
        .then((res) => res.json())
        .then((data) => {
          console.log("data from fetch /currentUser is", data);
          setUser(data);
          setChecked({ bio: data.bio, interests: data.interests });
          // props.history.push("/home");
        })
        .catch((error) => console.log("error in fetch /currentUser", error));
    }
  }, []);
  // useEffect(() => {
  //   fetch("http://localhost:8080/users/profile", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       username: props.user.username,
  //     }),
  //   })
  //     .then((res) => res.json())
  //     .then((data) => {
  //       console.log("DATA: ", data);
  //       document.getElementById("realNameId").value =
  //         data.user_profile.realName;
  //       document.getElementById("userNameInterest1Id").value =
  //         data.user_profile.userInterest1;
  //       document.getElementById("userNameInterest2Id").value =
  //         data.user_profile.userInterest2;
  //       console.log("data: ", data);
  //       console.log("user: ", props.user);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitting(true);
    console.log("formData: ", formData);
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
        profile: formData,
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
    setFormData({
      name: event.target.name,
      value: event.target.value,
      username: user,
    });
    // console.log("state", formData )
  };

  return (
    <div className="profile">
      <h2>Profile Information</h2>
      <div style={{ height: "25px" }}>
        <h4>{user.username ? user.username : " "}</h4>
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
              value={formData.userInterest1}
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
