import ActionBtns from "../../../container/action-btns-container/action-btns-container";

export const supplierActions = (object) => {
  const { toggleForm } = object;

  return (
    <div className="page-actions-container">
      <ActionBtns
        btns={[
          {
            handleClick: toggleForm,
            title: "Edit",
            // child: <FaUserEdit />,
          },
        ]}
      />
    </div>
  );
};

export const reportTableFields=()=> 
[
        {
          label: "Supplier",
          value: "supplierCompanyName",
          key: "supplierCompanyName",
        },

        { label: "Contact ", value: "phone_no", key: "phone_no" },
        { label: "Email", value: "email", key: "email" },

        {
          label: "Status",
          value: "status",
          key: "status",
        },
        { label: "Location", value: "location", key: "location" },
        { label: "NetTerms", value: "netTerms", key: "netTerms" },
        { label: "W-8Ben", value: "w8Bene", key: "w8Bene" },
        { label: "D-590", value: "d590", key: "d590" },
        { label: "W-9", value: "w9", key: "w9" },
        { label: "A-1099", value: "a1099", key: "a1099" },
        {
          label: "Certificate Of Insurance",
          value: "certificateOfInsurance",
          key: "certificateOfInsurance",
        },
        {
          label: "Contract Start Date",
          value: "contractStartDate",
          key: "contractStartDate",
        },
        {
          label: "Contract End Date",
          value: "contractEndDate",
          key: "contractEndDate",
        },
      ]

/* export const reportTableFields = () => [
  { label: "PhoneNumber", value: "phoneNumber", key: "phoneNumber" },

  {
    label: "Email",
    value: "email",
    key: "email",
  },
  { label: "Gender", value: "gender", key: "gender" },
  {
    label: "DateOfBirth",
    value: "dateOfBirth",
    key: "dateOfBirth",
  },
  {
    label: "ContractStartDate",
    value: "contractStartDate",
    key: "contractStartDate",
  },
  {
    label: "ContractEndDate",
    value: "contractEndDate",
    key: "contractEndDate",
  },
  { label: "Status", value: "status", key: "status" },
  {
    label: "SubContractorCompanyName",
    value: "subContractorCompanyName",
    key: "subContractorCompanyName",
  },
]; */

/* export const archiveModalHeaders = () => [
  "Name",
  "Email",
  "PhoneNumber",
  "Status",
  "SubContractorCompanyName",
  "Client",
];
export const workerContextMenu = [
  { key: "tab", name: "Open link in new tab", icon: <GoLink /> },
]; */




