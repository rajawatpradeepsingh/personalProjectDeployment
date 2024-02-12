import { useEffect, useState, useCallback } from "react";
import auth from "../../../../utils/AuthService";
import { getUnreadUserNotifications } from "../../../../API/notifications/notification-apis";

import Button from "../../../common/button/button.component";
import { BellOutlined } from "@ant-design/icons";
import "antd/dist/antd.css";
import "./notification-bar.styles.css";
import ViewNotifications from "../../../entity/notification/ViewNotifications";

const NotificationBar = () => {
  const [headers] = useState(auth.getHeaders());
  const [user] = useState(auth.getUserInfo());

  const [openNotifications, setOpenNotifications] = useState(false);
  const [unread, setUnread] = useState(0);
  const [unreadList, setUnreadList] = useState([]);
  const [openDrawer, setOpenDrawer] = useState(false);

  const getUnreadList = useCallback(() => {
    getUnreadUserNotifications(headers, user.id)
      .then((res) => {
        if (res.data) {
          setUnreadList(res.data);
          setUnread(res.data.length);
        }
      })
  }, [headers, user]);

  useEffect(() => {
    const timer = setInterval(() => {
      getUnreadList();
    }, 300000);
    return () => clearInterval(timer);
  }, [getUnreadList]);


  useEffect(() => getUnreadList(), [getUnreadList]);

  const toggleNotifications = () => setOpenNotifications((prev) => !prev);

  const handleBlur = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setOpenNotifications(false);
    }
  };

  return (
    <>
      <div
        className="notification-bar-container"
        tabIndex={0}
        onBlur={handleBlur}
      >
        <Button
          type="button"
          handleClick={toggleNotifications}
          className="transparent w-150"
        >
          <BellOutlined className="icon" />
          Notifications
        </Button>
        {unread > 0 && (
          <span className="bubble">
            {unread > 99 ? `${99}+` : unread}
          </span>
        )}
        <ViewNotifications
          open={openNotifications}
          setOpen={setOpenNotifications}
          openDrawer={openDrawer}
          setOpenDrawer={setOpenDrawer}
          setUnread={setUnread}
          unreadList={unreadList}
          setUnreadList={setUnreadList}
        />
      </div >
    </>
  );
};

export default NotificationBar;
