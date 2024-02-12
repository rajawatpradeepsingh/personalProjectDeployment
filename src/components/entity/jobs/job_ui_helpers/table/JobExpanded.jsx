import {useState, useEffect} from 'react';
import { Table } from "antd";

export const JobExpanded = ({ row }) => {
   const [data, setData] = useState([]);

   useEffect(() => setData([row]), [row]);

   const columns = [
     {
       title: "Hiring Manager",
       dataIndex: "hiringManager",
       key: "hiringManager",
       width: 150
     },
     {
       title: "FLSA",
       dataIndex: "flsaType",
       key: "flsaType",
       width: 100
     },
     {
       title: "Tax",
       dataIndex: "taxType",
       key: "taxType",
       width: 100
     },
     {
       title: "Description",
       dataIndex: "jobDescription",
       key: "jobDescription",
       render: (desc) => (
        <div style={{ maxHeight: "150px", overflowY: "auto"}}>
          {desc}
          {/* {desc.substring(0, 1000)}{desc.length > 1000 && '...'} */}
        </div>
       )
      //  ellipsis: true,
     },
   ];

   return (
     <Table
       dataSource={data}
       columns={columns}
       pagination={false}
       rowKey={() => `${data?.id}_expanded`}
     />
   );
}