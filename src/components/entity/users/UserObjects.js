import { AuditOutlined } from "@ant-design/icons";

export const formNavEditSteps = () => [
  {
    title: "Roles",
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
