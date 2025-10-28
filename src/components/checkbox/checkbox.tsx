import React, { useState } from "react";
import "./checkbos.css";

interface CheckBoxProps {
  onChange: (isChecked: boolean) => void;
}

const CheckBox = ({ onChange }: CheckBoxProps) => {
  const [isChecked, setChecked] = useState(true);

  const handleCheckboxChange = () => {
    const newCheckedValue = !isChecked;
    setChecked(newCheckedValue);
    onChange(newCheckedValue);
  };

  return (
    <label className="container">
      <input
        type="checkbox"
        onChange={handleCheckboxChange}
        defaultChecked={isChecked}
        // checked={isChecked}
        className="input-check"
      />
      <div className="checkmark"></div>
    </label>
  );
};

export default CheckBox;
