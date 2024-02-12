import { Route } from "react-router-dom"
import LoginForm from "../components/entity/auth/loginForm";
import Reset from "../components/entity/auth/reset";
import ResetPassword from "../components/entity/auth/resetPassword";

const RoutingNoAuth = () => {
  return <>
    <Route path="/" exact component={LoginForm} />
    <Route path="/login" exact component={LoginForm} />
    <Route path="/reset" exact component={Reset} />
    <Route path="/resetPassword" component={ResetPassword} />
  </>
}

export default RoutingNoAuth;