import { useState } from "react";
import { Popover, Select } from "antd";
import './cand-subcomp.scss';

export const StatusSelect = ({value, id, ...props}) => {
  const [open, setOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  const hide = () => {
    setOpen(false);
  };

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };

  const handleStatusChange = (value) => setNewStatus(value);

  const saveChanges = () => {
    props.update(id, newStatus);
    hide();
  }

   return (
     <Popover
       open={open}
       onOpenChange={handleOpenChange}
       title="Update Status"
       trigger={"click"}
       content={
         <>
           <Select
             id="status-select"
             value={newStatus ? newStatus : value}
             size="small"
             style={{ width: "150px" }}
             options={props.options
               .filter((status) => status !== "Onboarded")
               .map((status) => ({
                 value: status,
                 label: status,
               }))}
             onChange={handleStatusChange}
           />
           <div className="select-popover-btns">
             <button
               type="button"
               className="popover-btn cancel"
               onClick={hide}
             >
               cancel
             </button>
             <button
               type="button"
               className="popover-btn save"
               onClick={saveChanges}
             >
               save
             </button>
           </div>
         </>
       }
     >
       <span
         className={`table-record-status ${value && value.toLowerCase().split(" ").join("")}`}
       >
         {value}
       </span>
     </Popover>
   );
}