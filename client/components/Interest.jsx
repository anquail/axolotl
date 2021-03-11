import React, { useState } from "react";
import PropTypes from "prop-types";

const Checkbox = ({
  type = "checkbox",
  name = "check",
  url,
  checked = false,
  onChange,
}) => (
  <input
    type={type}
    name={name}
    url={url}
    checked={checked}
    onChange={onChange}
  />
);

export default function Interest({ interest }) {
  const [checked, setChecked] = useState(false);
  //   Checkbox.propTypes = {
  //     type: PropTypes.string,
  //     name: PropTypes.string.isRequired,
  //     checked: PropTypes.bool,
  //     onChange: PropTypes.func.isRequired,
  //     url: PropTypes.string.isRequired,
  //   };
  console.log(checked);
  function handleChange(e) {
    console.log(e.target.value);
    setChecked(!checked);
  }

  return (
    <div>
      <input type="checkbox" onClick={handleChange} value={interest.value} />
      <label>{interest.displayName}</label>
    </div>
  );
}
