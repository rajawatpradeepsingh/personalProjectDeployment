import { Popover } from "antd";
import './popover-styles.css';

export const PopoverTable = (props) => {
   return (
      <Popover
         content={props.content}
         title={props.title}
         trigger="click"
         overlayStyle={{ width: "500px" }}
         placement="left"
         // showArrow={false}
      >
         <span className="popover-trigger">{props.children}</span>
      </Popover>
   )
}