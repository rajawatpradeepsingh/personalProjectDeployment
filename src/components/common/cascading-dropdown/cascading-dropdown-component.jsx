import React from 'react';
import { Cascader } from "antd";
import "./cascading-dropdown-styles.css";

 const CascadingDropdown = (props) => {
   return (
     <div className="cascader-container">
         <label htmlFor="cascader" className="cascader-label">{props.required && !props.disabled && <span className='required'>*</span>} {props.label}</label>
         <Cascader placeholder={props.placeholder || "Select"} value={props.value} options={props.options} onChange={props.onChange} changeOnSelect bordered={false}/>
         <span className='cascader-border'></span>
     </div>
   );
}
export default CascadingDropdown;