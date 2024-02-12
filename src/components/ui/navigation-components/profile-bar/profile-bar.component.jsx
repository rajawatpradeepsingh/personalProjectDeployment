import { useState } from "react";
import AuthService from "../../../../utils/AuthService";
import { setIsAuth } from "../../../../Redux/appSlice";
import { useDispatch } from "react-redux";
import { UserOutlined, SettingOutlined, LogoutOutlined, DownOutlined, } from "@ant-design/icons";
import Button from "../../../common/button/button.component";
import AppSettings from "../../app-settings/app-settings-component";
import Profile from "../../../entity/profile/Profile";
import "./profile-bar.styles.css";

const ProfileBar = (props) => {
  const dispatch = useDispatch();
  const [user] = useState(AuthService.getUserInfo());
  const [displayMenu, setDisplayMenu] = useState(false);
  const [appSettingsDrawerOpen, setAppSettingsDrawerOpen] = useState(false);
  const [profileSettingsDrawerOpen, setProfileSettingsDrawerOpen] = useState(false);

  const openMenu = () => {
    setDisplayMenu((prev) => !prev);
  };

  const closeMenu = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setDisplayMenu(false);
    }
  };

  const toggleProfileSettingsDrawer = () => {
    setProfileSettingsDrawerOpen((prev) => !prev);
    setDisplayMenu(false);
  };

  const toggleAppSettingsDrawer = () => {
    setAppSettingsDrawerOpen((prev) => !prev);
    setDisplayMenu(false);
  };

  const handleLogout = () => {
    AuthService.logout();
    dispatch(setIsAuth(false));
  };

  return (
    <div
      className="profile-bar-container"
      tabIndex={0}
      onClick={openMenu}
      onBlur={closeMenu}
    >
      <div className="user-icon-container">
        <UserOutlined />
      </div>
      {user && (
        <div className="user-menu-container">
          <span className="user-name">
            {user.firstName} {user.lastName}
          </span>
          <span className="username">{user.username}</span>
        </div>
      )}
      <DownOutlined style={{ color: "var(--tertiary)" }} />
      <div className={`user-menu ${displayMenu ? "open" : ""}`}>
        <Button
          className="transparent bg-hover padding w-full marginY"
          type="button"
          name="user-settings-btn"
          handleClick={toggleProfileSettingsDrawer}
        >
          <UserOutlined className="icon" />
          Profile
        </Button>
        {props.admin && (
          <Button
            className="transparent bg-hover padding w-full marginY"
            type="button"
            name="user-settings-btn"
            handleClick={toggleAppSettingsDrawer}
          >
            <SettingOutlined className="icon" />
            App Settings
          </Button>
        )}
        <Button
          className="transparent bg-hover padding w-full marginY"
          type="button"
          name="user-logout"
          handleClick={handleLogout}
        >
          <LogoutOutlined className="icon" />
          Logout
        </Button>
      </div>
      <Profile
        open={profileSettingsDrawerOpen}
        onClose={toggleProfileSettingsDrawer}
      />
      <AppSettings
        open={appSettingsDrawerOpen}
        onClose={toggleAppSettingsDrawer}
      />
    </div>
  );
};

export default ProfileBar;
