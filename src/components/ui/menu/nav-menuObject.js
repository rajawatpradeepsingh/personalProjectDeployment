import { HomeOutlined, LinkOutlined } from "@ant-design/icons";


export const menu = [
{
    route: "/",
    name: "home",
    child: (
      <>
        <HomeOutlined style={{ fontSize: "15px", marginRight: "5px" }} />
        <span>Home</span>
      </>
    ),
  },
  
  {
    route: "/viewresourceManager",
    name: "resourcemanager",
    text: "Managers",
    subRoutes: ["/addresourceManager"],
  },
  {
    route: "/viewcandidates",
    name: "candidates",
    text: "Candidates",
    subRoutes: ["/candidate", "/addcandidate"],
  },
  {
    route: "/viewworkers",
    name: "workers",
    text: "Workers",
    subRoutes: ["/addworker"],
  },
  {
    route: "/viewclients",
    name: "clients",
    text: "Clients",
    subRoutes: ["/addclient"],
  },
  {
    route: "/viewprojects",
    name: "projects",
    text: "Projects",
    subRoutes: ["/addprojects"],
  },

  {
    route: "/viewworkOrder",
    name: "workOrder",
    text: "WorkOrder",
    subRoutes: ["/addworkOrder"],
  },
  {
    route: "/viewcalender",
    name: "calender",
    text: "Calender",
    subRoutes: ["/addCalender"],
  },
  {
    route: "/viewtimesheet",
    name: "timesheet",
    text: "TimeSheet",
    subRoutes: ["/addtimesheet"],
  },
  {
    route: "/viewcommission",
    name: "commission",
    text: "Commission",
    // subRoutes: ["/addguide"],
  },

  
  {
    route: "/viewjobs",
    name: "jobs",
    text: "Job Openings",
    subRoutes: ["/addjob"],
  },
 
  {
    parent: true,
    // route: "/viewinterviewers",
    name: "interviews...",
    text: "Interviews...",
    children: [
      {
        route: "/viewinterviewers",
        name: "interviewers",
        text: "Interviewers",
        subRoutes: ["/interviewer", "/addinterviewer"],
      },
      {
        route: "/viewinterviews",
        name: "interviews",
        text: "Interviews",
        subRoutes: ["/viewzoomlink"],
      },
      {
        route: "/viewguides",
        name: "guides",
        text: "IQ Guide",
        subRoutes: ["/addguide"],
      },
    ],
  },
  
  
  //{
  //  route: "/viewvendors",
  //  name: "vendors",
  //  text: "Vendors",
  //  subRoutes: ["/addvendor"],
  //},
  {
    route: "/viewsuppliers",
    name: "suppliers",
    text: "Suppliers",
    subRoutes: ["/addsupplier"],
  },
  
  {
    route: "/viewonboardings",
    name: "onboardings",
    text: "Onboardings",
    subRoutes: ["/addonboarding"],
  },
  {
    parent: true,
    name: "settings...",
    text: "Settings...",
    children: [
      {
    route: "/viewparameters",
    name: "parameters",
    text: "Parameters",
  },
  {
    route: "/viewusers",
    name: "users",
    text: "Authorizations",
    admin: true,
    subRoutes: ["/viewroles", "/addrole"],
  },
  
],
},
];


export const navContextMenu = [
  { key: "tab", name: "Open link in new tab", icon: <LinkOutlined style={{ marginRight: "4px"}}/> },
];
