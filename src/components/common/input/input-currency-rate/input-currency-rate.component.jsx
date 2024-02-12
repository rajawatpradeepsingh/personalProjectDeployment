import React from "react";
import { useState } from "react";
import { DropdownCurrencyList } from "./currencies/DropdownCurrencyList";
import { currencies } from "./currencies/currencies";
import "./input-currency-rate.scss";
import "./currencies/currencies.css";

export const InputCurrencyRate = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`currency-container ${props.className || ""}`}>
      <label
        htmlFor={props.name}
        className={
          props.screenReaderOnly ? `sr-only currency-label` : "currency-label"
        }
      >
        {props.required && !props.disabled && <span className="required">*</span>} {props.label}{" "}
        {props.guide && <span className="guide-text">({props.guide})</span>}
        
      </label>

      <div className={`${props.className || ""} currency-line`}>
        <DropdownCurrencyList
          type={props.type}       
          className="currency-dropdown"
          name={props.nameCurrency}
          options={currencies}
          handleChange={props.handleChange}
          value={props.valueCurrency}
          setIsOpen={setIsOpen}
          isOpen={isOpen}
          disabled={props.disabled}
        ></DropdownCurrencyList>
        <input
        type="number"
          className={`${props.className} currency-input`}
          name={props.nameRate}
          onChange={props.handleChange}
          placeholder={props.placeholder}
          value={props.valueRate}
          required
          disabled={props.disabled}
        ></input>
      </div>
    </div>
  );
};
