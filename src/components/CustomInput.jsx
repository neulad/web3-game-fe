import React from "react";
import { PageHOC } from "../components";
import { useGlobalContext } from "../context";

import styles from "../styles";
const regex = /^[0-9a-zA-Z]+$/;

const CustomInput = ({ label, placeholder, value, handleValueChange }) => {
  return (
    <>
      <label htmlFor="name" className={styles.label}>
        {label}
      </label>
      <input
        className={styles.input}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          if (e.target.value === "" || true) handleValueChange(e.target.value);
        }}
      />
    </>
  );
};

export default CustomInput;
