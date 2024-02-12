import Breadcrumbs from "../../../common/breadcrumbs/breadcrumbs.component";
import { ShareAltOutlined, ExportOutlined } from "@ant-design/icons";
import { EditFilled, CalendarOutlined } from "@ant-design/icons";
import { MailOutlined, LinkOutlined } from "@ant-design/icons";
import DropdownActionOptions from "../../../common/dropdown-action-options/dropdown-action-options";
import ActionBtns from "../../../container/action-btns-container/action-btns-container.jsx";
import { Workbench } from "../../../container/workbench-container/Workbench";

export const AddCandidateNavSteps = [
  ...["Basic Information", "Address", "Professional Details"].map((item) => ({
    title: item,
    hasRequiredFields: true,
    subTitle: (
      <span
        style={{
          fontSize: "20px",
          marginBottom: "8px",
          color: "var(--secondary)",
        }}
      >
        *
      </span>
    ),
  })),
  { title: "Comments" },
];

export const candidateActions = (object) => {
  const {
    toggleForm,
    scheduleInterview,
    showEmailActions,
    setShowEmailActions,
  } = object;

  const handleClickEmailBtn = () => setShowEmailActions((prev) => !prev);

  return (
    <Workbench>
      <ActionBtns
        btns={[
          {
            handleClick: toggleForm,
            title: "Edit",
            child: <EditFilled />,
          },
          {
            handleClick: scheduleInterview,
            title: "Schedule Interview",
            child: <CalendarOutlined />,
          },
          {
            handleClick: handleClickEmailBtn,
            title: "Email",
            child: (
              <>
                <MailOutlined />
                {showEmailActions && (
                  <DropdownActionOptions
                    close={() => setShowEmailActions(false)}
                    options={candidateEmailOptions}
                  />
                )}
              </>
            ),
            disabled: true,
          },
          {
            handleClick: () => console.log("click share"),
            title: "Share",
            child: <ShareAltOutlined />,
          },
          {
            handleClick: () => console.log("click report"),
            title: "Export report",
            child: <ExportOutlined />,
          },
        ]}
      />
    </Workbench>
  );
};

export const reportTableFields = () => [
  { label: "Status", value: "status", key: "status" },
  { label: "Recruiter", value: "recruiter", key: "recruiter" },
  { label: "Gender", value: "gender", key: "gender" },
  {
    label: "Current Job Title",
    value: "currentJobTitle",
    key: "currentJobTitle",
  },
  {
    label: "Current Employer",
    value: "currentEmployer",
    key: "currentEmployer",
  },
  { label: "Current CTC", value: "currentCtc", key: "currentCtc" },
  {
    label: "Total Experience",
    value: "totalExperience",
    key: "totalExperience",
  },
  { label: "Expected CTC", value: "expectedCtc", key: "expectedCtc" },
  {
    label: "Work Auth Status",
    value: "workAuthStatus",
    key: "workAuthStatus",
  },
  { label: "Available In", value: "availableIn", key: "availableIn" },
  { label: "Location", value: "location", key: "location" },
  {
    label: "Willing to Relocate",
    value: "relocate",
    key: "relocate",
  },
  { label: "Email", value: "email", key: "email" },
  { label: "Phone Number", value: "phoneNumber", key: "phoneNumber" },
  {
    label: "LinkedIn Profile",
    value: "linkedinProfile",
    key: "linkedinProfile",
  },
  {
    label: "Reason for Job Change",
    value: "reasonForJobChange",
    key: "reasonForJobChange",
  },
  {
    label: "Comments",
    value: "comments",
    key: "comments",
    maxlength: "3000",
  },
];

export const archiveModalHeaders = () => [
  "Name",
  "Recruiter",
  "Location",
  "Experience",
  "Work Auth.",
  "Expected CTC"
];

export const candidateContextMenu = [
  { key: "tab", name: "Open link in new tab", icon: <LinkOutlined /> },
];

const candidateEmailOptions = {
  header: "Email Candidate for",
  lines: [
    {
      id: 1,
      label: "Introduction",
      action: () => {
        console.log("Do intro email");
      },
    },
    {
      id: 2,
      label: "Information request form",
      action: () => {
        console.log("Do information request email");
      },
    },
    {
      id: 3,
      label: "Offer letter",
      action: () => {
        console.log("Do offer letter email");
      },
    },
    {
      id: 4,
      label: "Termination letter",
      action: () => {
        console.log("Do termination letter email");
      },
    },
  ],
};

export const crumbs = (closeForm, candidateName) => (
  <Breadcrumbs
    className="header"
    crumbs={[
      { id: 0, text: "Candidates", onClick: () => closeForm() },
      {
        id: 1,
        text: candidateName ? candidateName : "Profile",
        lastCrumb: true,
      },
    ]}
  />
);
