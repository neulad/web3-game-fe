import React from "react";
import { AlertIcon } from "../assets";
import styles from "../styles";

const Alert = ({ type, message }) => {
  console.log(styles[type], type);

  return (
    <div className={`${styles.alertContainer} ${styles.flexCenter}`}>
      <div className={`${styles.alertWrapper} ${styles[type]}`}>
        <AlertIcon type={type} /> {message}
      </div>
    </div>
  );
};

export default Alert;
