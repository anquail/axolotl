import React from "react";
import Interest from "./Interest.jsx";

export default function InterestsContainer({
  frontend,
  backend,
  setProfileData,
  profileData,
}) {
  const interests = [
    { value: "frontend", displayName: "Front End", checked: frontend },
    { value: "backend", displayName: "Back End", checked: backend },
  ];
  const renderInterests = () =>
    interests.map((interest, i) => (
      <Interest
        key={`Interest ${i}`}
        interest={interest}
        setProfileData={setProfileData}
        profileData={profileData}
      />
    ));

  return <div>{renderInterests()}</div>;
}
