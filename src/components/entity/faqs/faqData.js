const faqData = [
  {
    id: 1,
    question: "What is RCP Drishticon for?",
    answer:
      "RCP Drishticon is an application that collects and organizes all the data you gather throughout the employee life cycle and enables your hiring and onboarding processes. RCP limits the recruiter's workload and often supports advanced filtering systems based on job requirements and applicants' credentials.",
  },
  {
    id: 2,
    question: "What are the supported browsers for the RCP application?",
    answer: {
      text: "User should use one of the supported Web browsers. RCP does not support Mobile app, the application might hang or crash if accessed from the mobile. The following Web browsers are supported:",
      list: ["Google Chrome", "Mozilla Firefox", "Microsoft Edge", "Safari"],
    },
  },
  {
    id: 3,
    question: "What is the registration process?",
    answer: {
      text: "Create your account credentials (red asterisks (*) indicate required fields):",
      list: [
        "Enter your username, the username you enter will be used as your login ID",
        "Create a password in the Password field, then re-enter it in the Confirm Password field.",
        "Select your user role category from the predefined list. There are three primary categories: HR, Business Dev Manager and Recruiter",
        "Enter your Personal Information. The Email ID you enter will be used as the primary email address for your account",
        "Select the security question and answer for account recovery purposes",
        "You will receive a confirmation email when the admin approves your account. Log in using the username and password you created during registration. ",
      ],
    },
  },
  {
    id: 4,
    question: "How do I reset or change my password?",
    answer: {
      text: "These steps will allow any user to reset their password:",
      list: [
        "Visit RCP login page and click forgot password",
        "The application will prompt user to enter the email ID which is associated with their account",
        "The application will prompt the user to answer their security question",
        "The user will receive an email from RCP with a link to change their password. User should check their spam folder as emails get caught in there every so often",
        "User can click on the link to be directed to the page on the browser from which to reset their password",
      ],
      textTwo: "Changing your password:",
      listTwo: [
        "If user knows their password but would like to change it they should first sign in to the application",
        "Hover over Profile icon to get dropdown menu and select 'User Info'",
        "Click change password button, type in new password and re-type to confirm - click 'Submit Password' button",
      ],
    },
  },
  {
    id: 5,
    question: "How can I change my email address and/or contact info?",
    answer: {
      list: [
        "Sign in to application and navigate to 'User Info'",
        "Individually enable fields that you want edited",
        "Click 'Save' button under the form to save changes",
      ],
    },
  },
  {
    id: 6,
    question: "What are the main features?",
    answer: {
      list: [
        "Employee Records: Create employee data HR data with advanced filtering systems in one secure database, accessible from anywhere.",
        "Standard Reporting: Get strategic sense by creating custom reports without collecting data and sorting data.",
        "Scheduling Interviews: RCP interview function is integrated with zoom, where you can autogenerate a zoom link for the interviews. There is no limit to how many meetings a user can host; however, it has 40-minute meeting duration limit for all meetings. User can also copy paste their Microsoft teams and skype invites in the schedule interview tab.",
        "Onboarding: The current onboarding feature manages the team to track the employee onboarding checklist for the smoother employee onboarding.",
        "Custom Access Levels: The application has three different custom role levels that provide unique access to employee information.",
      ],
    },
  },
  {
    id: 7,
    question: "What are the current roles and privileges?",
    answer: {
      tableData: {
        headers: ["Role", "Can Add/Edit", "Read Only", "Details"],
        cellData: [
          {
            colOne: "Recruiter",
            colTwo: "Candidates, Interviewers, Interviews, Onboarding",
            colThree: "Clients, Job Openings",
            colFour:
              "Access only to their employee's records and their own Dashboard, they can check for duplicate employee records by filling out the following info in Add Employee: First name, Last name, Email, and Phone No.",
          },
          {
            colOne: "Business Dev Manager (Sales Managers)",
            colTwo:
              "Candidates, Interviewers, Interviews, Onboarding, Clients, Job Openings",
            colThree: "n/a",
            colFour:
              "Sales managers have access only to their employee's records and their own Dashboard, they can check for duplicate employee records by filling out the following info in Add Employee: First name, Last name, Email, and Phone No.",
          },
          {
            colOne: "HR",
            colTwo:
              "Candidates, Interviewers, Interviews, Onboarding, Clients, Job Openings, Manage Users, Roles",
            colThree: "n/a",
            colFour:
              "Access to all the data of the recruiters and sales managers and their Dashboards.",
          },
        ],
      },
    },
  },
  {
    id: 8,
    question: "Who has access to creating and deleting roles?",
    answer: "Only HR/Admin have access to create and delete a role.",
  },
  {
    id: 9,
    question: "What is the use of the Archive Button?",
    answer:
      "It enables you to move a record or data from your main function to an archive folder, it’s a one-click option to clear data from the current function without deleting it. Application have archive button on each function.",
  },
  {
    id: 10,
    question: "What is the use of the Reports Button?",
    answer:
      "Users can generate reports in PDF, Excel, and CSV formats to get an overview of that function. Users can generate customized reports by filtering the fields",
  },
  {
    id: 11,
    question: "Is the support team available?",
    answer:
      "Yes, we have the in-house support team available from 9 am-4 pm PST, Monday to Friday. You can update your issues in the docs and shoot us an email at support.rcp@drishticon.com. We also have a google docs where you can update your issues and keep a track of the status of your issues.",
  },
  {
    id: 12,
    question: "What are the future features of the application?",
    answer: {
      tableData: {
        headers: ["Function", "Feature"],
        cellData: [
          {
            colOne: "Onboarding",
            colTwo:
              "Offer Letter generation, integration with Ease Portal and Asset Management",
          },
          {
            colOne: "OffBoarding",
            colTwo:
              "Termination Letter generation, final timesheet submission and approval and Assets return, tracking and confirmation",
          },
          {
            colOne: "Standard Email Alerts",
            colTwo: "Intro email, Rejection email and/or Thank You email",
          },
          {
            colOne: "Calendar Invite",
            colTwo:
              "Sending calendar invite to select available timeslots for Interviews",
          },
          {
            colOne: "Dashboard",
            colTwo:
              "Show data for All Recruiters or All Sales Managers, Filter by Recruiters or Sales Managers and Filter by Client",
          },
          {
            colOne: "Job Posting Integration with Job Portals",
            colTwo: "Zip Recruiter, Indeed and/or LinkedIn",
          },
        ],
      },
    },
  },
  {
    id: 13,
    question: "What is the goal for the application?",
    answer:
      "RCP Drishticon has two main goals, automating the whole recruitment process, which can be beneficial to streamline the candidate search and help the company make the right hire. The second goal is to automate the onboarding process to maintain a company's smooth operation.",
  },
  {
    id: 14,
    question: "What emails get sent through the application?",
    answer: {
      list: [
        "When an interview is scheduled and email gets sent to the candidate and the interviewer(s)",
        "When a candidate is marked as 'Selected' after completing an interview a Congratulation email is sent to them",
        "When a candidate is marked as 'Not Selected' after completing an interview a 'Rejected' emau is sent to them",
        "On completing an interview a Thank You email is sent to the interviewer(s)",
      ],
    },
  },
];

export default faqData;
