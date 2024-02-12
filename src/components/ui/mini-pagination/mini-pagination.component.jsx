import { useState } from 'react';
import { Pagination } from 'antd';
import 'antd/dist/antd.css';
import './mini-pagination.styles.css';


const MiniPagination = (props) => {
   const [current, setCurrent] = useState(1);
   const onChange = (page) => {
      setCurrent(page);
      props.setCurrentPage(page);
   }

   return(
      <div className='mini-pagination-container'>
         <Pagination size="small" showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`} current={current} onChange={onChange} defaultPageSize={props.defaultPageSize} total={props.total}/>
      </div>
   )
};
export default MiniPagination;