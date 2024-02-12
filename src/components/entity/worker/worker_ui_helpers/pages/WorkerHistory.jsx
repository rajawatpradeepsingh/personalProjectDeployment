
import { useParams } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import Input from "../../../../common/input/inputs.component";
import { runValidation } from "../../../../../utils/validation";
import {
  setInputErr,
  setRequiredErr,
  setChangesMade,
  setBasicInfo,
} from "../../../../../Redux/workerSlice";
import moment from "moment";
import ms from "ms";
import ProjectHistory from "../project_history/ProjectHistory";
import TextBlock from "../../../../common/textareas/textareas.component";
import SingleSelect from "../../../../common/select/selects.component";
import { Checkbox } from "antd";
import Button from "../../../../common/button/button.component";
import SignForm from "../../../../common/file-download/SignForm";

const WorkerHistory = (props) => {
  const dispatch = useDispatch();
  const { editEnabled } = useSelector((state) => state.worker);
  const { inputErr, requiredErr } = useSelector((state) => state.worker);
  const [minDate, setMinDate] = useState(null);
  const dispatchErr = (object) => dispatch(setInputErr(object));
  const dispatchReqErr = (object) => dispatch(setRequiredErr(object));
  const dispatchChange = (object) => dispatch(setChangesMade(object));
  const { basicInfo, worker } = useSelector((state) => state.worker);
  const params = useParams();

  const { resume, enableReplaceResume, replaceResumeEnabled, uploadNewResume } =
    props;
  useEffect(() => {
    const day = ms("1d");
    const min_date = new Date(+new Date(basicInfo?.contractStartDate) + day);
    setMinDate(moment(min_date).format("YYYY-MM-DD"));
  }, [basicInfo?.contractStartDate]);

  const dispatchBasic = useCallback(
    (object) => dispatch(setBasicInfo(object)),
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
  const handleCheckChange = (event) => {
    const {name } = event.target;
  // dispatchBasic({ [name]: event.target.checked });
  dispatchBasic({ ...basicInfo, [name]: event.target.checked });

 }
  return (
    <div style={{display: "flex", flexWrap: "wrap"}}>
      <h3 className="disabled-form-section-header">Current Project Details</h3>
      <Input
        name="contractStartDate"
        label="Project Start Date"
        id="contractStartDate"
        type="date"
        max="2999-12-31"
        disabled={!editEnabled}
        onChange={(e) => handleBasicInfoChange(e)}
        value={basicInfo?.contractStartDate}
      />
      <Input
        name="contractEndDate"
        label="Project End Date"
        id="contractEndDate"
        type="date"
        min={minDate}
        max="2999-12-31"
        onChange={(e) => handleBasicInfoChange(e)}
        value={basicInfo?.contractEndDate}
        disabled={!editEnabled}
      />
      <h3 className="disabled-form-section-header">Asset Details</h3>
      <div style={{ fontSize: "12px", display: "flex", flexDirection: "column",paddingRight:"20px" }}>
        <label style={{ fontWeight: "200", fontSize: "12px", textTransform: "uppercase", color: "rgba(0, 0, 0, 0.8)" }} >Is Laptop Provided?</label>
        <div style={{ fontSize: "12px", paddingLeft: "50px" }}>
          <Checkbox
            name="isLaptopProvided"
            label="Is Laptop Provided"
            id="isLaptopProvided"
            value={basicInfo.isLaptopProvided}
            onChange={(event) => {
              handleCheckChange(event);
            }}
            disabled={!editEnabled}

          />
        </div>
      </div>
      {(basicInfo.isLaptopProvided === true ||
        basicInfo.isLaptopProvided === "true") && (
          <div style={{ fontSize: "12px",display: "flex"
        }}>
<SingleSelect
        name="laptopProvided"
        label="Laptop Provided"
        id="laptopProvided"
        onChange={(e) => handleBasicInfoChange(e, "validateGender")}
        value={basicInfo?.laptopProvided}
        options={[
          {
            id: "Initiated",
            value: "Initiated",
            name: "Initiated",
          },
          {
            id: "In process",
            value: "In process",
            name: "In process",
          },
          {
            id: "Completed",
            value: "Completed",
            name: "Completed",
          },
        ]}
        disabled={!editEnabled}
      />
      <SingleSelect
        name="laptopProvidedBy"
        label="Laptop Provided By"
        id="laptopProvidedBy"
        onChange={(e) => handleBasicInfoChange(e)}
        placeholder={"If Yes, Please Select..."}
        value={basicInfo?.laptopProvidedBy}
        options={[
          { id: 1, value: "Drishticon", name: "Drishticon" },
          { id: 2, value: "Client", name: "Client" },
          { id: 3, value: "NA", name: "NA" },
        ]}
        disabled={!editEnabled}
      />
        <div style={{ fontSize: "12px", display: "flex", flexDirection: "column",paddingRight:"20px" }}>
        <label style={{ fontWeight: "200", fontSize: "12px", textTransform: "uppercase", color: "rgba(0, 0, 0, 0.8)" }} >laptop Returned?</label>
        <div style={{ fontSize: "12px", paddingLeft: "50px" }}>
          <Checkbox
            name="laptopReturned"
            label="laptop Returned"
            id="laptopReturned"
            value={basicInfo.laptopReturned}
            onChange={(event) => {
              handleCheckChange(event);
            }}
            disabled={!editEnabled}

          />
        </div>
      </div>
      {(basicInfo.laptopReturned === true ||
        basicInfo.laptopReturned === "true") && (
          <div style={{ fontSize: "12px" }}>
     <Input
        name="laptopReturnedDate"
        label="Laptop Returned Date"
        type="Date"
        id="laptopReturnedDate"
        onChange={(e) => handleBasicInfoChange(e)}
        value={basicInfo?.laptopReturnedDate}
        disabled={!editEnabled}
      />
            </div>
        )}

            </div>
        )}

     <div style={{ fontSize: "12px", display: "flex", flexDirection: "column",paddingRight:"20px" }}>
        <label style={{ fontWeight: "200", fontSize: "12px", textTransform: "uppercase", color: "rgba(0, 0, 0, 0.8)" }} >SignedEquipment Form?</label>
        <div style={{ fontSize: "12px", paddingLeft: "50px" }}>
          <Checkbox
            name="signedEquipmentForm"
            label="signedEquipment Form"
            id="signedEquipmentForm"
            value={basicInfo.signedEquipmentForm}
            onChange={(event) => {
              handleCheckChange(event);
            }}
            disabled={!editEnabled}

          />
        </div>
      </div>
      {(basicInfo.signedEquipmentForm === true ||
        basicInfo.signedEquipmentForm === "true") && (
          <div style={{ fontSize: "12px" }}>
    {editEnabled ? (
          <div>
            <Input
              label="Resume"
              required
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

      <SignForm
            id={basicInfo?.id}
            resume={basicInfo?.resume?.resumeName}
            displayType="link"
            required
            disabled={!editEnabled}
            noLabel={true}
            className="small"
          />
          {basicInfo?.resume?.resumeName}
          </div>
            </div>
    
        )}
            </div>
        )}

      <h3 className="disabled-form-section-header"> Additional Information</h3>
      <TextBlock
        type="text"
        label="Additional Information for worker"
        name="comments"
        value={basicInfo?.comments || ""}
        onChange={(e) => handleBasicInfoChange(e)}
        maxLength="3000"
        charCount={`${
          basicInfo.comments ? 3000 - basicInfo.comments.length : 3000
        } of 3000`}
        disabled={!editEnabled}
      />

      <ProjectHistory
       id={params?.workerId || worker?.id}
      />
    </div>
  );
};

export default WorkerHistory;
