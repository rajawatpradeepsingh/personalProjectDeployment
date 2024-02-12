import React, { useEffect, useState } from "react";
import "./timeinput.css";
import ReactTooltip from "react-tooltip";

export const TimeInput = ({ className, id, value, onChange, name, ...props }) => {
  const dNow = new Date();
  const [newTime, setNewTime] = useState({
    "input-hh": dNow.getHours() % 12 === 0 ? 12 : dNow.getHours() % 12,
    "input-mm": dNow.getMinutes(),
    "input-ampm": dNow.getHours() >= 12 ? "PM" : "AM",
  });
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    setIsSupported(timeInputSupported());
  }, []);

  useEffect(() => {
    const ev = {
      target: {
        id: id,
        value: `${newTime["input-hh"]}:${newTime["input-mm"]} ${newTime["input-ampm"]}`,
      },
    };
    onChange(ev);
  }, [newTime, id]);

  const handleInputHH = (e) => {
    const val = ("01" + e.target.value).slice(-2);
    if (val.length === 2 && +val < 13)
      setNewTime({
        ...newTime,
        "input-hh": val,
      });
  };

  const handleInputMM = (e) => {
    const val = ("00" + e.target.value).slice(-2);
    if (val.length === 2 && +val < 60)
      setNewTime({
        ...newTime,
        "input-mm": val,
      });
  };

  const handleInputAMPM = (e) => {
    let val = e.target.value.slice(-2);
    if (
      val.toUpperCase() === "A" ||
      val.toUpperCase() === "P" ||
      (val.length > 1 && val[1].toUpperCase() === "M")
    )
      setNewTime({
        ...newTime,
        "input-ampm": val,
      });
  };

  const timeInputSupported = () => {
    const test = document.createElement("input");
    try {
      test.type = "time";
    } catch (e) {
      console.log(e.description);
    }
    //return false;
    return test.type === "time";
  };

  return (
    <div>
      {isSupported ? (
        <div className="time-container">
          <label htmlFor="time" className="time-label">
            {props.required && !props.disabled && <span className="required">*</span>}{" "}
            {props.label}
          </label>
          <input
            type="time"
            className={props.className ? props.className : "time-input-field"}
            id={id}
            onChange={onChange}
            value={value}
            name={name}
            required={props.required}
            disabled={props.disabled}
            min={props.min}
            max={props.max}
          />
          <span></span>
          {props.errMssg && (
            <label className="error-label">{props.errMssg}</label>
          )}
          {!props.errMssg && <label className="info">{props.info}</label>}
        </div>
      ) : (
        <div className="text-time-input">
          <label htmlFor="time" className="time-label">
            {props.required && !props.disabled && <span className="requiredsign">*</span>}
            {props.label}{" "}
          </label>
          <div
            className="input-text"
            data-tip="You are using an outdated browser, please update"
          >
            <span>
              <input
                type="text"
                id="input-hh"
                value={`${
                  newTime["input-hh"] % 12 === 12 ? 12 : newTime["input-hh"]
                }`}
                onChange={handleInputHH}
                className="text-time-input-field"
              ></input>
            </span>
            <span className="text-time-divider">:</span>
            <span>
              <input
                type="text"
                id="input-mm"
                value={newTime["input-mm"]}
                onChange={handleInputMM}
                className="text-time-input-field"
              ></input>
            </span>
            <span className="text-time-divider"> </span>
            <span>
              <input
                type="text"
                id="input-ampm"
                value={newTime["input-ampm"]}
                onChange={handleInputAMPM}
                className="text-time-input-field"
              ></input>
            </span>
          </div>
          {props.errMssg && (
            <label className="error-label">{props.errMssg}</label>
          )}
          {!props.errMssg && <label className="info">{props.info}</label>}
          <ReactTooltip />
        </div>
      )}
    </div>
  );
};;
