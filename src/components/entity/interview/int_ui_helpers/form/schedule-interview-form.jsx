import React, { useEffect, useState, useCallback, forwardRef, useImperativeHandle, useMemo } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import auth from "../../../../../utils/AuthService";
import { config } from "../../../../../config";
import * as service from "../../../../../utils/service.js";
import moment from "moment/moment";
import { validateURL } from "../../../../../utils/validation";
import { getActivityId } from "../../../../../API/candidates/candidate-apis";
import { formatCandidateData, formatClientOptions, formatInterviewerOptions, formatJobOptions, validateStartTime, validateEndTime, endTimeFill } from "../../utils/int_utils";
import { interviewRoundOptions as options } from "../../../../../utils/defaultData";
import { deleteMeeting, getBody, createMeeting, updateMeeting, } from "../zoom/zoomService";
import { setAddInterviewOpen } from "../../../../../Redux/interviewSlice";
import { TimeInput } from "../../../../common/input/input-time/TimeInput";
import { DateInput } from "../../../../common/input/input-date/DateInput";
import { PastDate } from "../../../../common/input/input-date/PastDate";
import { Alert, Spin } from "antd";
import Form from "../../../../common/form/form.component";
import Input from "../../../../common/input/inputs.component";
import MultiSelect from "../../../../common/select/multiSelect/multiSelect.component";
import SingleSelect from "../../../../common/select/selects.component";
import SearchSelect from "../../../../common/select/search-select/search-select.component";
import { CalendarFilled } from "@ant-design/icons";
import "./schedule-form.css";
import { message } from "antd";
import IdleTimeOutHandler from "../../../../ui/Dashboard/IdleTimeOutHandler";

export const ScheduleInterviewForm = forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const headers = useMemo(() => auth.getHeaders(), []);
  const timeZone = useMemo(() => service.currentTZ(), []); // local timeZone
  const cand = useMemo(() => props.candidate, [props.candidate]);
  const interviewer = useMemo(() => props.interviewer, [props.interviewer]);
  const [isInterviewerSelected, setIsInterviewerSelected] = useState(false);
  
   const[isActive,setIsActive]=useState(true)
  const[isLogout,setLogout]=useState(false)

  const initialScheduleState = {
    date: "",
    startTime: "",
    endTime: "",
    meetingURL: "",
    timeZone,
  };

  const initialInterviewState = {
    candidate: { id: 0 },
    interviewers: [],
    client_name: "",
    jobOpening: { id: 0 },
    roundType: 0,
    type: "",
  };

  const [schedule, setSchedule] = useState(initialScheduleState);
  const [interview, setInterview] = useState(initialInterviewState);
  const [candidates, setCandidates] = useState([]);
  const [submitCandidates, setSubmitCandidates] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [clients, setClients] = useState([]);
  const [interviewers, setInterviewers] = useState([]);
  const [meeting, setMeeting] = useState({});
  const [meetingPlatform, setMeetingPlatform] = useState("");
  const [candidateInfo, setCandidateInfo] = useState(null);
  const [selectedCandidateName, setSelectedCandidateName] = useState("");
  const [candActivity, setCandActivity] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [inputErr, setInputErr] = useState({});
  const [endTimeError, setEndTimeError] = useState("");
  const [candUpdate, setCandUpdate] = useState({});
  const [canAutoCreateZoom, setCanAutoCreateZoom] = useState(false);

  const getCandidatesInfo = useCallback(
    (id) => {
      axios
        .get(`${config.serverURL}/candidates/${id}`, { headers })
        .then((res) => setCandidateInfo(res.data))
        .catch(() => { });
    },
    [headers]
  );

  // TODO: get from redux state
  const loadCandidates = (headers) => {
    let url = `${config.serverURL}/candidates?dropdownFilter=true`;
    if (auth.hasRecruiterRole()) url += `&recruiterid=${auth.getUserId()}`;
    axios.get(url, { headers })
      .then((res) => {
        if (res.data) {
          setCandidates(formatCandidateData(res.data));
        }
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) auth.logout();
      });
  };

  const loadSubmittedCandidates = (headers) => {
    let url = `${config.serverURL}/candidates/submit?dropdownFilter=true`;
    if (auth.hasRecruiterRole()) {
      url += `&recruiterid=${auth.getUserId()}`;
    }
    axios
      .get(url, { headers })
      .then((res) => {
        if (res.data) {
          setSubmitCandidates(formatCandidateData(res.data));
        }
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          auth.logout();
        }
      });
  };

  // TODO: get from redux state
  const loadInterviewers = (headers) => {
    axios.get(`${config.serverURL}/interviewer?dropdownFilter=true`, { headers })
      .then((res) => {
        if (res.data) {
          setInterviewers(formatInterviewerOptions(res.data));
        }
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) auth.logout();
      });
  };

  // TODO: get from redux state
  const loadJobs = (headers) => {
    axios
      .get(`${config.serverURL}/jobopenings?dropdownFilter=true`, { headers })
      .then((res) => {
        if (res.data) {
          setJobs(formatJobOptions(res.data));
        }
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) auth.logout();
      });
  };

  // TODO: get from redux state
  const loadClients = (headers) => {
    axios
      .get(`${config.serverURL}/clients?dropdownFilter=true`, { headers })
      .then((res) => {
        if (res.data) {
          setClients(formatClientOptions(res.data));
        }
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) auth.logout();
      });
  };

  const handleSubmitInterview = async (event, activityId, activityDetails) => {
    event.preventDefault();
    if (Object.keys(inputErr).length || errorMessage) return;

    if (schedule.meetingURL !== "" && !validateURL(schedule.meetingURL)) {
      setErrorMessage("The Meeting URL you entered is invalid, try a different URL to submit.");
      resetMeeting();
      return;
    }

    if (interview.type === "Internal Interview" && (!schedule.startTime || !schedule.endTime || !schedule.date)) {
      setErrorMessage("Fill out all required fields.");
      resetInternal();
      return { status: 400 };
    }

    if (interview.type === "client Interview" && (!schedule.startTime || !schedule.endTime || !schedule.date)) {
      setErrorMessage("Fill out all required fields.");
      resetInternal();
      return { status: 400 };
    }

    if (interview.type === "Internal Interview" && !interview.interviewers.length) {
      setErrorMessage("Please select at least one Interviewer.");
      resetInternal();
      return;
    }

    let newInterview = {
      ...interview,
      schedule: {
        meetingURL: schedule.meetingURL,
        date: service.getDate(schedule.date, schedule.startTime, timeZone),
        //startTime: service.getUTCdateTime(schedule.date, schedule.startTime),
        //endTime: service.getUTCdateTime(schedule.date, schedule.endTime),
        startTimeZ: service.getDateTime(schedule.date, schedule.startTime, timeZone),
        endTimeZ: service.getDateTime(schedule.date, schedule.endTime, timeZone),
        timeZone,
      },
      recruiter: { id: candidateInfo.recruiter.id },
    };

    try {
      setErrorMessage("");
      setIsLoading(true);
      const scheduleResponse = await axios.post(`${config.serverURL}/interviews`, newInterview, { headers });
      if (scheduleResponse?.status === 201) {
        const comment = `{"id": "${scheduleResponse?.data?.id}", "round": "${interview.roundType === 1 ? "Technical Round 1" : interview.roundType === 2 ? "Technical Round 2" : interview.roundType === 3 ? "HR Round" : "Interview scheduled"}", "date": "${moment(schedule.date).format("MM/DD/YYYY")}", "start": "${moment(schedule.startTime, "HH:mm:ss").format("hh:mm A")}", "end": "${moment(schedule.endTime, "HH:mm:ss").format("hh:mm A")}", "timezone": "${timeZone}", "comment": "${activityDetails ? activityDetails.comment : ""}"}`
        let actId = activityId || candActivity?.id || null;
        let update = activityDetails
          ? { ...activityDetails, comment }
          : {
            candidateId: parseInt(candidateInfo?.id),
            trackingStatus: "INTERVIEW",
            
            jobId: interview.jobOpening?.id || null,
            comment,
          };
        dispatch(setAddInterviewOpen(false));
        if (actId || update) {
          const activityResponse = actId
            ? await axios.put(`${config.serverURL}/activities/${actId}`, update, { headers })
            : await axios.post(`${config.serverURL}/activities`, update, { headers });

          if (activityResponse && activityResponse?.status === 200) {
            if (candActivity) setSuccessMessage("Interview has been successfully scheduled ");
            resetScheduler();
            message.success({
              content: "Interview has been successfully scheduled ",
              duration: 5,
              style: { marginTop: "5%" },
            });
            return { status: 200 }
          } else {
            return { status: activityResponse?.error?.status || 400 }
          }
        } else {
          resetScheduler();
          setSuccessMessage("Interview has been successfully scheduled ");
          if (props.loadInterviews) props.loadInterviews();
        }
      }
    } catch (err) {
      setIsLoading(false);
      if (err.response && err.response.status === 401) auth.logout();
      if (err.response && err.response.status === 409) setErrorMessage(err.response.data);
      if (err.response && err.response.status === 500) setErrorMessage("Error creating Interview, please try again or contact the support team if error persists.");
    }
  };

  const resetScheduler = () => {
    setInterview(initialInterviewState);
    setSchedule(initialScheduleState);
    setSelectedCandidateName("");
    setMeeting({});
    setIsLoading(false);
    setMeetingPlatform("");
  }

  const resetMeeting = () => {
    setMeeting({});
    setIsLoading(false);
    setMeetingPlatform("");
    setErrorMessage("");
  }

  const resetInternal = () => {
    setErrorMessage("");
    setIsLoading(false);
  }

  const handleInterviewChange = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case "candidate":
        if (value) {
          setInterview({
            ...interview,
            [name]: { ...interview.candidate, id: parseInt(value) },
          });
          const candidate = candidates.filter(
            (c) => c.id === parseInt(value)
          )[0];
          setSelectedCandidateName(candidate.name);
          getCandidatesInfo(value);
        } else {
          setInterview({
            ...interview,
            [name]: { ...interview.candidate, id: 0 },
          });
          setSelectedCandidateName("");
        }
        break;
      case "job":
        setInterview({
          ...interview,
          jobOpening: { ...interview.jobOpening, id: parseInt(value) },
        });
        setCandUpdate({
          ...candUpdate,
          clientName: `${jobs.filter((job) => job.id === parseInt(value))[0]?.clientName
            } (${jobs.filter((job) => job.id === parseInt(value))[0]?.location})`,
          manager: `${jobs.filter((job) => job.id === parseInt(value))[0]?.jobTitle
            } (Manager: ${jobs.filter((job) => job.id === parseInt(value))[0]?.manager
            })`,
        });
        break;
      case "roundType":
        setInterview({ ...interview, [name]: parseInt(value) });
        break;
      default:
        setInterview({ ...interview, [name]: value });
        break;
    }
  };

  const handleScheduleChange = (event) => {
    const { name, value } = event.target;
    setSchedule({ ...schedule, [name]: value });
    setInputErr({});
  };

  const handleCancel = () => {
    if (props.candidate) {
      setInterview({
        ...initialInterviewState,
        candidate: { id: props.candidate.id },
      });
    } else {
      setInterview(initialInterviewState);
      setSelectedCandidateName("");
    }
    setSchedule(initialScheduleState);
    setErrorMessage("");
    setInputErr({});
    setMeeting({});
    setMeetingPlatform("");
    setSuccessMessage("");
    dispatch(setAddInterviewOpen(false));
  };

  const getZoomRequestBody = () => {
    const candidate = candidates.filter((c) => c.id === interview.candidate.id || 0)[0]?.name;
    return getBody(candidate, interview.roundType, schedule);
  };

  const createZoomMeeting = (requestBody) => {
    createMeeting(requestBody, headers)
      .then((res) => {
        if (res) {
          setMeeting(res);
          const resUrl = {
            target: { name: "meetingURL", value: res.join_url },
          };
          handleScheduleChange(resUrl);
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const updateZoomMeeting = (requestBody) => {
    updateMeeting(requestBody, meeting.id, headers).catch((err) =>
      console.log(err)
    );
  };

  const handleZoomActions = () => {
    const requestBody = getZoomRequestBody();
    if (requestBody.err) {
      setInputErr({ ...inputErr, zoomURL: requestBody.err });
    } else {
      meeting.id
        ? updateZoomMeeting(requestBody, meeting.id, headers)
        : createZoomMeeting(requestBody, headers);
    }
  };

  const handlePlatformChange = (event) => {
    if (meeting.id && event.target.value !== "Zoom") {
      deleteMeeting(meeting.id, headers);
      setMeeting({});
      setSchedule({ ...schedule, meetingURL: "" });
    } else if (
      !meeting.id &&
      event.target.value === "Zoom" &&
      canAutoCreateZoom
    ) {
      handleZoomActions();
    } else {
      setSchedule({ ...schedule, meetingURL: "" });
    }
    setMeetingPlatform(event.target.value);
  };

  const multiSelectChange = (options) => {
    const temp = options.filter((o) => o.selected).map((o) => ({ id: o.id }));
    setInterview({ ...interview, interviewers: temp });
  };

  const getActivity = useCallback(async () => {
    try {
      const res = await getActivityId(headers, interview.candidate?.id, interview.jobOpening?.id);
      if (res.status === "SUCCESS") {
        setCandActivity(res.data);
        setErrorMessage("");
      } else {
        setErrorMessage(res.message);
      }
    } catch (error) {
      console.log(error);
    }
  }, [headers, interview.candidate?.id, interview.jobOpening?.id])

  //get selected candidates information 
  useEffect(() => {
    if (cand && !candidateInfo) {
      getCandidatesInfo(cand.id)
    };
  }, [getCandidatesInfo, cand, candidateInfo]);

  //populate form from props, modals
  useEffect(() => {
    if (cand && !props.type) {
      setInterview((i) => ({ ...i, candidate: { id: cand.id } }));
      setSelectedCandidateName(cand.name);
    }
  }, [cand, props.type]);

  //populate form from props (scheduling from activity component)
  useEffect(() => {
    if (props.job && cand && props.type !== "Internal Interview") {
      setInterview((interview) => ({
        ...interview,
        candidate: { id: parseInt(cand?.id) },
        jobOpening: { id: props.job?.id },
        client_name: props.job.client?.clientName,
        type: props.type
      }));
    } else if (props.type === "Internal Interview" && cand) {
      setInterview((interview) => ({
        ...interview,
        jobOpening: null,
        type: props.type,
        candidate: { id: parseInt(cand?.id) }
      }))
    }
  }, [props.job, cand, props.type]);

  useEffect(() => {
    if (interviewer) {
      setInterview((interview) => ({
        ...interview,
        type: "Internal Interview",
        interviewers: [{ id: interviewer.id }]
      }));
    }
  }, [interviewer]);

  //set zoom permissions
  useEffect(() => {
    if (
      interview.candidate.id &&
      interview.roundType &&
      interview.interviewers.length &&
      schedule.date &&
      schedule.startTime &&
      schedule.endTime
    ) {
      setCanAutoCreateZoom(true);
    }
  }, [interview, schedule]);

  //load data for selects, skip uneeded data when scheduling from activity component
  useEffect(() => {
    loadSubmittedCandidates(headers)
    loadInterviewers(headers);
    if (!props.activityForm) {
      loadCandidates(headers);
      loadJobs(headers);
      loadClients(headers);
    }
  }, [headers, props.activityForm]);

  //set job options for select based on client selection
  useEffect(() => {
    if (interview.client_name && !props.activityForm) {
      setFilteredJobs(
        jobs.filter((job) => job.client === interview.client_name)
      );
    }
  }, [interview.client_name, jobs, props.activityForm]);

  //validate start and end times, throw errors if invalid selection
  useEffect(() => {
    if (schedule.date && schedule.startTime) validateStartTime(schedule.date, schedule.startTime, setInputErr);
    if (schedule.date && schedule.endTime) validateEndTime(schedule.date, schedule.startTime, schedule.endTime, setEndTimeError);
  }, [schedule.startTime, schedule.date, schedule.endTime]);

  //update endtime based on start time
  useEffect(() => {
    if (schedule.startTime !== "") endTimeFill(schedule.startTime, setSchedule);
  }, [schedule.startTime]);

  //update interview type from parent component props
  useEffect(() => {
    if (!props.type) {
      if (interview.type === "Client Interview") {
        setInterview((i) => ({ ...i, interviewers: [], jobOpening: { id: 0 } }));
      }
      if (interview.type === "Internal Interview") {
        setInterview((i) => ({ ...i, jobOpening: null }));
      }
    }
  }, [interview.type, props.type]);

  //handle getting activity id for selected candidate and job --> throw errors if candidate not at correct stage for interview
  useEffect(() => {
    if (!props.activityForm && ((interview.type && interview.type !== "Internal Interview") && interview.candidate?.id && interview.jobOpening?.id)) {
      getActivity();
    }
  }, [interview.candidate?.id, interview.jobOpening?.id, interview.type, props.activityForm, getActivity])

  //handle cancel and submit from parent component
  useImperativeHandle(ref, () => ({
    cancel() {
      handleCancel();
    },
    submit(event, id, details) {
      return handleSubmitInterview(event, id, details);
    },
  }));


  return (
    <>
     
          {errorMessage && <Alert type="error" showIcon message={errorMessage} />}
      {successMessage && <Alert type="success" showIcon message={successMessage} />}
      {!props.activityForm ? (
        <Form
          onSubmit={handleSubmitInterview}
          cancel={handleCancel}
          formEnabled={true}
        >
          <SingleSelect
            label="Interview Type"
            name="type"
            value={interview.type}
            onChange={handleInterviewChange}
            options={[
              { id: "Internal Interview", name: "Internal Interview" },
              { id: "Client Interview", name: "Client Interview" },
            ]}
            required
            disabled={props.interviewer}
          />
          {interview.type === "Client Interview" && (
            <SearchSelect
              label="Candidate"
              name="candidate"
              value={selectedCandidateName}
              handleSelect={handleInterviewChange}
              options={submitCandidates.map((candidate) => ({
                id: candidate.id,
                name: candidate.name,
                value: candidate.name,
              }))}
              required
            />
          )}
          {interview.type === "Internal Interview" && (
            <SearchSelect
              label="Candidate"
              name="candidate"
              value={selectedCandidateName}
              handleSelect={handleInterviewChange}
              options={candidates
                .filter(
                  (candidate) =>
                    candidate.status === "Active" ||
                    candidate.status === "Ready to be Marketed"
                )
                .map((candidate) => ({
                  id: candidate.id,
                  name: candidate.name,
                  value: candidate.name,
                }))}
              required
            />
          )}
          {interview.type === "Internal Interview" && (
            <div className="interviewer-select-container">
              <MultiSelect
                label="Interviewers"
                required={isInterviewerSelected}
                isMulti
                options={interviewers.map((i) => ({
                  id: i.id,
                  value: i.fullName,
                  label: i.fullName,
                  selected: interview.interviewers
                    ?.map((int) => int.id)
                    .includes(i.id),
                }))}
                handleChange={multiSelectChange}
                maxSelections={4}
              />
              {interview.interviewers.length >= 4 && (
                <p className="info-label">
                  (Reached Max: 4 Interviewers per Interview)
                </p>
              )}
            </div>
          )}
          {interview.type === "Client Interview" && (
                        <SingleSelect
              label="Client"
              name="client_name"
              value={interview.client_name}
              onChange={handleInterviewChange}
              options={clients.map((client) => ({
                id: client.id,
                value: client.clientName,
                name: client.clientName,
              }))}
              required
            />
          )}
          {interview.type === "Client Interview" && (
            <SingleSelect
              label="Job Opening"
              required
              name="job"
              value={interview.jobOpening?.id}
              onChange={handleInterviewChange}
              options={filteredJobs.map((job) => ({
                id: job.id,
                name: job.jobTitle,
              }))}
              disabled={!interview.client_name}
              placeholder={
                !interview.client_name ? "Select client first..." : "Select Job"
              }
            />
          )}
          {interview.type === "Client Interview" && (
                        <SingleSelect
              label="Round Type"
              name="roundType"
              value={interview.roundType}
              onChange={handleInterviewChange}
              options={options}
            />
          )}
          {interview.type === "Internal Interview" && (
            <SingleSelect
              label="Round Type"
              name="roundType"
              value={interview.roundType}
              onChange={handleInterviewChange}
              options={options}
              required
            />
          )}
          <DateInput
            label="Date"
            name="date"
            onChange={handleScheduleChange}
            value={schedule.date || ""}
            min={new Date().toLocaleDateString("en-ca")}
            required
            errMssg={inputErr.date}
          />
          <div className="times">
            <TimeInput
              id="startTime"
              label="Start Time"
              required
              name="startTime"
              onChange={handleScheduleChange}
              value={schedule.startTime || ""}
              errMssg={inputErr.startTime}
              info={`Timezone: ${timeZone}`}
            />
            <TimeInput
              id="endTime"
              label="End Time"
              required
              name="endTime"
              onChange={handleScheduleChange}
              value={schedule.endTime}
              errMssg={endTimeError}
            />
          </div>
          {interview.type === "Internal Interview" && (
            <div className="url-input">
              <SingleSelect
                label="Meeting URL"
                required
                name="meetingPlatform"
                value={meetingPlatform}
                onChange={handlePlatformChange}
                options={[
                  { id: 1, value: "Teams", name: "Teams" },
                  { id: 2, value: "Skype", name: "Skype" },
                  { id: 3, value: "Zoom", name: "Zoom" },
                  { id: 4, value: "Other", name: "Other" },
                ]}
                placeholder="Select Platform..."
              />
              {meetingPlatform === "Zoom" &&
                interview.type === "Internal Interview" ? (
                <Input
                  type="text"
                  name="meetingURL"
                  onChange={handleScheduleChange}
                  value={schedule.meetingURL || ""}
                  pattern="^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&%'\(\)\*\+,;=.]+$"
                  disabled={meeting.id}
                  errMssg={inputErr.zoomURL}
                  required
                  hasIconBtn={true}
                  btnId={meeting.id}
                  btnDisabled={!canAutoCreateZoom}
                  btnOnClick={handleZoomActions}
                  inlineIcon={<CalendarFilled />}
                />
              ) : meetingPlatform !== "" ? (
                <Input
                  type="text"
                  name="meetingURL"
                  onChange={handleScheduleChange}
                  value={schedule.meetingURL || ""}
                  pattern="^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&%'\(\)\*\+,;=.]+$"
                />
              ) : null}
            </div>
          )}

          {interview.type === "Client Interview" && (
            <Input
              type="text"
              label="Meeting URL"
              name="meetingURL"
              onChange={handleScheduleChange}
              value={schedule.meetingURL || ""}
              pattern="^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&%'\(\)\*\+,;=.]+$"
            />
          )}
          {isLoading && (
            <div className="progress-circle-right">
              <Spin />
            </div>
          )}
        </Form>
      ) : (
        <>
                          {/* {interview.type === "Client Interview" && (
            <SingleSelect
              label="Interview Type"
              name="type"
              value={interview.type}
              onChange={handleInterviewChange}
              disabled={props.type}
              options={[
                { id: "Internal Interview", name: "Internal Interview" },
                { id: "Client Interview", name: "Client Interview" },
              ]}
              required
              className="small-form"
            />
          )} */}
          {interview.type === "Internal Interview" && (
            <div style={{marginTop:"-2px"}}>
              <MultiSelect
                label="Interviewers"
                required
                isMulti
                options={interviewers.map((i) => ({
                  id: i.id,
                  value: i.fullName,
                  label: i.fullName,
                  selected: interview.interviewers
                    ?.map((int) => int.id)
                    .includes(i.id),
                }))}
                handleChange={multiSelectChange}
                maxSelections={4}
              />
              {interview.interviewers.length >= 4 && (
                <p className="info-label">
                  (Reached Max: 4 Interviewers per Interview)
                </p>
              )}
            </div>
          )} 
          <div style={{marginTop:"3px"}}>
                    <SingleSelect
              label="Round Type"
              name="roundType"
              value={interview.roundType}
              onChange={handleInterviewChange}
              options={options}
                          />
                          </div>
                    <PastDate
            label="Date"
            name="date"
            onChange={handleScheduleChange}
            value={schedule.date || ""}
            min={new Date(props.submittedOn).toLocaleDateString("en-ca")}
            required
            errMssg={inputErr.date}
            className="small-form"
          />
          <TimeInput
            id="startTime"
            label="Start Time"
            required
            name="startTime"
            onChange={handleScheduleChange}
            value={schedule.startTime || ""}
            info={`Timezone: ${timeZone}`}
            className="small-form"
          />
                    <div style={{marginTop:"-2px"}}>

                          <TimeInput
            id="endTime"
            label="End Time"
            required
            name="endTime"
            onChange={handleScheduleChange}
            value={schedule.endTime}
            className="small-form"
          />
          </div>
          <div>
          {interview.type === "Internal Interview" && (

          <SingleSelect
            label="Meeting URL"
            name="meetingPlatform"
            required
            value={meetingPlatform}
            onChange={handlePlatformChange}
            options={[
              { id: 1, value: "Teams", name: "Teams" },
              { id: 2, value: "Skype", name: "Skype" },
              { id: 3, value: "Zoom", name: "Zoom" },
              { id: 4, value: "Other", name: "Other" },
            ]}
            placeholder="Select Platform..."
            className="small-form"
          />
          )}
          </div>
          <div>
          {interview.type === "Client Interview" && (

<SingleSelect
  label="Meeting URL"
  name="meetingPlatform"
  value={meetingPlatform}
  onChange={handlePlatformChange}
  options={[
    { id: 1, value: "Teams", name: "Teams" },
    { id: 2, value: "Skype", name: "Skype" },
    { id: 3, value: "Zoom", name: "Zoom" },
    { id: 4, value: "Other", name: "Other" },
  ]}
  placeholder="Select Platform..."
  className="small-form"
/>
)}
</div>
                    {meetingPlatform && (
            <>
              {meetingPlatform === "Zoom" &&
                interview.type === "Internal Interview" ? (
                <Input
                  type="text"
                  name="meetingURL"
                  onChange={handleScheduleChange}
                  value={schedule.meetingURL || ""}
                  // pattern="^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&%'\(\)\*\+,;=.]+$"
                  disabled={meeting.id}
                  errMssg={inputErr.zoomURL}
                  hasIconBtn={true}
                  btnId={meeting.id}
                  btnDisabled={!canAutoCreateZoom}
                  btnOnClick={handleZoomActions}
                  inlineIcon={<CalendarFilled />}
                  className="small-form"
                />
              ) : (
                <Input
                  type="text"
                  label="Meeting URL"
                  name="meetingURL"
                  onChange={handleScheduleChange}
                  value={schedule.meetingURL || ""}
                  // pattern="^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&%'\(\)\*\+,;=.]+$"
                  className="smallest-form"
                />
              )}
            </>
                      )}
        </>
      )}
       <IdleTimeOutHandler 
    onActive={()=>{setIsActive(true)}} 
    onIdle={()=>{setIsActive(false)}}
    onLogout={()=>{setLogout(true)}}
    />
    </>
    
      );
});
