import React, { useState, useEffect } from 'react';
import 'antd/dist/antd.css';
import { Slider } from 'antd';
import "./range-slider.styles.css";


const RangeSlider = (props) => {
   const [marks, setMarks] = useState({ 0: 0, 40: 40 });
   const [value, setValue] = useState([0, 0]);

   const handleChange = (values) => {
      setValue(values);
      props.onChange(values);
      setMarks({ 0: 0, [values[0]]: values[0], [values[1]]: values[1], 40: 40 });
   }

   useEffect(() => {
      if (props.reset) {
         setValue([0,0])
         setMarks({ 0: 0, 40: 40 });
      };
   }, [props.reset]);

  return (
    <div className="slider-container">
      <Slider
        range
        value={value}
        marks={marks}
        max={40}
        onChange={handleChange}
        className="range-slider"
      />
    </div>
  );
};

export default RangeSlider;