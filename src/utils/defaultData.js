export const ctcTax = ["W-2", "C2C", "1099"];
export const ctcType = ["Per hour", "Annual"];
export const expPeriod = ["year(s)", "month(s)"];
export const noticePeriod = ["week(s)", "month(s)", "Immediately Available"];

export const gender = [
  "Male",
  "Female",
  "Non-Binary",
  "Trans-Fem",
  "Trans-Masc",
  "Prefer Not to Say",
];

export const securityQuestions = [
  { id: 1, name: "What is your mother's maiden name?" },
  { id: 2, name: "What high school did you attend?" },
  { id: 3, name: "What is the name of your first school?" },
  { id: 4, name: "What was the make of your first car?" },
  { id: 5, name: "What was your favorite food as a child?" },
];

export const zoomSettings = {
  setting: {
    host_video: true,
    participant_video: true,
    in_meeting: true,
    join_before_host: true,
    mute_upon_entry: false,
    watermark: false,
    use_pmi: false,
    approval_type: 2,
    audio: "both",
    auto_recording: "local",
    enforce_login: false,
    registrants_email_notification: false,
    waiting_room: false,
    allow_multiple_devices: true,
  },
};

export const interviewRoundOptions = [
  { id: 1, name: "Technical Round 1", const: "TECHNICAL_ROUND_1" },
  { id: 2, name: "Technical Round 2", const: "TECHNICAL_ROUND_2" },
  { id: 3, name: "HR Round", const: "HR_ROUND" },
];

export const roundOptionsFilter = [
  { value: 1, text: "Technical Round 1" },
  { value: 2, text: "Technical Round 2" },
  { value: 3, text: "HR Round" },
];

export const decisionOptionsFilter = [
  { value: 1, text: "Selected" },
  { value: 3, text: "Tentative" },
  { value: 2, text: "Rejected" },
];

export const jobActivity = [
  "Submitted",
  "Client Interview",
  "Pending",
  "Confirmed",
  "Rejected",
];

export const candidateStatus = [
  "New",
  "Active",
  "Ready to be Marketed",
  "Hold",
  "Onboarded",
  "Passive",
  "Closed",
];

export const statuses = ["New", "Active", "Closed", "Hold"];

export const jobTypes = ["Full Time", "Contract to hire", "Contract"];

export const priorities = ["Low", "Medium", "High"];

export const hiringType = ["Internal Hire", "Direct Hire", "Corp to Corp Hire"];

export const processStatus = ["Initiated", "In process", "Completed"];


export const workerStatus = [
  "Active",
  "TERMINATED",
  "LEAVEWITHOUTPAY",
  "HIRE",
 
];
export const timesheetStatus = [
  'Drafted',
  'Submitted',
  'Submitted/Updated',
  'Collected',
  'Processed',
  'Closed'
];
export const ParameterFilter = [
  "Admin fee",
  "Sick fee",
  "PTO fee",
  "STS"

 
 
];
export const ManagerRole = [
"RECRUITER",
"SALESMANAGER"
 
 
];

export const recordStatus = [
  "Completed",
  "Pending", 
];
