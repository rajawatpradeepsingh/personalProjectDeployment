import Button from "../../../common/button/button.component";
import AuthService from "../../../../utils/AuthService";
import * as service from "../utils/utils"
import Notification from "../notification.component";
import "./preview-dropdown.styles.css";

const PreviewDropdown = ({ setOpenDrawer, ...props }) => {
  const user = AuthService.getUserInfo();
  const isAdmin = AuthService.hasAdminRole();

  const handleOpenDrawer = () => {
    setOpenDrawer(true);
  };

  const openRecord = (item) => {
    props.onClick(item);
  };

  return (
    <div className="notes-preview-container">
      <div className="dropdown-actions">
        <span className="dropdown-heading">Notifications</span>
        {!isAdmin && (
          <Button
            className="btn transparent blue font-small bg-hover padding"
            type="button"
            handleClick={props.readAll}
            disabled={!props.unread}
          >
            Mark All as Read
          </Button>
        )}
      </div>
      <div className="preview-content-container">
        {props.dataShort.length ? (
          props.dataShort.map((record) => (
            <Notification
              record={record}
              key={`short${record.id}`}
              onClick={() => openRecord(record)}
              unread={record.receivers.filter(
                (item) => item.userId?.id === user.id
              )}
              message={service.getMessage(record)}
              date={service.getMessageDate(record)}
              author={service.getMessageAuthor(record)}
            />
          ))
        ) : (
          <span className="no-notifications-text">No Notifications</span>
        )}
      </div>
      <div className="dropdown-actions">
        <Button
          className="btn transparent blue bg-hover padding"
          type="button"
          handleClick={handleOpenDrawer}
        >
          View All
        </Button>
      </div>
    </div>
  );
};

export default PreviewDropdown;
