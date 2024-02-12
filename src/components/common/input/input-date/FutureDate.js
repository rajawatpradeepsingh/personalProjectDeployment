import React, { useEffect, useState } from "react";
import "./dateinput.css";
import ReactTooltip from "react-tooltip";

export const FutureDate = ({className, id, value, onChange, max, name, ...props}) => {
  const minDate = new Date();
  const [newDate, setNewDate] = useState("");
  const [isSupported, setIsSupported] = useState(true);
  const [dateFormatWarning, setDateFormatWarning] = useState("");

  useEffect(() => {
    setNewDate(value);
    setIsSupported(dateInputSupported());
  }, [value]);

  const handleChange = (e) => {
    setNewDate(e.target.value);
    const passed = new Date(`${e.target.value.split("-")[0]}, ${ e.target.value.split("-")[1]}, ${e.target.value.split("-")[2]}`);
    let currentDate = new Date();
    currentDate.setHours(0,0,0,0);
  
    if (e.target.value.length !== 10) {
      setDateFormatWarning("Make sure date is in correct format.");
    } else if (passed >= currentDate) {
      setDateFormatWarning("Date can't be set to future date.")
    } else {
      setDateFormatWarning("");
    }
    if (passed <= minDate) onChange(e);
  };

  const dateInputSupported = () => {
    const test = document.createElement("input");
    try {
      test.type = "date";
    } catch (e) {}
    //return false;
    return test.type === "date";
  };

  return (
    <div className="date-container">
      {isSupported ? (
        <div className="input-date-container">
          <label htmlFor="date" className="date-label">
            {props.required && !props.disabled && <span className="required">*</span>}{" "}
            {props.label}
          </label>
          <input
            type="date"
            className={className ? className : "date-input-field"}
            id={id}
            onChange={handleChange}
            value={newDate}
            //min={min}
            max={max}
            name={name}
            required={props.required}
            disabled={props.disabled}
            readOnly={props.readOnly}
            //  value={props.value}
          />
          {props.errMssg && (
            <label className="error-label">{props.errMssg}</label>
          )}
          {dateFormatWarning && (
            <label className="error-label">{dateFormatWarning}</label>
          )}
        </div>
      ) : (
        <div
          className="input-date-container"
          data-tip="Format must be: YYYY-MM-DD (update browser for better performance)"
        >
          <label htmlFor="date" className="date-label">
            {props.required && <span className="required">*</span>}{" "}
            {props.label}
          </label>
          <input
            type="text"
            className="date-input-field"
            id={id}
           // min={min}
            max={max}
            name={name}
            value={newDate}
            // value={props.value}
            onChange={handleChange}
            disabled={props.disabled}
            required={props.required}
          ></input>
          <ReactTooltip place="right" effect="float" type="warning" />
          {props.errMssg && (
            <label className="error-label">{props.errMssg}</label>
          )}
          {dateFormatWarning && (
            <label className="error-label">{dateFormatWarning}</label>
          )}
        </div>
      )}
    </div>
  );
};
