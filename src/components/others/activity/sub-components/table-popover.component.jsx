import moment from "moment";
import Button from "../../../../components/common/button/button.component";
import { Popover } from "antd";
import { EditFilled, DeleteOutlined } from "@ant-design/icons";
import "../activity.styles.scss";


export const ActivityPopover = ({ activity, status, date, submittedOn, pendingOn, selDate, current, fn, deleteFn, ...props }) => {
   return (
      <Popover
         placement="bottom"
         content={
            <div>
               <div>

                  {activity.newFormat
                     ? activity[status].comment
                     : activity.comment}
               </div>
               <div>
                  <div className="updateon">
                     <span>Updated On {moment(activity[status].updatedDate).format("MM-DD-YYYY")}</span>
                  </div>
               </div>
            </div>

         }
         title={
            <div className="popover-activity-title">
               <span className="popover-status">{activity.newFormat
                  ? `${status}`
                  : `${status} ${activity.user}`
               }</span>
               {activity.currentStatus === current && activity.newFormat && (
                  <div style={{ display: "flex" }}>
                     <Button className={"btn icon small marginX"} handleClick={() => fn(activity)}><EditFilled /></Button>
                     <Button className={"btn icon small marginX red"} handleClick={() => deleteFn(activity[status].id)}><DeleteOutlined /></Button>
                  </div>
               )}
            </div>
         }
      >

         <div className={`activity-date ${props.dateClassName}`}>

            {moment(
               activity.newFormat
                  ? selDate
                  : selDate
            ).format("MM.DD.YYYY")}
         </div>

      </Popover>
   )
}