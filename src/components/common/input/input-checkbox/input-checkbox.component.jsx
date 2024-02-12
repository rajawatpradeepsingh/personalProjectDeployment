import "./input-checkbox.styles.css";

const InputCheckbox = (props) => {
  return (
    <div className="input-checkbox-container">
      <input
        onChange={props.onChange}
        id={props.id}
        name={props.name}
        type="checkbox"
        checked={props.checked}
      />
      <label className="input-checkbox-label" htmlFor={props.id}>
        {props.label}
      </label>
    </div>
  );
};

export default InputCheckbox;
