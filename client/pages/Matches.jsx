import React, { useState, useEffect } from "react";
import ProfileCard from "../components/ProfileCard.jsx";
import { withRouter } from "react-router-dom";
import ProfilePicture from "../components/ProfilePicture.jsx";

///client/components/ProfilePicture.jsx

// UNFIXED: login, click profile, refresh, then click matches makes app explode

function Matches({ user, matches, setMatches, history }) {
  if (user.username === undefined) history.push("/");
  // const [matches, setMatches] = useState([]);

  useEffect(() => {
    fetch("/users/matches", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user._id,
        //request more info to populate profile cards
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) setMatches(data);
      })
      .catch((err) => {
        console.log(err, "matche error!");
      });
  }, []);

  const generateProfileCards = () => {
    if (matches.length) {
      return matches.map((match, i) => (
        <ProfileCard
          key={`ProfileCard ${i}`}
          user={user}
          match={match}
          setMatches={setMatches}
        />
      ));
    }
  };

  // useEffect(() => {
  //   //grab info with fetch request
  //   fetch("/users/matches", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       userId: user._id,
  //       //request more info to populate profile cards
  //     }),
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       if (Array.isArray(data)) setMatches(data);
  //     })
  //     .catch((err) => {
  //       console.log(err, "matche error!");
  //     });
  // }, []);

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

// {/* <div className= 'matches' >
// <h2>Your Matches</h2>
// <div >{/* card s */}</div>
// </div> */}

export default withRouter(Matches);

// const Matches = () => {
//   return (
//     // <div>
//     //   <h3>Welcome to Pairer!</h3>
//     //   <small>Main Page</small>
//     // </div>
//     <h2>Matches</h2>
//   );
// };
// export default Matches;
