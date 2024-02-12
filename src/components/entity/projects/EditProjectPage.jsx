import { useEffect, useState, useCallback, useMemo } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { config } from "../../../config.js";
import * as service from "../../../utils/service.js";
import auth from "../../../utils/AuthService.js";
import { setIsAuth } from "../../../Redux/appSlice.js";
import { setRequiredErr,setEditEnabled,setBasicInfo,setProject, setShowProjectDetails} from "../../../Redux/projectSlice.js";
import { TabsComponent } from "../../common/tabs/TabsComponent";
import { PageContainer } from "../../container/page-container/PageContainer";
import { PageHeader } from "../../container/page-header/PageHeader.jsx";
import Breadcrumbs from "../../common/breadcrumbs/breadcrumbs.component.jsx";
import { Workbench } from "../../container/workbench-container/Workbench.jsx";
import Content from "../../container/content-container/content-container.component.jsx";
import BasicInfoProject from "./edit sections/BasicInfoProject.jsx";
import Form from "../../common/form/form.component.jsx";
import Button from "../../common/button/button.component.jsx";
import PopUp from "../../modal/popup/popup.component.jsx";
import { message } from "antd";
import { EditFilled, ShareAltOutlined, ExportOutlined,  } from "@ant-design/icons";
import IdleTimeOutHandler from "../../ui/Dashboard/IdleTimeOutHandler.js";
import {getProjectById, updateProject } from "../../../API/projects/projects-apis.js";
import ProjectDetails from "./edit sections/ProjectDetails.jsx";

const EditProjectPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const params = useParams();
  const headers = useMemo(() => auth.getHeaders(), []);
  const url = useMemo(() => `${config.serverURL}/projects`, []);
  const { basicInfo } = useSelector((state) => state.project);
  const { changesMade } = useSelector((state) => state.project);
  const { requiredErr } = useSelector((state) => state.project);
  const { editEnabled,showProjectDetails } = useSelector((state) => state.project);
  const [editDisabled, setEditDisabled] = useState(true);
  const [pageIndex, setPageIndex] = useState("1");
  const [inputErr] = useState({});
  const [errorBanner, setErrorBanner] = useState(false);
  const [popUpMessage, setPopUpMessage] = useState({});
  const [openPopUp, setOpenPopUp] = useState(false);
   const[isActive,setIsActive]=useState(true)
  const[setLogout]=useState(false)

  const logout = useCallback(() => {
    dispatch(setIsAuth(false));
    auth.logout();
  }, [dispatch]);

  const dispatchEdit = useCallback((object) => {
    dispatch(setEditEnabled(object));
    setPageIndex("1");
  }, [dispatch]);

  const closePopUp = () => {
    setOpenPopUp(false);
    setPopUpMessage({});
  };

  const toggleForm = () => {
    if (editEnabled) {
      confirmDiscardChanges();
    } else {
      dispatchEdit(!editEnabled);
      setEditDisabled(!editDisabled);
    }
  };

  const resetAfterAPIRequest = () => {
    dispatchEdit(false);
  };

  const dispatchProject = useCallback(
    (object) => dispatch(setProject(object)),
    [dispatch]
  );

  const dispatchBasic = useCallback(
    (object) => dispatch(setBasicInfo(object)),
    [dispatch]
  );

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

  useEffect(() => {
    if (showProjectDetails) {
      setPageIndex("2");
    }
  }, [showProjectDetails]);

  const dispatchReqErr = useCallback(
    (object) => dispatch(setRequiredErr(object)),
    [dispatch]
  );

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
        projectName: basicInfo.projectName,
        hiringManager: basicInfo.hiringManager,
        startDate: basicInfo.startDate,
        endDate: basicInfo.endDate,
      };

      axios
      .post(`${url}/checks/${basicInfo.id}`, checkData, {
        headers,
      })
        .then((response) => {
          if (response.status === 200) {
            updateProjectData(event);
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

  const updateProjectData = async (event) => {
    event.preventDefault();

    const messgKey = "isLoading";
    const projectData = {
      ...basicInfo,
    };

    try {
      const response = await updateProject(
        headers,
        projectData,
        basicInfo.id,
      );
      if (response.statusCode === 200) {
        if (0) {

        } else {
          resetAfterAPIRequest();
          setEditDisabled(true);
          dispatchBasic(response.data);
          dispatchProject(response.data.ProjectDetails);
          message.success({
            content: "Project updated!",
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

  const getProject = useCallback(async () => {
    try {
      const id = params?.managerId;
      if (!id) return;
      const response = await getProjectById(headers, id);

      if (response.statusCode === 200) {
        dispatchBasic(response.projectData);
      } else if (response.statusCode === 401) {
        logout();
      }
    } catch (error) {
      console.log(error);
    }
  }, [
    params?.managerId,
    headers,
    dispatchBasic,
    logout
  ]);

  useEffect(() => {
    getProject();
  }, [getProject]);

  const closeForm = () => {
    resetAfterAPIRequest();
    dispatchEdit(false);

    history.push("/viewprojects");
  };

  const setNavPage = (key) => {
    setPageIndex(key);
    dispatch(setShowProjectDetails(false));;
  };

  const confirmDiscardChanges = () => {
    dispatchProject({});
    dispatchEdit(false);
   getProject();
   setOpenPopUp(false);
    dispatchReqErr({});
    setErrorBanner(false);
  };

  return (
    <PageContainer>
    <PageHeader
      breadcrumbs={
        <Breadcrumbs
          className="header"
          crumbs={[
            { id: 0, text: "Project", onClick: () => closeForm() },
            {
              id: 1,
              text: `PRJ-${basicInfo?.client?.clientName.toUpperCase().substr(0, 3)}-${("00" + basicInfo?.id).slice(-5)}`,
              lastCrumb: true,
            },
          ]}
        />
      }
      actions={
        
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
        </>
        }
      />
       <IdleTimeOutHandler 
  onActive={()=>{setIsActive(true)}} 
  onIdle={()=>{setIsActive(false)}}
  onLogout={()=>{setLogout(true)}}
  />
   <div className="multi-content-container">
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
            <BasicInfoProject
              logout={logout}
              handleRequiredCheck={handleRequiredCheck}
            />
          </Form>
        </Content>
        <Content className="medium">
          <TabsComponent
            activeKey={pageIndex}
            setActiveKey={setNavPage}
            items={[

              {
                key: "1",
                label: (
                  <span>
                     Details
                  </span>
                ),
                children: <ProjectDetails />,
              },
             
            ]}
          />
        </Content>
      </div>

     
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

export default EditProjectPage;
