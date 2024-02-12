import { useEffect, useState, useCallback,useMemo } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AuthService from "../../../utils/AuthService";
import axios from "axios";
import { config } from "../../../config";
import Content from "../../container/content-container/content-container.component";
import Form from "../../common/form/form.component";
import Breadcrumbs from "../../common/breadcrumbs/breadcrumbs.component";
import * as service from "../../../utils/service";
import { setIsAuth } from "../../../Redux/appSlice.js";
import BasicInfo from "./worker_ui_helpers/pages/BasicInfo";
import WorkerHistory from "./worker_ui_helpers/pages/WorkerHistory";
import { setEditEnabled, } from "../../../Redux/workerSlice";
import { setWorker, setBasicInfo, setWorkerInfo,setChangesMade, setProjectInfo } from "../../../Redux/workerSlice";
import { setRequiredErr } from "../../../Redux/candidateSlice";
import PopUp from "../../modal/popup/popup.component";
import Button from "../../common/button/button.component";
import { getWorkerById, updateWorker,postResume,deleteResume } from "../../../API/workers/worker-apis";
import { PageContainer } from "../../container/page-container/PageContainer";
import { PageHeader } from "../../container/page-header/PageHeader";
import { ContentPanels } from "../../container/content-panels-container/ContentPanels";
import { Workbench } from "../../container/workbench-container/Workbench";
import { TabsComponent } from "../../common/tabs/TabsComponent";
import { message } from "antd";
import { EditFilled, ShareAltOutlined, ExportOutlined, HistoryOutlined, AuditOutlined, CreditCardOutlined } from "@ant-design/icons";
import VisaDetails from "./worker_ui_helpers/pages/VisaDetails";
import "antd/dist/antd.css";
import RateCardWorker from "./worker_ui_helpers/pages/RateCard-Worker";
import IdleTimeOutHandler from "../../ui/Dashboard/IdleTimeOutHandler";
import Address from "./worker_ui_helpers/pages/Address.jsx";
import auth from "../../../utils/AuthService";

const EditWorkerPage = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const params = useParams();
  const [headers] = useState(AuthService.getHeaders());
  const [editDisabled, setEditDisabled] = useState(true);
  const [inputErr] = useState({});
  const { worker, basicInfo } = useSelector((state) => state.worker);
  const { editEnabled } = useSelector((state) => state.worker);
  const [pageIndex, setPageIndex] = useState("1");
  const [popUpMessage, setPopUpMessage] = useState({});
  const [openPopUp, setOpenPopUp] = useState(false);
  const [url] = useState(`${config.serverURL}/worker`);
  const [errorBanner, setErrorBanner] = useState(false);
  const { requiredErr } = useSelector((state) => state.worker);
  const { changesMade } = useSelector((state) => state.worker);
  const [canAddEdit, setCanAddEdit] = useState(false);
   const[isActive,setIsActive]=useState(true)
  const[isLogout,setLogout]=useState(false)
  const [resume, setResume] = useState({});
  const [newResume, setNewResume] = useState(null);
  const [replaceResumeEnabled, setReplaceResumeEnabled] = useState(false);
  
  const user = useMemo(() => auth.getUserInfo(), []);
  const [roleData,setRoleData]=useState(user.roles[0]);
  const [isAdmin, setIsAdmin] = useState(false);

  
  useEffect(() => {
    
    if (auth.hasAdminRole()) setIsAdmin(true);
  }, []);
  const logout = useCallback(() => {
    dispatch(setIsAuth(false));
    AuthService.logout();
  }, [dispatch]);

  useEffect(() => {
    if (AuthService.isAdminOrOperations()) setCanAddEdit(true)
  }, []);

  const dispatchEdit = useCallback(
    (object) => dispatch(setEditEnabled(object)),
    [dispatch]
  );

  const dispatchWorker = useCallback(
    (object) => dispatch(setWorker(object)),
    [dispatch]
  );

  const dispatchBasic = useCallback(
    (object) => dispatch(setBasicInfo(object)),
    [dispatch]
  );

  const dispatchProjectInfo = useCallback(
    (object) => dispatch(setProjectInfo(object)),
    [dispatch]
  );

  const dispatchWorkerInfo = useCallback(
    (object) => dispatch(setWorkerInfo(object)),
    [dispatch]
  );

  const dispatchReqErr = useCallback(
    (object) => dispatch(setRequiredErr(object)),
    [dispatch]
  );
  const dispatchChange = useCallback(
    (object) => dispatch(setChangesMade(object)),
    [dispatch]
  );
  const getWorker = useCallback(async () => {
    try {
      const id = params.workerId || worker.id;
      const response = await getWorkerById(headers, id);
      if (response.statusCode === 200) {
        dispatchWorker(response.workerData);
        dispatchBasic(response.workerData);
        dispatchProjectInfo(response.workerData);
        dispatchWorkerInfo(response.workerData);
        setResume(response.resumeData);

      } else if (response.statusCode === 401) {
        logout();
      }
    } catch (error) {
      console.log(error);
    }
  }, [headers, params.workerId, worker.id, dispatchWorker, dispatchBasic, dispatchProjectInfo, dispatchWorkerInfo, logout]);

  useEffect(() => {
    getWorker();
  }, [getWorker]);

  const toggleForm = () => {
    if (editEnabled) {
      confirmDiscardChanges();
    } else {
      dispatchEdit(!editEnabled);
      setEditDisabled(!editDisabled)
    }
  };

  const closePopUp = () => {
    setOpenPopUp(false);
    setPopUpMessage({});
  };
  const enableReplaceResume = () => {
    setReplaceResumeEnabled((prev) => !prev);
  };
  const uploadNewResume = (event) => {
    const maxAllowedSize = 1 * 1024 * 1024;
    if (event.target.files[0].size > maxAllowedSize) {
      dispatchReqErr({
        ...inputErr,
        [event.target.name]:
          "File is too big. Please select file with size < 1MB",
      });
      event.target.value = "";
    } else {
      dispatchChange(true);
      let temp = { ...inputErr };
      delete temp[event.target.name];
      dispatchReqErr(temp);
      let file = event.target.files[0];
      setNewResume(file);
    }
  };

  const handleRequiredCheck = (event) => {
    if (event.target.value === "") {
      dispatchReqErr({
        ...requiredErr,
        [event.target.name]: "Field is required",
      });
    } else {
      let temp = { ...requiredErr };
      delete temp[event.target.name];
      dispatchReqErr(temp);
    }
  };

  const setNavPage = (key) => {
    setPageIndex(key);
  };

  const preSubmitCheck = (event) => {
    event.preventDefault();
    if (
      Object.keys(inputErr).length > 0 ||
      Object.keys(requiredErr).length > 0
    ) {
      setErrorBanner(true);
      return;
    } else {
      setErrorBanner(false);
      const checkData = {
        firstName: basicInfo.firstName,
        lastName: basicInfo.lastName,
        email: basicInfo.email,
        phoneNumber: basicInfo.phoneNumber,
      };

      axios
        .post(`${url}/checks/${basicInfo.id}`, checkData, {
          headers,
        })
        .then((response) => {
          if (response.status === 200) {
            updateWorkerData(event);
          }
        })
        .catch((err) => {
          service.errLogout(err);
          setOpenPopUp(true);
          setPopUpMessage({
            title: "Error",
            details: `${err.response.data}`,
            confirmValue: "Close",
          });
        });
    }

  };

  const updateWorkerData = async (event) => {
    event.preventDefault();
    const messgKey = "isLoading";

    const workerData = {
      ...basicInfo,
      ProjectInfo: {
      },
      client: {
        clientName: basicInfo.client.clientName,
        id: basicInfo.client.id,
      },
      // resourceManager: {
      //   name: basicInfo.resourceManager.firstName,
      //   id: basicInfo.resourceManager.resourceManagerId,
      // },
    };

    try {
      const response = await updateWorker(
        headers,
        workerData,
        basicInfo.id,
      );
      if (response.statusCode === 200) {
        if (newResume) {
          updateResume();
        } else {
          resetAfterAPIRequest();
          setEditDisabled(true);
          dispatchBasic(response.data);
          dispatchProjectInfo(response.data.ProjectInfo);
          dispatchWorkerInfo(response.data.WorkerDetails);
          setResume(response.data.resume);

          message.success({
            content: "Worker updated!",
            messgKey,
            duration: 5,
            style: { marginTop: "5%" },
          });
        }
      } else {
        message.error({
          content: `An error occurred while saving changes (${response.statusCode})`,
          messgKey,
          duration: 10,
        });
      }
    } catch (error) {
      if (error.response?.status === 401) logout();
    }
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
      dispatchEdit(false);
    }
  };

  const updateResume = async () => {
    try {
      const formData = new FormData();
      formData.append("file", newResume);
      let updResponse = {};

      if (resume) {
        const delResponse = await deleteResume(headers, basicInfo.id);
        if (delResponse.status === 200)
          updResponse = await postResume(headers, basicInfo.id, formData);
      } else {
        updResponse = await postResume(headers, basicInfo.id, formData);
      }

      if (updResponse.status === 201) {
        setResume(newResume);
        dispatchBasic(updResponse.data);
        setResume(updResponse.data.resume);
        resetAfterAPIRequest();
        message.success({
          content: "Candidate updated!",
          duration: 5,
          style: { marginTop: "5%" },
        });
      }
    } catch (err) {
      message.error({
        content: `An error occurred while saving changes (${err.response?.status})`,
        duration: 10,
      });
    }
  };

  const resetAfterAPIRequest = () => {
    dispatchEdit(false);
    setReplaceResumeEnabled(false);
  }

  const closeForm = () => {
    dispatchBasic({});
    resetAfterAPIRequest();
    setResume({});
    history.push("/viewworkers");
  };

  const confirmDiscardChanges = () => {
    dispatchWorker(worker);
    dispatchEdit(false);
    setReplaceResumeEnabled(false);
    getWorker();
    setOpenPopUp(false);
    dispatchReqErr({});
    setErrorBanner(false);
    getWorker();
    setNewResume(null)
  };

  useEffect(() => {
    if (editEnabled && +pageIndex > 2) {
      setPageIndex("1");
    }
  }, [editEnabled, pageIndex]);

  return (
    <PageContainer>
      <PageHeader
        breadcrumbs={
          <Breadcrumbs
            className="header"
            crumbs={[
              { id: 0, text: "Workers", onClick: () => closeForm() },
              {
                id: 1,
                text: ` ${worker?.firstName} ${worker?.lastName}`,
                lastCrumb: true,
              },
            ]}
          />
        }
        actions={
          isAdmin||roleData.workerPermission ? (
            <>
              {editEnabled && (
                <>
                  <Button
                    type="button"
                    handleClick={preSubmitCheck}
                    className={"btn main submit marginX"}
                  >
                    Save Changes
                  </Button>
                  <Button
                    type="button"
                    handleClick={resetForm}
                    className={"btn main reset marginX"}
                  >
                    Cancel
                  </Button>
                </>
              )}
              <Workbench>
                <Button
                  type="button"
                  handleClick={toggleForm}
                  className="btn icon marginX"
                  title="Edit"
                >
                  <EditFilled />
                </Button>
                <Button
                  type="button"
                  disabled
                  className="btn icon marginX"
                  title="Share"
                >
                  <ShareAltOutlined />
                </Button>
                <Button
                  type="button"
                  disabled
                  className="btn icon marginX"
                  title="Export Report"
                >
                  <ExportOutlined />
                </Button>
              </Workbench>
            </>
          ):""
        }
      />
        <IdleTimeOutHandler 
    onActive={()=>{setIsActive(true)}} 
    onIdle={()=>{setIsActive(false)}}
    onLogout={()=>{setLogout(true)}}
    />
      <ContentPanels>
        {errorBanner && (
          <span className="fixed-error-banner">{`Resolve errors before submitting: ${Object.keys(
            inputErr
          )
            .concat(Object.keys(requiredErr))
            .join(", ")}`}</span>
        )}
        <Content className="x-small">
          <Form
            className="column small"
            onSubmit={preSubmitCheck}
            cancel={resetForm}
            formEnabled={editEnabled}
          >
            <BasicInfo
              logout={logout}
              handleRequiredCheck={handleRequiredCheck}
            />
          </Form>
        </Content>
        <Content className="medium">
          <TabsComponent
            activeKey={pageIndex}
            setActiveKey={setNavPage}
            position="top"
            items={[
              {
                key: "1",
                label: (
                  <span>
                    <HistoryOutlined /> Project History
                  </span>
                ),
                children: <WorkerHistory
                resume={resume}
                enableReplaceResume={enableReplaceResume}
                replaceResumeEnabled={replaceResumeEnabled}
                uploadNewResume={uploadNewResume}
                  />,
              },
              {
                key: "2",
                label: (
                  <span>
                    <AuditOutlined /> Address
                  </span>
                ),
                children: <Address  />,
              },
              {
                key: "3",
                label: (
                  <span>
                    <AuditOutlined /> Visa Details
                  </span>
                ),
                children: (
                  <VisaDetails id={params?.workerId || worker?.id} />
                ),
                disabled: editEnabled,
              },
              {
                key: "4",
                label: (
                  <span>
                    <CreditCardOutlined /> Rate Card Details
                  </span>
                ),
                children: (
                  <RateCardWorker id={params?.workerId || worker?.id} />

                ),
                disabled: editEnabled,
              },
            ]}
          />
        </Content>
      </ContentPanels>
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
    </PageContainer>
  );
};

export default EditWorkerPage;
