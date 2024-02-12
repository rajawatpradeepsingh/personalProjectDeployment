import { useSelector, useDispatch } from "react-redux";
import { Fragment, useCallback, useState, useEffect } from "react";
import { setUserDetails } from "../../../../Redux/userSlice";
import { runValidation } from "../../../../utils/validation";
import Input from "../../../common/input/inputs.component";
import SingleSelect from "../../../common/select/selects.component";
import auth from "../../../../utils/AuthService";
import { getAllRoles } from "../../../../API/roles/role_apis";
import { DateInput } from "../../../common/input/input-date/DateInput";
import { InputPhone } from "../../../common/input/input-phone/input-phone.component";

const BasicInfoUser = () => {
  const { userDetails } = useSelector((state) => state.users);
  const [formDisabled] = useState(false);
  const { editEnabled } = useSelector((state) => state.users);
  const [inputErr, setInputErr] = useState({});
  const dispatch = useDispatch();
  const [roleOptions, setRoleOptions] = useState([]);
  const isAdmin = auth.hasAdminRole();
  const [showActivationDate, setShowActivationDate] = useState(false); 
  const [emailValidationError, setEmailValidationError] = useState(false);
  const dispatchBasic = (object) => dispatch(setUserDetails(object));

  useEffect(() => {
    getAllRoles()
      .then((res) => setRoleOptions(res.data ? res.data : []))
      .catch((err) => console.log(err));
  }, []);

  const dispatchUserDetails = useCallback(
    (object) => dispatch(setUserDetails(object)),
    [dispatch]
  );

  const handleChange = (e, validProc = null) => {
    const isValid = runValidation(validProc, e.target.value);
    dispatchUserDetails({ ...userDetails, [e.target.name]: e.target.value });

    if (e.target.name === "firstName" || e.target.name === "lastName") {
      const isValidName = /^[A-Za-z]+$/.test(e.target.value);

      if (!isValidName) {
        setInputErr({
          ...inputErr,
          [e.target.name]: "Invalid format. Only alphabets are allowed.",
        });
      } else {
        let temp = { ...inputErr };
        delete temp[e.target.name];
        setInputErr(temp);
      }
    } else if (e.target.name === "email") {
      const emailRegex =
        /^(?!^[0-9])([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/;
      const isValidEmail = emailRegex.test(e.target.value);

      if (!isValidEmail) {
        setInputErr({
          ...inputErr,
          [e.target.name]: "Invalid email format.",
        });
        setEmailValidationError(true);
      } else {
        let temp = { ...inputErr };
        delete temp[e.target.name];
        setInputErr(temp);
        setEmailValidationError(false);
      }
    } else if (!isValid) {
      setInputErr({
        ...inputErr,
        [e.target.name]: `Invalid format or characters`,
      });
    } else if (isValid || e.target.value === "") {
      let temp = { ...inputErr };
      delete temp[e.target.name];
      setInputErr({ inputErr: temp });
    }
  };

  const handleChangeUser = (e) => {
    let roles = roleOptions.filter((item) => +item.id === +e.target.value)[0];
    dispatchUserDetails({
      ...userDetails,
      roles: [{ id: roles.id }],
    });
    setShowActivationDate(true);
  };

  const handlePhoneChange = (value) => {
    dispatchBasic({ ...userDetails, phoneNumber: value });
  };

  const isActivationDateFuture = userDetails?.activationDate === new Date().toISOString().split('T')[0];

  return !editEnabled ? (
    <>
      <div className="disabled-form-section small">
        <h3 className="disabled-form-section-header">Basic Information</h3>

        <div className="disabled-form-section-content">
          <span className="disabled-form-text">
            <span className="disabled-form-bold-text">Username:</span>
            {userDetails?.username}
          </span>
          <span className="disabled-form-text">
            <span className="disabled-form-bold-text">First Name:</span>
            {userDetails?.firstName}
          </span>
          <span className="disabled-form-text">
            <span className="disabled-form-bold-text">Last Name:</span>
            {userDetails?.lastName}
          </span>
          <span className="disabled-form-text">
            <span className="disabled-form-bold-text">Role:</span>
            {userDetails?.roles?.[0]?.roleName}
          </span>
            <span className="disabled-form-text">
              <span className="disabled-form-bold-text">Activation Date:</span>
              {userDetails?.activationDate}
            </span>
          <span className="disabled-form-text">
            <span className="disabled-form-bold-text">Email:</span>
            {userDetails?.email}
          </span>
          <span className="disabled-form-text">
            <span className="disabled-form-bold-text">Phone Number:</span>
            {userDetails?.phoneNumber}
          </span>
        </div>
      </div>
    </>
  ) : (
    <Fragment>
      <h3 className="disabled-form-section-header"> Basic Information</h3>

      <Input
        type="text"
        label="Username"
        name="username"
        value={userDetails?.username || ""}
        onChange={(e) => handleChange(e, "validateName")}
        maxLength="20"
        required
        errMssg={inputErr["username"]}
        disabled={true}
      />

      <Input
        type="text"
        label="First Name"
        name="firstName"
        maxLength="20"
        value={userDetails?.firstName || ""}
        onChange={(e) => handleChange(e, "validateHasAlpha")}
        required
        errMssg={inputErr["firstName"]}
      />

      <Input
        type="text"
        label="Last Name"
        name="lastName"
        maxLength="20"
        value={userDetails?.lastName || ""}
        onChange={(e) => handleChange(e, "validateHasAlpha")}
        required
        errMssg={inputErr["lastName"]}
      />

      <InputPhone
        label="Phone Number"
        phoneNumber={userDetails?.phoneNumber || ""}
        handleChange={handlePhoneChange}
        required
        errMssg={inputErr["phoneNumber"]}
      />

      <Input
        type="text"
        label="Email"
        name="email"
        maxLength="40"
        value={userDetails?.email || ""}
        onChange={(e) => handleChange(e)}
        required
        errMssg={inputErr["email"]}
      />

      <SingleSelect
        label="Role"
        name="roleId"
        onChange={handleChangeUser}
        value={userDetails?.roles ? userDetails?.roles[0]?.id : ""}
        options={roleOptions.map((roles) => {
          let id = roles.id;
          return {
            id: id,
            name: `${roles.roleName}`,
          };
        })}
        required
        disabled={formDisabled || !isAdmin}
      />
   {showActivationDate && (       
     <DateInput 
        label="Activation Date"
        name="activationDate"
        id="activationDate"
        value={userDetails?.activationDate || ""}
        onChange={handleChange}
                required
        min={new Date().toLocaleDateString("en-ca")}
      />
      )}
    </Fragment>
  );
};

export default BasicInfoUser;
