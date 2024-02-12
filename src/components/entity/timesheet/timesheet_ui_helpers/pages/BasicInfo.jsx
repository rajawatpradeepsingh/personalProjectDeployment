import { useSelector,useDispatch } from "react-redux";
import { setTimeSheetDetails } from "../../../../../Redux/timesheetSlice";
import { config } from "../../../../../config";
import AuthService from "../../../../../utils/AuthService";
import { Fragment, useState, useEffect,useCallback } from "react";
import SingleSelect from "../../../../common/select/selects.component";
import axios from "axios";
import { setInputErr, setRequiredErr,setChangesMade } from "../../../../../Redux/rateCardSlice";
import { runValidation } from "../../../../../utils/validation";
import Input from "../../../../common/input/inputs.component";
import moment from "moment";

const BasicInfo = () => {
  const { editEnabled } = useSelector((state) => state.timesheet);
  const { timeSheetDetails } = useSelector((state) => state.timesheet);
  const dispatchTimeSheet = (object) => dispatch(setTimeSheetDetails(object));
  const dispatch = useDispatch();
  const [workerOptions, setWorkerOptions] = useState([]);
  const [headers] = useState(AuthService.getHeaders());
  const { inputErr, requiredErr } = useSelector((state) => state.timesheet);
  const dispatchErr = (object) => dispatch(setInputErr(object));
  const dispatchReqErr = (object) => dispatch(setRequiredErr(object));
  const dispatchChange = (object) => dispatch(setChangesMade(object));


  
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

  dispatchTimeSheet({
    ...timeSheetDetails,
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
  dispatchTimeSheet({ ...timeSheetDetails, [event.target.name]: event.target.value });

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
            <span className="disabled-form-bold-text">Worker:</span>
            {`${timeSheetDetails?.worker?.firstName} ${timeSheetDetails?.worker?.lastName}`}
          </span>
          <span className="disabled-form-text">
            <span className="disabled-form-bold-text">Time Period:</span>
            {/* {timeSheetDetails?.mondayDate + " to " +
                    (timeSheetDetails?.sundayDate) } */}
                    {timeSheetDetails?.timesheetWeekDays?.mondayDate + " to " +
                    timeSheetDetails?.timesheetWeekDays?.sundayDate }
                   </span>
                  
          <span className="disabled-form-text">
            <span className="disabled-form-bold-text">Work Order:</span>
            {`${timeSheetDetails?.workOrder?.id} PRJ-${timeSheetDetails?.workOrder?.project?.client?.clientName.slice(0,3)}-000${timeSheetDetails?.workOrder?.id}  `}
          </span>

          <span className="disabled-form-text">
            <span className="disabled-form-bold-text">Client:</span>
            {`${timeSheetDetails?.workOrder?.project?.client?.clientName}`}
          </span>
        
          <span className="disabled-form-text">
            <span className="disabled-form-bold-text">TimeSheet Status </span>
             {timeSheetDetails?.timeSheetStatus}
          </span>

          <span className="disabled-form-text">
            <span className="disabled-form-bold-text">Submitted On:</span>
            {moment(timeSheetDetails?.submittedOn ).format("MM/DD/YYYY")}

          </span>

          {/* <span className="disabled-form-text">
            <span className="disabled-form-bold-text">Billable Hours:</span>
            {`${timeSheetDetails?.billableHours }`}
          </span> */}


        
        </div>
    
      </div>
    </>
  ) : (
    <Fragment> 
      <h3 className="disabled-form-section-header">Basic Information</h3>

      <SingleSelect
            label="Worker Name"
            name="workerId"
            data-testid="worker-options"
            value={timeSheetDetails?.worker?.id || ""}
            required
            onChange={handleChangeWorker}
            options={workerOptions.map((worker) => {
              let id = worker.id;
              return {
                id: id,
                name: `${worker.firstName} ${worker.lastName}`,
              };
            })}
            disabled
          />
    {/* <Input
                label="Time Period"
                type="text"
                name="timePeriod"
                value={timeSheetDetails?.mondayDate + " to " +
                    (timeSheetDetails?.sundayDate) }
                onChange={handleChange}
                disabled
            /> */}
<span style={{display:"flex",flexDirection: "column",paddingBottom: "18px"}}>
            <span style={{fontWeight:"600",fontSize:"12px",textTransform:"uppercase",color:"black"}}>Time Period:</span>
            <span style={{fontWeight:"200",fontSize:"13px",maxHeight:"100px",overflowY:"auto"}}>
            {timeSheetDetails?.timesheetWeekDays?.mondayDate + " to " +
                    (timeSheetDetails?.timesheetWeekDays?.sundayDate) }
          </span>
          </span>
   
      <span style={{display:"flex",flexDirection: "column",paddingBottom: "18px"}}>
            <span style={{fontWeight:"600",fontSize:"12px",textTransform:"uppercase",color:"black"}}>Work Order:</span>
            <span style={{fontWeight:"200",fontSize:"13px",maxHeight:"100px",overflowY:"auto"}}>
            {`${timeSheetDetails?.workOrder?.id} PRJ-${timeSheetDetails?.workOrder?.project?.client?.clientName.slice(0,3)}-000${timeSheetDetails?.workOrder?.id}  `}
          </span>
          
          </span>
          <span style={{display:"flex",flexDirection: "column",paddingBottom: "18px"}}>
            <span style={{fontWeight:"600",fontSize:"12px",textTransform:"uppercase",color:"black"}}>Client:</span>
            <span style={{fontWeight:"200",fontSize:"13px",maxHeight:"100px",overflowY:"auto"}}>
            {` ${timeSheetDetails?.workOrder?.project?.client?.clientName.slice(0,100)}  `}
          </span>
          </span>

          <SingleSelect
            label="TimeSheet Status"
            name="timeSheetStatus"
            value={timeSheetDetails?.timeSheetStatus}
            onChange={(e) => handleChange(e)}
            options={[
              {id: 1, value: 'DRAFTED', name: 'Drafted' },
              { id: 2,value: 'SUBMITTED', name: 'Submitted' },
              { id: 3,value: 'SUBMITTED_UPDATED', name: 'Submitted/Updated' },
              {id: 4, value: 'COLLECTED', name: 'Collected' },
              {id: 5, value: 'PROCESSED', name: 'Processed' },
              {id: 6, value: 'CLOSED', name: 'Closed' }]}
            required
          />       
               <Input
            name="submittedOn"
            label=" submitted On"
            type="date"
            id="submittedOn"
            max="2999-12-31"
            onChange={(e) => handleChange(e)}
            value={timeSheetDetails?.submittedOn}
          />                 
    </Fragment>

  );
};

export default BasicInfo;