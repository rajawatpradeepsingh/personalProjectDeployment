import './selects.styles.css';
import { ExclamationCircleOutlined } from "@ant-design/icons";

const SingleSelect = (props) => {
  return (
    <>
      {props.disabled || props.readOnly ? (
        <div className='readonly-select-container'>
          <span className='readonly-label'>{props.label}</span>
          <span className={`readonly-value ${!props.value && "empty"}`}>{props.value ? props.options?.filter(o => o.value === props.value || o.id === props.value)[0]?.name : "no data"}</span>
        </div>
      ) : (
        <div
          className={
            props.className
              ? `single-select-container ${props.className || ""}`
              : "single-select-container"
          }
        >
          <label htmlFor={props.name} className="select-main-label">
            {props.required && !props.disabled && (
              <span className="required">*</span>
            )}{" "}
            {props.label}{" "}
            {props.guide && (
              <span className="guide-text">({props.guide})</span>
            )}
          </label>
          <select
            className={
              props.className ? `select ${props.className}` : "select"
            }
            name={props.name}
            id={props.name}
            value={props.value || ""}
            onChange={props.onChange}
            onBlur={props.onBlur}
            required={props.required}
            guide={props.guide}
            disabled={props.disabled}
            title={props.title}
          >
            {props.placeholder === "All" ? (
              <option key="all" value="all">
                All{" "}
              </option>
            ) : props.placeholder ? (
              <option value="">{props.placeholder}</option>
            ) : (
              <option value="">{props.disabled ? "" : "Select"}</option>
            )}
            {props.options &&
              props.options.length &&
              props.options.map((option, index) => (
                <option
                  className="select-option"
                  selected={option.selected}
                  key={index}
                  disabled={option.disabled}
                  value={option.value ? option.value : option.id}
                >
                  {option.name}
                </option>
              ))}
            {props.placeholder === "Unassigned" && (
              <option value="">Unassigned</option>
            )}
          </select>
          {props.errMssg && (
            <label className="error-label">
              <ExclamationCircleOutlined style={{ fontSize: "12px" }} />{" "}
              {props.errMssg}
            </label>
          )}
        </div>
      )}
    </>
  );
}

export default SingleSelect;