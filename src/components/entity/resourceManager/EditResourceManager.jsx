
import { useEffect, useState, useCallback, useMemo } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { config } from "../../../config.js";
import * as service from "../../../utils/service.js";
import auth from "../../../utils/AuthService.js";
import { setIsAuth } from "../../../Redux/appSlice.js";
import { PageContainer } from "../../container/page-container/PageContainer";
import { PageHeader } from "../../container/page-header/PageHeader.jsx";
import Breadcrumbs from "../../common/breadcrumbs/breadcrumbs.component.jsx";
import { Workbench } from "../../container/workbench-container/Workbench.jsx";
import Content from "../../container/content-container/content-container.component.jsx";
import Form from "../../common/form/form.component.jsx";
import Button from "../../common/button/button.component.jsx";
import PopUp from "../../modal/popup/popup.component.jsx";
import { message } from "antd";
import IdleTimeOutHandler from "../../ui/Dashboard/IdleTimeOutHandler.js";
import {setEditEnabled,setManager,setBasicInfo,setRequiredErr,setShowManagerComments} from "../../../Redux/managerSlice.js";
import { getManagerById,updateManager } from "../../../API/resourcemanagers/resourcemanagers_api.js";
import { CommentOutlined,ShareAltOutlined, ExportOutlined, EditFilled } from '@ant-design/icons';
import ResourceManagerComments from "./edit_sections/ResourceManagerComments.jsx";
import BasicInfoManager from "./edit_sections/BasicInfo.jsx";
import { TabsComponent } from "../../common/tabs/TabsComponent";

const EditResourceManager = () => {

  const dispatch = useDispatch();
  const history = useHistory();
  const params = useParams();
  const headers = useMemo(() => auth.getHeaders(), []);
  const user = useMemo(() => auth.getUserInfo(), []);
  const url = useMemo(() => `${config.serverURL}/resourcemanager`, []);
  const [inputErr] = useState({});
  const [errorBanner, setErrorBanner] = useState(false);
  const [popUpMessage, setPopUpMessage] = useState({});
  const { basicInfo,manager } = useSelector((state) => state.manager);
  const { changesMade } = useSelector((state) => state.manager);
  const { requiredErr } = useSelector((state) => state.manager);
  const { editEnabled, showManagerComments } = useSelector((state) => state.manager);
  const [editDisabled, setEditDisabled] = useState(true);
  const [pageIndex, setPageIndex] = useState("1");
  const [openPopUp, setOpenPopUp] = useState(false);
   const[isActive,setIsActive]=useState(true)
  const[isLogout,setLogout]=useState(false)
  const [isAdmin, setIsAdmin] = useState(false);
  const [roleData,setRoleData]=useState(user.roles[0]);
console.log(user)
useEffect(() => {
  if (auth.hasAdminRole()) setIsAdmin(true);
}, []);
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
    // dispatch(setAddComment(false));
    // dispatch(setNewComment({}));
  };

  const dispatchManager = useCallback(
    (object) => dispatch(setManager(object)),
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
    if (showManagerComments) {
      setPageIndex("2");
    }
  }, [showManagerComments]);

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
        // firstName: basicInfo.firstName,
        // lastName: basicInfo.lastName,
        // email: basicInfo.email,
        // phone_no: basicInfo.phone_no,
        // role:basicInfo.role,
        // startDate: basicInfo.startDate,
        // endDate: basicInfo.endDate,
        // comments: basicInfo.comments,
    

      };

      axios
        .post(`${url}/checks/${basicInfo.resourceManagerId}`, checkData, {
          headers,
        })
        .then((response) => {
          if (response.status === 200) {
            updateManagerData(event);
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

  const updateManagerData = async (event) => {
    event.preventDefault();

    const messgKey = "isLoading";
   //  const { name, id, phone_no,role, startDate,endDate, email } = basicInfo;
    const managerData = {
      ...basicInfo,
      // manager: {
      //   name, id, phone_no,role, startDate,endDate, email
      // },
    };
    updateManager(headers, managerData, basicInfo.resourceManagerId)
    .then(response => {
      if (response.statusCode === 200) {
        resetAfterAPIRequest();
        setEditDisabled(true);
        dispatchBasic(response.data);
        message.success({
          content: "manager updated!",
          messgKey,
          duration: 5,
          style: { marginTop: "5%" },
        });
      } else {
        message.error({
          content: `An error occurred while saving changes (${response.statusCode})`,
          messgKey,
          duration: 10,
        });
      }
    })
};

  
  


  const getManagers = useCallback(async () => {
    try {
      const id = params?.resourceManagerId;
      if (!id) return;
      const response = await getManagerById(headers, id);

      if (response.statusCode === 200) {
        dispatchBasic(response.managerData);
      } else if (response.statusCode === 401) {
        logout();
      }
    } catch (error) {
      console.log(error);
    }
  }, [
    params?.resourceManagerId,
    headers,
    dispatchBasic,
    logout
  ]);

  useEffect(() => {
    getManagers();
  }, [getManagers]);

  const closeForm = () => {
    resetAfterAPIRequest();
    dispatchEdit(false);

    history.push("/viewresourceManager");
  };

  const setNavPage = (key) => {
    setPageIndex(key);
    dispatch(setShowManagerComments(false));;
  };

  const confirmDiscardChanges = () => {
    dispatchManager(manager);
    dispatchEdit(false);
    getManagers();
    // dispatchNewComment({});
  };

  return (

      <PageContainer>
    <PageHeader
      breadcrumbs={
        <Breadcrumbs
          className="header"
          crumbs={[
            { id: 0, text: "Manager", onClick: () => closeForm() },
            {
              id: 1,
              text: `${basicInfo?.firstName} ${basicInfo?.lastName}`,
              lastCrumb: true,
            },
          ]}
        />
      }
      actions={
        
        <Workbench>
          {isAdmin || roleData.managerPermission  ?
          <Button
            type="button"
            handleClick={toggleForm}
            className="btn icon marginX"
            title="Edit"
          >
            <EditFilled />
          </Button>
          :""
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
            <BasicInfoManager
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
                    <CommentOutlined /> Comments
                  </span>
                ),
                children: <ResourceManagerComments />,
              },
             
            ]}
          />
        </Content>
      </div>
    {/* <ContentPanels>
      <Content className="x-small">
        <Form
          className="column small"
           submit={updateManager}
          cancel={resetForm}
          formEnabled={editEnabled}
        >
          <BasicInfoManager 
            logout={logout}
            handleRequiredCheck={handleRequiredCheck}
            />
        </Form>
      </Content>

      <Content className="medium">
        <FormNav
          steps={formNavEditSteps()}
           submit={updateManagerData}
          reset={resetForm}
          canSubmit={editEnabled}
          setCurrentPage={setNavPage}
          clickable={true}
          type="navigation"
          hideNavBtns={true}
          index={pageIndex}
        >
          <Form>
            {currentPage === "ResourceManagerComments" && <ResourceManagerComments/>}
          </Form> */}

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

export default EditResourceManager;
