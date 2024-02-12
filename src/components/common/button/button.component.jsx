import React from "react";
import "./button.styles.scss";

const Button = ({handleClick, className, ...otherProps}) => (
   <button
      onClick={handleClick}
      className={className ? `${className} btn` : "btn"}
      {...otherProps}
   >
      {otherProps.children}
   </button>
);

export default Button;