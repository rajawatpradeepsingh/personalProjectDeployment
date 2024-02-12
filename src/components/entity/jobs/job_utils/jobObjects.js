import { AuditOutlined } from "@ant-design/icons";

export const reportTableFields = () => [
  { label: "Client", value: "client", key: "client" },
  {
    label: "No.Of Jobopenings",
    value: "noOfJobopenings",
    key: "noOfJobopenings",
  },
  { label: "Hiring Manager", value: "hiringManager", key: "hiringManager" },
  { label: "Priority", value: "priority", key: "priority" },
  { label: "Status", value: "status", key: "status" },
  { label: "Location", value: "location", key: "location" },
  { label: "Client Bill Rate", value: "clientBillRate", key: "clientBillRate" },
  { label: "Job Description", value: "jobDescription", key: "jobDescription" },
  { label: "Job Type", value: "jobType", key: "jobType" },
  { label: "Work Type", value: "workType", key: "workType" },
  { label: "FLSA Type", value: "flsaType", key: "flsaType" },
  { label: "Tax Type", value: "taxType", key: "taxType" },
  { label: "Job Creation Date", value: "creationDate", key: "creationDate" },
];

export const archiveModalHeaders = () => [
  "Job Title",
  "Client Name",
  "No. of openings",
  "Hiring Manager",
  "Priority",
  "Status",
  "Employment Type",
];

export const statusFilter = [
  { text: "New", value: "New" },
  { text: "Active", value: "Active" },
  { text: "Hold", value: "Hold" },
  { text: "Closed", value: "Closed" },
];

export const priorityFilter = [
  { text: "Low", value: "Low" },
  { text: "Medium", value: "Medium" },
  { text: "High", value: "High" },
];

export const formNavEditSteps = () => [
  {
    title: "Job Details",
    icon: (
      <AuditOutlined
        style={{
          color: "var(--secondary-muted)",
          fontSize: "18px",
          marginBottom: "1px",
        }}
      />
    ),
    status: "finish",
  },
];
