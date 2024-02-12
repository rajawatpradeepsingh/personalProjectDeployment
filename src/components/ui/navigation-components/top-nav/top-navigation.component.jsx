import { useState, useEffect, useCallback } from "react";
import AuthService from "../../../../utils/AuthService";
import { useDispatch } from "react-redux";
import { setNavMenuOpen } from "../../../../Redux/navMenuSlice";
import Dslogo from "../../../../image/Drishticon_logo.png"
import LeftNav from "../left-nav/left-navigation.component";
import NotificationBar from "../notification-bar/notification-bar.component";
import ProfileBar from "../profile-bar/profile-bar.component";
import "./top-navigation.styles.css";
import ViewNote from "../../../entity/Notes/ViewNotes";

const TopNav = () => {
  const dispatch = useDispatch();
  const [focus, setFocus] = useState({ home: true });
  const [hasAdminRole] = useState(AuthService.hasAdminRole());
  const [menuOpen, setMenuOpen] = useState(true);

  const handleFocus = useCallback((page, val = true) => {
    setFocus({ [page]: val });
  }, []);

  useEffect(() => {
    if (menuOpen) {
      dispatch(setNavMenuOpen(true));
    } else {
      dispatch(setNavMenuOpen(false));
    }
  }, [dispatch, menuOpen]);

  return (
    <nav className="top-nav-container">
      <div className="company-logo-container">
        <img src={Dslogo} alt="company logo" height="70" className="logo-img" />
      </div>
      <div className="top-nav-btns">
        <ViewNote />
        <NotificationBar />
        <ProfileBar setFocus={setFocus} admin={hasAdminRole} />
      </div>
      <LeftNav
        focus={focus}
        handleFocus={handleFocus}
        admin={hasAdminRole}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
      />
    </nav>
  );
};

export default TopNav;
