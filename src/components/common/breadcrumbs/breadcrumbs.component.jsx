import { Fragment } from "react";
import { RightOutlined } from "@ant-design/icons";
import "./breadcrumbs.styles.css";

const Breadcrumbs = ({ crumbs, ...props }) => {
   return (
      <div className={`crumbs-container ${props.className}`}>
         {crumbs.length && crumbs.map(crumb => {
            return !crumb.lastCrumb ? (
               <Fragment key={crumb.id}>
                  <span onClick={crumb.onClick} className="clickable">{crumb.text}</span>
                  <RightOutlined className="crumb-icon" />
               </Fragment>
            ) : (
               <span key={crumb.id} className="last-crumb">{crumb.text}</span>
            )
         })}
      </div>
   )
}

export default Breadcrumbs;