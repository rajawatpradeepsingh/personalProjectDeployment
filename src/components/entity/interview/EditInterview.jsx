import React, { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { config } from "../../../config";
import axios from "axios";
import { updateSelectedInterview } from "../../../API/interviews/interview-apis";
import { useSelector, useDispatch, } from "react-redux";
import { useMemo } from "react";


import { setIsAuth } from "../../../Redux/appSlice";
import { setInterview, setViewSchedule } from "../../../Redux/interviewSlice";
import { setViewFeedback } from "../../../Redux/interviewSlice";
import auth from "../../../utils/AuthService";
import * as service from "../../../utils/service";
import { updateMeeting, getBody, parseUrlForID, } from "./int_ui_helpers/zoom/zoomService";
import Content from "../../container/content-container/content-container.component";
import Input from "../../common/input/inputs.component";
import SingleSelect from "../../common/select/selects.component";
import MultiSelect from "../../common/select/multiSelect/multiSelect.component";
import { DateInput } from "../../common/input/input-date/DateInput";
import { TimeInput } from "../../common/input/input-time/TimeInput";
import TextBlock from "../../common/textareas/textareas.component";
import Button from "../../common/button/button.component";
import Breadcrumbs from "../../common/breadcrumbs/breadcrumbs.component";
import Form from "../../common/form/form.component";
import SwitchComponent from "../../common/switch/switch.component";
import { message, Alert } from "antd";
import { PageContainer } from "../../container/page-container/PageContainer";
import { PageHeader } from "../../container/page-header/PageHeader";
import { TabsComponent } from "../../common/tabs/TabsComponent";
import { CalendarFilled, CommentOutlined } from "@ant-design/icons";
import IdleTimeOutHandler from "../../ui/Dashboard/IdleTimeOutHandler";
import "antd/dist/antd.css";
import "./interview.css";

const EditInterview = () => {
  const [headers] = useState(auth.getHeaders());
  const history = useHistory();
 
  const [userIsRecruiter] = useState(auth.hasRecruiterRole());
  const timeZone = service.currentTZ();
  const [selectedInterview, setSelectedInterview] = useState([]);
  const [newInterview, setNewInterview] = useState({ timeZone });
  const [interviewerOptions, setInterviewerOptions] = useState([]);
  const [interviewers, setInterviewers] = useState([]);
  const [jobOptions, setJobOptions] = useState([]);
  const [currentPage, setCurrentPage] = useState("1");
  const [scheduleFormEnabled, setScheduleFormEnabled] = useState(false);
  const [feedbackFormEnabled, setFeedbackFormEnabled] = useState(false);
  const [interviewTimePassed, setInterviewTimePassed] = useState(false);
  const [readOnlyPermission, setReadOnlyPermission] = useState(false);
  const [zoomMeetingId, setZoomMeetingId] = useState("");
  const [sendEmail, setSendEmail] = useState(false);
  const [startTimeError, setStartTimeError] = useState("");
  const [endTimeError, setEndTimeError] = useState("");
  const dispatch = useDispatch();
  const { interview, viewFeedback } = useSelector((state) => state.interview);
  const { viewSchedule } = useSelector((state) => state.interview);
  const[isActive,setIsActive]=useState(true);
  const[isLogout,setLogout]=useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const user = useMemo(() => auth.getUserInfo(), []);
  const [roleData,setRoleData]=useState(user.roles[0]);
  useEffect(() => {
    if (auth.hasAdminRole()) setIsAdmin(true);
  }, []);


  useEffect(() => setSelectedInterview(interview), [interview]);

  //set what page of the form to land on
  useEffect(() => {
    if (viewSchedule) setCurrentPage("1");
  }, [viewSchedule]);

  useEffect(() => {
    if (viewFeedback) setCurrentPage("2");
  }, [viewFeedback]);

  useEffect(() => {
    setInterviewTimePassed(new Date(`${interview?.schedule?.date}`) < new Date());
  }, [interview?.schedule?.date]);

  useEffect(() => {
    if (userIsRecruiter && user.id !== interview?.candidate?.recruiter?.id)
      setReadOnlyPermission(true);
  }, [user, userIsRecruiter, interview?.candidate?.recruiter?.id]);

  useEffect(() => {
    if (interview?.schedule?.meetingURL)
      setZoomMeetingId(parseUrlForID(interview.schedule.meetingURL));
  }, [interview?.schedule?.meetingURL]);

  //navigate through form pages
  const setNavPage = (key) => {
    setCurrentPage(key);
    dispatch(setViewSchedule(false));
    dispatch(setViewFeedback(false));
  };

  const logout = () => {
    dispatch(setIsAuth(false));
    auth.logout();
  };

  const getInterviewers = useCallback(() => {
    axios
      .get(`${config.serverURL}/interviewer?dropdownFilter=true`, { headers })
      .then((res) => {
        if (res.status === 200) {
          setInterviewerOptions(
            res.data.map((item) => ({
              id: item.id,
              name: `${item.firstName} ${item.lastName}`,
            }))
          );
        }
      })
      .catch((err) => service.errLogout(err));
  }, [headers]);

  const getJobs = useCallback(() => {
    axios
      .get(`${config.serverURL}/jobopenings?dropdownFilter=true`, { headers })
      .then((res) => {
        if (res.status === 200) {
          setJobOptions(
            res.data.map((item) => ({
              id: item.id,
              value: item.id,
              name: `${item.jobTitle} (${item.client.clientName})`,
            }))
          );
        }
      })
      .catch((err) => service.errLogout(err));
  }, [headers]);

  useEffect(() => {
    getInterviewers();
    getJobs();
  }, [getInterviewers, getJobs]);

  useEffect(() => {
    if (interviewerOptions.length) {
      setInterviewers(
        interviewerOptions.map((i) => ({
          id: i.id,
          value: i.name,
          label: i.name,
          selected: selectedInterview.interviewers
            ?.map((int) => int.id)
            .includes(i.id),
          isDeleted: false,
        }))
      );
    }
  }, [interviewerOptions, selectedInterview.interviewers]);

  const enableScheduleForm = () => {
    setScheduleFormEnabled(true);
  };

  const enableFeedbackForm = () => {
    setFeedbackFormEnabled(true);
  };

  const handleInterviewChange = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case "jobOpening":
        const jobOpening = { id: +value }
        setSelectedInterview({ ...selectedInterview, jobOpening });
        setNewInterview({ ...newInterview, jobOpening });
        break;
      case "roundType":
        setSelectedInterview({ ...selectedInterview, [name]: +value });
        setNewInterview({ ...newInterview, [name]: +value });
        break;
      case "interviewLink":
        setSelectedInterview({ ...selectedInterview, [name]: value });
        setNewInterview({ ...newInterview, [name]: value });
        break;
      case "date":
        const newDate = {
          [name]: value,
          "startTimeZ": service.getDateTime(value, service.getCurrentTime(true)),
          "endTimeZ": service.getDateTime(value, service.getCurrentTime(true)),
        }
        setSelectedInterview({ ...selectedInterview, schedule: { ...selectedInterview.schedule, ...newDate } });
        setNewInterview({ ...newInterview, ...newDate });
        break;
      case "startTimeZ":
      case "endTimeZ":
        const newTime = { [name]: service.getDateTime(selectedInterview?.schedule?.date, value, timeZone) }
        setSelectedInterview({ ...selectedInterview, schedule: { ...selectedInterview.schedule, ...newTime } });
        setNewInterview({ ...newInterview, ...newTime });
        break;
      case "decision":
        setSelectedInterview({ ...selectedInterview, schedule: { ...selectedInterview.schedule, [name]: +value }, });
        setNewInterview({ ...newInterview, [name]: +value });
        break;
      default:
        if (name === undefined) return;
        setSelectedInterview({ ...selectedInterview, schedule: { ...selectedInterview.schedule, [name]: value }, });
        setNewInterview({ ...newInterview, [name]: value, });
    }
  };

  const handleInterviewerChange = (options) => {
    const updList = options
      .filter((o) => o.selected)
      .map((o) => ({ id: o.id }));
    setSelectedInterview({ ...selectedInterview, interviewers: updList });
    setNewInterview({ ...newInterview, interviewers: updList });
  };

  const handleSwitch = (value) => {
    setSendEmail(value);
  };

  const submitUpdate = async (event) => {
    event.preventDefault();
    const messgKey = "isLoading";
    if (startTimeError || endTimeError) return;
    if (!selectedInterview.schedule.decision) updateZoomMeeting();
    message.loading({
      content: "Submitting updates...",
      messgKey,
      style: { marginTop: "5%" },
    });

    // for BE always pass decision for email service
    const currentDecision =
      !selectedInterview.schedule.decision ||
        selectedInterview.schedule.decision === "NULL"
        ? 0
        : selectedInterview.schedule?.decision === "SELECTED"
          ? 1
          : selectedInterview.schedule?.decision === "TENTATIVE"
            ? 2
            : selectedInterview.schedule?.decision === "REJECTED"
              ? 3
              : selectedInterview.schedule.decision;

    const interviewUpdates = {
      ...newInterview,
      decision: currentDecision,
    };

    const response = await updateSelectedInterview(
      headers,
      +selectedInterview.id,
      sendEmail,
      interviewUpdates
    );
    if (response.statusCode === 200) {
      message.success({
        content: "Interview updated",
        messgKey,
        duration: 5,
        style: { marginTop: "5%" },
      });
      dispatch(setInterview(response.data));
      setScheduleFormEnabled(false);
      setFeedbackFormEnabled(false);
    }
    if (response.statusCode === 401) logout();
    if (response.statusCode === 400 || response.statusCode === 500)
      message.error({
        content: `An error occurred while saving changes (${response.statusCode})`,
        messgKey,
        duration: 10,
      });
  };

  const updateZoomMeeting = () => {
    if (zoomMeetingId) {
      const candidate = `${selectedInterview.candidate.firstName} ${selectedInterview.candidate.lastName}`;
      const intrv = selectedInterview;
      const requestBody = getBody(candidate, intrv.roundType, intrv.schedule);
      updateMeeting(requestBody, zoomMeetingId, headers).catch((err) =>
        console.log(err)
      );
    }
  };

  const resetForm = () => {
    setSelectedInterview(interview);
    setNewInterview({ timeZone });
    setScheduleFormEnabled(false);
    setFeedbackFormEnabled(false);
    setStartTimeError("");
    setEndTimeError("");
  };

  const closeForm = useCallback(() => {
    dispatch(setViewFeedback(false));
    dispatch(setViewSchedule(false));
    history.push("/viewinterviews");
  }, [dispatch, history]);

  useEffect(() => {
    const validateTime = () => {
      const date = new Date();
      const start = new Date(selectedInterview.schedule?.startTimeZ);
      const end = new Date(selectedInterview.schedule?.endTimeZ);

      setStartTimeError(start < date ? "Interview can't be set for passed date/time" : "");
      setEndTimeError(start >= end ? "End time must be greater than start time" : "");
    };

    if (scheduleFormEnabled) {
      if (
        (selectedInterview.schedule?.date && selectedInterview.schedule?.startTimeZ) ||
        (selectedInterview.schedule?.date && selectedInterview.schedule?.endTimeZ)
      )
        validateTime();
    }
  }, [
    selectedInterview.schedule?.startTimeZ,
    selectedInterview.schedule?.endTimeZ,
    selectedInterview.schedule?.date,
    scheduleFormEnabled,
  ]);

  useEffect(() => {
    if (!interview.id) closeForm();
  }, [interview, closeForm]);

  return (
    <PageContainer>
      <PageHeader
        breadcrumbs={
          <Breadcrumbs
            className="header"
            crumbs={[
              { id: 0, text: "Interviews", onClick: () => closeForm() },
              {
                id: 1,
                text: `Interview: ${interview?.candidate?.firstName} ${interview?.candidate?.lastName}`,
                lastCrumb: true,
              },
            ]}
          />
        }
      />
       <IdleTimeOutHandler 
    onActive={()=>{setIsActive(true)}} 
    onIdle={()=>{setIsActive(false)}}
    onLogout={()=>{setLogout(true)}}
    />
      <Content>
        <TabsComponent
          activeKey={currentPage}
          setActiveKey={setNavPage}
          position="left"
          items={[
            {
              key: "1",
              label: (
                <span>
                  {" "}
                  <CalendarFilled /> Schedule
                </span>
              ),
              children: (
                <Form
                  onSubmit={submitUpdate}
                  cancel={resetForm}
                  formEnabled={scheduleFormEnabled}
                >
                  <SingleSelect
                    label="Round"
                    name="roundType"
                    value={
                      typeof selectedInterview?.roundType !== "number"
                        ? selectedInterview?.roundType === "TECHNICAL_ROUND_1"
                          ? 1
                          : selectedInterview?.roundType === "TECHNICAL_ROUND_2"
                            ? 2
                            : 3
                        : selectedInterview?.roundType
                    }
                    options={[
                      { id: 1, name: "Technical Round 1" },
                      { id: 2, name: "Technical Round 2" },
                      { id: 3, name: "HR Round" },
                    ]}
                    onChange={handleInterviewChange}
                    disabled={!scheduleFormEnabled}
                    required
                  />
                  {selectedInterview?.jobOpening && (
                    <SingleSelect
                      label="Job Opening"
                      name="jobOpening"
                      value={selectedInterview?.jobOpening.id || ""}
                      options={jobOptions}
                      onChange={handleInterviewChange}
                      disabled={!scheduleFormEnabled}
                      required
                    />
                  )}
                  {!selectedInterview?.jobOpening && (
                    <MultiSelect
                      className={`large ${!scheduleFormEnabled ? "multi-select-disabled" : ""
                        }`}
                      label="Interviewer(s)"
                      isMulti
                      options={interviewers}
                      handleChange={handleInterviewerChange}
                      disabled={!scheduleFormEnabled}
                      maxSelections={4}
                    />
                  )}

                  <Input
                    label="Meeting Link"
                    type="text"
                    name="meetingURL"
                    value={selectedInterview?.schedule?.meetingURL}
                    disabled={!scheduleFormEnabled}
                    onChange={handleInterviewChange}
                  />
                  <DateInput
                    label="Date"
                    name="date"
                    id="date"
                    value={selectedInterview?.schedule?.date}
                    onChange={handleInterviewChange}
                    disabled={!scheduleFormEnabled}
                    required
                    min={new Date().toLocaleDateString("en-ca")}
                  />
                  <TimeInput
                    label="Start Time"
                    required
                    name="startTimeZ"
                    id="startTimeZ"
                    value={service.getLocalTimeFromDatetime(
                      selectedInterview?.schedule?.startTimeZ,
                      true
                    )}
                    disabled={!scheduleFormEnabled}
                    onChange={handleInterviewChange}
                    info={`Timezone: ${timeZone}`}
                    errMssg={startTimeError}
                  />
                  <TimeInput
                    label="End Time"
                    name="endTimeZ"
                    id="endTimeZ"
                    required
                    value={service.getLocalTimeFromDatetime(
                      selectedInterview?.schedule?.endTimeZ,
                      true
                    )}
                    disabled={!scheduleFormEnabled}
                    onChange={handleInterviewChange}
                    errMssg={endTimeError}
                  />

                  <div className="update-actions-container">
                    {!interviewTimePassed &&
                      !scheduleFormEnabled &&
                      !readOnlyPermission && (
                        <Button
                          type="button"
                          className="btn main outlined"
                          handleClick={enableScheduleForm}
                        >
                          Update Schedule
                        </Button>
                      )}
                  </div>
                </Form>
              ),
            },
            {
              key: "2",
              label: (
                <span>
                  <CommentOutlined /> Feedback & Decision
                </span>
              ),
              children: (
                <Form
                  onSubmit={submitUpdate}
                  cancel={resetForm}
                  formEnabled={feedbackFormEnabled}
                >
                  <SingleSelect
                    label="Decision"
                    name="decision"
                    value={
                      typeof selectedInterview?.schedule?.decision !== "number"
                        ? selectedInterview?.schedule?.decision === "SELECTED"
                          ? 1
                          : selectedInterview?.schedule?.decision === "TENTATIVE"
                            ? 2
                            : selectedInterview?.schedule?.decision === "REJECTED"
                              ? 3
                              : ""
                        : selectedInterview.schedule?.decision
                    }
                    options={[
                      { id: 1, name: "Selected" },
                      { id: 2, name: "Tentative" },
                      { id: 3, name: "Rejected" },
                    ]}
                    onChange={handleInterviewChange}
                    disabled={!feedbackFormEnabled}
                  />
                  <Input
                    label="Link to Recording"
                    type="text"
                    name="interviewLink"
                    value={selectedInterview?.interviewLink || ""}
                    onChange={handleInterviewChange}
                    disabled={!feedbackFormEnabled}
                    className="large"
                  />
                  <TextBlock
                    label="Feedback"
                    name="feedback"
                    value={selectedInterview?.schedule?.feedback || ""}
                    onChange={handleInterviewChange}
                    maxLength="1024"
                    charCount={`Remaining characters: ${selectedInterview?.schedule?.feedback
                      ? 1024 - selectedInterview?.schedule?.feedback.length
                      : 1024
                      } of 1024`}
                    disabled={!feedbackFormEnabled}
                  />
                  {feedbackFormEnabled && (
                    <SwitchComponent
                      label="Inform Candidate by Email"
                      handleSwitch={handleSwitch}
                    />
                  )}
                  <div className="update-actions-container">
                    {!interviewTimePassed && !readOnlyPermission && (
                      <Alert
                        message="Come back after interview has passed to leave feedback and update decision."
                        type="info"
                        showIcon
                      />
                    )}
                  </div>
                  <div>
                    {interviewTimePassed &&
                      !feedbackFormEnabled &&
                      !readOnlyPermission && (
                        <Button
                          type="button"
                          className="btn main outlined"
                          handleClick={enableFeedbackForm}
                        >
                          Update Feedback
                        </Button>
                      )}
                  </div>
                </Form>
              ),
            },
          ]}
        />
      </Content>
    </PageContainer>
  );
};

export default EditInterview;
