import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { config } from "../../../config";
import auth from "../../../utils/AuthService";
import { useDispatch, useSelector } from "react-redux";
import { setShowModal } from "../../../Redux/userSlice";
import { runValidation } from "../../../utils/validation";
import LargeModal from "../../modal/large-modal/large-modal.component";
import Form from "../../common/form/form.component";
import Input from "../../common/input/inputs.component";
import Alert from "@mui/material/Alert";
import SingleSelect from "../../common/select/selects.component";

const EditUserModal = ({ editUser, viewOnly }) => {
  const [editedUser, setEditedUser] = useState({});
  const [message, setMessage] = useState("");
  const [headers] = useState(auth.getHeaders());
  const [inputErr, setInputErr] = useState({});
  const dispatch = useDispatch();
  const { showModal, selectedUser } = useSelector(
    (state) => state.users
  );
  const [roleOptions, setRoleOptions] = useState([]);
  const [formDisabled, setFormDisabled] = useState(false);

  const isAdmin = auth.hasAdminRole(); // Replace with the actual function to check for admin role

  useEffect(() => {
    if (!isAdmin) {
      setFormDisabled(true);
    } else if (viewOnly || auth.hasHRRole() || auth.hasBDManagerRole() || auth.hasRecruiterRole()) {
      setFormDisabled(true);
    }
  }, [viewOnly, isAdmin]);
  useEffect(() => {
    setEditedUser(selectedUser);
  }, [showModal, selectedUser]);

  const handleChange = (e, validProc = null) => {
    const isValid = runValidation(validProc, e.target.value);
    const isDeleted = e.target.value === "";
    setEditedUser({
      ...editedUser,
      [e.target.name]: e.target.value,
    });

    if (!isValid) {
      setInputErr({ ...inputErr, [e.target.name]: "Invalid characters" });
    } else if (isValid || isDeleted) {
      let temp = { ...inputErr };
      delete temp[e.target.name];
      setInputErr(temp);
    }
  };

  const closeModal = () => {
    setEditedUser({});
    setMessage("");
    setInputErr({});
    dispatch(setShowModal(false));
  };

  // const handleChangeUser = (e) => {
  //   let roles = roleOptions.filter(
  //     (item) => +item.id === +e.target.value
  //   )[0];

  //   setEditedUser({
  //     ...editedUser,
  //     roles: { id: roles.id },
  //   });
  // };

  const handleChangeUser = (e) => {
    let roles = roleOptions.filter(
      (item) => +item.id === +e.target.value
    )[0];
  
    setEditedUser({
      ...editedUser,
      roles: [{ id: roles.id }], // Keep roles as an array of objects
    });
  };
  

  const getRoles = useCallback(() => {
    axios
      .get(config.serverURL + "/roles?dropdownFilter=true", {
        headers,
      })
      .then((res) => {
        const users = res.data;
        console.log(users)
        if (res.data) {
          setRoleOptions(users);
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) auth.logout();
      });
  
}, [headers]);

useEffect(() => {
  getRoles();
}, [getRoles]);
  
  const handleEditUser = (e, UserId) => {
    e.preventDefault();  
    if (Object.keys(inputErr).length) {
      console.log("Input errors:", inputErr);
      setMessage(`Fix errors before submitting: ${Object.keys(inputErr).join(", ")}`);
      return;
    } else {
      setMessage("Email/Username already exists!");
    }
  
    const UserPatchInfo = {
      id: editedUser.id,
      username: editedUser.username,
      firstName: editedUser.firstName,
      lastName: editedUser.lastName,
      phoneNumber: editedUser.phoneNumber,
      email: editedUser.email,
      roles:editedUser.roles
    };  
    preSubmitCheck(UserPatchInfo, UserId);
  };

  const preSubmitCheck = (patchInfo, id) => {
    axios
      .post(`${config.serverURL}/users/checks/${id}`, patchInfo, {
        headers,
      })
      .then(() => {
        closeModal();
        editUser(patchInfo, id);
      }) 
  };
  
  
  return (
    <>
      <LargeModal
        open={showModal}
        close={closeModal}
        header={{
          text: `Users: ${editedUser?.username}`,
        }}
      >
        <Form
          onSubmit={(e) => handleEditUser(e, editedUser.id)}
          cancel={closeModal}
          formEnabled={!formDisabled && isAdmin} 
        >
          {message && (
            <Alert
              severity="error"
              style={{ width: "100%", marginBottom: "10px" }}
            >
              {message}
            </Alert>
          )}

          <Input
            type="text"
            label="Username"
            name="username"
            value={editedUser.username || ""}
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
            value={editedUser.firstName || ""}
            onChange={(e) => handleChange(e, "validateHasAlpha")}
            required
            errMssg={inputErr["firstName"]}
          />

          <Input
            type="text"
            label="Last Name"
            name="lastName"
            maxLength="20"
            value={editedUser.lastName || ""}
            onChange={(e) => handleChange(e, "validateHasAlpha")}
            required
            errMssg={inputErr["lastName"]}
          />

          <Input
            type="text"
            label="Phone Number"
            name="phoneNumber"
            maxLength="20"
            value={editedUser.phoneNumber || ""}
            onChange={(e) => handleChange(e, "validateHasAlpha")}
            required
            errMssg={inputErr["phoneNumber"]}
          />

          <Input
            type="text"
            label="Email"
            name="email"
            maxLength="40"
            value={editedUser.email || ""}
            onChange={(e) => handleChange(e)}
            required
            errMssg={inputErr["email"]}
          />

        <SingleSelect
            label="Role"
            name="roleId"
            onChange={handleChangeUser}
            value={editedUser.roles ? editedUser.roles[0]?.id : ""}
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


        </Form>
      </LargeModal>
    </>
  );
};

export default EditUserModal;
