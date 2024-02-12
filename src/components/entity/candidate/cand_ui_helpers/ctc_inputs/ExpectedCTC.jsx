import { ctcType, ctcTax } from "../../../../../utils/defaultData";
import InputCurrency from "../../../../common/input/input-currency/input-currency.component";
import Check from "../../../../common/checkbox/checkbox.component";
import { MinusOutlined } from "@ant-design/icons";
import "./styles.scss";

export const ExpectedCTC = ({ expRange, disabled, handleChange, currencyDict, ...props }) => {
  return (
    <>
      {disabled ? (
        <div className="readonly-ctc-container">
          <span className="readonly-ctc-label">Expected CTC</span>
          <span
            className={`readonly-ctc-value ${!props.expectedCtcValue ||
              !props.startExpCTC ||
              (!props.endExpCTC && "empty")
              }`}
          >
            {props.expectedCtcValue || props.startExpCTC || props.endExpCTC
              ? `${props.expectedCtcCurrency
                ? `${props.expectedCtcCurrency}`
                : ""
              }${!expRange["expRange"]
                ? props.startExpCTC ||
                props.endExpCTC ||
                props.expectedCtcValue ||
                ""
                : props.startExpCTC || ""
              }${props.endExpCTC && expRange["expRange"]
                ? `-${props.endExpCTC}`
                : ""
              } /`
              : ""}
          </span>
          <span className={`readonly-ctc-value`}>
            {props.expectedCtcType ? `${props.expectedCtcType} /` : ""}
          </span>
          <span className={`readonly-ctc-value`}>
            {props.expectedCtcTax ? `${props.expectedCtcTax}` : ""}
          </span>
        </div>
      ) : (
        <div className="ctc-container">
          <span className={`ctc-label ${disabled && "readonly"}`}>
            Expected CTC
          </span>
          <input
            name="startExpCTC"
            type="number"
            placeholder={!disabled ? "Value" : ""}
            value={
              !expRange["expRange"]
                ? props.startExpCTC || props.endExpCTC || props.expectedCtcValue || ""
                : props.startExpCTC || ""
            }
            onChange={(e) => handleChange(e, "validateInt")}
            min="0"
            max="1999999999"
            className={`ctc-input ${disabled && "readonly"}`}
            disabled={disabled}
          />
          {expRange["expRange"] && (
            <>
              <MinusOutlined
                style={{
                  margin: "8px 8px 7px 5px",
                  fontSize: "15px",
                  color: "var(--secondary-muted)",
                }}
              />
              <input
                name="endExpCTC"
                type="number"
                placeholder={!disabled ? "Value" : ""}
                value={props.endExpCTC || ""}
                onChange={(e) => handleChange(e, "validateInt")}
                min="0"
                max="1999999999"
                className={`ctc-input ${disabled && "readonly"}`}
              />
            </>
          )}
          <select
            className={`ctc-select ${disabled && "readonly"}`}
            name="expectedCtcType"
            value={props.expectedCtcType || ""}
            onChange={handleChange}
            disabled={disabled}
          >
            <option value="">{!disabled ? "Period" : ""}</option>
            {ctcType.map((ctc) => (
              <option key={ctc} value={ctc}>
                {ctc}
              </option>
            ))}
          </select>
          <InputCurrency
            label="Expected Currency"
            screenReaderOnly
            data-testid="expectedCtcCurrency"
            id="expectedCtcCurrency"
            value={props.expectedCtcCurrency || ""}
            handleChange={(e) => {
              handleChange(e);
            }}
            placeholder={!disabled ? "Currency" : ""}
            options={currencyDict}
            disabled={disabled}
            className="small"
          ></InputCurrency>
          <select
            className={`ctc-select ${disabled && "readonly"}`}
            name="expectedCtcTax"
            value={props.expectedCtcTax || ""}
            onChange={handleChange}
            disabled={disabled}
          >
            <option value="">{!disabled ? "Tax" : ""}</option>
            {ctcTax.map((ctc) => (
              <option key={ctc} value={ctc}>
                {ctc}
              </option>
            ))}
          </select>
          {!disabled && (
            <Check
              name="expRange"
              id="expRange"
              setCheckedList={props.checkExpRange}
              checkedList={expRange}
              label="Range"
              style={{ textAlign: "left", paddingLeft: "3px" }}
              disabled={disabled}
            />
          )}
        </div>
      )}
    </>
  );
};
