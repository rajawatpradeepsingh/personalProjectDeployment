import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import auth from "../../../utils/AuthService";
import { useEffect, useState, useCallback ,useMemo} from "react";
import Button from "../../common/button/button.component.jsx";
import { formNavEditSteps } from "./job_utils/jobObjects.js";
import Breadcrumbs from "../../common/breadcrumbs/breadcrumbs.component.jsx";
import Content from "../../container/content-container/content-container.component.jsx";
import Form from "../../common/form/form.component";
import PopUp from "../../modal/popup/popup.component";
import FormNav from "../../ui/form-nav/form-nav.component.jsx";
import BasicInfoJob from "./edit_sections/BasicInfoJob.jsx";
import JobDetails from "./edit_sections/JobDetails.jsx";
import { getJobById, updateJob } from "../../../API/jobs/job-apis.js";
import { setJobDetails, setEditEnabled } from "../../../Redux/jobSlice.js";
import { message } from "antd";
import { PageContainer } from "../../container/page-container/PageContainer.jsx";
import { PageHeader } from "../../container/page-header/PageHeader.jsx";
import { Workbench } from "../../container/workbench-container/Workbench.jsx";
import { ContentPanels } from "../../container/content-panels-container/ContentPanels.jsx";
import { EditFilled, ShareAltOutlined, ExportOutlined, } from "@ant-design/icons";
import IdleTimeOutHandler from "../../ui/Dashboard/IdleTimeOutHandler";

const headers = auth.getHeaders();

export const EditJobPage = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const history = useHistory();
  const [currentPage] = useState("Job Details");
  const [pageIndex, setPageIndex] = useState(0);
  const { jobDetails, changesMade, editEnabled } = useSelector((state) => state.job);
  const [popUpMessage, setPopUpMessage] = useState({});
  const [openPopUp, setOpenPopUp] = useState(false);
  const[isActive,setIsActive]=useState(true);
  const[isLogout,setLogout]=useState(false);


  const dispatchJobDetails = useCallback((object) => dispatch(setJobDetails(object)), [dispatch]);
  const dispatchEditEnabled = useCallback((object) => dispatch(setEditEnabled(object)), [dispatch]);

  const getJob = useCallback((id) => {
    getJobById(headers, id)
      .then(res => {
        if (res.statusCode === 200) {
          dispatchJobDetails(res.data);
        }
      })
  }, [dispatchJobDetails]);
  const [isAdmin, setIsAdmin] = useState(false);
  const user = useMemo(() => auth.getUserInfo(), []);
  const [roleData,setRoleData]=useState(user.roles[0]);
  useEffect(() => {
    if (auth.hasAdminRole()) setIsAdmin(true);
  }, []);

  useEffect(() => {
    const id = params?.jobId;
    if (id) getJob(id);
  }, [params?.jobId, getJob]);

  const updateJobs = (event) => {
    event.preventDefault();
    const messgKey = "isLoading";
    const {
      jobTitle,
      hiringManager,
      period, workType,
      priority,
      noOfJobopenings,
      flsaType,
      taxType,
      status,
      clientBillRate,
      jobType,
      currency,
      jobDescription,
      comments
    } = jobDetails;

    const jobdata = {
      jobTitle,
      hiringManager,
      period,
      workType,
      priority,
      noOfJobopenings,
      flsaType,
      taxType,
      currency,
      status,
      clientBillRate,
      jobType,
      jobDescription,
      comments,
      client: {
        clientName: jobDetails.client.clientName,
        id: jobDetails.client.id,
      },
    };

    updateJob(headers, jobdata, jobDetails.id)
      .then(res => {
        if (res.statusCode === 200) {
          dispatchEditEnabled(false);
          dispatchJobDetails(res.data);
          message.success({
            content: "Job updated!",
            messgKey,
            duration: 5,
            style: { marginTop: "5%" },
          });
        } else {
          message.error({
            content: `An error occurred while saving changes (${res.statusCode})`,
            messgKey,
            duration: 10,
          });
        }
      })
  };

  const closeForm = () => {
    dispatchEditEnabled(false);
    history.push("/viewjobs");
  };

  const toggleForm = () => {
    if (editEnabled) confirmDiscardChanges();
    else dispatchEditEnabled(!editEnabled)
  };

  const closePopUp = () => {
    setOpenPopUp(false);
    setPopUpMessage({});
  };

  const confirmDiscardChanges = () => {
    dispatchEditEnabled(false);
  };

  const resetForm = () => {
    if (changesMade) {
      setOpenPopUp(true);
      setPopUpMessage({
        title: "Confirm Discard Changes",
        details: "All changes will be discarded, proceed?",
        confirmValue: "Confirm",
        cancelValue: "Cancel",
      });
    } else {
      dispatchEditEnabled(false);
    }
  };

  const setNavPage = (key) => {
    setPageIndex(key);
  };

  return (
    <PageContainer>
           <IdleTimeOutHandler 
    onActive={()=>{setIsActive(true)}} 
    onIdle={()=>{setIsActive(false)}}
    onLogout={()=>{setLogout(true)}}
    />
      <PageHeader
        breadcrumbs={
          <Breadcrumbs
            className="header"
            crumbs={[
              { id: 0, text: "Job", onClick: () => closeForm() },
              {
                id: 1,
                text: `№DH${("00000" + jobDetails?.id).slice(-5)} ${jobDetails?.jobTitle
                  } (${jobDetails?.client?.clientName} - ${jobDetails?.client?.address?.city
                  }) `,
                lastCrumb: true,
              },
            ]}
          />
        }
        actions={
          
          <Workbench>
               { isAdmin || roleData.managerPermission || roleData.candidatesPermission  ||roleData.clientPermission  ||roleData.interviewsPermission  ||roleData.jobOpeningsPermission  ||roleData.onBoardingsPermission ||roleData.settingsPermission  ||roleData.suppliersPermission ?
            <Button
              type="button"
              handleClick={toggleForm}
              className="btn icon marginX"
              title="Edit"
            >
              <EditFilled />
            </Button>:""
               }
            <Button
              type="button"
              handleClick={() =>
                console.log("put onClick handler, but not an object")
              }
              disabled
              className="btn icon marginX"
              title="Share"
            >
              <ShareAltOutlined />
            </Button>
            <Button
              type="button"
              handleClick={() =>
                console.log("put onClick handler, but not an object")
              }
              disabled
              className="btn icon marginX"
              title="Export Report"
            >
              <ExportOutlined />
            </Button>
          </Workbench>
        }
      />
       <IdleTimeOutHandler 
    onActive={()=>{setIsActive(true)}} 
    onIdle={()=>{setIsActive(false)}}
    onLogout={()=>{setLogout(true)}}
    />
      <ContentPanels>
        <Content className="x-small">
          <Form
            className="column small"
            onSubmit={updateJobs}
            cancel={resetForm}
            formEnabled={editEnabled}
          >
            <BasicInfoJob />
          </Form>
        </Content>

        <Content className="medium">
          <FormNav
            steps={formNavEditSteps()}
            submit={updateJobs}
            reset={resetForm}
            canSubmit={editEnabled}
            setCurrentPage={setNavPage}
            clickable={true}
            type="navigation"
            hideNavBtns={true}
            index={pageIndex}
          >
            <Form>
              {currentPage === "Job Details" && <JobDetails />}
            </Form>
            <PopUp
              openModal={openPopUp}
              type={popUpMessage.title?.toLowerCase() || ""}
              closePopUp={closePopUp}
              handleConfirmClose={
                popUpMessage.title?.includes("Confirm")
                  ? confirmDiscardChanges
                  : closePopUp
              }
              confirmValue={popUpMessage.confirmValue}
              cancelValue={popUpMessage.cancelValue}
              message={popUpMessage}
            />
          </FormNav>
        </Content>
      </ContentPanels>
    </PageContainer>
  );
};

export default EditJobPage;
