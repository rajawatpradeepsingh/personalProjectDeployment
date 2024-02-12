import { Fragment, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Input from "../../../common/input/inputs.component";
import { runValidation } from "../../../../utils/validation";
import { setChangesMade, setInputErr, setRequiredErr ,setBasicInfo} from "../../../../Redux/projectSlice";
import moment from "moment";
import ms from "ms";
import "../project.css";
const BasicInfoProject = () => {
  const dispatch = useDispatch();
  const { editEnabled } = useSelector((state) => state.project);
  const {  inputErr, requiredErr } = useSelector((state) => state.project);
  const dispatchChange = (object) => dispatch(setChangesMade(object));
  const dispatchErr = (object) => dispatch(setInputErr(object));
  const dispatchReqErr = (object) => dispatch(setRequiredErr(object));
  const dispatchBasic = (object) => dispatch(setBasicInfo(object));
  const { basicInfo } = useSelector((state) => state.project);
  const [minDate, setMinDate] = useState(null);

  useEffect(() => {
    const day = ms("1d");
    const min_date = new Date(+new Date(basicInfo?.startDate) + day);
    setMinDate(moment(min_date).format("YYYY-MM-DD"));
  }, [basicInfo?.startDate]);


  

  const projectChange = (event, validProc = "validateNum") => {
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


  return !editEnabled ? (
    <>
      <div className="disabled-form-section small">
        <h3 className="disabled-form-section-header"> Basic Information</h3>
        <div className="disabled-form-section-content">
          <span className="disabled-form-text">
            <span className="disabled-form-bold-text">Project Name:</span>
            {basicInfo?.projectName}
          </span>
          <span className="disabled-form-text">
            <span className="disabled-form-bold-text">Hiring Manager:</span>
            {basicInfo?.hiringManager}
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
            <span className="disabled-form-bold-text">Client Rate:</span>
            {Number(basicInfo?.clientRate).toFixed(2)}
          </span>
          <span className="disabled-form-align">
            <span className="disabled-form-bold-text">VMS Adjusted Bill Rate:</span>
            {Number(basicInfo?.billRate).toFixed(2)}
          </span>
          <span className="disabled-form-align">
            <span className="disabled-form-bold-text">Rebate Adjusted Bill Rate:</span>
            {Number(basicInfo?.netBillRate).toFixed(2)}
          </span>
        </div>
      </div>
  
    </>
  ) : (
    <Fragment>
      <h3 className="disabled-form-section-header" >Basic Information</h3>
      
      <Input
        label="Project Name"
        type="text"
        name="projectName"
        onChange={(e) => projectChange(e, "validateName")}
        value={basicInfo?.projectName} 
        required       
        disabled={!editEnabled}
  /> 
       <Input
        label="Hiring Manager"
        type="text"
        name="hiringManager"
        onChange={(e) => projectChange(e,"validateName")}
        value={basicInfo?.hiringManager}
        disabled={!editEnabled}
      
      />

<Input
         type="date"
         label="Start Date"
         name="startDate"
        id="startDate"
        max="2999-12-31"
        disabled={!editEnabled}
        onChange={(e) => projectChange(e)}
        value={basicInfo?.startDate}
      />
      <Input
         type="date"
         label="End Date"
         name="endDate"
        id="endDate"
        min={minDate}
        max="2999-12-31"
        onChange={(e) => projectChange(e)}
        value={basicInfo?.endDate}
        disabled={!editEnabled}
      />
      

                  <Input
                 type="number"
                 pattern="[0-9]*"
                 label="Client Rate"
                 name="clientRate"
                 value={Number(basicInfo?.clientRate).toFixed(2)}
                 onChange={(e) => projectChange(e,"validateHasDecimal")}
                 disabled={!editEnabled}
                 className="right-align"

                /> 
                  <Input
                   type="number"
                   label="VMS Adjusted
                   Bill Rate"
                   name="billRate"
                   value={Number(basicInfo?.billRate).toFixed(2)}
                   onChange={(e) => projectChange(e,"validateHasDecimal")}
                   disabled={!editEnabled}
                   className="right-align"


                      />

                    
                 <Input
                 type="number"
                 label="Rebate Adjusted
                 Bill Rate"
                 name="netBillRate"
                 value={Number(basicInfo?.netBillRate).toFixed(2)}
                 onChange={(e) => projectChange(e,"validateHasDecimal")}
                 disabled={!editEnabled}
                 className="right-align"



                /> 
                 
    </Fragment>
  );
};

export default BasicInfoProject;
