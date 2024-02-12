import { useSelector,useDispatch } from "react-redux";
import { config } from "../../../../config";
import AuthService from "../../../../utils/AuthService";
import { Fragment, useState, useEffect} from "react";
import SingleSelect from "../../../common/select/selects.component";
import axios from "axios";
import { setChangesMade, setInputErr, setRequiredErr ,setBasicInfo} from "../../../../Redux/workOrderSlice";
import { runValidation } from "../../../../utils/validation";
import Input from "../../../common/input/inputs.component";
import moment from "moment";

const BasicInfoWorkOrder = () => {
    const { editEnabled } = useSelector((state) => state.workOrder);
    const { basicInfo } = useSelector((state) => state.workOrder);
    const dispatchBasicInfo= (object) => dispatch(setBasicInfo(object));
    const dispatch = useDispatch();
    const [workerOptions, setWorkerOptions] = useState([]);
    const { inputErr, requiredErr } = useSelector((state) => state.workOrder);
    const dispatchErr = (object) => dispatch(setInputErr(object));
    const dispatchReqErr = (object) => dispatch(setRequiredErr(object));
    const dispatchChange = (object) => dispatch(setChangesMade(object));

    const [minDate, setMinDate] = useState(null);

    
  const getWorkers = () => {
    if (AuthService.hasAdminRole() || AuthService.hasRecruiterRole()) {
      let headers = JSON.parse(sessionStorage.getItem("headers"));
      axios
        .get(config.serverURL + "/worker?dropdownFilter=true", { headers })
        .then((res) => {
          const workop = res.data;
          if (res.data) {
            setWorkerOptions(workop);
          }
        })
        .catch((error) => {
          console.log(error);
          if (error.response && error.response.status === 401) {
            AuthService.logout();
          }
        });
    }
  };

  useEffect(() => {
    getWorkers();
  }, []);

  const handleChangeWorker = (e) => {
    let worker = workerOptions.filter(
      (item) => +item.id === +e.target.value
    )[0];

    dispatchBasicInfo({
      ...basicInfo,
      worker: { id: worker.id },
    });
  };


  const handleChange = (event, validProc = null) => {
    dispatchChange(true);
    const isValid = runValidation(validProc, event.target.value);
    let temp;
    if (event.target.value !== "") {
      temp = { ...requiredErr };
      delete temp[event.target.name];
      dispatchReqErr(temp);
    }
    dispatchBasicInfo({ ...basicInfo, [event.target.name]: event.target.value });

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
        <h3 className="disabled-form-section-header">Basic Information</h3>
        <div className="disabled-form-section-content">

        <span className="disabled-form-text">
            <span className="disabled-form-bold-text">Active Date:</span>
            {moment(basicInfo?.activeDate).format("MM/DD/YYYY")}
          </span>

        <span className="disabled-form-text">
            <span className="disabled-form-bold-text">Project Name:</span>
            {basicInfo?.project?.projectName}
          </span>
          <span className="disabled-form-text">
            <span className="disabled-form-bold-text">worker:</span>
            {`${basicInfo?.worker?.firstName} ${basicInfo?.worker?.lastName}`},
          </span>
          <span className="disabled-form-text">
            <span className="disabled-form-bold-text">Start Date:</span>
            {moment(basicInfo?.startDate).format("MM/DD/YYYY")}
          </span>
          <span className="disabled-form-text">
            <span className="disabled-form-bold-text">End Date:</span>
            {moment(basicInfo?.endDate).format("MM/DD/YYYY")}
          </span>   
          
          <span className="disabled-form-align">
            <span className="disabled-form-bold-text">C2C Pay Rate/hr:</span>
            {Number(basicInfo?.payRate).toFixed(2)}
          </span>
          <span className="disabled-form-align">
            <span className="disabled-form-bold-text">Rebate Adjusted Bill Rate/hr:</span>
            {Number(basicInfo?.billRate).toFixed(2)}
          </span>
          <span className="disabled-form-align">
            <span className="disabled-form-bold-text">Margin/hr:</span>
            {Number(basicInfo?.margin).toFixed(2)}
          </span>
        </div>
    
      </div>
    </>
  ) : (
    <Fragment> 
      <h3 className="disabled-form-section-header">Basic Information</h3>

      <Input
         type="date"
         label="Active Date"
         name="activeDate"
        min={minDate}
        max="2999-12-31"
        onChange={(e) => handleChange(e)}
        value={basicInfo?.activeDate}
        disabled={!editEnabled}
      />

<Input
        label="Project"
        type="text"
        name="projectName"
        onChange={(e) => handleChange(e, "validateName")}
        value={basicInfo?.project?.projectName}       
        disabled
  /> 
        <SingleSelect
            label="Worker Name"
            name="workerId"
            data-testid="worker-options"
            value={basicInfo?.worker?.id || ""}
            required
            onChange={handleChangeWorker}
            options={workerOptions.map((worker) => {
              let id = worker.id;
              return {
                id: id,
                name: `${worker.firstName} ${worker.lastName}`,
              };
            })}
          />
          <Input
         type="date"
         label="Start Date"
         name="startDate"
        id="startDate"
        max="2999-12-31"
        disabled
        onChange={(e) => handleChange(e)}
        value={basicInfo?.startDate}
      />
      <Input
         type="date"
         label="End Date"
         name="endDate"
        id="endDate"
        min={minDate}
        max="2999-12-31"
        onChange={(e) => handleChange(e)}
        value={basicInfo?.endDate}
        disabled
      />

<Input
                   type="number"
                   label="C2C Pay Rate/hr"
                   name="payRate"
                   value={Number(basicInfo?.payRate).toFixed(2)}
                   onChange={(e) => handleChange(e,"validateHasDecimal")}
                   disabled

                      />

       <Input
                 type="number"
                 label="Rebate Adjusted Bill Rate/hr"
                 name="billRate"
                 value={Number(basicInfo?.billRate).toFixed(2)}
                 onChange={(e) => handleChange(e,"validateHasDecimal")}
                 disabled

                /> 

      
 
               

                    

<Input
        label="Margin/hr"
        type="number"
        name="margin"
        value={Number(basicInfo?.margin).toFixed(2)}
        disabled
      />
    </Fragment>

  );
};
export default BasicInfoWorkOrder;