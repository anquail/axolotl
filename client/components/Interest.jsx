import React, { useState } from "react";

export default function Interest({ interest, profileData, setProfileData }) {
  function handleChange() {
    setProfileData({
      ...profileData,
      [interest.value]: !interest.checked,
    });
  }

  return (
    <div>
      <input
        checked={interest.checked}
        type="checkbox"
        onChange={handleChange}
        value={interest.value}
      />
      <label>{interest.displayName}</label>
    </div>
  );
}
