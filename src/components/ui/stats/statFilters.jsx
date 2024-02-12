import React from 'react';
import Button from '../../../components/common/button/button.component';
import { CloseOutlined } from '@ant-design/icons';
import './statFilters.scss';

const StatFilters = (props) => {

   return (
      <div className='stats-filters'>
         {props.children}
         {props.showClear && (
            <Button type="button" className="icon-btn icon-text small reset" handleClick={props.clearFilters}>
               <CloseOutlined />
               Clear
            </Button>
         )}
      </div>
   )
}

export default StatFilters;