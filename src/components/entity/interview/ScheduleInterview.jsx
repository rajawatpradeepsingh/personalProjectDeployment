import React, { useRef } from "react";
import { useSelector } from "react-redux";
import LargeModal from "../../modal/large-modal/large-modal.component";
import { ScheduleInterviewForm } from "./int_ui_helpers/form/schedule-interview-form";
import "./interview.css";

const ScheduleInterview = (props) => {
  const cancelBtn = useRef(null);
  const { addInterviewOpen } = useSelector((state) => state.interview);

  return (
    <LargeModal
      open={addInterviewOpen}
      close={() => cancelBtn.current.cancel()}
      header={{
        text: `Schedule Interview`,
      }}
    >
      <ScheduleInterviewForm
        ref={cancelBtn}
        candidate={props.candidate}
        interviewer={props.interviewer}
      />
    </LargeModal>
  );
};

export default ScheduleInterview;
