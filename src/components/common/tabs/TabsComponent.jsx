import { Tabs } from "antd";
import "./tabs-styles.scss";

export const TabsComponent = ({ activeKey, setActiveKey, ...props}) => {
   return (
     <Tabs
       id="tabs-container"
       activeKey={activeKey}
       onChange={setActiveKey}
       tabPosition={props.position ? props.position : 'right'}
       style={{ height: 650 }}
       items={props.items}
     />
   );
}
