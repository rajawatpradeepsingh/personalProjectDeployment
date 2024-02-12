import { useEffect, useState } from "react";
import Input from "../../../../common/input/inputs.component";
import Button from "../../../../common/button/button.component";
import { DateInput } from "../../../../common/input/input-date/DateInput";
import * as service from "../../../../../utils/service";
import { TimeInput } from "../../../../common/input/input-time/TimeInput";
import { CloseOutlined } from "@ant-design/icons";

export const EditZoomMeeting = (props) => {
  const [meeting, setMeeting] = useState({});
  const [patch, setPatch] = useState({});
  const [startDate, setStartDate] = useState();
  const [startTime, setStartTime] = useState();
  const timezone = service.currentTZ(); // local timezone

  useEffect(() => {
    setMeeting(props.meeting);
    setStartDate(service.getLocalDatefromUTC(props.meeting.start_time));
    setStartTime(service.getLocalTimefromUTC(props.meeting.start_time));
  }, [props.meeting]);

  useEffect(() => {
    setStartDate(service.getLocalDatefromUTC(meeting.start_time));
    setStartTime(service.getLocalTimefromUTC(meeting.start_time));
  }, [meeting.start_time]);

  const submitModal = (e) => {
    e.preventDefault();
    props.handleSubmitForm(meeting.id, patch);
    cancelModal();
  };

  const cancelModal = () => {
    setPatch({});
    setMeeting({});
    props.setShowModal(false);
  };

  const handleChange = (e) => {
    setMeeting({ ...meeting, [e.target.name]: e.target.value });
    setPatch({ ...patch, [e.target.name]: e.target.value });
  };

  const handleChangeDatetime = (e) => {
    const newDatetime = {
      date: startDate,
      startTime: startTime,
      [e.target.name]: e.target.value,
    };
    const updDate = service.getUTCData(newDatetime.date, newDatetime.startTime);
    const updTime = service.getUTCTime(newDatetime.date, newDatetime.startTime);
    setMeeting({ ...meeting, start_time: `${updDate}T${updTime}Z` });
    setPatch({ ...patch, start_time: `${updDate}T${updTime}Z` });
  };

  return (
    <>
      {props.showModal && (
        <div className="modal-container">
          <div className="edit-modal-comp">
            <button onClick={cancelModal} className="modal-close-btn">
              <CloseOutlined className="close-svg" />
            </button>
            <div className="edit-modal-header">
              <h2 className="edit-modal-heading">Zoom Meeting Details</h2>
            </div>
            <form className="modal-form">
              <Input
                type="text"
                label="Topic"
                name="topic"
                id="topic"
                value={meeting.topic || ""}
                disabled
              ></Input>
              <Input
                type="text"
                label="Agenda"
                name="topic"
                id="topic"
                value={meeting.agenda || ""}
                disabled
              ></Input>

              <DateInput
                label="Start date"
                required
                id="date"
                className="long-size"
                name="date"
                value={startDate}
                onChange={handleChangeDatetime}
              ></DateInput>
              <TimeInput
                label="Start time"
                required
                id="startTime"
                className="long-size"
                name="startTime"
                value={startTime}
                onChange={handleChangeDatetime}
              ></TimeInput>

              <Input
                type="text"
                label="Time zone"
                name="timezone"
                id="timezone"
                value={timezone || ""}
                disabled
              ></Input>
              <Input
                type="text"
                label="Duration (minutes)"
                name="duration"
                id="duration"
                value={meeting.duration || ""}
                onChange={handleChange}
              ></Input>

              <div className="form-btns">
                <Button
                  type="submit"
                  className="outline submit"
                  handleClick={submitModal}
                >
                  Save
                </Button>
                <Button
                  type="cancel"
                  className="outline reset"
                  handleClick={cancelModal}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
