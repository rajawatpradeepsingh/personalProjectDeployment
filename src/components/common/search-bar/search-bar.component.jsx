import React, { useState, useImperativeHandle, forwardRef } from "react";
import { SearchOutlined, CloseCircleFilled } from "@ant-design/icons";
import "./search-bar.styles.css";

const Search = forwardRef((props, ref) => {
  const [options, setOptions] = useState([]);
  const [value, setValue] = useState("");
  const [showClear, setShowClear] = useState(false);

  const handleSearch = (value) => {
    setValue(value);
    props.handleSearch(value);
    setOptions([]);
    setShowClear(true);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      props.handleSearch(event.target.value);
      setOptions([]);
      if (event.target.value) setShowClear(true);
      if (!event.target.value) handleClear();
    }
  };

  const onChange = (event) => {
    const { value } = event.target;
    setValue(value);
    if (props.options?.length)
      setOptions(
        !value
          ? []
          : props.options.filter((option) => {
            return typeof option === "string"
              ? option.toLowerCase().includes(value.toLowerCase())
              : option === value;
          })
      );
  };

  const handleClear = () => {
    props.clearSearch();
    setValue("");
    setShowClear(false);
  };

  useImperativeHandle(ref, () => ({
    clearSearch() {
      handleClear();
    },
    searchValue: value
  }));

  return (
    <div className="search-bar-container">
      <SearchOutlined className="searchbar-icon" />
      <input
        type="search"
        placeholder={"Search table"}
        value={value}
        onChange={onChange}
        className="search-bar"
        onKeyDown={handleKeyDown}
      />

      {showClear && (
        <button
          type="reset"
          name="clear-search-btn"
          className="btn icon small margin-right"
          onClick={handleClear}
        >
          <CloseCircleFilled />
        </button>
      )}
      <button
        type="submit"
        className="searchbar-btn"
        onClick={() => handleSearch(value)}
        disabled={!value}
      >
        search
      </button>
      {options.length > 0 && (
        <ul className="search-dropdown-list">
          {options.map((option) => (
            <li
              key={option}
              className="search-option"
              onClick={() => handleSearch(option)}
            >
              <span>{option}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});

export default Search;
