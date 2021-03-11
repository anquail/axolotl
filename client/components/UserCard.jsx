import React, { useState } from "react";

const UserCard = ({ curInterest, handleSwipe }) => {
  const [cardClass, setCardClass] = useState("userCard slide-in-bottom");

  const swipes = (e, decision) => {
    if (decision === "reject") setCardClass("userCard slide-out-left");
    else setCardClass("userCard slide-out-right");
  };

  return (
    <div
      className={cardClass}
      onAnimationEnd={(e) => {
        setCardClass("userCard slide-in-bottom");
        if (e.animationName === "slide-out-left") handleSwipe(e, "reject");
        if (e.animationName === "slide-out-right") handleSwipe(e, "accept");
      }}
    >
      <div className="cardContents">
        <img src={curInterest.githubavatar} alt="profile pic" />
        <div className="cardText">
          <h2>{curInterest.username}</h2>
          <hr />
          <p>
            <strong>Wants to study: </strong>
            {curInterest.backend ? "Back End    " : null}
            {curInterest.frontend ? "Front End" : null}
          </p>
          <p>
            <strong>Bio: </strong>
            {curInterest.bio || "User is too lazy to put in their bio"}
          </p>
        </div>
        <div className="swipeBtns">
          <button className="reject" onClick={(e) => swipes(e, "reject")}>
            <i className="fal fa-times-circle fa-5x"></i>
          </button>
          <button className="accept" onClick={(e) => swipes(e, "accept")}>
            <i className="fal fa-check-circle fa-5x"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
