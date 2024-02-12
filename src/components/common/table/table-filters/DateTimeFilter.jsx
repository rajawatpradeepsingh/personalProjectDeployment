import { useState } from "react";
import { DatePicker } from "antd";

export const DateTimeFilter = (props) => {
  const [date, setDate] = useState("");

  const handleReset = () => {
    setDate("");
  };

  const confirmReset = () => {
    let temp = { ...props.filters };
    delete temp["date"];
    props.setFilters(temp);
  }

  const handleChange = (value) => {
    value ? setDate(value) : setDate("");
  };

  const handleFilter = () => {
    if (date) {
      props.setFilters({ ...props.filters, date: new Date(date) });
    } else {
      confirmReset();
    }
  }

  return (
    <div className="custom-filter-container date">
      <DatePicker bordered={false} onChange={handleChange} value={date} />
      <hr className="divider" />
      <div className="custom-filter-btns">
        <button
          type="button"
          className="custom-filter-clear"
          onClick={handleReset}
        >
          Reset
        </button>
        <button
          type="button"
          className="custom-filter-ok"
          onClick={handleFilter}
        >
          OK
        </button>
      </div>
    </div>
  );
};
