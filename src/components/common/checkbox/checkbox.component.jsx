import { Checkbox } from "antd";
import "./checkbox.styles.css";

const Check = (props) => {
  const handleCheck = (event) => {
    if (props.checkedList && props.checkedList[event.target.id]) {
      let tempCheckedList = { ...props.checkedList };
      delete tempCheckedList[event.target.id];
      props.setCheckedList({ ...tempCheckedList });
    } else {
      props.setCheckedList({
        ...props.checkedList,
        [event.target.id]: props.record ? props.record : event.target.name,
      });
    }
  };

  const handleFilterCheck = (event, filterName, trailName) => {
    props.handleCheck(
      event.target.id,
      event.target.name,
      filterName,
      trailName,
      props.options
    );
  };

  const styles = {
    color: "var(--secondary-muted)",
  };

  const redStyles = {
    color: "var(--error)",
  };

  const smallStyles = {
    color: "var(--secondary)",
  };

  const defaultStyles = {
    padding: 0, marginTop: "1px", marginRight: "4px"
  };

  return (
    <>
      {props.filterCheckbox ? (
        <div style={{ textAlign: "left" }}>
          <Checkbox
            checked={
              props.checkedList[props.filterName] === props.id ||
              (props.checkedList[props.filterName] !== undefined &&
                props.checkedList[props.filterName]
                  .split(",")
                  .filter((i) => i === props.id).length > 0)
            }
            styles={{ ...smallStyles, ...defaultStyles }}
            name={props.name}
            id={props.id}
            onChange={(event) =>
              handleFilterCheck(event, props.filterName, props.trailName)
            }
          />
          {props.label && (
            <label htmlFor={"filter-checkbox"} className={`check-label small`}>
              {props.label}
            </label>
          )}
        </div>
      ) : (
        <div
          style={
            props.style
              ? props.style
              : {
                textAlign: "center",
                paddingBottom: "4px",
                paddingLeft: "4px",
              }
          }
        >
          <Checkbox
            checked={props.checkedList && props.checkedList[props.id] !== undefined}
            style={{
              ...defaultStyles,
              ...(props.className === "red"
                ? redStyles
                : props.className === "small"
                  ? smallStyles
                  : styles
              )
            }}
            name={props.name}
            id={props.id}
            onChange={handleCheck}
            disabled={props.disabled}
          />
          {props.label && (
            <label
              htmlFor={props.id}
              className={`check-label ${props.className}`}
            >
              {props.label}
            </label>
          )}
        </div>
      )}
    </>
  );
};

export default Check;
