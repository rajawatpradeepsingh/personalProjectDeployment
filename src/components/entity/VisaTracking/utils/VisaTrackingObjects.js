import { AuditOutlined } from "@ant-design/icons";

export const formNavEditSteps = () => [
  {
    title: "Visa Details",
    icon: (
      <AuditOutlined
        style={{
          color: "var(--secondary-muted)",
          fontSize: "24px",
        }}
      />
    ),
    status: "finish",
  },
];


export const reportTableFields = () => [
  {
    label: "Type",
    value: "visaType",
    key: "visaType",
  },
  { label: "Status", value: "visaStatus", key: "visaStatus" },
  {
    label: "Applied On",
    value: "visaAppliedDate",
    key: "visaAppliedDate",
  },
  {
    label: "Start Date",
    value: "visaStartDate",
    key: "visaStartDate",
  },
  {
    label: "Expiry On",
    value: "visaExpiryDate",
    key: "visaExpiryDate",
  },
  {
    label: "Citizen Of",
    value: "visaCountry",
    key: "visaCountry",
  },
  {
    label: "Birth Country",
    value: "countryOfBirth",
    key: "countryOfBirth",
  },
  {
    label: "Resides In",
    value: "visaCountryOfResidence",
    key: "visaCountryOfResidence",
  },
];

export const visaTypes = [
  { id: 1, value: "H1B", name: "H1B" },
  { id: 2, value: "L1", name: "L1" },
  { id: 3, value: "O1", name: "O1" },
  { id: 4, value: "E1", name: "E1" },
  { id: 5, value: "E3", name: "E3" },
  { id: 5, value: "CITIZEN", name: "Citizen" },
  { id: 6, value: "GREEN CARD", name: "Green Card" },
];