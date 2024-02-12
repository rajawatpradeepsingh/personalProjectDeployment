import React from "react";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import SingleSelect from '../select/selects.component';
import "./inputs.styles.css";

const Input = React.forwardRef((props, ref) => {
  return (
    <>
      {props.disabled || props.readOnly ? (
        <div className="readonly-input-container">
          <span
            className="readonly-label"
            onClick={() => (props.hasIconBtn ? props.btnOnClick() : null)}
          >
            {props.label}
            {props.guide && <span className="guide-text">({props.guide})</span>}
            {props.hasIconBtn && <span className="inline-icon-label">{props.inlineIcon}</span>}

          </span>
          <span className={`readonly-input-value ${!props.value && "empty"}`}>
            {typeof props.value === "string"
              ? `${props.value?.substring(0, 40)}${props.value?.substring(41) && "..."
              }`
              : props.value
                ? props.value
                : "no data"}{" "}
            {props.menuOptions
              ? props.menuOptions?.filter(
                (o) => o.value === props.menuValue
              )[0]?.name
              : ""}
          </span>
        </div>
      ) : (
        <div
          className={
            props.className
              ? `input-comp-container ${props.className}`
              : "input-comp-container"
          }
        >
          <label htmlFor={props.name} className="input-main-label">
            {props.required && !props.disabled && (
              <span className="required">*</span>
            )}{" "}
            {props.label}
          </label>
          <div
            className={
              props.className === "input-menu"
                ? "input-menu-container"
                : props.hasIconBtn
                  ? "with-btn"
                  : ""
            }
          >
            <input
              type={props.type}
              name={props.name}
              id={props.id ? props.id : props.name}
              value={props.value}
              onChange={props.onChange}
              onBlur={props.onBlur}
              required={props.required}
              disabled={props.disabled}
              pattern={props.pattern}
              maxLength={props.maxLength}
              minLength={props.minLength}
              min={props.min}
              max={props.max}
              title={props.title}
              placeholder={props.placeholder}
              ref={ref}
              className={
                props.className ? `input ${props.className}` : "input"
              }
              readOnly={props.readOnly}
            />
            {props.hasIconBtn && (
              <button
                type="button"
                onClick={props.btnOnClick}
                className="inline-icon-btn"
                disabled={props.btnDisabled}
                id={props.btnId}
              >
                {props.inlineIcon}
              </button>
            )}
            {props.hasMenuOptions && (
              <SingleSelect
                name={props.menuName}
                value={props.menuValue}
                onChange={props.menuOnChange}
                options={props.menuOptions}
                className="inline-input-menu"
                disabled={props.disabled}
              />
            )}
          </div>
          {props.errMssg && (
            <label className="error-label">
              <ExclamationCircleOutlined style={{ fontSize: "12px" }} />{" "}
              {props.errMssg}
            </label>
          )}
          {!props.errMssg && <label className="info">{props.info}</label>}
        </div>
      )}
    </>
  );
})

export default Input;