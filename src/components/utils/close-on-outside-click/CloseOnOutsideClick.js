import React from "react";
import { useCloseOnOutsideClick } from "../../../Hooks/useCloseOnOutsideClick";

const CloseOnOutsideClick = ({ children, onClose }) => {
  const ref = useCloseOnOutsideClick(onClose);
  return <div ref={ref}>{children}</div>;
};

export default CloseOnOutsideClick;
