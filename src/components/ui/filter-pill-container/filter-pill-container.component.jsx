//belov: Added multiOptions props to handle multiple selections and filter values by IDs. Not mandatory

import { useState, useEffect } from "react";
import FilterPill from "../filter-pill/filter-pill.component";
import "./filter-pill-container.styles.css";

export const PillContainer = ({
  filterTrail,
  filters,
  updateFilters,
  setFilterTrail,
  ...props
}) => {
  const [selectedFilters, setSelectedFilters] = useState([]);

  //create array from filter trail object for render
  const displaySelectedFilters = (filterTrail) => {
    let pills = [];
    for (const key in filterTrail) {
      if (filterTrail[key] && filterTrail[key]["value"].includes(",")) {
        const values = filterTrail[key]["value"].split(",");
        const filters = values.map((value) => ({
          ...filterTrail[key],
          value,
          filterProperty: key,
          isMulti: true,
        }));
        pills = pills.concat(filters);
      } else {
        pills.push({
          ...filterTrail[key],
          filterProperty: key,
          isMulti: false,
        });
      }
    }
    setSelectedFilters(pills);
  };

  useEffect(() => {
    if (filterTrail) displaySelectedFilters(filterTrail);
  }, [filterTrail]);

  return (
    <div className="pills-container">
      {selectedFilters.length > 0 &&
        selectedFilters.map((trail) => (
          <FilterPill
            key={trail.value}
            value={trail.value}
            filter={trail.filter}
            property={trail.filterProperty}
            isMulti={trail.isMulti}
            filters={filters}
            setFilters={updateFilters}
            filterTrail={filterTrail}
            setFilterTrail={setFilterTrail}
            multiOptions={props?.multiOptions}
          />
        ))}
    </div>
  );
};
