import { ctcType, ctcTax } from "../../../../../utils/defaultData";
import InputCurrency from "../../../../common/input/input-currency/input-currency.component";
import './styles.scss';

export const CurrentCTC = ({ disabled, handleChange, currencyDict, ...props }) => {

  return (
    <>
      {disabled ? (
        <div className="readonly-ctc-container">
          <span className="readonly-ctc-label">Current CTC</span>
          <span className={`readonly-ctc-value ${!props.currentCtcValue && "empty"}`}>
            {props.currentCtcValue
              ? `${props.currentCtcCurrency ? `${props.currentCtcCurrency}` : ""
              }${props.currentCtcValue} /`
              : "no data"}
          </span>
          <span className={`readonly-ctc-value`}>
            {props.currentCtcType ? `${props.currentCtcType} /` : ""}
          </span>
          <span className={`readonly-ctc-value`}>
            {props.currentCtcTax ? `${props.currentCtcTax}` : ""}
          </span>
        </div>
      ) : (
        <div className="ctc-container">
          <span className={`ctc-label ${disabled && "readonly"}`}>
            Current CTC
          </span>
          <input
            name="currentCtcValue"
            type="number"
            placeholder={!disabled ? "Value" : ""}
            value={props.currentCtcValue || ""}
            onChange={(e) => handleChange(e, "validateInt")}
            min="0"
            max="1999999999"
            className={`ctc-input ${disabled && "readonly"}`}
            disabled={disabled}
          />
          <select
            className={`ctc-select ${disabled && "readonly"}`}
            name="currentCtcType"
            value={props.currentCtcType || ""}
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
            screenReaderOnly
            data-testid="currentCtcCurrency"
            id="currentCtcCurrency"
            value={props.currentCtcCurrency || ""}
            handleChange={(e) => {
              handleChange(e);
            }}
            placeholder={!disabled ? "Currency" : ""}
            options={currencyDict}
            disabled={disabled}
            className="small"
          />
          <select
            className={`ctc-select ${disabled && "readonly"}`}
            name="currentCtcTax"
            value={props.currentCtcTax || ""}
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
        </div>
      )}
    </>
  );
}