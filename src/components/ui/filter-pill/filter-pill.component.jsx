import Button from "../../../components/common/button/button.component";
import { CloseOutlined } from "@ant-design/icons";
import "./filter-pill.styles.css";

const FilterPill = ({
  filters,
  setFilters,
  filterTrail,
  setFilterTrail,
  ...props
}) => {
  const handleClearFilter = (property, isMulti, filterValue, trailName) => {
    let newFilters, newTrail;
    if (!isMulti) {
      newFilters = { ...filters };
      newTrail = { ...filterTrail };
      delete newFilters[property];
      delete newTrail[property];
    } else {
      const filtersArray = filters[property].split(",");
      if (props.multiOptions && props.multiOptions[props.filter]?.length) {
        const delId = props.multiOptions[props.filter]
          .filter((v) => v.name === filterValue)
          .map((i) => i.id)[0];
        newFilters = filtersArray.filter((f) => +f !== delId);
      } else newFilters = filtersArray.filter((v) => v !== filterValue);
      if (newFilters?.length) {
        newFilters = { ...filters, [property]: newFilters.join(",") };
        const newTrailValues = filterTrail[property].value
          .split(",")
          .filter((t) => t !== props.value);
        newTrail = {
          ...filterTrail,
          [property]: { filter: trailName, value: newTrailValues.join(",") },
        };
      } else {
        let temp = { ...filters };
        let trail = { ...filterTrail };
        delete temp[property];
        delete trail[property];
      }
    }
    if (trailName === "Experience") {
      newFilters = { ...filters };
      newTrail = { ...filterTrail };
      delete newFilters["expTo"];
      delete newTrail["expTo"];
      delete newFilters["expFrom"];
      delete newTrail["expFrom"];
    }
    setFilters(newFilters);
    setFilterTrail(newTrail);
  };

  return (
    <div className="filter-pill-container">
      <span className="filter-name">
        {props.filter}: {props.value}
      </span>
      <Button
        type="button"
        className="icon-btn filter-pill-close"
        handleClick={() =>
          handleClearFilter(
            props.property,
            props.isMulti,
            props.value,
            props.filter
          )
        }
      >
        <CloseOutlined />
      </Button>
    </div>
  );
};

export default FilterPill;
