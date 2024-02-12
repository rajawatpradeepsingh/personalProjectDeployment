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

export const archiveModalHeaders = () => [
  "Param Type",
  "Param Value",
  "Param Level",
  "Comments",
];
export const reportTableFields = () => [

  { label: "Param Value", value: "paramValue", key: "paramValue" },
  { label: "Param Level", value: "paramLevel", key: "paramLevel" },
  {
    label: "Comments",
    value: "comments",
    key: "comments",
  },
];
