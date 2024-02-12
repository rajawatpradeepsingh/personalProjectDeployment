import React, { useEffect, useState } from "react";
import { InputPhone } from "../../common/input/input-phone/input-phone.component.jsx";
import PopUp from "../../modal/popup/popup.component.jsx";
import { runValidation } from "../../../utils/validation";
import { securityQuestions } from "../../../utils/defaultData";
import { Alert } from "antd";
import "./auth.css";
import Input from "../../common/input/inputs.component.jsx";
import SingleSelect from "../../common/select/selects.component.jsx";
import Button from "../../common/button/button.component";
import Form from "../../common/form/form.component.jsx";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { postRegister } from "../../../API/auth/auth-api.js";
import { getAllRoles } from "../../../API/roles/role_apis.js";
import { alertEmail } from "../../../API/users/user-apis.js";

const RegisterForm = (props) => {
  const [roles, setRoles] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [message, setMessage] = useState("");
  const [invalidError, setInvalidError] = useState({});
  const [lengthError, setLengthError] = useState({});
  const [toggledPass, setToggledPass] = useState({
    password: true,
    password2: true,
  });
  const formInitialState = {
    username: "",
    password: "",
    password2: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    role: "",
    question: "",
    answer: "",
  };
  const [details, setDetails] = useState(formInitialState);

  useEffect(() => {
    getAllRoles()
      .then((res) => setRoles(res.data ? res.data : []))
      .catch((err) => console.log(err));
  }, []);

  const checkPasswords = (updDetails) => {
    if (
      updDetails.password.length &&
      updDetails.password2.length &&
      updDetails.password !== updDetails.password2
    ) {
      setInvalidError({
        ...invalidError,
        passwordMismatch: "Passwords must match",
      });
    } else {
      let temp = { ...invalidError };
      delete temp["passwordMismatch"];
      setInvalidError(temp);
    }
  };

  const handleChange = (e, validProc = null) => {
    const isValid = runValidation(validProc, e.target.value);
    let temp = { ...lengthError };
    delete temp[e.target.name];
    setLengthError(temp);

    const updDetails = {
      ...details,
      [e.target.name]: e.target.value,
    };
    setDetails(updDetails);

    if (!isValid) {
      setInvalidError({
        ...invalidError,
        [e.target.name]: "Inavlid or incomplete input",
      });
    } else {
      let temp = { ...invalidError };
      delete temp[e.target.name];
      setInvalidError(temp);
    }
    if (["password", "password2"].includes(e.target.name))
      checkPasswords(updDetails);
  };

  const checkLength = (name, min) => {
    if (details[name].length < min && details[name] !== "") {
      setLengthError({
        ...lengthError,
        [name]: `Must be minimum ${min} characters.`,
      });
    } else if (details[name].length >= min || !details[name].length) {
      let temp = { ...lengthError };
      delete temp[name];
      setLengthError(temp);
    }
  };

  const handleChangePhone = (value) => {
    setDetails({ ...details, phoneNumber: value });
  };

  const handlePhoneError = (bool) => {
    if (bool) {
      setInvalidError({ ...invalidError, phoneNumber: true });
    } else {
      let temp = { ...invalidError };
      delete temp["phoneNumber"];
      setInvalidError(temp);
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();

    if (Object.keys(invalidError).length || Object.keys(lengthError).length) {
      setMessage(
        `Error: ${
          Object.keys(invalidError).length
            ? Object.keys(invalidError).join(", ")
            : Object.keys(lengthError).length
            ? Object.keys(lengthError).join(", ")
            : ""
        }`
      );
      return;
    }

    postRegister(details)
      .then((res) => {
        if (res.status === 201) {
          setOpenModal(true);
          alertEmail(details.username);
          setMessage("");
        } else setMessage(res.data);
      })
      .catch((err) => console.log(err));
  };

  const resetForm = () => {
    setDetails(formInitialState);
    setInvalidError({});
    setLengthError({});
    props.setNewAccount(false);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setDetails(formInitialState);
    props.setNewAccount(false);
  };

  const passVisibilityHandle = (name) => {
    setToggledPass({
      ...toggledPass,
      [name]: !toggledPass[name],
    });
  };

  return (
    <div className="register-form-container">
      <h1 className="login-form-header">Sign Up</h1>
      {message && <Alert type="error" showIcon message={message} />}
      <Form
        onSubmit={submitHandler}
        cancel={resetForm}
        formEnabled={false}
        className="centered"
      >
        <div className="register-input-row">
          <Input
            type="text"
            label="Username"
            name="username"
            value={details.username}
            onChange={(e) => {
              handleChange(e, ["validateName", "validateEmail"]);
            }}
            minLength="3"
            maxLength="30"
            info="3 - 30 characters"
            errMssg={invalidError["username"] || lengthError["username"] || ""}
            onBlur={() => checkLength("username", 3)}
            required
          />
          <SingleSelect
            label="Role"
            name="role"
            onChange={(event) =>
              setDetails({ ...details, role: event.target.value })
            }
            placeholder="Select Role"
            options={roles.map((role) => ({
              id: role.id,
              name: role.roleName,
            }))}
            value={details.role}
            required
          />
        </div>
        <div className="register-input-row">
          <Input
            type={toggledPass.password ? "password" : "text"}
            label="Password"
            name="password"
            onChange={handleChange}
            minLength="6"
            maxLength="10"
            required
            value={details.password}
            btnOnClick={(e) => passVisibilityHandle("password")}
            hasIconBtn={true}
            inlineIcon={
              toggledPass ? (
                <EyeOutlined style={{ color: "var(--tertiary)" }} />
              ) : (
                <EyeInvisibleOutlined style={{ color: "var(--tertiary)" }} />
              )
            }
            info="6 - 10 characters"
            errMssg={lengthError["password"] || ""}
            onBlur={() => checkLength("password", 6)}
          />
          <Input
            type={toggledPass.password2 ? "password" : "text"}
            label="Confirm Password"
            name="password2"
            onChange={handleChange}
            btnOnClick={(e) => passVisibilityHandle("password2")}
            hasIconBtn={true}
            inlineIcon={
              toggledPass ? (
                <EyeOutlined style={{ color: "var(--tertiary)" }} />
              ) : (
                <EyeInvisibleOutlined style={{ color: "var(--tertiary)" }} />
              )
            }
            minLength="6"
            maxLength="10"
            required
            errMssg={
              invalidError["passwordMismatch"] || lengthError["password2"] || ""
            }
            value={details.password2}
            onBlur={() => checkLength("password2", 6)}
          />
        </div>
        <div className="register-input-row">
          <Input
            type="text"
            label="First Name"
            name="firstName"
            value={details.firstName}
            onChange={(e) => {
              handleChange(e, "validateName");
            }}
            minLength="2"
            maxLength="20"
            required
            errMssg={
              invalidError["firstName"] || lengthError["firstName"] || ""
            }
            info="2 - 20 characters"
            onBlur={() => checkLength("firstName", 2)}
          />
          <Input
            type="text"
            label="Last Name"
            name="lastName"
            value={details.lastName}
            onChange={(e) => {
              handleChange(e, "validateName");
            }}
            minLength="2"
            maxLength="20"
            required
            errMssg={invalidError["lastName"] || lengthError["lastName"] || ""}
            info="2 - 20 characters"
            onBlur={() => checkLength("lastName", 2)}
          />
        </div>
        <div className="register-input-row">
          <Input
            type="email"
            label="E-mail"
            name="email"
            value={details.email}
            onChange={(e) => {
              handleChange(e, "validateEmail");
            }}
            required
            errMssg={invalidError["email"]}
            info="email@example.com"
          />
          <InputPhone
            label="Phone Number"
            name="phoneNumber"
            phoneNumber={details.phoneNumber}
            errMssg={invalidError["phoneNumber"]}
            handleChange={handleChangePhone}
            setError={(bool) => handlePhoneError(bool)}
          />
        </div>
        <div className="register-input-row">
          <SingleSelect
            label="Security question"
            name="question"
            placeholder="Select Question"
            options={securityQuestions.map((item) => item)}
            onChange={(event) =>
              setDetails({ ...details, question: event.target.value })
            }
            value={details.question}
            required
          />
          <Input
            type="answer"
            label="Answer"
            name="answer"
            value={details.answer}
            onChange={handleChange}
            required
          />
        </div>
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            marginTop: "12px",
          }}
        >
          <Button
            name="cancel-register"
            type="reset"
            handleClick={resetForm}
            className="btn main reset marginX"
          >
            Cancel
          </Button>
          <Button
            name="register"
            type="submit"
            className="btn main marginX"
            handleClick={submitHandler}
            style={{
              width: "120px",
              height: "34px",
              alignSelf: "center",
            }}
          >
            Sign Up
          </Button>
        </div>
      </Form>
      <PopUp
        openModal={openModal}
        closePopUp={handleCloseModal}
        handleConfirmClose={handleCloseModal}
        message={{
          title: "Registration Successful",
          details:
            "We will email you when you are authorized to login and begin using the Recruitment Portal",
        }}
      />
    </div>
  );
};

export default RegisterForm;
