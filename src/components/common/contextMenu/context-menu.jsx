import CloseOnOutsideClick from "../../utils/close-on-outside-click/CloseOnOutsideClick";
import "./context-menu.css";

const ContextMenu = ({ context, coords, close, options, shiftTop }) => {
  const handleClick = (e) => {
    e.stopPropagation();
    window.open(`${context.url}`, "_blank");
    close();
  };

  return (
    <CloseOnOutsideClick onClose={close}>
      <div
        className="context-container"
        style={{ top: coords.y - shiftTop || 0, left: coords.x }}
        onClick={close}
      >
        {context.text && <div className="context-caption">{context.text}</div>}
        {options.map((o) => (
          <div key={o.key} onClick={handleClick} className="context-item">
            <div className="context-item-data">
              {o.icon && o.icon}
              <span>{o.name}</span>
            </div>
          </div>
        ))}
      </div>
    </CloseOnOutsideClick>
  );
};

export default ContextMenu;
