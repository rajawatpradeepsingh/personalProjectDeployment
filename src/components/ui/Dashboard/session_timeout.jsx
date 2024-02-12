import { EyeOutlined } from "@ant-design/icons";
import { PopoverTable } from "../../common/popovers/popovers";
export const TimeOutPopover = ({ records, ...props }) => {



   return (
     <>
       {+props.children !== 0 ? (
         <PopoverTable
           title="Session Time Out"
           content={
             <table style={{ width: "100%", borderColor: "#f1f1f1", borderCollapse: "initial" }}>
               <thead>
                 <tr style={{ backgroundColor: "#fafafa", padding: "8px" }}>
                   <th style={{ padding: "8px" }}>Values</th>
                   <th style={{ padding: "8px" }}>Time</th>

                 </tr>
               </thead>
               <tbody>
                   <tr>
                   <td style={{ padding: "8px" }}>3000</td>
                     <td style={{ padding: "8px" }}>3 secs</td>
                   </tr>
                   <tr>
                   <td style={{ padding: "8px" }}>30000</td>
                     <td style={{ padding: "8px" }}>30 secs</td>
                   </tr>
                   <tr>
                   <td style={{ padding: "8px" }}>300000</td>
                     <td style={{ padding: "8px" }}>3 mins</td>
                   </tr>
                   <tr>
                   <td style={{ padding: "8px" }}>1000000</td>
                     <td style={{ padding: "8px" }}>10 mins</td>
                   </tr>
                   <tr>
                   <td style={{ padding: "8px" }}>2000000</td>
                     <td style={{ padding: "8px" }}>20 mins</td>
                   </tr>
                   <tr>
                   <td style={{ padding: "8px" }}>3000000</td>
                     <td style={{ padding: "8px" }}>30 mins</td>
                   </tr>
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