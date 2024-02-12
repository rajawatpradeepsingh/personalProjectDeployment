import { Fragment, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import SingleSelect from "../../../common/select/selects.component";
import { setChangesMade, setInputErr, setRequiredErr, setJobDetails } from "../../../../Redux/jobSlice";
import { runValidation } from "../../../../utils/validation";
import TextBlock from "../../../common/textareas/textareas.component";
import { priorities, jobTypes } from "../../../../utils/defaultData";
import "../../../common/textareas/textareas.styles.css"
import "../job.css"
const JobDetails = () => {
  const dispatch = useDispatch();
  const { jobDetails, editEnabled, inputErr, requiredErr } = useSelector((state) => state.job);
  const [editDisabled] = useState(true);
  const [errMsg, setErrMsg] = useState({});

  const dispatchErr = (object) => dispatch(setInputErr(object));
  const dispatchReqErr = (object) => dispatch(setRequiredErr(object));
  const dispatchChange = (object) => dispatch(setChangesMade(object));

  const handleBasicInfoChange = (event, validProc = null) => {
    dispatchChange(true);
    const isValid = runValidation(validProc, event.target.value);
    let temp;
    if (event.target.value !== "") {
      temp = { ...requiredErr };
      delete temp[event.target.name];
      dispatchReqErr(temp);
    }
    dispatch(setJobDetails({ ...jobDetails, [event.target.name]: event.target.value }));
    event.preventDefault();

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

  const postValidation = (e, postValidProc = null) => {
    const isInvalid = e.target.value.length
      ? postValidProc && !runValidation(postValidProc, e.target.value)
      : true;
    setErrMsg({ ...errMsg, [`${e.target.name}ErrFlag`]: Boolean(isInvalid) });
  };

  return (
    <Fragment>
      {!editEnabled ? (
        <>
          <div className="disabled-form-section small">
            <div className="disabled-form-section">
              <h3 className="disabled-form-section-header"> Job Description</h3>
            </div>
            <div className="disabled-form-section-content wide" >
              <span className="disabled-form-text wide">
                 <div className="text-block-container">
                <TextBlock
                id="jobDescription"
                  label="Job Description"
                  name="jobDescription"
                  value={jobDetails?.jobDescription || ""}
                  disabled={editDisabled}
                />
                </div>
              </span>
            </div>
            <div className="disabled-form-section">
              <h3 className="disabled-form-section-header">Job Details</h3>
            </div>
            <div className="disabled-form-section-content wide" style={{ padding: '0px 0px 0px 25px' }}>
              <span className="disabled-form-text wide">
                <span className="disabled-form-bold-text">WORK TYPE:</span>
                {jobDetails?.workType}
              </span>
              <span className="disabled-form-text wide">
                <span className="disabled-form-bold-text">PRIORITY:</span>
                {jobDetails?.priority}
              </span>
              <span className="disabled-form-text wide">
                <span className="disabled-form-bold-text">{" "}EMPLOYMENT TYPE:</span>
                {jobDetails?.jobType}
              </span>
            </div>
            <div className="disabled-form-section-content wide" style={{ padding: '0px 0px 0px 25px' }}>
              <span className="disabled-form-text wide">
                <span className="disabled-form-bold-text">FLSA TYPE:</span>
                {jobDetails?.flsaType}
              </span>
              <span className="disabled-form-text wide">
                <span className="disabled-form-bold-text">TAX TYPE:</span>
                {jobDetails?.taxType}
              </span>
            </div>
            <div className="disabled-form-section">
              <h3 className="disabled-form-section-header">Comments</h3>
            </div>
            <div className="disabled-form-section-content wide" style={{ padding: '0px 0px 0px 25px' }}>
              <span className="disabled-form-text wide">
                <span className="disabled-form-bold-text">Comments:</span>
                <TextBlock
                  type="text"
                  label="Comments"
                  name="comments"
                  value={jobDetails?.comments || ""}
                  onChange={(e) => handleBasicInfoChange(e)}
                  maxLength="3000"
                  charCount={`${jobDetails.comments ? 3000 - jobDetails.comments.length : 3000
                    } of 3000`}
                  disabled
                />
              </span>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="long-form-subsection">
            <div style={{ width: "100%" }}>
              <h3 className="disabled-form-section-header" style={{ padding: '0px 0px 0px 25px' }}>Job Description</h3>
              <div style={{ padding: '0px 0px 20px 25px', display: 'flex' }}>
                <TextBlock
                id="jobDescription"
                  label="Job Description"
                  name="jobDescription"
                  value={jobDetails?.jobDescription || ""}
                  onChange={(e) => {
                    postValidation(e, "validateHasAlphabet");
                    handleBasicInfoChange(e);
                  }}
                  charCount={`${jobDetails?.jobDescription
                    ? 3000 - jobDetails.jobDescription.length
                    : 3000
                    } of 3000`}
                  required
                  errMssg={
                    jobDetails?.jobDescription?.length > 0 &&
                    errMsg.jobDescriptionErrFlag &&
                    "Description can't only contain numbers"
                  }
                  maxLength="3000"
                  disabled={!editDisabled}
                />
              </div>
            </div>
          </div>
          <div className="long-form-subsection">
            <div>
              <h3 className="disabled-form-section-header" style={{ padding: '0px 0px 0px 25px' }}> Job Details</h3>
              <div style={{ padding: '0px 0px 20px 25px', display: 'flex' }}>
                <SingleSelect
                  label="Work Type"
                  name="workType"
                  value={jobDetails?.workType || ""}
                  onChange={handleBasicInfoChange}
                  options={[
                    { id: "Hybrid", value: "Hybrid Work", name: "Hybrid Work" },
                    { id: "Onsite", value: "Onsite Work", name: "Onsite Work" },
                    { id: "Remote", value: "Remote Work", name: "Remote Work" },
                  ]}
                  disabled={!editDisabled}
                />
                <SingleSelect
                  label="Priority"
                  name="priority"
                  value={jobDetails?.priority || ""}
                  onChange={handleBasicInfoChange}
                  options={priorities.map((p) => ({ id: p, value: p, name: p }))}
                  disabled={!editDisabled}
                />
                <SingleSelect
                  label="Employment Type"
                  name="jobType"
                  value={jobDetails?.jobType || ""}
                  onChange={handleBasicInfoChange}
                  options={jobTypes.map((t) => ({ id: t, name: t }))}
                  disabled={!editDisabled}
                />
              </div>
            </div>
          </div>
          <div className="long-form-subsection">
            <div>
              <div style={{ padding: '0px 0px 20px 25px', display: 'flex' }}>
                <SingleSelect
                  label="FLSA Type"
                  name="flsaType"
                  value={jobDetails?.flsaType || ""}
                  onChange={handleBasicInfoChange}
                  options={[
                    { id: "Exempt", value: "Exempt", name: "Exempt" },
                    { id: "Non Exempt", value: "Non Exempt", name: "Non Exempt" },
                  ]}
                  disabled={!editDisabled}
                />
                <SingleSelect
                  label="Tax Type"
                  name="taxType"
                  value={jobDetails?.taxType || ""}
                  onChange={handleBasicInfoChange}
                  options={[
                    { id: "C2C", value: "C2C", name: "C2C" },
                    { id: "W-2", value: "W-2", name: "W-2" },
                  ]}
                  disabled={!editDisabled}
                />
              </div>
            </div>
          </div>
          <div className="long-form-subsection">
            <div style={{ width: "100%" }}>
              <h3 className="disabled-form-section-header" style={{ padding: '0px 0px 0px 25px' }}>comments</h3>
              <div style={{ padding: '0px 0px 20px 25px', display: 'flex' }}>
                <TextBlock
                  type="text"
                  label="Comments"
                  name="comments"
                  value={jobDetails?.comments || ""}
                  onChange={(e) => handleBasicInfoChange(e)}
                  maxLength="3000"
                  charCount={`${jobDetails.comments ? 3000 - jobDetails.comments.length : 3000
                    } of 3000`}
                  disabled={!editEnabled}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </Fragment>
  );
};

export default JobDetails;
