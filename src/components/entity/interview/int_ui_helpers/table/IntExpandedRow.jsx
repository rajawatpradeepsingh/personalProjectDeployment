import { useState, useEffect } from "react";
import { roundDisplay } from "../../utils/int_utils";
import { Table } from "antd";
import { ViewDateTime } from "./ViewDateTime";
import { ViewJobDetails } from "./ViewJobDetails";
import { TableLink } from "../../../../common/table/TableLink";
import './int-table-styles.scss';

export const IntExpandedRow = (props) => {
   const [data, setData] = useState([]);

   useEffect(() => {
      if (props.data) setData(props.data);
   }, [props.data]);

   const columns = [
     {
      title: "",
      dataIndex: "",
      key: "id",
      render: () => <span></span>,
      width: 30,
      fixed: "left"
     },
     {
       title: "Candidate",
       dataIndex: "candFullName",
       key: "candidate.firstName",
       fixed: "left",
       width: 170,
       render: (fullName, row) => (
         <TableLink
           onClick={() => props.openEditPage(row.id, "schedule")}
           label={fullName}
         />
       ),
     },
     {
       title: "Job Details",
       dataIndex: "jobOpening",
       key: "jobOpening.jobTitle",
       width: 170,
       render: (job, row) => (
         <ViewJobDetails
           title={job}
           client={row.client}
           type={row.jobType}
           id={row.jobId}
         />
       ),
     },
     {
       title: "Round",
       dataIndex: "roundType",
       key: "roundType",
       render: (round) => roundDisplay(round),
        width: 140
     },
     {
       title: "Schedule",
       dataIndex: "date",
       key: "date",
       width: 140,
       render: (date, row) => (
         <ViewDateTime
           date={date}
           start={row.schedule?.startTimeZ}
           end={row.schedule?.endTimeZ}
         />
       ),
     },
     {
       title: "Interviewers",
       dataIndex: "interviewers",
       key: "interviewers.firstName",
       ellipsis: true,
     },
     {
       title: "Decision",
       ellipsis: true,
       dataIndex: "decision",
       key: "decision",
       width: 115,
       render: (decision) => (
         <span
           style={
             !decision
               ? { color: "rgba(0,0,0,0.2)" }
               : {
                   color:
                     decision === "REJECTED"
                       ? "var(--error)"
                       : decision === "TENTATIVE"
                       ? "var(--warning)"
                       : "var(--success)",
                 }
           }
         >
           {decision ? decision : "pending"}
         </span>
       ),
     },
     {
       title: "Feedback",
       ellipsis: true,
       dataIndex: "feedback",
       key: "feedback",
     },
     {
       title: "Recording",
       dataIndex: "interviewLink",
       key: "interviewLink",
       ellipsis: true,
     },
   ];

   return (
     <>
      {data.length ? (
         <Table
            id="int-child-table"
            dataSource={data}
            columns={columns}
            pagination={false}
            rowKey={(row) => `${row.id}_expanded`}
         />
      ) : (
         <div>
            <span>No previous interviews</span>
         </div>
      )}
     </>
   );
};
