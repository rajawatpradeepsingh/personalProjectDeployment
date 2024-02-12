import { useCallback, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Input from "../../../../common/input/inputs.component";
import SingleSelect from "../../../../common/select/selects.component";
import { setChangesMade, setInputErr, setRequiredErr, setBasicInfo } from "../../../../../Redux/onBoarding";
import { runValidation } from "../../../../../utils/validation";
import moment from "moment";
import ms from "ms";
import DownloadFile from "../../../../common/file-download/DownloadFile";
import { processStatus } from "../../../../../utils/defaultData";

const OnboardingDetails = () => {
  const { editEnabled } = useSelector((state) => state.onBoarding);
  const dispatchChange = (object) => dispatch(setChangesMade(object));
  const dispatch = useDispatch();
  const dispatchErr = (object) => dispatch(setInputErr(object));
  const { inputErr, requiredErr } = useSelector((state) => state.onBoarding);
  const dispatchReqErr = (object) => dispatch(setRequiredErr(object));
  const { basicInfo } = useSelector((state) => state.onBoarding);
  const [minDate, setMinDate] = useState(null);
  const [replaceFile] = useState(false);

  useEffect(() => {
    const day = ms("1d");
    const min_date = new Date(+new Date(basicInfo?.startDate) + day);
    setMinDate(moment(min_date).format("YYYY-MM-DD"));
  }, [basicInfo?.startDate]);

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
  const handleUploadFile = (e) => {
    const maxAllowedSize = 1 * 1024 * 1024;
    if (e.target.files && e.target.files.length > 0) {
      if (e.target.files[0].size > maxAllowedSize) {
        alert("File is too big. Please select file with size < 1MB");
      } else {
        dispatchBasic({ ...basicInfo, resume: e.target.files[0] });
      }
    }
  };

  return (
    <>
      <h3 className="disabled-form-section-header">Project </h3>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        <Input
          type="text"
          label="Project Name"
          name="project"
          value={basicInfo?.project}
          z
          maxLength="20"
          onChange={(e) => handleBasicInfoChange(e, "validateName")}
          errMssg={inputErr["project"]}
          disabled={!editEnabled}
        />
        <Input
          name="startDate"
          label="Project Start Date"
          id="startDate"
          type="date"
          max="2999-12-31"
          onChange={(e) => handleBasicInfoChange(e)}
          value={basicInfo?.startDate}
          disabled={!editEnabled}
        />
        <Input
          name="endDate"
          label="Project End Date"
          id="endDate"
          type="date"
          min={minDate}
          max="2999-12-31"
          onChange={(e) => handleBasicInfoChange(e, "validateGender")}
          value={basicInfo?.endDate}
          disabled={!editEnabled}
        />
      </div>
      <h3 className="disabled-form-section-header">Asset</h3>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        <SingleSelect
          type="date"
          label="Delivery Of Laptop"
          name="deliveryOfLaptop"
          value={basicInfo?.deliveryOfLaptop}
          onChange={(e) => handleBasicInfoChange(e, "validateGender")}
          maxLength="20"
          disabled={!editEnabled}
          options={processStatus.map(status => ({ id: status, value: status, name: status }))}
        />
      </div>
      <h3 className="disabled-form-section-header">Additional</h3>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        <SingleSelect
          type="text"
          label="Sign-Up-Contract"
          name="signUpContract"
          value={basicInfo?.signUpContract}
          onChange={(e) => handleBasicInfoChange(e, "validateName")}
          maxLength="20"
          disabled={!editEnabled}
          options={processStatus.map(status => ({ id: status, value: status, name: status }))}
        />
        <div>
          {!replaceFile ? (
            <DownloadFile
              candidateId={basicInfo?.id}
              resume={basicInfo?.resume}
              displayType="link"
              label="Document"
            />
          ) : (
            <Input
              label="Document"
              type="file"
              name="resume"
              onChange={handleUploadFile}
              disabled={!editEnabled}
            />
          )}
        </div>
        <SingleSelect
          label="Ease Portal Setup"
          name="easePortalSetUp"
          value={basicInfo?.easePortalSetUp}
          onChange={(e) => handleBasicInfoChange(e, "validateName")}
          maxLength="20"
          disabled={!editEnabled}
          options={processStatus.map(status => ({ id: status, value: status, name: status }))}
        />
        <SingleSelect
          label="Workorder"
          name="workOrder"
          value={basicInfo?.workOrder}
          disabled={!editEnabled}
          onChange={(e) => handleBasicInfoChange(e, "validateName")}
          options={processStatus.map(status => ({ id: status, value: status, name: status }))}
        />
        <SingleSelect
          label="Background Check"
          name="backgroundCheck"
          value={basicInfo?.backgroundCheck}
          onChange={(e) => handleBasicInfoChange(e, "validateName")}
          maxLength="20"
          disabled={!editEnabled}
          options={processStatus.map(status => ({ id: status, value: status, name: status }))}
        />
      </div>
    </>
  );
};

export default OnboardingDetails;
