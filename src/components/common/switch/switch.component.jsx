import { useEffect, useState } from 'react';
import { Switch } from 'antd';
import 'antd/dist/antd.css';
import './switch.styles.scss';


const SwitchComponent = (props) => {
   const [checked, setChecked] = useState(false);

   const handleChange = (value) => {
      setChecked(value);
      props.handleSwitch(value);
   }

   useEffect(() => {
      if(props.value) {
         setChecked(props.value === "Yes" ? true : false);
      } 
   }, [props.value])

   return (
      <div className='switch-container'>
         <label htmlFor='switch' className='switch-label'>{props.label}</label>
         <Switch  checkedChildren={props.checkedChildren}
         unCheckedChildren={props.unCheckedChildren}
checked={checked} size="big" onChange={handleChange} className="switch"/>
      </div>
      
   )
};

export default SwitchComponent;