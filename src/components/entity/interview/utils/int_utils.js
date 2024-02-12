import * as service from "../../../../utils/service";
import moment from "moment";

export const formatCandidateData = (data) => {
  return data.map((candidate) => ({
    id: candidate.id,
    name: `${candidate.firstName} ${candidate.lastName}`,
    status: candidate.status,
    commentList: candidate.professionalInfo?.commentList || [],
  }));
};

export const formatInterviewerOptions = (data) => {
  return data.map((interviewer) => ({
    id: interviewer.id,
    fullName: `${interviewer.firstName} ${interviewer.lastName}`,
  }));
};

export const formatJobOptions = (data) => {
  return data.map((job) => ({
    id: job.id,
    jobTitle: job.jobTitle,
    client: `${job.client?.clientName} (${job.client?.address?.city})` || "",
    manager: job.hiringManager,
  }));
};

export const formatClientOptions = (data) => {
  return data.map((client) => ({
    id: client.id,
    clientName: `${client.clientName} (${client.address?.city})` || "",
  }));
};

export const validateStartTime = (sDate, sTime, setInputErr) => {
  const date = new Date();
  const start = new Date(`${sDate} ${sTime}`);
  if (start < date) {
    setInputErr((i) => {
      return {
        ...i,
        startTime: "Interview can't be scheduled for passed date/time",
      };
    });
  } else {
    setInputErr((i) => {
      const { startTime, ...rest } = i;
      return rest;
    });
  }
};

export const validateEndTime = (sDate, sTime, eTime, setEndTimeError) => {
  const start = new Date(`${sDate} ${sTime}`);
  const end = new Date(`${sDate} ${eTime}`);
  if (end < start) {
    setEndTimeError("End time can't be less than start time");
  } else {
    setEndTimeError("");
  }
};

export const endTimeFill = (time, setSchedule) => {
  let temp = time.split(":");
  if (parseInt(temp[0]) >= 10) {
    setSchedule((s) => ({
      ...s,
      endTime: `${parseInt(temp[0]) + 1}:${temp[1]}`,
    }));
    return `${parseInt(temp[0]) + 1}:${temp[1]}`;
  } else {
    setSchedule((s) => ({
      ...s,
      endTime: `0${parseInt(temp[0]) + 1}:${temp[1]}`,
    }));
    return `0${parseInt(temp[0]) + 1}:${temp[1]}`;
  }
};

export const mapInterviewList = (data) => {
  return data.map((interview) => ({
    id: interview.id,
    interviewLink: interview.interviewLink,
    candFullName: `${interview.candidate?.firstName} ${interview.candidate?.lastName}`,
    candidate: {
      id: interview.candidate.id,
      fullName: `${interview.candidate?.firstName} ${interview.candidate?.lastName}`,
      recruiterId: interview.candidate.recruiter
        ? interview.candidate.recruiter.id
        : "",
      recruiterRole: interview.candidate.recruiter
        ? interview.candidate.recruiter.roles[0].roleName.toLowerCase()
        : "",
    },
    interviewers: interview.interviewers
      ? interview.interviewers
          .map(
            (interviewer) => `${interviewer.firstName} ${interviewer.lastName}`
          )
          .join(", ")
      : "",
    roundType: interview.roundType,
    jobOpening:
      interview.jobOpening !== null
        ? interview.jobOpening?.jobTitle
        : "Internal Interview",
    jobId: interview.jobOpening !== null ? interview.jobOpening?.id : null,
    client: interview.jobOpening
      ? `${interview.jobOpening?.client?.clientName} (${interview.jobOpening?.client?.address?.city})`
      : "",
    jobType: interview.jobOpening !== null ? interview.jobOpening.jobType : "",
    schedule: interview.schedule,
    date: interview.schedule?.date,
    feedback: interview.schedule?.feedback,
    decision: interview.schedule?.decision,
  }));
};

export const roundDisplay = (round) => {
  let temp = round ? round.toLowerCase().split("_") : [];
  let temp2 = temp.map((word) =>
    word && word.length === 2
      ? word.toUpperCase()
      : `${word.charAt(0).toUpperCase()}${word.substring(1)}`
  );
  return temp2.join(" ");
};

export const timeDisplay = (date, time) => {
  let local = service.getLocalTime(date, time);
  let temp = local.split(":");
  if (temp[0] <= 11) {
    return temp[0] < 1
      ? `12:${temp[1]}AM`
      : `${temp[0] < 10 ? temp[0].charAt(1) : temp[0]}:${temp[1]}AM`;
  } else if (temp[0] > 12) {
    let hours = temp[0] - 12;
    return `${hours}:${temp[1]}PM`;
  } else {
    return `${temp[0]}:${temp[1]}PM`;
  }
};

export const dateFormat = (date, time) => {
  return moment(date).format("MM/DD/YYYY");
};

export const scheduleTimeFormat = (start, end) => {
  return `${moment(start).format("hh:mmA")} - ${moment(end).format("hh:mmA")}`;
};
