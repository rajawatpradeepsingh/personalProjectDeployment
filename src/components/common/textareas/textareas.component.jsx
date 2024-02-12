import './textareas.styles.css';
import { ExclamationCircleOutlined } from "@ant-design/icons";

const TextBlock = (props) => {
  return (
    <>
      { props.readonly ? (
        <div className='readonly-textarea-container'>
          <span className='readonly-label'>{props.label}</span>
          <span className={`readonly-value ${!props.value && "empty"}`}>{props.value ? props.value : "no data"}</span>
        </div>
      ) : (
        <div className={`text-block-container ${props.className}`}>
          <label htmlFor={props.name} className="text-block-main-label">
            {props.required && !props.disabled && (
              <span className="required">*</span>
            )}{" "}
            {props.label}
          </label>
          <textarea
            name={props.name}
            id={props.name}
            value={props.value}
            onChange={props.onChange}
            maxLength={props.maxLength}
            rows={props.rows}
            required={props.required}
            disabled={props.disabled}
            placeholder={props.placeholder}
            className={`text-block ${props.className}`}
          />
          {!props.disabled && props.charCount && (
            <label className="char-count">{props.charCount}</label>
          )}
          {props.errMssg && (
            <label className="error-label">
              <ExclamationCircleOutlined style={{ fontSize: "16px" }} />{" "}
              {props.errMssg}
            </label>
          )}
        </div>
      )}
    </>
  );
}

export default TextBlock;