import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import "./auth.css";
import auth from "../../../utils/AuthService";
import { setIsAuth, setToken } from "../../../Redux/appSlice";
import { useDispatch } from "react-redux";
import Button from "../../common/button/button.component";
import Form from "../../common/form/form.component";
import Input from "../../common/input/inputs.component";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import RegisterForm from "./registerForm";
import { getAuthUser } from "../../../API/auth/auth-api";

const LoginForm = () => {
  const [details, setDetails] = useState({ name: "", password: "" });
  const [info, setInfo] = useState("");
  const [toggledPass, setToggledPass] = useState(true);
  const [isBanned, setIsBanned] = useState(false);
  const [newAccount, setNewAccount] = useState(false);
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    const time = localStorage.getItem("RCPTimeOff");
    if (!time) return;
    const timerOff = new Date(time);
    const now = new Date();
    if (timerOff > now) {
      setIsBanned(true);
      setTimeout(() => setIsBanned(false), timerOff - now);
    }
  }, []);

  const loginHandler = (e) => {
    e.preventDefault();
    if (!details.name || !details.password) {
      setInfo("Please check the entered data");
      return false;
    }

    getAuthUser(details)
      .then((res) => {
        if (res.message) {
          setInfo(res.message);
          return;
        }
        if (res.data) {
          if (!res.data.enabled) {
            setInfo("The specified user is not yet authorized");
            return;
          }
          if (res.data.roles.length) {
            auth.login(true, res.token, res.headers, res.data);
            dispatch(setIsAuth(true));
            dispatch(setToken(res.token));
            history.push("/");
          } else {
            setInfo("The specified user has not yet been assigned roles");
          }
        }
      })
      .catch(() => {
        setInfo("Please, make sure the server is available");
      });
  };

  const resetHandler = () => history.push("/reset");

  useEffect(() => {
    setInfo("");
  }, [details]);

  const passVisibilityHandle = (e) => {
    setToggledPass(!toggledPass);
  };

  const openRegisterForm = () => setNewAccount(true);

  return (
    <div className="page-container full-width centered">
      {!newAccount ? (
        <div className="login-form-container">
          <div className="login-info-panel">
            <h1 className="login-info-header">
              Welcome to Drishticon Recruitment Portal
            </h1>
            <span className="login-info-subheader">
              Don't have an account yet?
            </span>
            <Button
              type="button"
              className="btn main"
              handleClick={openRegisterForm}
            >
              Sign Up
            </Button>
          </div>
          <div className="login-form">
            <h1 className="login-form-header">Sign In</h1>
            <Form onSubmit={loginHandler} className="column">
              {info && <p className="login-prompts">{info}</p>}
              <Input
                type="text"
                label="Username"
                name="name"
                onChange={(e) =>
                  setDetails({ ...details, name: e.target.value })
                }
                value={details.name}
              />
              <Input
                type={toggledPass ? "password" : "text"}
                label="Password"
                name="password"
                id="login-password"
                onChange={(e) =>
                  setDetails({ ...details, password: e.target.value })
                }
                btnOnClick={(e) => passVisibilityHandle(e)}
                hasIconBtn={true}
                inlineIcon={
                  toggledPass ? (
                    <EyeOutlined style={{ color: "var(--tertiary)" }} />
                  ) : (
                    <EyeInvisibleOutlined
                      style={{ color: "var(--tertiary)" }}
                    />
                  )
                }
                value={details.password}
              />

              <Button
                handleClick={resetHandler}
                disabled={isBanned}
                type="button"
                className={"transparent marginY"}
              >
                Forgot your password?
              </Button>

              <Button name="login" type="submit" className="btn main marginY">
                Sign In
              </Button>

              {isBanned && (
                <span className="error-text">
                  <ExclamationCircleOutlined /> Too many attempts to reset
                  password, try again later
                </span>
              )}
            </Form>
          </div>
        </div>
      ) : (
        <RegisterForm setNewAccount={setNewAccount} />
      )}
    </div>
  );
};

export default LoginForm;
