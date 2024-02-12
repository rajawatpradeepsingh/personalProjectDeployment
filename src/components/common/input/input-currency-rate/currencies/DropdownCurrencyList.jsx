import { useEffect, useRef } from "react";

// subComponent: dropdown graph types and flags
export const DropdownCurrencyList = (props) => {
  const ref = useRef(null);

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  });

  const handleClickOutside = (e) => {
    if (ref.current && !ref.current.contains(e.target)) {
      props.setIsOpen(false);
    }
  };

  const toggling = () => props.setIsOpen(prevState => !prevState);

  const onOptionClicked = (option) => () => {
    props.handleChange({
      target: {
        name: props.name,
        value: option.name ? `${option.name}, ${option.value}` : "",
      },
    });
    props.setIsOpen(false);
  };

  return (
    <div className="droplist-container">
      <div className="list-header" onClick={!props.disabled ? toggling : null}>
        {props.value ? props.value : "USD, $"}
        {!props.disabled && <div className="arrow arrow-down"></div>}
      </div>
      {props.isOpen && (
        <div className="list-container" ref={ref}>
          <div>
            {props.options.map((option) => (
              <li
                //className={`${option.bgImg} list-item`}
                className="list-item"
                onClick={onOptionClicked(option)}
                key={option.id}
                value={option}
              >
                {option.name ? `${option.name}, ${option.value}` : "..."}
              </li>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
