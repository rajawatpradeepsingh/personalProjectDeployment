export const reportTableFields = () => [
  { label: "Hiring Type ", value: "hiringType", key: "hiringType" },
  { label: "Start Date", value: "startDate", key: "startDate" },
  { label: "End Date", value: "endDate", key: "endDate" },
  {
    label: "Sign Up Contract",
    value: "signUpContract",
    key: "signUpContract",
  },
  { label: "Client", value: "client", key: "client" },
  {
    label: "Ease Portal Setup",
    value: "easePortalSetUp",
    key: "easePortalSetUp",
  },
  { label: "Work Order", value: "workOrder", key: "workOrder" },
  {
    label: "Background Check",
    value: "backgroundCheck",
    key: "backgroundCheck",
  },
  {
    label: "Delivery Of Laptop",
    value: "deliveryOfLaptop",
    key: "deliveryOfLaptop",
  },
];

export const archiveModalHeaders = () => [
  "Candidate Name",
  "Client",
  "Hiring Type",
  "Start Date",
  "End Date",
  "Sign Up Contract",
  "Delivery Of Laptop",
];

export const hiringTypeFilter = [
  { text: "Direct Hire", value: "Direct Hire" },
  { text: "Internal Hire", value: "Internal Hire" },
  { text: "Corp to Corp Hire", value: "Corp to Corp Hire" },
];
