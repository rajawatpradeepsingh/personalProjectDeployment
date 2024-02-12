import { useState } from "react";
import { CloseCircleFilled } from "@ant-design/icons";
import "./filter-search.styles.css";

const FilterSearch = (props) => {
  const [searchValue, setSearchValue] = useState("");

  const handleChange = (event) => {
    setSearchValue(event.target.value);
    if (props.setAddOption) props.setAddOption(event.target.value);
    props.handleSearch(event.target.value);
  };

  const clearSearch = () => {
    setSearchValue("");
    props.handleSearch("");
    if (props.setAddOption) props.setAddOption("");
  };

  const addOption = () => {
    props.handleAddOption();
    clearSearch();
  };

  return (
    <div className="filter-search-container">
      <input
        type="text"
        name="filter-search"
        className="filter-search-input"
        value={searchValue}
        onChange={handleChange}
        placeholder={!props.setAddOption ? "Search" : "Search or Add"}
      />
      {searchValue && !props.setAddOption && (
        <span className="clear-icon-filters" onClick={clearSearch}>
          <CloseCircleFilled className="clear-icon-content" />
        </span>
      )}
      {props.newOption && (
        <span className="add-option-text" onClick={addOption}>
          add
        </span>
      )}
    </div>
  );
};

export default FilterSearch;
