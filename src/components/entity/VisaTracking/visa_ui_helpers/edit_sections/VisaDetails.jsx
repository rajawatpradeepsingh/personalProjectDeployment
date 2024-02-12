import { useState, useEffect, useMemo, useCallback } from "react";
import auth from "../../../../../utils/AuthService";
import { useSelector, useDispatch } from "react-redux";
import { getCountries } from "../../../../../utils/serviceAddress";
import { setVisaDeatils } from "../../../../../Redux/visatrackingSlice";
import { getWorkerForDropdown } from "../../../../../API/workers/worker-apis";
import SingleSelect from "../../../../common/select/selects.component";
import Input from "../../../../common/input/inputs.component";
import moment from "moment";
import ms from "ms";
import { delDict, postDict ,getDict} from "../../../../../API/dictionaries/dictionary-apis";
import MultiSelect from "../../../../common/select/multiSelect/multiSelect.component";
import Button from "../../../../common/button/button.component";
import VisaForm from "../../../../common/file-download/visaForm";
import { runValidation } from "../../../../../utils/validation";


const VisaDetails = (props) => {
  const dispatch = useDispatch();
  const dispatchVisa = (object) => dispatch(setVisaDeatils(object));
  const headers = useMemo(() => auth.getHeaders(), []);
  const { editEnabled } = useSelector((state) => state.visatracking);
  const { visaDetails } = useSelector((state) => state.visatracking);
  const countriesList = useMemo(() => getCountries(), []);
  const [workerOptions, setWorkerOptions] = useState([]);
  const [minDate, setMinDate] = useState(null);
  const [hideDetails, setHideDetails] = useState(false);
  const [workAuthStatusDict, setWorkAuthStatusDict] = useState([]);
  const[inputErr, setInputErr] = useState([]);
  const { resume, enableReplaceResume, replaceResumeEnabled, uploadNewResume } =
  props;
  const getDicts = useCallback(async () => {
    const response = {};
    response.workAuth = await getDict("workAuthStatus", headers);
   

    return response;
  }, [headers]);

  useEffect(() => {
    if (visaDetails?.visaStatus === "NOT APPLICABLE" && !editEnabled) setHideDetails(true);
  }, [visaDetails, editEnabled]);

  const getWorkers = useCallback(async () => {
    const res = await getWorkerForDropdown(headers);
    if (res.tableData.length) {
      setWorkerOptions(res.tableData.map(worker => ({ name: `${worker.firstName} ${worker.lastName}`, id: worker.id })));
    }
  }, [headers]);

  useEffect(() => {
    getWorkers();
  }, [getWorkers]);

  const handleChangeWorker = (e) => {
    dispatchVisa({
      ...visaDetails,
      worker: { id: +e.target.value },
    });
  };

  const handleChange = (e,validProc=null) => {
    const { name, value } = e.target;
    const isValid = runValidation(validProc, e.target.value);

    if (value === "Citizen" || value === "Not Applicable") {
      dispatchVisa({
        ...visaDetails,
        visaStatus: "NOT APPLICABLE",
        visaAppliedDate: "",
        visaStartDate: "",
        visaExpiryDate: "",
        [name]: value,
      });
      setHideDetails(true);
    } else {
      const newVisaStatus = visaDetails.visaStatus === "NOT APPLICABLE" ? "" : visaDetails.visaStatus;
      dispatchVisa({ ...visaDetails,       visaStatus: newVisaStatus,
        [name]: value });
      setHideDetails(false);
    }
    if (!isValid) {
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
  
  const countryChange = (e) => {
    const index = e.target.selectedOptions[0].index;
    const selected = index
      ? countriesList[e.target.selectedOptions[0].index - 1]
      : {};

    dispatchVisa({
      ...visaDetails,
      [e.target.name]: selected.name,

    });
  };

  useEffect(() => {
    const day = ms("1d");
    const min_date = new Date(
      +new Date(visaDetails?.visaStartDate) + day
    );
    setMinDate(moment(min_date).format("YYYY-MM-DD"));
  }, [visaDetails?.visaStartDate]);




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
    if (parent === "visaDetails"){
      handleChange(change);
      setHideDetails(false);
    }  
    


    // call add AI for new /* TODO: decompose and make as new function */
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

    // call delete API for marked as deleted
    options
      .filter((o) => o.isDeleted)
      .forEach((o) => {
        delDict(o.id, headers).catch((err) => console.log(err));
      });
    const delList = options.filter((o) => !o.isDeleted);
    if (resource === "workAuthStatus") setWorkAuthStatusDict(delList);

  };

  return (
    <>
      <h3 className="disabled-form-section-header">
        Current Status of Visa and Details
      </h3>
     
      <MultiSelect
        label="Type"
        disabled={!editEnabled}
        options={workAuthStatusDict.map((o) => ({
          id: o.id,
          value: o.value,
          label: o.value,
          selected: visaDetails?.visaType === o.value,
        }))}
        handleChange={(e) => multiSelectChange(e, "workAuthStatus","visaDetails")}
        creatable
        required
        placeholder="please select"
        deletable={auth.hasAdminRole() || auth.hasBDManagerRole()}
      />
       {!hideDetails && (visaDetails?.visaType === "opt" || visaDetails?.visaType === "cpt" || visaDetails?.visaType === "stem opt") && (
       <Input
            name="usEntryDate"
            label=" US ENTRY DATE"
            type="date"
            id="usEntryDate"
            max="2999-12-31"
            min={minDate}
              onChange={(e) => handleChange(e)}
              value={visaDetails?.usEntryDate || ""}
              disabled={!editEnabled}
          />
          )}
          {!hideDetails && (visaDetails?.visaType === "opt" || visaDetails?.visaType === "cpt" || visaDetails?.visaType === "stem opt") && (
              <Input
              name="entryDateOfF1"
              label=" EntryDateOfF1"
              type="date"
              id="entryDateOfF1"
              max="2999-12-31"
              min={minDate}
              onChange={(e) => handleChange(e)}
              value={visaDetails?.entryDateOfF1 || ""}
              disabled={!editEnabled}
  />
)}
        <SingleSelect
          name="visaStatus"
          label=" Status"
          id="visaStatus"
          onChange={handleChange}
          value={visaDetails?.visaStatus || ""}
          options={[
            {
              id: 1,
              value: "APPLIED",
              name: "Applied",
            },
            {
              id: 2,
              value: "ACTIVE",
              name: "Active",
            },
            {
              id: 3,
              value: "REJECTED",
              name: "Rejected",
            },
            {
              id: 3,
              value: "EXPIRED",
              name: "Expired",
            },
            {
              id: 4,
              value: "NOT APPLICABLE",
              name: "Not Applicable",
            },
          ]}
          disabled={!editEnabled}
        />
      {!hideDetails && (visaDetails?.visaStatus === "APPLIED") && (

        <Input
          name="visaAppliedDate"
          label="Applied On"
          type="date"
          id="visaAppliedDate"
          onChange={(e) => handleChange(e)}
          value={visaDetails?.visaAppliedDate || ""}
          disabled={!editEnabled || visaDetails.visaStatus !== "APPLIED"}
        />
      )}
      {!hideDetails &&
        (visaDetails?.visaStatus === "ACTIVE") && (
          <>
            <Input
              name="visaStartDate"
              label=" Start Date"
              type="date"
              id="visaStartDate"
              max="2999-12-31"
              onChange={(e) => handleChange(e)}
              value={visaDetails?.visaStartDate || ""}
              disabled={!editEnabled}
            />
            <Input
              name="visaExpiryDate"
              label=" Expiry Date"
              type="date"
              id="visaExpiryDate"
              max="2999-12-31"
              min={minDate}
              onChange={(e) => handleChange(e)}
              value={visaDetails?.visaExpiryDate || ""}
              disabled={!editEnabled}
            />
          </>
        )}

        {!hideDetails &&
        (visaDetails?.visaStatus === "EXPIRED") && (
          <>
            <Input
              name="visaExpiryDate"
              label=" Expiry Date"
              type="date"
              id="visaExpiryDate"
              max="2999-12-31"
              min={minDate}
              onChange={(e) => handleChange(e)}
              value={visaDetails?.visaExpiryDate || ""}
              disabled={!editEnabled}
            />
          </>
        )}
      <SingleSelect
        label="Worker"
        name="workerId"
        onChange={handleChangeWorker}
        value={visaDetails?.worker?.id || ""}
        options={workerOptions}
        disabled={!editEnabled}
        required
      />
      <SingleSelect
        label="Country Of Birth"
        name="countryOfBirth"
        value={visaDetails?.countryOfBirth || ""}
        onChange={countryChange}
        placeholder="Country Of Birth..."
        options={countriesList}
        required
        disabled={!editEnabled}
      />
      <SingleSelect
        label="Country Of Residence"
        name="visaCountryOfResidence"
        id="visaCountryOfResidence"
        value={visaDetails?.visaCountryOfResidence || ""}
        onChange={countryChange}
        options={countriesList}
        required
        disabled={!editEnabled}
      />
      <SingleSelect
        label="Country Of Citizenship"
        name="visaCountry"
        value={visaDetails?.visaCountry || ""}
        onChange={countryChange}
        placeholder="Country..."
        options={countriesList}
        required
        disabled={!editEnabled}
      />
               <Input
              name="passportNumber"
              label=" Passport Number"
              id="passportNumber"
              onChange={(e) => handleChange(e,"validateHasAlpha")}
              value={visaDetails?.passportNumber}
              disabled={!editEnabled}
              errMssg={inputErr["passportNumber"]}

            />
              <Input
              name="visaNumber"
              label=" Visa Number"
              id="visaNumber"
              onChange={(e) => handleChange(e)}
              value={visaDetails?.visaNumber}
              disabled={!editEnabled}
            />
            {/* {!hideDetails && editEnabled && ( */}
  <>
              {editEnabled ? (
          <div>
            <Input
              label="Resume"
              type="file"
              name="resume"
              onChange={uploadNewResume}
              disabled={!editEnabled}
            />
            {editEnabled && resume ? (
              <Button
                type="button"
                className="x-small"
                handleClick={enableReplaceResume}
              >
                {replaceResumeEnabled ? "Cancel" : "Replace"}
              </Button>
            ) : editEnabled && !resume ? (
              <Button
                type="button"
                className="x-small"
                handleClick={enableReplaceResume}
              >
              </Button>
            ) : null}
          </div>
        ) : (
          <div>
 <label style={{ fontWeight: "200", fontSize: "12px", textTransform: "uppercase", color: "rgba(0, 0, 0, 0.8)" }} >Document</label>
<div style={{display:"flex",paddingTop:"4px",fontSize:"13px"}}>
<VisaForm
            id={visaDetails?.id}
            resume={visaDetails?.resume?.resumeName}
            displayType="link"
            required
            disabled={!editEnabled}
            noLabel={true}
            className="small"
          />
          {visaDetails?.resume?.resumeName}
              </div>
            </div>
    
        )}

        </>
      {/* )} */}
    </>
  );
};
export default VisaDetails;
