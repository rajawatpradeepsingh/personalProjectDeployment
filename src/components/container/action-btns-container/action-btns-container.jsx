import Button from "../../common/button/button.component";
import "./action-btns.styles.css";

/*** Props to pass via array of objects
  Button: {handleClick, className, title, child, disabled}
*/

const ActionBtns = (props) => {
  return (
    <>
      {props.btns.map((b) => {
        return (
          <Button
            key={b.title}
            className={`btn icon marginX ${b.className}`}
            handleClick={b.handleClick}
            title={b.title}
            disabled={b.disabled}
          >
            {b.child}
          </Button>
        );
      })}
    </>
  );
};

export default ActionBtns;
