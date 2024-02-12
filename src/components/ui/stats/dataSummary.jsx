import React from 'react';
import './dataSummary.scss';

const DataSummary = ({ data, ...props}) => {
   return (
      <div className={`data-summary-container ${data.theme}`}>
         <span className={`data-summary-label ${data.theme}`}>{data.label}</span>
         <span className={`data-summary-total ${data.theme}`}>{data.total}</span>
      </div>
   )
}

export default DataSummary;