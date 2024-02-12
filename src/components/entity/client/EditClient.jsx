
import { useEffect, useState, useCallback, useMemo } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { config } from "../../../config.js";
import * as service from "../../../utils/service.js";
import auth from "../../../utils/AuthService.js";
import { setRequiredErr, setClient, setEditEnabled, setBasicInfo, setClientTaxes } from "../../../Redux/clientSlice.js";
import { setIsAuth } from "../../../Redux/appSlice.js";
import { setAddComment, setNewComment, setShowComments } from "../../../Redux/clientSlice.js";
import { getClientById, updateClient } from "../../../API/clients/clients-apis.js";
import { TabsComponent } from "../../common/tabs/TabsComponent";
import { PageContainer } from "../../container/page-container/PageContainer";
import { PageHeader } from "../../container/page-header/PageHeader.jsx";
import Breadcrumbs from "../../common/breadcrumbs/breadcrumbs.component.jsx";
import { Workbench } from "../../container/workbench-container/Workbench.jsx";
import Content from "../../container/content-container/content-container.component.jsx";
import Comments from "./client_ui_helpers/edit_sections/Comments.jsx";
import BasicInfo from "./client_ui_helpers/edit_sections/BasicInfo.jsx";
import ClientDetails from "./client_ui_helpers/edit_sections/ClientDetails.jsx";
import { Jobs } from "./client_ui_helpers/edit_sections/Jobs.jsx";
import Form from "../../common/form/form.component.jsx";
import Button from "../../common/button/button.component.jsx";
import PopUp from "../../modal/popup/popup.component.jsx";
import { CommentOutlined, InfoCircleOutlined, DatabaseOutlined, ShareAltOutlined, ExportOutlined, EditFilled } from '@ant-design/icons';
import { message } from "antd";
import IdleTimeOutHandler from "../../ui/Dashboard/IdleTimeOutHandler.js";

const EditClientPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const params = useParams();
  const headers = useMemo(() => auth.getHeaders(), []);

  const url = useMemo(() => `${config.serverURL}/clients`, []);
  const { basicInfo, client } = useSelector((state) => state.client);
  const { changesMade } = useSelector((state) => state.client);
  const { requiredErr } = useSelector((state) => state.client);
  const { editEnabled, showComments } = useSelector((state) => state.client);
  const [editDisabled, setEditDisabled] = useState(true);
  const [pageIndex, setPageIndex] = useState("1");
  const [inputErr] = useState({});
  const [errorBanner, setErrorBanner] = useState(false);
  const [popUpMessage, setPopUpMessage] = useState({});
  const [openPopUp, setOpenPopUp] = useState(false);
   const[isActive,setIsActive]=useState(true)
  const[isLogout,setLogout]=useState(false)
  const [isAdmin, setIsAdmin] = useState(false);
  const user = useMemo(() => auth.getUserInfo(), []);
  const [roleData,setRoleData]=useState(user.roles[0]);
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
    dispatch(setAddComment(false));
    dispatch(setNewComment({}));
  };

  const dispatchNewComment = useCallback(
    (object) => dispatch(setNewComment(object)),
    [dispatch]
  );

  const dispatchClient = useCallback(
    (object) => dispatch(setClient(object)),
    [dispatch]
  );

  const dispatchBasic = useCallback(
    (object) => dispatch(setBasicInfo(object)),
    [dispatch]
  );

  const dispatchClientTax = useCallback(
    (object) => dispatch(setClientTaxes(object)),
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
    if (showComments) {
      setPageIndex("2");
    }
  }, [showComments]);

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
        clientName: basicInfo.clientName,
        webSite: basicInfo.webSite,
        phoneNumber: basicInfo.phoneNumber,
      };

      axios
        .post(`${url}/checks/${basicInfo.id}`, checkData, {
          headers,
        })
        .then((response) => {
          if (response.status === 200) {
            updateClientData(event);
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

  const updateClientData = async (event) => {
    event.preventDefault();

    const messgKey = "isLoading";
    const { clientName, id, phoneNumber, website, comments, address, vmsFees, adminFees, rebateFees } = basicInfo;
    const clientdata = {
      ...basicInfo,
      client: {
        clientName, id, phoneNumber, website, comments, address, vmsFees, adminFees, rebateFees, user: basicInfo.user || user.username
      },
    };

    updateClient(headers, clientdata.client, clientdata.client.id)
      .then(response => {
        if (response.statusCode === 200) {
          resetAfterAPIRequest();
          setEditDisabled(true);
          dispatchBasic(response.data);
          dispatchClientTax({ clientTaxes: response.data.clientTaxes });
          message.success({
            content: "Client updated!",
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

  const getClients = useCallback(async () => {
    const id = params?.clientId || client?.id;
    if (!id) return;
    getClientById(headers, id)
      .then(response => {
        if (response.statusCode === 200) {
          dispatchBasic(response.clientdata);
          dispatchClientTax({ clientTaxes: response.clientdata.clientTaxes });
        } else if (response.statusCode === 401) {
          logout();
        }
      })
  }, [params?.clientId, client?.id, headers, logout, dispatchBasic, dispatchClientTax]);

  useEffect(() => {
    getClients();
  }, [getClients]);

  const closeForm = () => {
    resetAfterAPIRequest();
    dispatchEdit(false);

    history.push("/viewclients");
  };

  const setNavPage = (key) => {
    setPageIndex(key);
    dispatch(setShowComments(false));
  };

  const confirmDiscardChanges = () => {
    dispatchClient(client);
    dispatchEdit(false);
    getClients();
    dispatchNewComment({});
  };

  return (
    <PageContainer>
      <PageHeader
        breadcrumbs={
          <Breadcrumbs
            className="header"
            crumbs={[
              { id: 0, text: "Clients", onClick: () => closeForm() },
              {
                id: 1,
                text: ` ${basicInfo?.clientName} (${basicInfo?.address?.city})`,
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
              {!auth.hasRecruiterRole() && 
              
              ( isAdmin || roleData.managerPermission || roleData.candidatesPermission  ||roleData.clientPermission  ||roleData.interviewsPermission  ||roleData.jobOpeningsPermission  ||roleData.onBoardingsPermission ||roleData.settingsPermission  ||roleData.suppliersPermission ?
                <Button
                  type="button"
                  handleClick={toggleForm}
                  className="btn icon marginX"
                  title="Edit"
                >
                  <EditFilled />
                </Button>:""
    )}
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
            items={[
              {
                key: "1",
                label: (
                  <span>
                    <InfoCircleOutlined /> Details
                  </span>
                ),
                children: <ClientDetails />,
              },
              {
                key: "2",
                label: (
                  <span>
                    <CommentOutlined /> Comments
                  </span>
                ),
                children: <Comments />,
              },
              {
                key: "3",
                label: (
                  <span>
                    <DatabaseOutlined /> Jobs
                  </span>
                ),
                children: <Jobs id={params?.clientId || client?.id} />,
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

export default EditClientPage;
