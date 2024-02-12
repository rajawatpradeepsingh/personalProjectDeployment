import { Fragment, useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import moment from "moment";
import { config } from "../../../../../config";
import AuthService from "../../../../../utils/AuthService";
import SingleSelect from "../../../../common/select/selects.component";
import Input from "../../../../common/input/inputs.component";
import { InputPhone } from "../../../../common/input/input-phone/input-phone.component";
import { runValidation } from "../../../../../utils/validation";
import { setBasicInfo, setChangesMade } from "../../../../../Redux/workerSlice";
import { setInputErr, setRequiredErr } from "../../../../../Redux/workerSlice";
import { delDict, postDict ,getDict} from "../../../../../API/dictionaries/dictionary-apis";
import MultiSelect from "../../../../common/select/multiSelect/multiSelect.component";
import auth from "../../../../../utils/AuthService";
import { InputCurrencyRate } from "../../../../common/input/input-currency-rate/input-currency-rate.component";
import { ctcType } from "../../../../../utils/defaultData";
import { Checkbox } from "antd";
const BasicInfo = () => {
  const dispatch = useDispatch();

  const { editEnabled } = useSelector((state) => state.worker);
  const { basicInfo } = useSelector((state) => state.worker);
  const { inputErr, requiredErr } = useSelector((state) => state.worker);
  const dispatchBasic = (object) => dispatch(setBasicInfo(object));
  const dispatchErr = (object) => dispatch(setInputErr(object));
  const dispatchReqErr = (object) => dispatch(setRequiredErr(object));
  const dispatchChange = (object) => dispatch(setChangesMade(object));
  const [clientOptions, setClientOptions] = useState([]);
  const [resourceManagerOptions, setResourceManagerOptions] = useState([]);
  const [headers] = useState(AuthService.getHeaders());
  const [primeSkillsDict, setPrimeSkillsDict] = useState([]);
  const [secSkillsDict, setSecSkillsDict] = useState([]);
  const [professionalRolesDict, setProfessionalRolesDict] = useState([]);

  const getDicts = useCallback(async () => {
    const response = {};
    response.prime = await getDict("primeSkills", headers);
    response.secondary = await getDict("secSkills", headers);
    response.professionalRoles = await getDict("professionalRoles", headers);

    return response;
  }, [headers]);



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

  const handleChangeClient = (e) => {
    const client = clientOptions.filter(
      (item) => +item.id === +e.target.value
    )[0];

    dispatchBasic({
      ...basicInfo,
      client: { clientName: client.clientName, id: client.id },
    });
  };
  const handleChangeResourceManager = (e) => {
    const resourceManager = resourceManagerOptions.filter(
      (item) => +item.resourceManagerId === +e.target.value
    )[0];

    dispatchBasic({
      ...basicInfo,
      resourceManager: { name: `${resourceManager?.firstName} ${resourceManager?.lastName}`, resourceManagerId: resourceManager?.resourceManagerId },
    });
  };
  //handle phone number changes
  const handlePhoneChange = (value) => {
    dispatchBasic({ ...basicInfo, phoneNumber: value });
  };

  //set error in state for phone errors
  const handlePhoneError = (error) => {
    if (error) {
      dispatchErr({
        ...inputErr,
        phoneNumber: true,
      });
    } else {
      let temp = { ...inputErr };
      delete temp["phoneNumber"];
      dispatchErr(temp);
    }
  };

  const getResourceManager = useCallback(async () => {
    try {
      return await axios
        .get(config.serverURL + "/resourcemanager?dropdownFilter=true&role=RECRUITER", { headers }
      );
    } catch (error) {
      console.log(error);
    }
  }, [headers]);

  useEffect(() => {
    let isCancelled = false;
    const fetchData = async () => {
      try {
        if (!isCancelled) {
          const response = await getResourceManager();
          if (response.status === 200) {
            setResourceManagerOptions(response.data);
          }
        }
      } catch (error) {
        if (!isCancelled && error.response?.status === 401)
          AuthService.logout();
      }
    };
    fetchData();
    //cleanup function:
    return () => (isCancelled = true);
  }, [getResourceManager]);

  const getClients = useCallback(async () => {
    try {
      return await axios.get(
        config.serverURL + "/clients?dropdownFilter=true",
        { headers }
      );
    } catch (error) {
      console.log(error);
    }
  }, [headers]);

  useEffect(() => {
    let isCancelled = false;
    const fetchData = async () => {
      try {
        if (!isCancelled) {
          const response = await getClients();
          if (response.status === 200) {
            setClientOptions(response.data);
          }
        }
      } catch (error) {
        if (!isCancelled && error.response?.status === 401)
          AuthService.logout();
      }
    };
    fetchData();
    //cleanup function:
    return () => (isCancelled = true);
  }, [getClients]);



  useEffect(() => {
    let isCancelled = false;
    const fetchData = async () => {
      try {
        const dictionaries = await getDicts();
        if (Object.keys(dictionaries).length) {
          if (!isCancelled) {
            setPrimeSkillsDict(dictionaries.prime);
            setSecSkillsDict(dictionaries.secondary);
            setProfessionalRolesDict(
              dictionaries.professionalRoles.sort((a, b) =>
                a.value.localeCompare(b.value)
              )
            );
            
          }
        }
      } catch (e) {
        if (!isCancelled) {
          console.log(e);
        }
      }
    };
    fetchData();
    //cleanup function:
    return () => (isCancelled = true);
  }, [getDicts]);

  const multiSelectChange = (options, resource, parent = null) => {
    const selected = options
      .filter((o) => o.selected)
      .map((o) => o.value)
      .join(",");

    let resName = resource;
    if (resource === "primeSkills") resName = "primarySoftwareSkill";
    if (resource === "secSkills") resName = "secondarySkill";
    if (resource === "professionalRoles") resName = "designation";

    const change = { target: { name: resName, value: selected || "" } };
    if (parent === "basicInfo") {
      handleBasicInfoChange(change);
    }
        options
      .filter((o) => !o.id && !o.isDeleted)
      .forEach((o) => {
        postDict(resource, o.value, headers)
          .then((res) => {
            if (resource === "primeSkills")
              setPrimeSkillsDict([...primeSkillsDict, res]);
            if (resource === "secSkills")
              setSecSkillsDict([...secSkillsDict, res]);
            if (resource === "professionalRoles")
              setProfessionalRolesDict([...professionalRolesDict, res]);
          })
          .catch((err) => console.log(err));
      });
    options
      .filter((o) => o.isDeleted)
      .forEach((o) => {
        delDict(o.id, headers).catch((err) => console.log(err));
      });
    const delList = options.filter((o) => !o.isDeleted);
    if (resource === "primeSkills") setPrimeSkillsDict(delList);
    if (resource === "secSkills") setSecSkillsDict(delList);
    if (resource === "professionalRoles") setProfessionalRolesDict(delList);

  };
  const currencyChange = (e, validProc = "validateNum") => {
    handleBasicInfoChange(e, e.target.name === "payRate" ? validProc : "");
  };
  const handleCheckChangeSF = (event) => {
    const {name } = event.target;
  // dispatchBasic({ [name]: event.target.checked });
  dispatchBasic({ ...basicInfo, [name]: event.target.checked });

 }

  return (
    <Fragment>
      <h3 className="disabled-form-section-header">Basic Information</h3>
      <SingleSelect
        name="status"
        label="Status"
        type="status"
        id="status"
        onChange={(e) => handleBasicInfoChange(e, "validateGender")}
        value={basicInfo?.status}
        options={[
          { id: 1, value: "ACTIVE", name: "Active" },
          { id: 2, value: "TERMINATED", name: "Terminated" },
          { id: 3, value: "LEAVEWITHOUTPAY", name: "LeaveWithoutPay" },
          { id: 4, value: "RE-HIRE", name: "Re-Hire" },
        ]}
        disabled={!editEnabled}
      />
      {editEnabled ? (
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
            required
            disabled={!editEnabled}
            errMssg={inputErr["lastName"]}
          />
        </>
      ) : (
        <Input
          readOnly
          value={`${basicInfo?.firstName} ${basicInfo?.lastName}`}
          label="Name"
        />
      )}
      <SingleSelect
        name="gender"
        label="Gender"
        id="gender"
        onChange={(e) => handleBasicInfoChange(e, "validateGender")}
        value={basicInfo?.gender}
        options={[
          { id: 1, value: "Male", name: "Male" },
          { id: 2, value: "Female", name: "Female" },
          { id: 3, value: "Non-Binary", name: "Non-Binary" },
          { id: 4, value: "Trans-Fem", name: "Trans-Fem" },
          { id: 5, value: "Trans-Fem", name: "Trans-Masc" },
          { id: 6, value: "Prefer Not to Say", name: "Prefer Not to Say" },
        ]}
        disabled={!editEnabled}
      />
      <SingleSelect
        label="Client"
        name="clientId"
        onChange={handleChangeClient}
        value={basicInfo?.client?.id}
        options={clientOptions?.map((client) => {
          let id = client?.id;
          let name = client?.clientName;
          return { id: id, name: name };
        })}
        required
        disabled
      />
        <MultiSelect
        label="Title"
        options={professionalRolesDict.map((o) => ({
          id: o.id,
          value: o.value,
          label: o.value,
          selected: basicInfo?.designation === o.value,
        }))}
        handleChange={(e) =>
          multiSelectChange(e, "professionalRoles", "basicInfo")
        }
        creatable
        placeholder="please select"

            deletable={auth.hasAdminRole() || auth.hasBDManagerRole()}
            disabled={!editEnabled}
          />
          <Input
        name="dateOfBirth"
        label="Dob"
        id="dateOfBirth"
        type="date"
        max={new Date().toLocaleDateString("en-ca")}
        onChange={(e) => handleBasicInfoChange(e, "validateDob")}
        value={!editEnabled && basicInfo?.dateOfBirth ? moment(basicInfo?.dateOfBirth).format("MM/DD/YYYY") : basicInfo?.dateOfBirth}
        disabled={!editEnabled}
      />
      {/* <h3 className="disabled-form-section-header">Contact</h3> */}
      <InputPhone
        label="Phone Num."
        phoneNumber={basicInfo?.phoneNumber || ""}
        handleChange={handlePhoneChange}
        disabled={!editEnabled}
        setError={handlePhoneError}
      />
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
          <SingleSelect
        label="Resource Manager"
        name="resourceManagerId"
        onChange={handleChangeResourceManager}
        value={basicInfo?.resourceManager?.resourceManagerId}
        options={resourceManagerOptions?.map((resourceManager) => {
          let id = resourceManager?.resourceManagerId;
          let name = `${resourceManager?.firstName} ${resourceManager?.lastName}`;
          return { id: id, name: name };
        })}
        required
        disabled={!editEnabled}

      />
            <SingleSelect
        name="payRateType"
        label="pPayRate Type"
        id="payRateType"
        onChange={(e) => handleBasicInfoChange(e)}
        value={basicInfo?.payRateType}
        options={[
          { id: 1, value: "crop to crop", name: "crop to crop" },
          { id: 2, value: "w2", name: "w2" },
  
        ]}
        disabled={!editEnabled}
      />
<InputCurrencyRate
              label="Pay Rate"
              id="currency"
              nameCurrency="currency"
              nameRate="payRate"
              handleChange={currencyChange}
              valueCurrency={basicInfo.currency}
              valueRate={Number(basicInfo.payRate).toFixed(2)}
              placeholder="Enter the amount"
              required
              disabled={!editEnabled}
            ></InputCurrencyRate>
                <SingleSelect
              label="Pay Rate Period"
              name="period"
              className="short"
              value={basicInfo.period}
              onChange={(e) => handleBasicInfoChange(e)}
              required
              options={ctcType.map((ctc) => ({
                id: ctc,
                value: ctc,
                name: ctc,
              }))}
              disabled={!editEnabled}
            />
 <InputCurrencyRate
              label="Net Pay Rate"
              id="currency"
              nameCurrency="currency"
              nameRate="netPayRate"
              handleChange={currencyChange}
              valueCurrency={basicInfo.currency}
              valueRate={Number(basicInfo.netPayRate).toFixed(2)}
              placeholder="Enter the amount"
              required
              disabled={!editEnabled}
            ></InputCurrencyRate>

                <SingleSelect
              label="Net Pay Rate Period"
              name="period"
              className="short"
              value={basicInfo.period}
              onChange={(e) => handleBasicInfoChange(e)}
              required
              options={ctcType.map((ctc) => ({
                id: ctc,
                value: ctc,
                name: ctc,
              }))}
              disabled={!editEnabled}
            />
      
      <h3 className="disabled-form-section-header">Worker Details</h3>
      
       <div style={{ fontSize: "12px", display: "flex", flexDirection: "column",paddingBottom:"10px" }}>
        <label style={{ fontWeight: "200", fontSize: "12px", textTransform: "uppercase", color: "rgba(0, 0, 0, 0.8)" }} >Is SubContractor?</label>
        <div style={{ fontSize: "12px", paddingLeft: "50px" }}>
          <Checkbox
            name="isSubContractor"
            label="Is SubContractor"
            id="isSubContractor"
            value={basicInfo.isSubContractor}
            onChange={(event) => {
              handleCheckChangeSF(event);
            }}
            disabled={!editEnabled}

          />
        </div>
      </div>
      {(basicInfo.isSubContractor === true ||
        basicInfo.isSubContractor === "true") && (
          <div style={{ fontSize: "12px" }}>
                  <Input
        type="text"
        label="SubContractor Name"
        name="subContractorCompanyName"
        value={basicInfo?.subContractorCompanyName}
        onChange={(e) => handleBasicInfoChange(e, "validateName")}
        maxLength="20"
        errMssg={inputErr["subContractorCompanyName"]}
        disabled={!editEnabled}
      />
</div>
        )}


      <MultiSelect
        label="Primary Skills"
        options={primeSkillsDict.map((o) => ({
          id: o.id,
          value: o.value,
          label: o.value,
          selected: basicInfo?.primarySoftwareSkill?.includes(o.value),
        }))}
        handleChange={(e) =>
          multiSelectChange(e, "primeSkills", "basicInfo")
        }
        isMulti
        creatable
        deletable={auth.hasAdminRole() || auth.hasBDManagerRole()}
        required
        disabled={!editEnabled}
      />

      <MultiSelect
        label="Secondary Skills"
        options={secSkillsDict.map((o) => ({
          id: o.id,
          value: o.value,
          label: o.value,
          selected: basicInfo?.secondarySkill?.includes(o.value),
        }))}
        handleChange={(e) => multiSelectChange(e, "secSkills", "basicInfo")}
        creatable
        isMulti
        deletable={auth.hasAdminRole() || auth.hasBDManagerRole()}
        disabled={!editEnabled}
      />
      


    </Fragment>
  );
};

export default BasicInfo;