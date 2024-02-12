import { useState, useEffect,useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import ContextMenu from "../../common/contextMenu/context-menu";
import { menu, navContextMenu } from "./nav-menuObject";
import "./nav-menu.styles.css";
import{getUserById} from "../../../API/users/user-apis";
import CloseOnOutsideClick from "../../utils/close-on-outside-click/CloseOnOutsideClick";

const NavMenu = ({ focus, handleFocus, admin }) => {
  const location = useLocation();
  const[managerRole,setManagerRole]= useState({});
  const [contextShow, setContextShow] = useState(false);
  const [contextCoords, setContextCoords] = useState({ x: 0, y: 0 });
  const [context, setContext] = useState({});
  
  useEffect(() => {
    // get menuItem (matching url path with route or possible subRoutes)
    const menuItem = menu.filter(
      (f) =>
        (!f?.children && matchRoute(f, location.pathname)) ||
        (f.children && matchRoute(f, location.pathname, true).length > 0)
    )[0];
    // destruct page value if defined or set Home page as focused
    if (menuItem) {
      const { name: page } = menuItem.parent
        ? matchRoute(menuItem, location.pathname, true)[0]
        : menuItem;
      handleFocus(page);
    } else handleFocus("home");
  }, [location.pathname, handleFocus]);

  const matchRoute = (item, pass, isChild = false) => {
    return !isChild
      ? item.route === pass || item.subRoutes?.some((s) => pass.includes(s))
      : item.children.filter(
        (f) => f.route === pass || f.subRoutes?.some((s) => pass.includes(s))
      );
  };

  // change focus for sub-menuItem
  const changeFocus = (e, page) => {
    e.stopPropagation();
    handleFocus(page);
  };
 
  const getUsers =  useCallback(async() => {
    try {
      let headers = JSON.parse(sessionStorage.getItem("headers"));
      const id = JSON.parse(sessionStorage.getItem("userInfo"))
      
      const response =  await getUserById(headers, id.id);
      let mrole = response.userdata.roles[0]
     
      setManagerRole(mrole
       
      )
  
    } catch (error) {
      console.log(error);
    }
  },[]);
  
  useEffect(() => {
    getUsers();
  }, [getUsers]);


  // render menuItem
  const getMenuItem = (menuItem) => {
    return (
      <>
      <Link
        id={menuItem.name}
        onContextMenu={handleContextMenu}
        key={menuItem.name}
        to={menuItem.route}
        className={`menu-link ${focus[menuItem.name] ? "focused" : ""}`}
        onClick={() => handleFocus(menuItem.name)}
      >
        {menuItem.child ? menuItem.child : menuItem.text}
      </Link>
      </>
    );
  };

  // render sub-menuItems
  const getChildren = (menuItem) => {
    return (
      <CloseOnOutsideClick onClose={(e) => handleFocus(e?.target?.name, false)}>
        <div className="sub-menu-link">
          {Array.isArray(menuItem.children) &&
            menuItem.children.length &&
            menuItem.children.map((i) => (
              <Link
                id={i.name}
                onContextMenu={(e) => handleContextMenu(e)}
                key={i.name}
                to={i.route}
                className={`menu-link ${focus[i.name] ? "focused" : ""}`}
                onClick={(e) => changeFocus(e, i.name)}
              >
                {i.child ? i.child : i.text}
              </Link>
            ))}
        </div>
      </CloseOnOutsideClick>
    );
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    const { text, href: url } = e.target;
    const home = window.location.origin;
    setContext({ text, url: url || home });
    setContextCoords({ x: e.pageX, y: e.pageY });
    setContextShow(true);
  };

  return (
    
    <>
    
      {menu
        .filter((f) => !f?.admin || f.admin === admin)
        .map((i) =>
          i.parent ? (
            <>
           { i.name === "interviews..." && managerRole.interviews ? <div 
              key={i.name}
              className={`parent-menu menu-link ${i.children?.some((s) => focus[s.name]) ? "focused" : ""
                }`}
              onClick={() => {
                focus[i.name]
                  ? handleFocus(i.name, false)
                  : handleFocus(i.name);
              }}
            >
              {i.text}
              {focus[i.name] && getChildren(i)}
            </div>:""}
            { admin ? <div 
              key={i.name}
              className={`parent-menu menu-link ${i.children?.some((s) => focus[s.name]) ? "focused" : ""
                }`}
              onClick={() => {
                focus[i.name]
                  ? handleFocus(i.name, false)
                  : handleFocus(i.name);
              }}
            >
              {i.text}
              {focus[i.name] && getChildren(i)}
            </div>:""}
            { i.name === "settings..." && managerRole.settings ? <div 
              key={i.name}
              className={`parent-menu menu-link ${i.children?.some((s) => focus[s.name]) ? "focused" : ""
                }`}
              onClick={() => {
                focus[i.name]
                  ? handleFocus(i.name, false)
                  : handleFocus(i.name);
              }}
            >
              {i.text}
              {focus[i.name] && getChildren(i)}
            </div>:""}
            </>
          ) : (
            <>
            { i.name === "resourcemanager" && managerRole.manager ? getMenuItem(i) :""}
            { i.name === "candidates" && managerRole.candidates ? getMenuItem(i) :""}
            { i.name === "clients" && managerRole.client? getMenuItem(i) :""}
            { i.name === "workers" && managerRole.worker ? getMenuItem(i) :""}
            { i.name === "jobs" && managerRole.jobOpenings? getMenuItem(i) :""}
            { i.name === "suppliers" && managerRole.suppliers ? getMenuItem(i) :""}
            { i.name === "onboardings" && managerRole.onBoardings ? getMenuItem(i) :""}
            { i.name === "interviews" && managerRole.interviews ? getMenuItem(i) :""}
            { i.name === "projects" && managerRole.projects ? getMenuItem(i) :""}
            { i.name === "workOrder" && managerRole.workOrder ? getMenuItem(i) :""}
            { i.name === "calender" && managerRole.calendar ? getMenuItem(i) :""}
            { i.name === "timesheet" && managerRole.timesheet ? getMenuItem(i) :""}
            { i.name === "home" && !admin ? getMenuItem(i) :""}
             { admin ? getMenuItem(i) :""}
            
            </>
          )
        )}
      {contextShow && (
        <ContextMenu
          close={() => setContextShow(false)}
          context={context}
          coords={contextCoords}
          options={navContextMenu}
          shiftTop={70}
        />
      )}
    </>
  );
};

export default NavMenu;
