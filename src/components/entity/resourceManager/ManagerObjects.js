import { AuditOutlined } from "@ant-design/icons";

export const formNavEditSteps = () => [
  {
    title: "Comments",
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
export const reportTableFields = () => [

  { label: "Role", value: "role", key: "role" },
  { label: "PhoneNumber", value: "phoneNumber", key: "phoneNumber" },
  {
    label: "Email",
    value: "email",
    key: "email",
  },
  { label: "Status", value: "state", key: "state" },
  {label: "Start Date", value: "startDate", key: "startDate"},
  { label: "End Date", value: "endDate", key: "endDate" }
];
