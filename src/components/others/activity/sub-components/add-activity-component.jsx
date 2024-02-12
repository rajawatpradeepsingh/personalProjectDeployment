import React, { useState, useCallback, useEffect, useRef } from "react";
import { config } from "../../../../config";
import axios from "axios";
import auth from "../../../../utils/AuthService";
import { ScheduleInterviewForm } from "../../../entity/interview/int_ui_helpers/form/schedule-interview-form";
import SingleSelect from '../../../common/select/selects.component';
import TextBlock from '../../../common/textareas/textareas.component';
import { message } from "antd";
import Input from '../../../common/input/inputs.component';
import Form from "../../../common/form/form.component";
export const AddNewActivity = (props) => {
  const [headers] = useState(auth.getHeaders());
  const newActivityInitialState = {
    jobId: null,
    submittedOn: "",
    comment: "",
    client: "",
    clientId: "",
    clientOptions: ""
  };
  const [newActivityClient, setNewActivityClient] = useState(null);
  const [newActivity, setNewActivity] = useState(newActivityInitialState);
  const submitBtnRef = useRef(null);
  const [clients, setClients] = useState([]);

  const handleNewActivityChange = (event) => {
    const { name, value } = event.target;
    if (name === "clientId") {
      setNewActivityClient(value === "Internal" ? value : parseInt(value));
    } else if (name === 'jobId') {
      setNewActivity({ ...newActivity, jobId: parseInt(value) });
    } else {
      setNewActivity({ ...newActivity, [name]: value });
    }
  };

  const loadClients = useCallback(() => {
    axios
      .get(`${config.serverURL}/clients`, { headers })
      .then((response) => {
        if (response.data) {
          setClients(response.data);
        }
      })
      .catch((err) => console.log(err));
  }, [headers]);

  useEffect(() => {
    loadClients();
  }, [loadClients]);

  const handleCancel = () => {
    setNewActivity(newActivityInitialState);
    setNewActivityClient(null);
    props.cancelAddActivity();
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (newActivity.jobId && props.jobsAlreadySubmitted.includes(newActivity.jobId)) {
      message.warning({ content: 'Candidate has already been submitted to this job opening.', style: { marginTop: '33%' }, duration: 5 });
      return;
    }
    if (!newActivity.jobId && newActivityClient !== "Internal") {
      message.warning({ content: 'Select a job opening before submitting.', style: { marginTop: '33%' }, duration: 5 });
      return;
    };
    const data = {
      candidateId: parseInt(props.candidateId),
      trackingStatus: newActivityClient === "Internal" ? "INTERVIEW" : "SUBMISSION",
      ...newActivity,
    };
    try {
      if (newActivity.jobId === null) {
        const intRes = await submitBtnRef.current.submit(event, null, data);
        if (intRes?.status === 200) {
          setNewActivity(newActivityInitialState);
          setNewActivityClient(null);
          props.submitSuccess();
        }
      } else {
        const response = await axios.post(`${config.serverURL}/activities`, data, { headers });
        if (response.status === 200) {
          setNewActivity(newActivityInitialState);
          setNewActivityClient(null);
          props.submitSuccess();
        }
      }
    } catch (error) {
      console.log(error);
      message.error(`${error.response ? `Error: ${error.response?.message}` : 'An error occured while submitting data'}`);
    }
  };

  return (
    <div className="activity-form">
      <Form
          onSubmit={handleSubmit}
          cancel={handleCancel}
          formEnabled={true}
        >
      <SingleSelect
        name="clientId"
        required
        label="Client || Internal Interview"
        value={newActivityClient || ""}
        onChange={handleNewActivityChange}
        options={[
          { id: 0, value: "Internal", name: "Internal Interview" },
        ].concat(
          clients.map((client) => {
            let id = client.id;
            return {
              id: id,
              name: `${client.clientName} (${client.address?.city || ""})`,
            };
          })
        )}
      />
      {newActivityClient === "Internal" && (
        <div style={{ width: "100%", display: "flex", flexWrap: "wrap" }}>
          <ScheduleInterviewForm
            ref={submitBtnRef}
            activityForm={true}
            candidate={{ id: props.candidateId }}
            type={"Internal Interview"}
          />
        </div>
      )}
      {newActivityClient && newActivityClient !== "Internal" && (
        <SingleSelect
          name="jobId"
          required
          label="Job Opening"
          value={newActivity.jobId || ""}
          onChange={handleNewActivityChange}
          options={props.jobs
            .filter(
              (job) =>
                job.status === "Active" && job.client.id === newActivityClient
            )
            .map((job) => ({
              id: job.id,
              value: job.id,
              name: `DH0000${job.id} /${job.jobTitle} /${job.hiringManager}`,
            }))}
        />
      )}
      {newActivityClient && newActivityClient !== "Internal" && (
               <div style={{marginTop:"-3px"}}>

        <Input
          name="submittedOn"
          label="Submitted On"
          required
          type="date"
          max="2999-12-31"
          onChange={(event) => handleNewActivityChange(event, "validateDob")}
          value={newActivity.submittedOn || ""}
        />
        </div>
      )}
      <TextBlock
        label="Comment"
        name="comment"
        value={newActivity.comment}
        onChange={handleNewActivityChange}
        maxLength={3000}
        charCount={`Remaining characters: ${newActivity?.comment ? 3000 - newActivity?.comment?.length : 3000
          } of 3000`}
      />
      
      </Form>
    </div>
  );
}