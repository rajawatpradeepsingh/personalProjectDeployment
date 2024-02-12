import React, { useState, useCallback, useEffect, useRef } from "react";
import moment from "moment";
import ms from "ms";
import axios from "axios";
import { config } from "../../../config.js";
import AuthService from "../../../utils/AuthService.js";
import { runValidation } from "../../../utils/validation.js";
import * as addr from "../../../utils/serviceAddress.js";
import Form from "../../common/form/form.component.jsx";
import Input from "../../common/input/inputs.component.jsx";
import SingleSelect from "../../common/select/selects.component.jsx";
import LargeModal from "../../modal/large-modal/large-modal.component.jsx";
import { message } from "antd";
import { postDict ,delDict,getDict} from "../../../API/dictionaries/dictionary-apis.js";
import MultiSelect from "../../common/select/multiSelect/multiSelect.component.jsx";
import auth from "../../../utils/AuthService.js";
import IdleTimeOutHandler from "../../ui/Dashboard/IdleTimeOutHandler.js";

const AddVisatracking = (props) => {
  const initialState = {
    worker: "",
    workerId: "",
    visaStatus: "",
    visaType: "",
    visaStartDate: "",
    visaExpiryDate: "",
    visaAppliedDate: "",
    visaCountryCode: "",
    visaCountry: "",
    countryOfBirth: "",
    visaCountryOfResidence: "",
    entryDateOfF1: "",
    workerOptions: [],
    workAuthStatusDict: [],
    passportNumber: "",
    visaNumber: "",

    isDeleted: false,
  };

  const [formState, setFormState] = useState(initialState);
  const [workers, setWorkers] = useState([]);
  const [isDisable, setIsDisable] = useState(false);
  const [countriesList, setCountriesList] = useState([]);
  const [showHide, setShowHide] = useState("");
  const [headers] = useState(AuthService.getHeaders());
  const [inputErr, setInputErr] = useState({});
  const [minDate, setMinDate] = useState(null);
  const { worker } = formState;
  const [workAuthStatusDict, setWorkAuthStatusDict] = useState([]);
  const[isActive,setIsActive]=useState(true)
  const[isLogout,setLogout]=useState(false)
  const docRef = useRef(null);
  const [resetKey, setResetKey] = useState(Date.now()); 
    
  const getDicts = useCallback(async () => {
    const response = {};
    response.workAuth = await getDict("workAuthStatus", headers);
    

    return response;
  }, [headers]);

  
  useEffect(() => {
    let isCancelled = false;
    const fetchData = async () => {
      try {
        const dictionaries = await getDicts();
        if (Object.keys(dictionaries).length) {
          if (!isCancelled) {
            setWorkAuthStatusDict(dictionaries.workAuth);
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
    if (resource === "workAuthStatus") resName = "visaType";

    const change = { target: { name: resName, value: selected || "" } };
    if (parent === "basicInfo") {
      handleChange(change);
    }
        options
      .filter((o) => !o.id && !o.isDeleted)
      .forEach((o) => {
        postDict(resource, o.value, headers)
          .then((res) => {
            
            if (resource === "workAuthStatus")
            setWorkAuthStatusDict([...workAuthStatusDict, res]);
          })
          .catch((err) => console.log(err));
      });
    options
      .filter((o) => o.isDeleted)
      .forEach((o) => {
        delDict(o.id, headers).catch((err) => console.log(err));
      });
    const delList = options.filter((o) => !o.isDeleted);
    if (resource === "workAuthStatus") setWorkAuthStatusDict(delList);

  };



  useEffect(() => {
    setCountriesList(addr.getCountries());
  }, []);

  useEffect(() => {
    const day = ms("1d");
    const min_date = new Date(+new Date(formState.visaStartDate) + day);
    setMinDate(moment(min_date).format("YYYY-MM-DD"));
  }, [formState.visaStartDate]);

  const handleChange = (e, validProc = null) => {
    e.preventDefault?.();
    const limit = e.target.max ? +e.target.max : null;
    const isValid = runValidation(validProc, e.target.value, limit);
    const isDeleted = e.target.value === "";
  setFormState({ ...formState, [e.target.name]: e.target.value });
    if(e.target.name === "visaType"){
            handleShowHide(e);
  if (e.target.value === "Citizen"|| e.target.value === "Not Applicable") {
        setIsDisable(true);
handleShowHide(e);
      if (e.target.value === "Citizen"|| e.target.value === "Not Applicable") {
        setTimeout(function () {
          document.getElementById("visaStatus").value = "NOT APPLICABLE";
        }, 300);
      }
    }} else {
        setIsDisable(false);
      }
    if (e.target.value === "opt" || e.target.value === "cpt" || e.target.value === "stem opt") {
      setIsDisable(true);
      handleShowHide(e);
      if (e.target.value === "opt" || e.target.value === "cpt" || e.target.value === "stem opt") {
        setTimeout(function () {
          document.getElementById("entryDateOfF1");
        }, 300);
      }
    } else {
      setIsDisable(false);
    }
      if (!isValid) {
      setInputErr({
        ...inputErr,
        [e.target.name]: `Invalid format or characters`,
      });
    } else if (isValid || isDeleted) {
      let temp = { ...inputErr };
      delete temp[e.target.name];
      setInputErr({ inputErr: temp });
    }
  };

    const countryChange = (e) => {
    const index = e.target.selectedOptions[0].index;
    const selected = index
      ? countriesList[e.target.selectedOptions[0].index - 1]
      : {};

    setFormState({
      ...formState,
      [e.target.name]: selected.name,
      countryCode: selected.code,
    });
  };

  const loadWorkers = useCallback(() => {
    axios
      .get(`${config.serverURL}/worker?dropdownFilter=true`, {
        headers,
      })
      .then((response) => {
        if (response.data) {
          setWorkers(response.data);
        }
      })
      .catch((err) => console.log(err));
  }, [headers]);

  useEffect(() => {
    loadWorkers();
  }, [loadWorkers]);

  const handleShowHide = (e) => {
    const visaStatus = e.target.value;
    const visaType = e.target.value;
    const entryDateOfF1 = e.target.value;
    setShowHide(visaStatus);
    setShowHide(visaType);
    setShowHide(entryDateOfF1);    
  };

  const submitForm = (e) => {
    e.preventDefault();
    var vStatus = document.getElementById("visaStatus").value;
  
    const isNotApplicable = formState.visaType === "Citizen" || formState.visaType === "Not Applicable";
  
    const otherFields = isNotApplicable
      ? {
          visaStartDate: "",
          visaExpiryDate: "",
          visaAppliedDate: "",
          usEntryDate: "",
        }
      : {
          visaStartDate: formState.visaStartDate,
          visaExpiryDate: formState.visaExpiryDate,
          visaAppliedDate: formState.visaAppliedDate,
          usEntryDate: formState.usEntryDate,
        };
  
    const visaStatus = isNotApplicable ? "NOT APPLICABLE" : formState.visaStatus === "" ? vStatus : formState.visaStatus;
  
    const visatracking = {
      worker: formState.worker === "" ? null : { id: formState.worker },
      visaCountry: formState.visaCountry,
      visaCountryOfResidence: formState.visaCountryOfResidence,
      visaType: formState.visaType,
      visaStatus: visaStatus,
      ...otherFields,
      countryOfBirth: formState.countryOfBirth,
      passportNumber: formState.passportNumber,
      visaNumber: formState.visaNumber,
      isDeleted: false,
    };
  
    axios
      .post(`${config.serverURL}/visatracking`, visatracking, { headers })
      .then((response) => {
        if (response.status === 201) {
          setFormState(initialState);
          setFormState((prevState) => ({
            ...prevState,
            visaType: "",
          }));
          message.success("Visa record created successfully");
          props.setOpen(false);
          props.refresh();
          if (response.data != null && formState.file) {
            let id = response.data.id;
            let file = formState.file;
            let formData = new FormData();
  
            formData.append("file", file);
            axios
              .post(`${config.serverURL}/visatracking/${id}/resume`, formData, {
                headers,
              })
              .then((uploadResponse) => {
                console.log(uploadResponse.status);
              })
              .catch((error) => {
                console.log(error);
                if (error.response && error.response.status === 401) {
                  AuthService.logout();
                }
              });
          }
        }
        resetForm();
      })
      .catch((error) => {
        console.error(error);
      });
  };  
        
  const handleWorkerChange = (event) => {
    event.preventDefault();
    setFormState({ ...formState, worker: event.target.value });
  };  

  const resetForm = () => {
    setFormState(initialState);
    setResetKey(Date.now()); 
    props.setOpen(false);
  };
  
  const handleUploadFile = (e) => {
    const maxAllowedSize = 1 * 1024 * 1024;
    if (e.target.files && e.target.files.length > 0) {
      if (e.target.files[0].size > maxAllowedSize) {
        setFormState((prevState) => ({
          ...prevState,
          inputErr: {
            ...prevState.inputErr,
            file: "File is too big. Please select a file with size < 1MB",
          },
          file: null,
        }));
        docRef.current.value = null;
      } else {
        setFormState((prevState) => ({
          ...prevState,
          file: e.target.files[0],
          inputErr: { ...prevState.inputErr, file: undefined },
        }));
      }
    } else {
      setFormState((prevState) => ({ ...prevState, file: null }));
    }
  };

  return (
    <LargeModal
      header={{ text: "Add New Visa"}}
      open={props.open}
      close={() => {
        resetForm();
        props.setOpen(false);
      }}
      key={resetForm ? "reset" : "no-reset"}
    >
             <IdleTimeOutHandler 
    onActive={()=>{setIsActive(true)}} 
    onIdle={()=>{setIsActive(false)}}
    onLogout={()=>{setLogout(true)}}
    />
      <Form formEnabled={true} onSubmit={submitForm} cancel={resetForm}  key={resetKey} >
        <SingleSelect
          label="Worker"
          name="workerId"
          data-testid="worker-options"
          onChange={handleWorkerChange}
          value={worker}
          options={workers.map((worker) => {
            let id = worker.id;
            return {
              id: id,
              name: `${worker.firstName} ${worker.lastName}`,
            };
          })}
          required
        />
        <SingleSelect
          label="Country Of Birth"
          name="countryOfBirth"
          value={formState.countryOfBirth}
          onChange={countryChange}
          placeholder="Country of Birth.."
          options={countriesList}
          required
        />
        <SingleSelect
          label="Country Of Residence"
          name="visaCountryOfResidence"
          id="visaCountryOfResidence"
          onChange={countryChange}
          value={formState.visaCountryOfResidence}
          placeholder="Country Of Residence..."
          options={countriesList}
          required
        />
        <SingleSelect
          label="Country Of Citizenship"
          name="visaCountry"
          value={formState.visaCountry}
          onChange={countryChange}
          placeholder="Country..."
          options={countriesList}
          required
        />
      <MultiSelect
        label="Type"
            options={workAuthStatusDict.map((o) => ({
              id: o.id,
              value: o.value,
              label: o.value,
              selected: formState.visaType === o.value,
            }))}
            handleChange={(e) =>
              multiSelectChange(e, "workAuthStatus", "basicInfo")
            }
            creatable
            placeholder="please select"
            required
            deletable={auth.hasAdminRole() || auth.hasBDManagerRole()}
            
          />
      {(showHide === "opt" || showHide === "cpt" || showHide === "stem opt" ) && (
            <Input
            name="entryDateOfF1"
            label=" EntryDateOfF1"
            type="date"
            id="entryDateOfF1"
            max="2999-12-31"
            onChange={(e) => handleChange(e)}
            value={formState.entryDateOfF1}
            errMssg={inputErr["entryDateOfF1"]}
          />
          )} 
          {(showHide === "opt" || showHide === "cpt" || showHide === "stem opt" ) && (
          <Input
          name="usEntryDate"
          label=" US ENTRY DATE"
          type="date"
          id="usEntryDate"
          max="2999-12-31"
          onChange={(e) => handleChange(e)}
          value={formState.usEntryDate}
          errMssg={inputErr["usEntryDate"]}
        />
        )} 
          <SingleSelect
            name="visaStatus"
            label=" Status"
            id="visaStatus"
            onChange={(e) => {
              handleChange(e);
              handleShowHide(e);
            }}
            value={formState.visaStatus}
            options={[
              { id: 1, value: "ACTIVE", name: "Active", disabled: isDisable },
              {
                id: 2,
                value: "APPLIED",
                name: "Applied",
                disabled: isDisable,
              },
              {
                id: 3,
                value: "EXPIRED",
                name: "Expired",
                disabled: isDisable,
              },
              {
                id: 4,
                value: "NOT APPLICABLE",
                name: "Not Applicable",
                disabled: !isDisable,
              },
            ]}
          />
        {(showHide === "ACTIVE" || showHide === "EXPIRED") && (
          <div className="visatrackingcol" id="visaStartDateDiv">
            <Input
              name="visaStartDate"
              label=" Start Date"
              type="date"
              id="visaStartDate"
              max="2999-12-31"
              onChange={(e) => handleChange(e)}
              value={formState.visaStartDate}
              errMssg={inputErr["visaStartDate"]}
            />
          </div>
        )}
        {(showHide === "ACTIVE" || showHide === "EXPIRED") && (
          <div className="visatrackingcol">
            <Input
              name="visaExpiryDate"
              label=" Expiry Date"
              type="date"
              min={minDate}
              id="visaExpiryDate"
              max="2999-12-31"
              onChange={(e) => handleChange(e)}
              value={formState.visaExpiryDate}
              errMssg={inputErr["visaExpiryDate"]}
            />
          </div>
        )}
        {showHide === "APPLIED" && (
          <div className="visatrackingcol">
            <Input
              name="visaAppliedDate"
              label=" Applied Date"
              type="date"
              id="visaAppliedDate"
              onChange={(e) => handleChange(e)}
              value={formState.visaAppliedDate}
            />
          </div>
        )}
        <Input
        name="passportNumber"
        label="Passport NUmber"
        type="text"
        id="passportNumber"
        onChange={(e) => handleChange(e,"validateHasAlpha")}
        value={formState.passportNumber}
        required
        errMssg={inputErr["passportNumber"]}

        />
                <Input
        name="visaNumber"
        label="Visa NUmber"
        type="text"
        id="visaNumber"
        onChange={(e) => handleChange(e)}
        value={formState.visaNumber}
        required
        />
        
        <div style={{ fontSize: "12px",display:"flex"}}>
                       <Input
                    type="file"
                    label="Attach Document"
                    data-testid="file"
                    name="file"
                    ref={docRef}
                    onChange={handleUploadFile}
                                        errMssg={inputErr["file"]}
                  />
                      </div>
      </Form>
    </LargeModal>
  );
};

export default AddVisatracking;
