import {  useSelector ,useDispatch} from "react-redux";
import { Fragment, useCallback, useState } from "react";
import { setBasicInfo, setChangesMade, setInputErr, setManager, setRequiredErr } from "../../../../Redux/managerSlice";
import { runValidation } from "../../../../utils/validation";
import Input from "../../../common/input/inputs.component";
import SingleSelect from "../../../common/select/selects.component";
import { InputPhone } from "../../../common/input/input-phone/input-phone.component";
const BasicInfoManager = () => {
  
  const [formDisabled] = useState(false);
  const { inputErr, requiredErr } = useSelector((state) => state.manager);
  const { editEnabled } = useSelector((state) => state.manager);
  const dispatchReqErr = (object) => dispatch(setRequiredErr(object));
  const dispatchBasic = (object) => dispatch(setBasicInfo(object));
  const dispatchChange = (object) => dispatch(setChangesMade(object));
  const dispatch = useDispatch();
  const dispatchErr = (object) => dispatch(setInputErr(object));
  const { basicInfo } = useSelector((state) => state.manager);
  


  const dispatchManagerDetails = useCallback(
    (object) => dispatch(setManager(object)),
    [dispatch]
  );
  const handleBasicInfoChange = (event, validProc = null) => {
    dispatchChange(true);
    const isValid = runValidation(validProc, event.target.value);
    let temp;
    if (event.target.value !== "") {
      temp = { ...requiredErr };
      delete temp[event.target.name];
      dispatchReqErr(temp);
    }
    dispatchBasic({ ...basicInfo, [event.target.name]: event.target.value });

    if (!isValid) {
      dispatchErr({
        ...inputErr,
        [event.target.name]: `Invalid format or characters`,
      });
    } else {
      temp = { ...inputErr };
      delete temp[event.target.name];
      dispatchErr(temp);
    }
  };

  //  const handleChange = (e, validProc = null) => {
  //   const isValid = runValidation(validProc, e.target.value);
  //   dispatchManagerDetails({ ...managerDetails, [e.target.name]: e.target.value });
  //   if (!isValid) {
  //     setInputErr({
  //       ...inputErr,
  //       [e.target.name]: `Invalid format or characters`,
  //     });
  //   } else if (isValid || e.target.value === "") {
  //     let temp = { ...inputErr };
  //     delete temp[e.target.name];
  //     setInputErr({ inputErr: temp });
  //   }
  // };
  const handlePhoneChange = (value) => {
    dispatchBasic({ ...basicInfo, phoneNumber : value });
  };
  const handlePhoneError = (error) => {
    if (error) {
      setInputErr({ ...inputErr, phoneNumber: true });
    } else {
      let temp = { ...inputErr };
      delete temp["phoneNumber"];
      setInputErr(temp);
    }
  };

// return !editEnabled ? (
//   <>
//         <div className="disabled-form-section small">
//          <h3 className="disabled-form-section-header">Basic Information</h3>

//          <div className="disabled-form-section-content">
//            <span className="disabled-form-text">
//              <span className="disabled-form-bold-text">FirstName:</span>
//              {managerDetails?.firstName}
             
//            </span>
//            <span className="disabled-form-bold-text">LastName:</span>
//              {managerDetails?.lastName}
           
//            <span className="disabled-form-text">
//              <span className="disabled-form-bold-text">Email:</span>
//              {managerDetails?.email}
//            </span>
//            <span className="disabled-form-text">
//              <span className="disabled-form-bold-text">Phone Number:</span>
//              {managerDetails?.phone_no}
         
//            </span>
//            <span className="disabled-form-bold-text">Role</span>
//              {managerDetails?.role}
//            <span className="disabled-form-text">
//              <span className="disabled-form-bold-text">Start Date:</span>
//              {managerDetails?.startDate}
//            </span>
//            <span className="disabled-form-text">
//              <span className="disabled-form-bold-text">End Date:</span>
//              {managerDetails?.endDate}
//            </span>
//          </div>

//        </div>
//        {!editEnabled ? (
//         <Input
//           label="Name"
//           readOnly
//           value={`${basicInfo?.firstName} ${basicInfo?.lastName}`}
//         />
// ) : (

//           <Fragment>
//              <h3 className="disabled-form-section-header"> Basic Information</h3>
//              <Input
//                     type="text"
//                     label="FirstName"
//                     name="name"
//                     value={managerDetails.firstName}
//                     onChange={(e) => handleChange(e, "validateName")}
//                     maxLength="20"
//                     required
//                   />
//                    <Input
//                     type="text"
//                     label="LastName"
//                     name="name"
//                     value={managerDetails.lastName}
//                     onChange={(e) => handleChange(e, "validateName")}
//                     maxLength="20"
//                     required
//                   />

//        <Input
//             label="Email"
//             type="email"
//             name="email"
//             onChange={handleChange}
//             value={managerDetails.email}
//             required
//          />
//                   <InputPhone
//                     phone_no={managerDetails.phone_no}
//                     handleChange={handleChange}
//                     label="Phone Num."
//                   />
//                     <Input
                 
//                   label="Start Date"
//                 name="startDate"
//                   type="date"
//                   max="2999-12-31"
//                   onChange={(e) => handleChange(e, "validateDate")}
//                   value={managerDetails.startDate}
//                 />
//                 <Input
//                   name="endDate"
//                   label=" End Date"
//                   type="date"
//                   max="2999-12-31"
//                   onChange={(e) => handleChange(e, "validateDate")}
//                   value={managerDetails.endDate}
//                 />
          
//       </Fragment>


// );
return (
  <>
    <h3 className="disabled-form-section-header"> Basic Information</h3>
    
{!editEnabled ? (
      <Input
        label="Name"
        readOnly
        value={`${basicInfo?.firstName} ${basicInfo?.lastName}`}
      />
    ) : (
      <>
        <Input
          type="text"
          label="First Name"
          name="firstName"
          value={basicInfo?.firstName || ""}
          onChange={(e) => handleBasicInfoChange(e, "validateName")}
          maxLength="40"
          required
          disabled={!editEnabled}
          errMssg={inputErr["firstName"]}
        />
        <Input
          type="text"
          label="Last Name"
          name="lastName"
          value={basicInfo?.lastName || ""}
          onChange={(e) => handleBasicInfoChange(e, "validateName")}
          maxLength="40"
          disabled={!editEnabled}
          errMssg={inputErr["lastName"]}
        />
      </>
    )}

    <Input
      type="email"
      label="Email"
      name="email"
      value={basicInfo?.email || ""}
      onChange={(e) => handleBasicInfoChange(e, "validateEmail")}
      required
      disabled={!editEnabled}
      errMssg={inputErr["email"]}
    />

    <InputPhone
      label="Phone Num."
      phoneNumber={basicInfo?.phoneNumber || ""}
      handleChange={handlePhoneChange}
      disabled={!editEnabled}
      setError={handlePhoneError}
    />

    
    <SingleSelect
      name="state"
      label="Status"
      type="state"
      id="state"
      onChange={(e) => handleBasicInfoChange(e)}
      value={basicInfo?.state}
      options={[
        { id: 1, value: "ACTIVE", name: "Active" },
        { id: 2, value: "INACTIVE", name: "Inactive" },
      ]}
      disabled={!editEnabled}
    />
    <SingleSelect
      name="role"
      label="Role"
      type="role"
      id="role"
      onChange={(e) => handleBasicInfoChange(e)}
      value={basicInfo?.role}
      options={[
        { id: 1, value: "RECRUITER", name: "Recruiter" },
        { id: 2, value: "SALESMANAGER", name: "Sales Manager" },
      ]}
      disabled={!editEnabled}
    />

    

    

   
   
    

   
  </>
);
};


export default BasicInfoManager;