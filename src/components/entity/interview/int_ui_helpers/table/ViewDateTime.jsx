import { useMemo, useState, useEffect } from 'react';
import { dateFormat, scheduleTimeFormat } from "../../utils/int_utils";
import './int-table-styles.scss';

export const ViewDateTime = ({ date, start, end, ...props }) => {
   const currentDateTime = useMemo(() => new Date(), []);
   const [datePassed, setDatePassed] = useState(false);

   useEffect(() => {
      if (new Date(start) < currentDateTime) {
        setDatePassed(new Date(end) < currentDateTime);
      }
   }, [start, end, currentDateTime]);

   return (
     <div className="table-schedule-display">
       <span className={`date ${datePassed && "past"}`}>
         {dateFormat(date, start)}
       </span>
       <span className={`time ${datePassed && "past"}`}>
         {scheduleTimeFormat(start,end)}
       </span>
     </div>
   );
}