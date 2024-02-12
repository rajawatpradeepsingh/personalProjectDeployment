import React from "react";
import { BrowserRouter } from "react-router-dom";
import { setToken } from "../../Redux/appSlice";
import { useDispatch, useSelector } from "react-redux";
import auth from "../../utils/AuthService";
import "react-phone-number-input/style.css";

import TopNav from "../ui/navigation-components/top-nav/top-navigation.component";
import Routing from "../../routing/Routing";
import RoutingNoAuth from "../../routing/RoutingNoAuth";

const Main = () => {
  const { token } = useSelector((state) => state.app);
  const dispatch = useDispatch();

  const getRoutes = () => {
    const existedToken = sessionStorage.getItem("jwttoken"); // if page was refreshed also check the sessionStorage for jwttoken
    const jwtToken = token || (existedToken && JSON.parse(existedToken));

    if (auth.tokenValidity(jwtToken)) {
      if (!token) dispatch(setToken(jwtToken));
      return <>
        <TopNav />
        <Routing />
      </>;
    }
    return <RoutingNoAuth />;
  };

  return (
    <BrowserRouter>
      {getRoutes()}
    </BrowserRouter>
  );
};

export default Main;