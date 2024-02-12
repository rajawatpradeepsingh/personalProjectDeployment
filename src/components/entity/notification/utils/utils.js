import { interviewRoundOptions as roundType } from "../../../../utils/defaultData";

export const getMessage = (item) => {
  let res = "";
  if (item.entityName === "candidates") res = candidateEntity(item);
  if (item.entityName === "interviewers") res = interviewerEntity();
  if (item.entityName === "interviews") res = interviewEntity(item);
  if (item.entityName === "jobs") res = jobEntity(item);
  return res ? res : "";
};

export const getMessageDate = (item) => {
  return new Date(`${item.dateTimeUTC}.000Z`).toLocaleString({
    timeZoneName: "short",
  });
};

export const getMessageAuthor = (item) => {
  return item.author
    ? `${item.author.firstName} ${item.author.lastName}`
    : "(userId=N/A)";
};

export const getMessageDescr = (item) => {
  let str = item.description || "";
  str = str
    .replace(/\s{2,}/g, " ")
    .replace(/\t/g, " ")
    .toString()
    .trim()
    .replace(/(\r\n|\n|\r)/g, "");
  return str ? JSON.parse(str) : {};
};

const candidateEntity = (item) => {
  let res = "";
  const author = getMessageAuthor(item);
  const descr = getMessageDescr(item);
  const candidate = descr?.name;

  if (item.role?.roleName === "RECRUITER") {
    let status = descr.jobActivity?.status;
    const activity = `${
      status?.indexOf("-") >= 0 ? status.split(" - ")[1] : status
    }`.toLowerCase();
    const client = descr.jobActivity?.client;
    const role = descr.jobActivity?.manager?.split(" (")[0];
    switch (activity) {
      case "submitted":
        return `${candidate}’s profile ${activity} to the ${role}/${client}`;
      case "client interview":
        return `${author}’s has scheduled an interview for ${candidate} with ${client}/${role}`;
      case "internal interview":
        return `${author}’s has scheduled an internal interview for ${candidate}`;
      case "confirmed":
        return `${candidate} has ${activity} with ${client} for ${role}`;
      default:
    }
    return `${candidate} is ${activity} with ${client} for ${role}`;
  }
  if (!descr.status) res = `A new candidate was added`;
  if (descr.jobActivity)
    res =
      descr.jobActivity?.old !== "null"
        ? `${candidate}’s job activity has changed from ${descr.jobActivity?.old} to ${descr.jobActivity?.new}`
        : `${candidate}’s job activity updated to ${descr.jobActivity?.new}`;
  if (descr.comment) res = `A new comment was added to ${candidate}’s profile`;
  if (descr.status)
    res = `${candidate}’s status has changed from ${descr.status?.old} to ${descr.status?.new}`;
  return `${res}`;
};

const interviewerEntity = () => {
  return `A new interviewer was added`;
};

const interviewEntity = (item) => {
  const descr = getMessageDescr(item);
  const candidate = descr?.name;
  const action = descr?.upd ? "updated" : "added";
  const round = descr?.round
    ? roundType.filter((i) => i.const === descr?.round)[0]?.name
    : "(N/A)";
  return `A ${
    descr?.decision ? "decision" : `new ${descr?.upd ? "change" : "feed back"}`
  } has been ${action} on ${candidate}’s interview/${round}`;
};

const jobEntity = (item) => {
  const descr = getMessageDescr(item);
  const action = descr?.upd ? "Updated" : "Added";
  return `${action} ${descr?.jobTitle}/${descr?.client?.name} requirement to the job openings`;
};
