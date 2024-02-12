import CloseOnOutsideClick from "../../utils/close-on-outside-click/CloseOnOutsideClick";
import "./dropdown-action-options.css";

/**
 * options object format:
 * {
 *    header: header,
 *    lines : [{id:id, label:label, action:action()}, ...]
 * }
 */

const DropdownActionOptions = ({ close, options }) => {
  return (
    <CloseOnOutsideClick onClose={close}>
      <div className="dropdown-action-options-container">
        {Array.isArray(options.lines) && options.lines.length ? (
          <>
            <h4 className="dropdown-action-options-action">{options.header}</h4>
            {options.lines.map((o, i) => (
              <div className="dropdown-action-options-row" key={i}>
                <div
                  className="dropdown-action-options-action"
                  onClick={o.action}
                >
                  {o.label}
                </div>
              </div>
            ))}
          </>
        ) : (
          <>
            <h4 className="dropdown-action-options-action">
              No options here yet
            </h4>
          </>
        )}
      </div>
    </CloseOnOutsideClick>
  );
};

export default DropdownActionOptions;
