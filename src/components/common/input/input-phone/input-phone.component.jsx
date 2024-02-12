import "./input-phone.styles.scss";
import PhoneInput, { formatPhoneNumberIntl, isValidPhoneNumber, } from "react-phone-number-input";
import { useState, useEffect, useRef } from "react";
import { ExclamationCircleOutlined } from "@ant-design/icons";

export const InputPhone = (props) => {
  let location = Intl.DateTimeFormat().resolvedOptions().locale;
  let country = location.split("-");
  const { phoneNumber, setError } = props
  const [isValid, setIsValid] = useState(true);
  const setErrorRef = useRef(setError);

  useEffect(() => {
    setErrorRef.current = setError;
  }, [setError]);

  useEffect(() => {
    if (phoneNumber) {
      if (!isValidPhoneNumber(phoneNumber || '')) setIsValid(false);
      else setIsValid(true);
    }
    if (!phoneNumber) setIsValid(true);

    setErrorRef.current && setErrorRef.current(!isValid);
  }, [phoneNumber, isValid]);

  return (
    <>
      {props.disabled ? (
        <div className="readonly-phone-container">
          <label className="readonly-label">{props.label}</label>
          <span className={`readonly-value ${!phoneNumber && "empty"}`}>{phoneNumber ? formatPhoneNumberIntl(phoneNumber) : "no data"}</span>
        </div>
      ) : (
        <div className="phone-input">
          <label className={props.className ? `${props.className} phone-input-label` : "phone-input-label"} htmlFor="phoneNumber">
            {props.label}{" "}
            {props.required && <span className="requiredsign">*</span>}
          </label>
          <PhoneInput
            name="phoneNumber"
            international
            countryCallingCodeEditable={props.edit ? true : false}
            defaultCountry={country[1]}
            placeholder="Enter phone number"
            value={phoneNumber}
            onChange={props.handleChange}
            limitMaxLength
          />
          {!isValid && (
            <label className='error-label'>
              <ExclamationCircleOutlined style={{ fontSize: "12px", marginRight: "3px" }} />
              Number is incomplete or invalid
            </label>
          )}
        </div>
      )}
    </>
  );
};
