import { Fragment, useState, useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Input from "../../../common/input/inputs.component";
import SingleSelect from "../../../common/select/selects.component";
import { runValidation } from "../../../../utils/validation";
import { setJobDetails, setInputErr, setRequiredErr } from "../../../../Redux/jobSlice";
import { statuses, ctcType } from "../../../../utils/defaultData";
import auth from "../../../../utils/AuthService";
import { config } from "../../../../config";
import axios from "axios";
import { InputCurrencyRate } from "../../../common/input/input-currency-rate/input-currency-rate.component";
import moment from "moment";
const headers = auth.getHeaders();

const BasicInfoJob = () => {
  const dispatch = useDispatch();
  const [editDisabled] = useState(true);
  const { editEnabled } = useSelector((state) => state.job);
  const { jobDetails, inputErr, requiredErr } = useSelector((state) => state.job);
  const [clientOptions, setClientOptions] = useState([]);

  const dispatchJobDetails = (object) => dispatch(setJobDetails(object));
  const dispatchErr = (object) => dispatch(setInputErr(object));
  const dispatchReqErr = (object) => dispatch(setRequiredErr(object));

  const getClients = useCallback(async () => {
    try {
      return await axios.get(
        config.serverURL + "/clients?dropdownFilter=true",
        { headers }
      );
    } catch (error) {
      console.log(error);
    }
  }, []);

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
          auth.logout();
      }
    };
    fetchData();
    //cleanup function:
    return () => (isCancelled = true);
  }, [getClients]);

  const jobChange = (e, validProc = null) => {
    const isDeleted = e.target.value === "";
    const isValid = runValidation(validProc, e.target.value, e.target.max);
    if (isDeleted || isValid)
      dispatchJobDetails({ ...jobDetails, [e.target.name]: e.target.value });
  };

  const currencyChange = (e, validProc = "validateNum") => {
    jobChange(e, e.target.value === "clientBillRate" ? validProc : "");
  };

  const handleChangeClient = (e) => {
    const client = clientOptions.filter(
      (item) => +item.id === +e.target.value
    )[0];

    dispatchJobDetails({
      ...jobDetails,
      client: { clientName: client.clientName, id: client.id, address: client.address },
    });
  };

  const handleBasicInfoChange = (event, validProc = null) => {
    const isValid = runValidation(validProc, event.target.value);
    let temp;
    if (event.target.value !== "") {
      temp = { ...requiredErr };
      delete temp[event.target.name];
      dispatchReqErr(temp);
    }
    dispatchJobDetails({ ...jobDetails, [event.target.name]: event.target.value });

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

  return !editEnabled ? (
    <>
      <div className="disabled-form-section small">
        <h3 className="disabled-form-section-header"> Basic Information</h3>
        <div className="disabled-form-section-content">
          <span className="disabled-form-text">
            <span className="disabled-form-bold-text">STATUS:</span>
            {jobDetails?.status}
          </span>
          <span className="disabled-form-text">
            <span className="disabled-form-bold-text">JOB TITLE:</span>
            {jobDetails?.jobTitle}
          </span>
          <span className="disabled-form-text">
            <span className="disabled-form-bold-text">NO.OF JOBS:</span>
            {jobDetails?.noOfJobopenings}
          </span>
          <span className="disabled-form-text">
            <span className="disabled-form-bold-text">HIRING MANAGER:</span>
            {jobDetails?.hiringManager}
          </span>
         
        </div>
      </div>

      <div className="disabled-form-section small">
        <h3 className="disabled-form-section-header">Client Deatils</h3>
        <div className="disabled-form-section-content">
          <span className="disabled-form-text">
            <span className="disabled-form-bold-text">CLIENT:</span>
            {jobDetails?.client?.clientName}
          </span>
          <span className="disabled-form-text">
            <span className="disabled-form-bold-text">PERIOD:</span>
            {jobDetails?.period}
          </span>
          <span className="disabled-form-text">
            <span className="disabled-form-bold-text">CLIENT BILL RATE:</span>
            {jobDetails?.clientBillRate}
          </span>

          
          
        </div>
      </div>
      
      <div className="disabled-form-section small" style={{position:"relative",paddingTop:"250px",right:"170px"}}>
        <h3 className="disabled-form-section-header"></h3>
        <div className="disabled-form-section-content">
          <span className="UpdatedBy">
            <span className="disabled-form-bold-text">CreatedDate:</span>
             {moment(jobDetails?.createdOn).format("MM.DD.YYYY")}
          </span>
          <span className="UpdatedBy">
          <span className="disabled-form-bold-text">CreatedBy:</span>
             {jobDetails?.createdBy}
          </span>
          <span className="UpdatedBy">
          <span className="disabled-form-bold-text">UpdatedDate:</span>
             {moment(jobDetails?.updatedOn).format("MM.DD.YYYY")}
          </span>
          <span className="UpdatedBy">
          <span className="disabled-form-bold-text">UpdatedBy:</span>
             {jobDetails?.updatedBy}
          </span>
        </div>
      </div>
    </>
  ) : (
    <Fragment>
      <h3 className="disabled-form-section-header" >Basic Information</h3>
      <SingleSelect
        label="Status"
        name="status"
        value={jobDetails?.status || ""}
        onChange={handleBasicInfoChange}
        options={statuses.map((s) => ({ id: s, value: s, name: s }))}
        disabled={!editDisabled}
      />
      <Input
        label="Job Title"
        type="text"
        name="jobTitle"
        value={jobDetails?.jobTitle}
        onChange={(e) => handleBasicInfoChange(e, "validateName")}
        pattern="[^0-9@#%^$&*?]+"
        maxLength="50"
        disabled={!editDisabled}
        errMssg={inputErr["jobTitle"]}
      />
      <Input
        type="text"
        label="No. of Openings"
        name="noOfJobopenings"
        value={jobDetails?.noOfJobopenings}
        onChange={(e) => {
          handleBasicInfoChange(e, "validateInt");
        }}
        maxLength="4"
        disabled={!editDisabled}
        errMssg={inputErr["noOfJobopenings"]}
        className="small"
      />
      <Input
        label="Hiring Manager"
        name="hiringManager"
        type="text"
        value={jobDetails?.hiringManager}
        onChange={(e) => handleBasicInfoChange(e, "validateName")}
        maxLength="20"
        disabled={!editDisabled}
        errMssg={inputErr["hiringManager"]}
      />
      <h3 className="disabled-form-section-header" >Client Details</h3>
      <SingleSelect
        label="Client"
        name="clientId"
        onChange={handleChangeClient}
        value={jobDetails?.client?.id}
        options={clientOptions?.map((client) => {
          let id = client?.id;
          let name = `${client.clientName} (${client.address?.city || ""})`;
          return { id: id, name: name };
        })}
        disabled={!editDisabled}
      />
      <SingleSelect
        label="Period"
        name="period"
        className="short"
        value={jobDetails?.period || "Per hour"}
        onChange={handleBasicInfoChange}
        options={ctcType.map((ctc) => ({ id: ctc, value: ctc, name: ctc }))}
        disabled={!editDisabled}
      />
      <InputCurrencyRate
        label="Client Bill Rate"
        guide={`${jobDetails?.period || "Per hour"}`}
        id="currency"
        nameCurrency="currency"
        nameRate="clientBillRate"
        handleChange={currencyChange}
        valueCurrency={jobDetails?.currency}
        valueRate={jobDetails?.clientBillRate || ""}
        placeholder="Enter the amount"
        disabled={!editDisabled}
      ></InputCurrencyRate>
    </Fragment>
  );
};

export default BasicInfoJob;