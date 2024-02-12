import { useState } from "react";
import RangeSlider from "../../range-slider/range-slider.component";

export const RangeFilter = (props) => {
   const [reset, setReset] = useState(false);
   const [from, setFrom] = useState(0);
   const [to, setTo] = useState(0);

   const handleReset = () => {
      setFrom(0);
      setTo(0);
      setReset(true);
   }

   const confirmReset = () => {
      let temp = { ...props.filters };
      delete temp["expFrom"];
      delete temp["expTo"];
      props.setFilters(temp);
   }

   const handleChange = (value) => {
      setReset(false);
      setFrom(value[0]);
      setTo(value[1]);
   }

   const handleFilter = () => {
     if (from || to) {
       props.setFilters({
         ...props.filters,
         expFrom: from,
         expTo: to,
       });
     } else {
       confirmReset();
     }
   };

   return (
     <div className="custom-filter-container">
       <RangeSlider reset={reset} onChange={(value) => handleChange(value)} />
       <hr className="divider" />
       <div className="custom-filter-btns">
         <button
           //  disabled={reset}
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
}