import "./notification.styles.scss";

const Notification = ({ record, ...props }) => {
   return (
      <div className="notification-record-container" onClick={props.onClick}>
         <p className="record-heading">{props.unread.length > 0 && <span className="unread-record-bubble"></span>}{record.entityName}</p>
         <div className="record-message">{props.message}</div>
         <div className="record-tags-container">
            <span className="record-tag">{props.date}</span>
            <span className="record-tag">{props.author}</span>
         </div>
      </div>
   )
}

export default Notification;