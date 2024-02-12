import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import auth from "../../../utils/AuthService.js";
import { patchPass, resetPass } from "../../../API/auth/auth-api.js";
import Button from "../../common/button/button.component.jsx";
import Content from "../../container/content-container/content-container.component.jsx";
import Form from "../../common/form/form.component.jsx";
import Input from "../../common/input/inputs.component.jsx";
import "./auth.css";

const RenewPassword = () => {
  const url = useLocation();
  const [urlState, setUrlState] = useState({});
  const [passwords, newPasswords] = useState({ newPass: "", confirmPass: "" });
  const [result, setResult] = useState("");
  const history = useHistory();
  const [resOK, setResOK] = useState(false);

  useEffect(() => {
    if (url.search && url.pathname)
      setUrlState({ search: url.search, path: url.pathname });
  }, [url.search, url.pathname]);

  useEffect(() => {
    if (urlState.search)
      resetPass(urlState.search).then((res) => {
        if (res.data) setResult(res.data);
      });
  }, [urlState]);

  const changeHandler = (e) =>
    newPasswords({ ...passwords, [e.target.name]: e.target.value });

  const submitHandler = (e) => {
    e.preventDefault();
    const updUser = { password: passwords.newPass };
    patchPass(urlState.search, updUser).then((res) => {
      if (res.status === 200) setResOK(true);
    });
  };

  const loginRedirectHandler = () => auth.logout();

  const resetRedirectHandler = () => history.push("/reset");

  const setRedirect = (result) => {
    return (
      <div className="reset-pass">
        <p>{`${result ? "Login successfully changed" : ""}.\n
        Press OK to return Login page`}</p>
        <Button type="submit" handleClick={loginRedirectHandler}>
          OK
        </Button>
      </div>
    );
  };

  const setAuthorized = () => {
    return (
      <Form className="column">
        <Input
          label="New Password"
          required
          type="password"
          name="newPass"
          onChange={changeHandler}
          value={passwords.newPass}
        />
        <Input
          label="Confirm Password"
          required
          type="password"
          name="confirmPass"
          onChange={changeHandler}
          value={passwords.confirmPass}
        />
        <Button
          id="send-reset"
          type="submit"
          className="submit"
          handleClick={submitHandler}
        >
          Submit
        </Button>
      </Form>
    );
  };

  const setUnauthorized = () => {
    return (
      <div className="reset-pass">
        <p className="unAuth-text">
          No User found with this email in our records. Try using a different
          email to reset your password.
        </p>
        <Button type="submit" handleClick={loginRedirectHandler}>
          Try Again
        </Button>
      </div>
    );
  };

  const setExpired = () => {
    return (
      <div className="reset-pass">
        <p className="unAuth-text">
          Your reset link has expired, to reset password return to Login page
          and make a new request.
        </p>
        <Button
          type="submit"
          handleClick={resetRedirectHandler}
          className="large"
        >
          Return to Login
        </Button>
      </div>
    );
  };

  return (
    <div className="page-container full-width">
      <Content className="small margin-top">
        <h2 className="form-header">Reset Password</h2>
        {!result || resOK ? (
          <>{setRedirect(resOK)}</>
        ) : (
          <>
            {result === "Authorized" && setAuthorized()}
            {result === "Unauthorized" && setUnauthorized()}
            {result === "Expired" && setExpired()}
          </>
        )}
      </Content>
    </div>
  );
};

export default RenewPassword;
