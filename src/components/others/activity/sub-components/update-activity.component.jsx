import { useEffect, useState, useRef, useCallback } from "react";
import { config } from "../../../../config";
import auth from "../../../../utils/AuthService";
import axios from "axios";
import SingleSelect from "../../../common/select/selects.component";
import { ScheduleInterviewForm } from "../../../entity/interview/int_ui_helpers/form/schedule-interview-form";
import { message } from "antd";
import Input from "../../..//common/input/inputs.component";
import { useDispatch, useSelector } from "react-redux";
import { setBasicInfo } from "../../../../Redux/candidateSlice";
import "../activity.styles.scss";
import moment from "moment";
import ms from "ms";
import { Checkbox } from "antd";
import { setChangesMade, setInputErr } from "../../../../Redux/candidateSlice";
import Form from "../../../common/form/form.component";
import TextBlock from "../../../common/textareas/textareas.component";

export const UpdateActivity = ({ record, jobs, activity, ...props }) => {
  const dispatch = useDispatch();
  const [headers] = useState(auth.getHeaders());
  const [statusOptions, setStatusOptions] = useState([]);
  const [update, setUpdate] = useState({});
  const submitBtnRef = useRef(null);
  const [oldRecordJobId, setOldRecordJobId] = useState(null);
  const [oldStatus, setOldStatus] = useState("");
  const { basicInfo } = useSelector((state) => state.candidate);
  const dispatchBasic = (prvBasicInfo) => dispatch(setBasicInfo(prvBasicInfo));
  const [docRef] = useState(null);
  const [minDate, setMinDate] = useState(null);
  const [newResume, setNewResume] = useState(null);
  const { inputErr } = useSelector((state) => state.candidate);
  const [showHide, setShowHide] = useState(false);

  useEffect(() => {
    const day = ms("1d");
    const min_date = new Date(+new Date(update.startDate) + day);
    setMinDate(moment(min_date).format("YYYY-MM-DD"));
  }, [update.startDate]);

  useEffect(() => {
    if (!record.newFormat) {
      let status = "";
      switch (record.status) {
        case "Submitted":
          status = "SUBMISSION";
          break;
        case "Internal Interview":
        case "Client Interview":
          status = "INTERVIEW";
          break;
        case "Pending":
          status = "PENDING";
          break;
        case "Confirmed":
          status = "CONFIRMED";
          break;
        default:
          break;
      }
      setOldStatus(status);
    }
  }, [record]);

  useEffect(() => {
    if (!record.newFormat && record.job?.client) {
      const title = record.job?.title?.includes("(")
        ? record.job?.title?.split(" (")[0]
        : record.job?.title;
      const client = record.job?.client?.includes("(")
        ? record.job?.client?.split(" (")[0]
        : record.job?.client;
      const location = record.job?.client?.split(" (")[1].slice(0, -1);
      const id = jobs.filter(
        (job) =>
          job.jobTitle === title &&
          job.client.clientName === client &&
          job.client?.address?.city === location
      )[0].id;
      if (id) setOldRecordJobId(id);
    }
  }, [record, jobs]);

  const dispatchErr = useCallback(
    (object) => dispatch(setInputErr(object)),
    [dispatch]
  );

  const dispatchChange = useCallback(
    (object) => dispatch(setChangesMade(object)),
    [dispatch]
  );

  const handleShowHide = (event) => {
    const sendOfferLetter = event.target.checked;
    setShowHide(sendOfferLetter);
  };

  const uploadNewResume = (event) => {
    const maxAllowedSize = 1 * 1024 * 1024;
    if (event.target.files[0].size > maxAllowedSize) {
      dispatchErr({
        ...inputErr,
        [event.target.name]:
          "File is too big. Please select file with size < 1MB",
      });
      event.target.value = "";
    } else {
      dispatchChange(true);
      let temp = { ...inputErr };
      delete temp[event.target.name];
      dispatchErr(temp);
      setNewResume(event.target.files[0]);
      console.log("tes" + newResume);
    }
  };

  const setUpdateData = useCallback(() => {
    let status = "";
    switch (record.newFormat ? record.currentStatus : record.status) {
      case "SUBMISSION":
      case "Submitted":
        status = "INTERVIEW";
        setStatusOptions([{ id: 1, value: "INTERVIEW", name: "Interview" }]);
        break;
      case "INTERVIEW":
      case "Internal Interview":
      case "Client Interview":
        status = "PENDING";
        setStatusOptions([
          { id: 1, value: "PENDING", name: "Pending" },
          { id: 2, value: "INTERVIEW", name: "Interview" },
        ]);
        break;
      case "PENDING":
      case "Pending":
        status = "CONFIRMED";
        setStatusOptions([
          { id: 2, value: "PENDING", name: "Pending" },
          { id: 0, value: "CONFIRMED", name: "Confirmed" },
          { id: 1, value: "REJECTED", name: "Rejected" },
        ]);
        break;
      case "CONFIRMED":
      case "Confirmed":
        status = "ON_BOARDING";
        setStatusOptions([{ id: 1, value: "ON_BOARDING", name: "Onboarded" }]);
        break;
      default:
        setStatusOptions([]);
    }
    setUpdate({
      candidateId: parseInt(props.candidate),
      pendingOn: record.pendingOn,
      confirmedOn: record.confirmedOn,
      onboardedOn: record.onboardedOn,
      rejectedOn: record.rejectedOn,
      offerLetter: record.offerLetter,
      trackingStatus: status,
      jobId: record.newFormat ? record.job.id : oldRecordJobId,
      project: record.project,
      hiringType: record.hiringType,
      startDate: record.startDate,
      endDate: record.endDate,
      signUpContract: record.signUpContract,
      deliveryOfLaptop: record.deliveryOfLaptop,
      easePortalSetup: record.easePortalSetUp,
      workOrder: record.workOrder,
      backgroundCheck: record.backgroundCheck,
      sendOfferLetter: record.sendOfferLetter,
      offerLetterFile: newResume,
    });
  }, [record, props?.candidate, oldRecordJobId]);

  useEffect(() => {
    setUpdateData();
  }, [setUpdateData]);

  const handleChange = (event) => {
    setUpdate({ ...update, [event.target.name]: event.target.value });
    setInputErr({});
  };

  const handleCheckBoxChange = (event) => {
    setUpdate({ ...update, [event.target.name]: event.target.checked });
    setInputErr({});
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (update.trackingStatus === "INTERVIEW" && record.newFormat) {
        const intRes = await submitBtnRef.current.submit(
          event,
          record.id,
          update
        );
        if (intRes?.status && intRes?.status === 200) props.successWithoutMessage();
        if (intRes?.status && intRes?.status === 400)
          message.error(`Check all form fields are filled out correctly.`);
        if (!intRes?.status) message.error(`please fill all mandatory fields`);
      }
      if (record.newFormat && update.trackingStatus !== "INTERVIEW") {
        const response = await axios.put(
          `${config.serverURL}/activities/${record.id}`,
          update,
          { headers }
        );
        if (response.status === 200) {
              dispatchBasic({
                ...basicInfo,
                status:
                  update.trackingStatus === "ON_BOARDING" ? "Onboarded" : "",
              });
          if (update.sendOfferLetter) {
            const formData = new FormData();
            formData.append("file", newResume);
            formData.append("trackingId", response.data.id);
            const sendOfferRes = await axios.post(
              `${config.serverURL}/activities/offerLetter`,
              formData,
              { headers }
            );
            if (sendOfferRes.status === 200) {
              
            }
          } else {
            props.success();
            dispatchBasic({
              ...basicInfo,
              status:
                update.trackingStatus === "ON_BOARDING" ? "Onboarded" : "",
            });
          }
        }
      } else if (!record.newFormat) {
        const data = {
          jobId: oldRecordJobId,
          date: record.date,
          candidateId: parseInt(props.candidate),
          trackingStatus: oldStatus,
          comment: record.comment,
        };
        const firstRes = await axios.post(
          `${config.serverURL}/activities`,
          data,
          { headers }
        );
        if (firstRes.status === 200) {
          if (update.trackingStatus === "INTERVIEW") {
            const intRes = await submitBtnRef.current.submit(
              event,
              firstRes.data.id,
              update
            );
            if (intRes.status === 200) props.success();
            if (intRes.status && intRes.status === 400)
              message.error(`Check all form fields are filled out correctly.`);
            if (!intRes.status)
              message.error(`Interview created, error updating activity.`);
          } else {
            const secondRes = await axios.put(
              `${config.serverURL}/activities/${firstRes.data.id}`,
              update,
              { headers }
            );
            if (secondRes.status === 200) props.success();
          }
        }
      }
    } catch (error) {
      console.log(error);
      message.error(`please fill the offer letter`);
    }
  };

  const handleCancel = () => {
    setUpdate({ update });
    props.cancel();
  };
  const handleUploadFile = (e) => {
    const maxAllowedSize = 1 * 1024 * 1024;
    if (e.target.files && e.target.files.length > 0) {
      if (e.target.files[0].size > maxAllowedSize) {
        alert("File is too big. Please select file with size < 1MB");
        docRef.current.value = null;
      } else {
        setUpdate({ ...update, resume: e.target.files[0] });
      }
    }
  };
  return (
    <div className="activity-form">
    <Form
          onSubmit={handleSubmit}
          cancel={handleCancel}
          formEnabled={true}
        >
      {update.jobId && (
        <SingleSelect
          disabled
          value={update.jobId || ""}
          label="Job Opening"
          options={jobs
            .filter((job) => job.status === "Active")
            .map((job) => ({
              id: job.id,
              //  value: record.newFormat ? job.id : record.job.title.includes("Manager") ? `${job.jobTitle} (Manager: ${job.hiringManager})` : job.jobTitle,
              value: job.id,
              name: `${job.jobTitle} (${job.client?.clientName}, ${job.client?.address?.city})`,
            }))}
        />
      )}
      <SingleSelect
        value={update.trackingStatus || ""}
        disabled={statusOptions.length > 1 ? false : true}
        label="Activity Status"
        options={statusOptions}
        onChange={handleChange}
        name="trackingStatus"
      />
      {update.trackingStatus === "INTERVIEW" && (
        <div style={{ width: "100%", display: "flex", flexWrap: "wrap" }}>
          <ScheduleInterviewForm
            ref={submitBtnRef}
            submittedOn={record.submittedOn}
            activityForm={true}
            candidate={{ id: props.candidate }}
            type={update.jobId ? "Client Interview" : "Internal Interview"}
            job={
              jobs.filter(
                (job) => job.id === update.jobId || job.id === oldRecordJobId
              )[0]
            }
          />
        </div>
      )}
      {update.trackingStatus === "PENDING" && (
        <Input
          name="pendingOn"
          label="Pending On"
          type="date"
          min={moment(JSON.parse(record.interviews[0].comment).date).format(
            "YYYY-MM-DD"
          )}
          required
          max={"2999-12-31"}
          onChange={(event) => handleChange(event, "validateDob")}
          value={update.pendingOn || ""}
        />
      )}
      {update.trackingStatus === "CONFIRMED" && (
        <Input
          name="confirmedOn"
          label="Confirmed On"
          type="date"
          required
          min={update.pendingOn}
          max="2999-12-31"
          onChange={(event) => handleChange(event, "validateDob")}
          value={update.confirmedOn || ""}
        />
      )}
  {update.trackingStatus === "CONFIRMED" && (
      
      <div >
      <div>
        
      
        <label style={{fontWeight:"200",fontSize:"12px",textTransform:"uppercase",color:"rgba(0, 0, 0, 0.8)"}}>Send Offer Letter</label>
        <div style={{  position:" relative",top:"5px",left:"44%",display: "flex",flexdirection:"row",justifyContent:"flex-start",
}}>
        <Checkbox
                name="sendOfferLetter"
                id="sendOfferLetter"
                checked={update.sendOfferLetter}
                onChange={(event) => {
                  handleCheckBoxChange(event);
                  handleShowHide(event);
                }}
              />
          </div>
      </div>
      </div>
              )}


      {showHide && (
  <div style={{  position:" relative",left:"2%",display: "flex",flexdirection:"row",justifyContent:"flex-start",
}}>        {update.trackingStatus === "CONFIRMED" && (
            <Input
              label="Offer Letter"
              required
              type="file"
              name="offerLetter"
              onChange={(event) => {
                uploadNewResume(event);
              }}
            />
          )}
        </div>
      )}

      {update.trackingStatus === "REJECTED" && (
        <Input
          name="rejectedOn"
          label="Rejected On"
          type="date"
          required
          min={update.pendingOn || ""}
          max="2999-12-31"
          onChange={(event) => handleChange(event, "validateDob")}
          value={update.rejectedOn || ""}
        />
      )}

      {update.trackingStatus === "ON_BOARDING" && update.jobId == null && (
        <Input
          name="onboardedOn"
          label="Onboarded On"
          required
          type="date"
          max="2999-12-31"
          min={update.confirmedOn}
          onChange={(event) => handleChange(event, "validateDob")}
          value={update.onboardedOn || ""}
        />
      )}

      {update.trackingStatus === "ON_BOARDING" && update.jobId != null && (
        <>
          <Input
            name="onboardedOn"
            label="Onboarded On"
            type="date"
            required
            max="2999-12-31"
            min={update.confirmedOn}
            onChange={(event) => handleChange(event, "validateDob")}
            value={update.onboardedOn || ""}
          />
          <Input
            type="text"
            label="Project"
            name="project"
            value={update.project || ""}
            onChange={(event) => handleChange(event, "validateName")}
            maxLength="20"
            errMssg={inputErr["project"]}
          />
          <SingleSelect
            label="Hiring Type"
            name="hiringType"
            value={update.hiringType}
            onChange={(event) => handleChange(event, "validateName")}
            required
            options={[
              {
                id: "Internal Hire",
                value: "Internal Hire",
                name: "Internal Hire",
              },
              {
                id: "Direct Hire",
                value: "Direct Hire",
                name: "Direct Hire",
              },
              {
                id: "Corp to Corp Hire",
                value: "Corp to Corp Hire",
                name: "Corp to Corp Hire",
              },
            ]}
          />
          <Input
            type="date"
            label="Project Start Date"
            name="startDate"
            onChange={(event) => handleChange(event, "validateDob")}
            value={update.startDate || ""}
            errMssg={inputErr["startDate"]}
            max="2999-12-31"
          />
          <Input
            type="date"
            label="Project End Date"
            name="endDate"
            value={update.endDate || ""}
            onChange={(event) => handleChange(event, "validateDob")}
            errMssg={inputErr["endDate"]}
            min={minDate}
            max="2999-12-31"
          />
          <SingleSelect
            label="Sign-Up Contract"
            name="signUpContract"
            value={update.signUpContract || ""}
            onChange={(event) => handleChange(event, "validateDob")}
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
          />
          <Input
            label="Document"
            type="file"
            name="resume"
            onChange={handleUploadFile}
          />
          <SingleSelect
            label="Delivery of Laptop"
            name="deliveryOfLaptop"
            value={update.deliveryOfLaptop || ""}
            onChange={(event) => handleChange(event)}
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
          />
          <SingleSelect
            label="Ease Portal Setup"
            name="easePortalSetUp"
            value={update.easePortalSetUp || ""}
            onChange={(e) => handleChange(e, "validateName")}
            options={[
              { id: "Initiated", value: "Initiated", name: "Initiated" },
              { id: "In process", value: "In process", name: "In process" },
              { id: "Completed", value: "Completed", name: "Completed" },
            ]}
          />
          <SingleSelect
            label="Workorder"
            name="workOrder"
            value={update.workOrder || ""}
            onChange={(event) => handleChange(event)}
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
              { id: "Created", value: "Created", name: "Created" },
            ]}
          />
          <SingleSelect
            label="Background Check"
            name="backgroundCheck"
            value={update.backgroundCheck || ""}
            onChange={(event) => handleChange(event)}
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
          />
        </>
      )}
           <div className="activity">
     
     <TextBlock
                label="Comment"
                name="comment"
                value={update.comment}
                onChange={handleChange}
                maxLength={3000}
                charCount={`Remaining characters: ${
                  update.comment ? 3000 - update.comment?.length : 3000
                } of 3000`}
              />
     </div>
      </Form>
    </div>
    
  );
};
