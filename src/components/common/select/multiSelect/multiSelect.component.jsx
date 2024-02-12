import { useCallback } from "react";
import { useState, useEffect, useRef } from "react";
import PopUp from "../../../modal/popup/popup.component";
import "./multiSelect.styles.css";

/*** Сomponent usage format ***
<MultiSelect
  label="input label"
  options={opt}
  handleChange={multiSelectChange}
  isMulti
  checkboxes
  creatable
  deletable
  disabled
  confirm={false}
  maxSelections={5}
  placeholder="Select..."
  reset
/>
By default the component is a single selection with no actions to create or remove options
Use combinations of isMulti/creatable/deletable to apply them
*/

const MultiSelect = (props) => {
  const [options, setOptions] = useState([]);
  const [availableOptions, setAvailbleOptions] = useState([]);
  const [selectedValues, setSelectedValues] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [creatable, setCreatable] = useState(false);
  const [isMulti, setIsMulti] = useState(false);
  const [deletable, setDeletable] = useState(false);
  const [currentValue, setCurrentValue] = useState("");
  const [confirmChange, setConfirmChange] = useState(false);
  const [changedOption, setChangedOption] = useState({});
  const [action, setAction] = useState("");
  const [isValidationRequired, setIsValidationRequired] = useState(props.required);
  const ref = useRef();
  const inputRef = useRef();

  //set permissions
  useEffect(() => setCreatable(props.creatable), [props.creatable]);
  useEffect(() => setIsMulti(props.isMulti), [props.isMulti]);
  useEffect(() => setDeletable(props.deletable), [props.deletable]);
  useEffect(() => setDisabled(props.disabled), [props.disabled]);

  useEffect(() => {
    if (props.reset) {
      setCurrentValue("");
      setOptions((prevOptions) => prevOptions.map((o) => ({ ...o, selected: false })));
    }
  }, [props.reset]);

  //format options for drop down
  const formatOptions = useCallback(() => {
    let newOptions = props.options.map((o) => ({
      id: o.id,
      value: o.value,
      selected: o.selected || false,
      isDeleted: o.isDeleted || false,
    }));

    newOptions
      .map((o, index) => ({ ...o, index }))
      .filter((f) => f.selected || f.isDeleted)
      .forEach(
        (u) =>
        (newOptions[u.index] = {
          id: u.id,
          value: u.value,
          selected: u.selected,
          isDeleted: u.isDeleted,
        })
      );
    setOptions(newOptions);
    if (!props.isMulti)
      newOptions
        .filter((o) => o.selected)
        .forEach((o) => setCurrentValue(o.value));
  }, [props.isMulti, props.options]);

  //call format options if options passed as props
  useEffect(() => {
    if (props?.options) formatOptions();
  }, [props.isMulti, props?.options, formatOptions]);

  //open options menu on click of field
  const openMenu = (e) => {
    e.stopPropagation();
    setMenuOpen(true);
    inputRef.current.focus();
  };

  const toggleMenu = (e) => {
    e.stopPropagation();
    setMenuOpen((prev) => !prev);
    inputRef.current.focus();
  };
  
  //set list of options, does not include deleted records (or selected options for multi selects)
  const filteredOptions = useCallback(() => {
    return !isMulti
      ? options.filter((o) => !o.isDeleted)
      : !props.checkboxes
        ? options.filter((o) => !o.selected && !o.isDeleted)
        : options;
  }, [isMulti, options, props.checkboxes]);

  useEffect(() => {
    //if (options.length) // Commented. Nested dropdown options could be empty for new Parent Entity
    setAvailbleOptions(filteredOptions());
  }, [options, filteredOptions]);

  //set list of currently selected options for multiselects
  const filteredSelections = useCallback(() => {
    return options.filter((o) => o.selected && !o.isDeleted);
  }, [options]);

  useEffect(() => {
    if (options.length) setSelectedValues(filteredSelections());
  }, [options, filteredSelections]);

  //mark values as selected or not selected, update options/selections list
  const handleSelections = (e, selected) => {
    const updList = options.map((o) =>
      o.value === e.target.id
        ? { ...o, selected: selected }
        : { ...o, selected: isMulti ? o.selected : false }
    );
    const selLength = updList.filter((o) => o.selected).length;
    if (props.maxSelections && selLength > props.maxSelections) return;
    if(props.required){
      setIsValidationRequired(selLength > 0 ? false : true);
    }else{
      setIsValidationRequired(false);
    }
    setOptions(updList);
    props.handleChange(updList);
  };

  //filter and update menu options as user types
  const searchOptions = (e) => {
    setCurrentValue(e.target.value);
    let filterMatchOptions = filteredOptions().filter((option) =>
      option.value.toLowerCase().includes(e.target.value.toLowerCase())
    );
    if (e.target.value) {
      setAvailbleOptions(filterMatchOptions);
    } else {
      setAvailbleOptions(filteredOptions());
    }
  };

  //set selection, keep input field empty if multiselect enabled
  const setSelection = (e) => {
    e.stopPropagation();
    handleSelections(e, true);
    setCurrentValue(isMulti ? "" : e.target.id);
    setMenuOpen(false);
  };

  //deselect option for multiselect
  const handleDeselectOption = (e) => {
    handleSelections(e, false);
    setMenuOpen(false);
  };

  //clear all selections from multiselect
  const clearAllSelections = (e) => {
    e.stopPropagation();
    const updOptions = options.map((o) => ({ ...o, selected: false }));
    setOptions(updOptions);
    props.handleChange(updOptions);
    setMenuOpen(false);
    if(props.required){
      setIsValidationRequired(true);
    }else{
      setIsValidationRequired(false);
    }
  };

  //check if input option already in database
  const newOptionExists = (option) => {
    return (
      options.filter(
        (o) => o.value?.toLowerCase() === option?.toLowerCase() && !o.isDeleted
      ).length > 0
    );
  };

  //const add new option to list of options, update database
  const addNewOption = (value) => {
    let newOptions = options;
    if (!newOptionExists(value)) {
      if (newOptions.filter((o) => o.value === value).length) {
        /* deleted option exists */
        newOptions = newOptions.map((o) =>
          o.value === value ? { ...o, selected: true, isDeleted: false } : o
        );
      } else {
        newOptions = [
          ...newOptions,
          { value: value, selected: true, isDeleted: false },
        ];
      }
    } else {
      newOptions = newOptions.map((o) =>
        o.value === value
          ? { ...o, selected: true }
          : isMulti
            ? o
            : { ...o, selected: false }
      );
    }
    setOptions(newOptions);
    props.handleChange(newOptions);
  };

  //delete option, remove from list and update database database (mark as isDeleted)
  const deleteOption = (e) => {
    e.stopPropagation?.();
    const deleted = options.map((o) => {
      return o.value === e.target.id
        ? { ...o, selected: false, isDeleted: true }
        : o;
    });
    if (currentValue === e.target.id) setCurrentValue("");
    setOptions(deleted);
    setMenuOpen(false);
    props.handleChange(deleted);
  };

  const handleSelectNewOption = () => {
    if (!newOptionExists(currentValue) && creatable) {
      setConfirmChange(true);
      setAction("add");
      setChangedOption(currentValue);
    }
  };

  const handleDeleteOption = (e) => {
    setConfirmChange(true);
    setAction("delete");
    setChangedOption(e);
  };

  const isEnterPressed = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleClickOutside(e);
      if (!currentValue && !isMulti) {
        const updOptions = options.map((o) => ({ ...o, selected: false }));
        setOptions(updOptions);
        props.handleChange(updOptions);
        return;
      }
      handleSelectNewOption(e);
    }
  };

  const handleClickOutside = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setMenuOpen(false);
      if (currentValue && !newOptionExists(currentValue) && creatable) {
        setConfirmChange(true);
        setAction("add");
        setChangedOption(currentValue);
      }
    }
  };

  const confirmDictChange = () => {
    switch (action) {
      case "add":
        addNewOption(changedOption);
        break;
      case "delete":
        deleteOption(changedOption);
        break;
      default:
    }
    setConfirmChange(false);
    setChangedOption({});
    setAction("");
    if (isMulti) setCurrentValue("");
  };

  const cancelDictChange = () => {
    setConfirmChange(false);
    setCurrentValue("");
  };

  return (
    <>
      {props.disabled || props.readOnly ? (
        <div className="readonly-multiselect-container">
          <span className="readonly-label">{props.label}</span>
          <span className={`readonly-multiselect-value ${currentValue ? "" : isMulti && selectedValues.length > 0 ? "" : "empty"}`}>
            {currentValue ? currentValue : isMulti ? selectedValues?.map(v => v.value)?.join(", ") : "no data"}
          </span>
        </div>
      ) : (
        <div
          className={
            disabled
              ? `multi-select-disabled multi-select`
              : `multi-select-${props.className} multi-select`
          }
          tabIndex={0}
          onBlur={handleClickOutside}
          style={{
            width: isMulti
              ? "270px"
              : props.className === "small"
                ? "120px"
                : "250px",
          }}
        >
          <label
            htmlFor={props.name}
            className={`${props.className} multi-select-label`}
          >
            {props.required && !props.disabled && (
              <span className="required">*</span>
            )}{" "}
            {props.label}
          </label>
          <div
            className={`multi-select-container ${disabled ? "multi-select-disabled" : ""
              } ${props.className}`}
            onClick={openMenu}
          >
            <div className="multi-select-input">
              {isMulti &&
                selectedValues.length > 0 &&
                selectedValues.map((o) => (
                  <span className="multi-selection" key={o.value} id={o.value}>
                    {o.value}
                    {!props.disabled && (
                      <span
                        className="delete-multi-select"
                        id={o.value}
                        onClick={handleDeselectOption}
                      >
                        x
                      </span>
                    )}
                  </span>
                ))}

              <input
                ref={inputRef}
                className={`multi-selections ${props.className}`}
                type="text"
                required={isValidationRequired}
                onChange={searchOptions}
                onClick={toggleMenu}
                onKeyPress={isEnterPressed}
                value={currentValue}
                disabled={disabled}
                placeholder={
                  props.placeholder && !isMulti
                    ? props.placeholder
                    : isMulti && !selectedValues.length && !props.disabled
                      ? "Select"
                      : ""
                }
              />
            </div>
            <div className="multi-select-signs">
              {isMulti &&
                options.filter((o) => o.selected).length > 0 &&
                !props.disabled && (
                  <span
                    className="clear-all-selections"
                    onClick={clearAllSelections}
                  >
                    x
                  </span>
                )}
              {!disabled && (
                <div
                  className={`multi-rotated-arrow ${props.className}`}
                  onClick={toggleMenu}
                >
                  ^
                </div>
              )}
            </div>
          </div>

          {menuOpen && !disabled && (
            <div className={`dropdown-multi-select`} ref={ref}>
              {availableOptions.length > 0 &&
                availableOptions.map((o) => {
                  return (
                    <li
                      className="multi-select-option"
                      key={o.id || o.value}
                      id={o.value}
                      onClick={setSelection}
                    >
                      <span id={o.value} onClick={setSelection} >
                        {props.checkboxes && (
                          <input type="checkbox"
                            id={o.value}
                            onChange={(e) => !o.selected ? setSelection(e) : handleDeselectOption(e)}
                            checked={o.selected}
                          />)}
                        {o.value}
                      </span>
                      {deletable && (
                        <span
                          className="delete-multi-select"
                          id={o.value}
                          onClick={handleDeleteOption}
                        >
                          x
                        </span>
                      )}
                    </li>
                  );
                })}
              {currentValue && !newOptionExists(currentValue) && creatable && (
                <li
                  id={currentValue}
                  onClick={handleSelectNewOption}
                  className="multi-select-option add-option"
                >
                  Add {currentValue}
                </li>
              )}
              {currentValue &&
                !newOptionExists(currentValue) &&
                !creatable &&
                !availableOptions.length && (
                  <li className="multi-select-option no-match-option">
                    No Match
                  </li>
                )}
              {!currentValue && !availableOptions.length && (
                <li className="multi-select-option no-match-option">No Data</li>
              )}
            </div>
          )}
          <PopUp
            openModal={confirmChange}
            type={"confirm-change"}
            handleConfirmClose={confirmDictChange}
            closePopUp={cancelDictChange}
            message={{
              title: "Confirm Change",
              details: `Are you sure you want to ${action} ${changedOption?.target?.id || "record"
                } as an option?`,
            }}
            confirmValue="Yes"
            cancelValue="No"
          ></PopUp>
        </div>
      )}
    </>
  );
};

export default MultiSelect;
