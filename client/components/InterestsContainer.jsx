import React from "react";
import Interest from "./Interest.jsx";

export default function InterestsContainer() {
  //get interest components
  const interests = [
    { value: "frontEnd", displayName: "Front End" },
    { value: "backEnd", displayName: "Back End" },
  ];
  const renderInterests = () =>
    interests.map((interest, i) => (
      <Interest key={`Interest ${i}`} interest={interest} />
    ));

  return <div>{renderInterests()}</div>;
}
