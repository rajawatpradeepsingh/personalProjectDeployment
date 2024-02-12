import React, { useState, useEffect, Fragment } from "react";
import { formatPhoneNumber } from "../../../utils/service";
import Button from "../../common/button/button.component";
import { runValidation } from "../../../utils/validation";
import auth from "../../../utils/AuthService";
import Form from "../../common/form/form.component";
import Input from "../../common/input/inputs.component";
import PopUp from "../../modal/popup/popup.component";
import { Alert } from "antd";
import { EditFilled } from "@ant-design/icons";
import { Drawer } from "antd";
import "./profile.css";
import { getUser, patchUser } from "../../../API/users/user-apis";
import { TimeOutPopover } from "../../ui/Dashboard/session_timeout";

const Profile = ({ open, onClose }) => {
  const initialFormState = {
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    roles: "",
    timeout:"",
  };
  const [userInfo, setUserInfo] = useState(initialFormState);
  const [passwordMismatch, setPasswordMismatch] = useState("");
  const [passwords, setPasswords] = useState({ newPass: "", confirmPass: "" });
  const [userEdit, setUserEdit] = useState({});
  const [enablePasswordChange, setEnablePasswordChange] = useState(false);
  const [openPopUp, setOpenPopUp] = useState(false);
  const [submitErr, setSubmitErr] = useState("");
  const [headers] = useState(auth.getHeaders());

  useEffect(() => {
    if (open) {
      const user = JSON.parse(sessionStorage.getItem("userInfo"));
      getUser(headers, user.id)
        .then((res) => 
        {
          if (res.data) {
            setUserInfo({
              id: res.data.id,
              username: res.data.username,
              firstName: res.data.firstName,
              lastName: res.data.lastName,
              email: res.data.email,
              phoneNumber: res.data.phoneNumber || "",
              roles: res.data.roles[0]?.roleName,
              timeout: res.data.timeout || null
            });
          }
        })
        .catch((err) => console.log(err));
    }
  }, [open, headers]);

  useEffect(() => {
    setSubmitErr("");
    if (
      passwords.newPass.length &&
      passwords.confirmPass.length &&
      passwords.newPass !== passwords.confirmPass
    )
      setPasswordMismatch("Passwords must match");
    else setPasswordMismatch("");
  }, [passwords]);

  const changeHandler = (e, procName) => {
    const isDeleted = e.target.value === "";
    const isValid = runValidation(procName, e.target.value);
    if (isValid || isDeleted)
      setUserInfo({
        ...userInfo,
        [e.target.name]: e.target.value,
      });
  };

  const saveHandler = (e) => {
    
    e.preventDefault();
    const newUser = {
      username: userInfo.username,
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      phoneNumber: userInfo.phoneNumber,
      email: userInfo.email,
      timeout:userInfo.timeout
    };
    patchUser(headers, userInfo.id, newUser)
      .then((res) => {
        
        if (res.data) {
          setUserEdit({});
          setOpenPopUp(true);
          setSubmitErr("");
           
        }
      })
      .catch((err) => {
         
        setSubmitErr(`Error while updating profile info: ${err}`);
      });
  };

  const cancelHandler = () => {
    setUserEdit({});
  };

  const submitPasswordChange = (e) => {
    e.preventDefault();
    if (passwordMismatch) {
      setSubmitErr("Passwords must match");
      return;
    }
    if (passwords.newPass !== "" && passwords.confirmPass !== "") {
      const newPass = { password: passwords.newPass };
      patchUser(headers, userInfo.id, newPass)
        .then((res) => {
          if (res.data) {
            setOpenPopUp(true);
            setPasswords({ newPass: "", confirmPass: "" });
            setEnablePasswordChange(false);
            setSubmitErr("");
          }
        })
        .catch((err) => {
          setSubmitErr(`Error while updating password: ${err}`);
        });
    }
  };

  const togglePasswordForm = () => {
    setEnablePasswordChange((prev) => !prev);
    setSubmitErr("");
  };

  const changePassword = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleInlineEdit = (name) => {
    
    if (!userEdit[name]) {
      setUserEdit({ ...userEdit, [name]: true });
    } else {
      let temp = { ...userEdit };
      delete temp[name];
      setUserEdit(temp);
    }
  };

  return (
    <Drawer
      title={`Profile Settings`}
      placement="right"
      size={736}
      onClose={onClose}
      open={open}
    >
      {submitErr && <Alert type="error" showIcon message={submitErr} />}
      <Form
        formEnabled={Object.keys(userEdit).length > 0}
        onSubmit={saveHandler}
        cancel={cancelHandler}
        className="column justify-start"
      >
        <Input
          type="text"
          label="Username"
          name="userName"
          value={userInfo?.username}
          disabled
        />
        <Input
          type="text"
          label="First Name"
          name="firstName"
          disabled={!userEdit.firstName}
          value={userInfo?.firstName}
          onChange={(e) => changeHandler(e)}
          hasIconBtn
          btnOnClick={() => handleInlineEdit("firstName")}
          inlineIcon={
            <EditFilled
              style={userEdit.firstName ? { color: "var(--secondary)" } : {}}
            />
          }
          required
        />
        <Input
          label="Last Name"
          type="text"
          name="lastName"
          disabled={!userEdit.lastName}
          value={userInfo?.lastName}
          onChange={changeHandler}
          hasIconBtn
          btnOnClick={() => handleInlineEdit("lastName")}
          inlineIcon={
            <EditFilled
              style={userEdit.lastName ? { color: "var(--secondary)" } : {}}
            />
          }
          required
        />
        <Input
          type="email"
          label="Email"
          name="email"
          disabled={!userEdit.email}
          value={userInfo?.email}
          onChange={(e) => changeHandler(e, "validateEmail")}
          hasIconBtn
          btnOnClick={() => handleInlineEdit("email")}
          inlineIcon={
            <EditFilled
              style={userEdit.email ? { color: "var(--secondary)" } : {}}
            />
          }
          required
        />

        <Input
          type="text"
          label="Phone Num."
          name="phoneNumber"
          disabled={!userEdit.phoneNumber}
          value={userInfo?.phoneNumber}
          placeholder="000-000-0000"
          onChange={changeHandler}
          onBlur={() => {
            setUserInfo({
              ...userInfo,
              phoneNumber: formatPhoneNumber(userInfo.phoneNumber),
            });
          }}
          hasIconBtn
          btnOnClick={() => handleInlineEdit("phoneNumber")}
          inlineIcon={
            <EditFilled
              style={userEdit.phoneNumber ? { color: "var(--secondary)" } : {}}
            />
          }
        />
        <Input
          type="text"
          label="Role"
          name="roles"
          disabled
          value={userInfo?.roles}
        />
        <div className="timeout_eye">
        <Input
          type="timeout"
          label="Session Time out"
          name="timeout"
          disabled={!userEdit.timeout}
          value={userInfo?.timeout}
          onChange={(e) => changeHandler(e, "validateTimeout")}
          hasIconBtn
          btnOnClick={() => handleInlineEdit("timeout")}
          inlineIcon={
            <EditFilled
              style={userEdit.timeout ? { color: "var(--secondary)" } : {}}
            />
          }
          
        
          required
        />
      <TimeOutPopover style={{ fontSize: "18px",marginLeft: '100px' }} />
      </div>
           

      </Form>
      <Form
        onSubmit={submitPasswordChange}
        cancel={togglePasswordForm}
        formEnabled={enablePasswordChange}
        className="centered"
      >
        {!enablePasswordChange && (
          <Button
            type="button"
            name="enable-pass-change"
            className={"btn main outlined"}
            handleClick={togglePasswordForm}
          >
            Update Password
          </Button>
        )}
        {enablePasswordChange && (
          <Fragment>
            <Input
              type="password"
              label="Password"
              name="newPass"
              value={passwords.newPass}
              onChange={changePassword}
              minLength="6"
              maxLength="10"
              info="6 - 10 characters"
              required
            />
            <Input
              label="Confirm Password"
              type="password"
              name="confirmPass"
              value={passwords.confirmPass}
              onChange={changePassword}
              minLength="6"
              maxLength="10"
              info="6 - 10 characters"
              errMssg={passwordMismatch}
              required
            />
          </Fragment>
        )}
      </Form>
      <PopUp
        openModal={openPopUp}
        closePopUp={() => setOpenPopUp(false)}
        handleConfirmClose={() => setOpenPopUp(false)}
        confirmValue="Ok"
        type="Success"
        message={{
          title: "Success",
          details: "Updates to account submitted successfully.",
        }}
      />
    </Drawer>
  );
};

export default Profile;
