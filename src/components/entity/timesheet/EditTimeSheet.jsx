import Content from "../../container/content-container/content-container.component.jsx";
import Form from "../../common/form/form.component";
import { useEffect, useState, useCallback, useMemo } from "react";
import Breadcrumbs from "../../common/breadcrumbs/breadcrumbs.component.jsx";
import Button from "../../common/button/button.component.jsx";
import { Workbench } from "../../container/workbench-container/Workbench.jsx";
import { ContentPanels } from "../../container/content-panels-container/ContentPanels";
import auth from "../../../utils/AuthService";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { config } from "../../../config";
import * as service from "../../../utils/service.js";
import axios from "axios";
import AuthService from "../../../utils/AuthService";
import { setIsAuth } from "../../../Redux/appSlice.js";
import PopUp from "../../modal/popup/popup.component";
import BasicInfo from "./timesheet_ui_helpers/pages/BasicInfo.jsx";
import Comments from "./timesheet_ui_helpers/pages/Comments.jsx";
import { setEditEnabled, setTimeSheetDetails,setRequiredErr, setTimeSheet} from "../../../Redux/timesheetSlice.js";
import { getTimeSheetById,updateTimeSheet } from "../../../API/timesheet/timesheet apis.js";
import { ShareAltOutlined, ExportOutlined, EditFilled } from "@ant-design/icons";
import { PageContainer } from "../../container/page-container/PageContainer.jsx";
import { PageHeader } from "../../container/page-header/PageHeader.jsx";
import { message } from "antd";
import IdleTimeOutHandler from "../../ui/Dashboard/IdleTimeOutHandler.js";
import { TabsComponent } from "../../common/tabs/TabsComponent";
import { CommentOutlined } from '@ant-design/icons';

const EditTimeSheet = () => {
  const params = useParams();
  const [editDisabled, setEditDisabled] = useState(true);
  const [headers] = useState(AuthService.getHeaders());
  const history = useHistory();
  const [openPopUp, setOpenPopUp] = useState(false);
  const [url] = useState(`${config.serverURL}/timesheet`);
  const [inputErr] = useState({});
  const [errorBanner, setErrorBanner] = useState(false);
  const { editEnabled } = useSelector((state) => state.timesheet);
  const { timeSheetDetails, } = useSelector((state) => state.timesheet);
  const { requiredErr } = useSelector((state) => state.timesheet);
  const { changesMade } = useSelector((state) => state.timesheet);
  const dispatch = useDispatch();
  const [popUpMessage, setPopUpMessage] = useState({});
  const canEdit = useMemo(() => AuthService.isAdminOrOperations(), []);
  const[isActive,setIsActive]=useState(true)
  const[isLogout,setLogout]=useState(false)
  const [pageIndex, setPageIndex] = useState("1");
  const user = useMemo(() => auth.getUserInfo(), []);
  const [roleData,setRoleData]=useState(user.roles[0]);
  const [isAdmin, setIsAdmin] = useState(false);
  const[managerRole,setManagerRole]= useState(false);
  
  useEffect(() => {
    
    if (auth.hasAdminRole()) setIsAdmin(true);
  }, []);
  const logout = useCallback(() => {
    dispatch(setIsAuth(false));
    AuthService.logout();
  }, [dispatch]);

  const dispatchEdit = useCallback(
    (object) => dispatch(setEditEnabled(object)),
    [dispatch]
  );

  const dispatchTimeSheetDetails = useCallback(
    (object) => dispatch(setTimeSheetDetails(object)),
    [dispatch]
  );

  const dispatchTimeSheet = useCallback(
    (object) => dispatch(setTimeSheet(object)),
    [dispatch]
  );

  const dispatchReqErr = useCallback(
    (object) => dispatch(setRequiredErr(object)),
    [dispatch]
  );

//   const getTimeSheet = useCallback(async () => {
//     try {
//       const id = params?.id;
//       if (!id) return;
//       const response = await axios.get(`${url}/${id}`, { headers });;

//       if (response.statusCode === 200) {
//         dispatchTimeSheetDetails(response.timeSheetData);
//       } else if (response.statusCode === 401) {
//         logout();
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   }, [
//     params?.id,
//     headers,
// dispatchTimeSheetDetails,
//     logout,
//   ]);
  const setNavPage = (key) => {
    setPageIndex(key);
  };

const getTimeSheet = useCallback(async () => {
  try {
    const id =  params.timesheetId || timeSheetDetails.id
    const response = await getTimeSheetById(headers, id);
    if (response.statusCode === 200) {
      dispatchTimeSheet(response.timeSheetData);
      dispatchTimeSheetDetails(response.timeSheetData);

    } else if (response.statusCode === 401) {
      logout();
    }
  } catch (error) {
    console.log(error);

  }
}, [headers,timeSheetDetails?.id,  params.timesheetId, dispatchTimeSheet, dispatchTimeSheetDetails, logout]);


  useEffect(() => {
    getTimeSheet();
  }, [getTimeSheet]);

  const resetForm = () => {
    if (changesMade) {
      setOpenPopUp(true);
      setPopUpMessage({
        title: "Confirm Discard Changes",
        details: "All changes will be discarded, proceed?",
        confirmValue: "Confirm",
        cancelValue: "Cancel",
      });
    }
    else {
      dispatchEdit(false);
    }
  };
 console.log(timeSheetDetails)
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
      const checkData = {};
      axios
        .post(`${url}/checks/${timeSheetDetails.id}`, checkData, {
          headers,
        })
        .then((response) => {
          if (response.status === 200) {
            updateTimeSheetdata(event);
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

  const updateTimeSheetdata = async (event) => {
    event.preventDefault();
    const messgKey = "isLoading";
    const timeSheetData = {
      ...timeSheetDetails,
      
    }

    try {
      const response = await updateTimeSheet(
        headers,
        timeSheetData,
        timeSheetDetails.id);
      if (response.statusCode === 200) {
        if (0) {
        } else {
          resetAfterAPIRequest();
          setEditDisabled(true);
          dispatchTimeSheetDetails(response.data);
          message.success({
            content: "timesheet updated!",
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

  const closePopUp = () => {
    setOpenPopUp(false);
    setPopUpMessage({});
  };

  const closeForm = () => {
    resetAfterAPIRequest();
    dispatchEdit(false);
    history.push("/viewtimesheet");
  };

  const confirmDiscardChanges = () => {
    dispatchTimeSheetDetails();
    dispatchEdit(false);
  };

  const resetAfterAPIRequest = () => {
    dispatchEdit(false);
  };

  const toggleForm = () => {
    if (editEnabled) {
      confirmDiscardChanges();
    } else {
      dispatchEdit(!editEnabled);
      setEditDisabled(!editDisabled);
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
console.log(timeSheetDetails)
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
              { id: 0, text: "All TimeSheet", onClick: () => closeForm() },
              {
                id: 1,
                text: `${timeSheetDetails?.worker?.firstName} ${timeSheetDetails?.worker?.lastName}`,
                lastCrumb: true,
              },
            ]}
          />
        }
        actions={
          isAdmin||roleData.workerPermission ?  (
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
          ):""
        }
      />
      {/* <Content>
        {errorBanner && (
          <span className="fixed-error-banner">{`Resolve errors before submitting: ${Object.keys(
            inputErr
          )
            .concat(Object.keys(requiredErr))
            .join(", ")}`}</span>
        )}
        <Form
          onSubmit={preSubmitCheck}
          cancel={resetForm}
          formEnabled={editEnabled}
        >
          <BasicInfo />
        </Form>
        <Comments />
      </Content> */}
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
                    <CommentOutlined />Comments
                  </span>
                ),
                children: <Comments
                  />,
              }
             
            
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
export default EditTimeSheet;
