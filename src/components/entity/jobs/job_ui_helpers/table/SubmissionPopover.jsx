import { useCallback } from "react";
import { useHistory } from "react-router-dom";
import { PopoverTable } from "../../../../common/popovers/popovers";
import { TableLink } from "../../../../common/table/TableLink";
import { EyeOutlined } from "@ant-design/icons";

export const SubmissionPopover = ({ records, ...props }) => {
   const history = useHistory();

   const openEditPage = useCallback((id) => {
      history.push(`/candidate/${id}`);
   }, [history]);

   return (
     <>
       {+props.children !== 0 ? (
         <PopoverTable
           title="Submissions"
           content={
             <table style={{ width: "100%", borderColor: "#f1f1f1", borderCollapse: "initial" }}>
               <thead>
                 <tr style={{ backgroundColor: "#fafafa", padding: "8px" }}>
                   <th style={{ padding: "8px" }}>Candidate</th>
                   <th style={{ padding: "8px" }}>Recruiter</th>
                   <th style={{ padding: "8px" }}>Submitted On</th>
                 </tr>
               </thead>
               <tbody>
                 {records.map((sub) => (
                   <tr key={sub.id}>
                     <td style={{ padding: "8px" }}>
                       <TableLink
                         label={sub.name}
                         onClick={() => openEditPage(sub.id)}
                         className="small"
                       />
                     </td>
                     <td style={{ padding: "8px" }}>{sub.recruiter}</td>
                     <td style={{ padding: "8px" }}>{sub.date}</td>
                   </tr>
                 ))}
               </tbody>
             </table>
           }
         >
           <div
             style={{
               display: "flex",
               flexDirection: "column",
               justifyContent: "center",
               alignItems: "center",
             }}
           >
             <EyeOutlined style={{ fontSize: "18px" }} />
             <span>{props.children}</span>
           </div>
         </PopoverTable>
       ) : (
         <div
           style={{
             display: "flex",
             flexDirection: "column",
             justifyContent: "center",
             alignItems: "center",
           }}
         >
           <span>{props.children}</span>
         </div>
       )}
     </>
   );
}