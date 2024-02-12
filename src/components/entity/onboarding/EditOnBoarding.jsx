import { useEffect, useState, useCallback ,useMemo} from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { config } from "../../../config";
import auth from "../../../utils/AuthService.js";
import AuthService from "../../../utils/AuthService";
import * as service from "../../../utils/service.js";
import { setIsAuth } from "../../../Redux/appSlice.js";
import { setEditEnabled, setBasicInfo, setOnbordingDetails, } from "../../../Redux/onBoarding";
import { getOnBoardingById, updateOnBoarding, } from "../../../API/onboarding/onBoarding-apis";
import BasicInfo from "./onboard_ui_helpers/edit_sections/BasicInfoOnBoard";
import OnboardingDetails from "./onboard_ui_helpers/edit_sections/OnboardingDetails";
import Content from "../../container/content-container/content-container.component.jsx";
import Form from "../../common/form/form.component";
import Breadcrumbs from "../../common/breadcrumbs/breadcrumbs.component.jsx";
import Button from "../../common/button/button.component.jsx";
import PopUp from "../../modal/popup/popup.component";
import { PageContainer } from "../../container/page-container/PageContainer";
import { PageHeader } from "../../container/page-header/PageHeader";
import { ContentPanels } from "../../container/content-panels-container/ContentPanels";
import { Workbench } from "../../container/workbench-container/Workbench";
import { TabsComponent } from "../../common/tabs/TabsComponent";
import { message } from "antd";
import IdleTimeOutHandler from "../../ui/Dashboard/IdleTimeOutHandler";
import { EditFilled, ShareAltOutlined, ExportOutlined, InfoCircleOutlined } from "@ant-design/icons";

const EditOnboardingPage = () => {
  const params = useParams();
  const [currentPage, setCurrentPage] = useState("1");
  const [editDisabled, setEditDisabled] = useState(true);
  const [headers] = useState(AuthService.getHeaders());
  const history = useHistory();
  const { editEnabled } = useSelector((state) => state.onBoarding);
  const [openPopUp, setOpenPopUp] = useState(false);
  const { changesMade } = useSelector((state) => state.onBoarding);
  const [url] = useState(`${config.serverURL}/onboarding`);
  const [inputErr] = useState({});
  const { basicInfo } = useSelector((state) => state.onBoarding);
  const { requiredErr } = useSelector((state) => state.onBoarding);
  const[isActive,setIsActive]=useState(true)
  const[isLogout,setLogout]=useState(false)
  const [isAdmin, setIsAdmin] = useState(false);
  const user = useMemo(() => auth.getUserInfo(), []);
  const [roleData,setRoleData]=useState(user.roles[0]);
  useEffect(() => {
    if (auth.hasAdminRole()) setIsAdmin(true);
  }, []);

  const dispatch = useDispatch();
  const [popUpMessage, setPopUpMessage] = useState({});

  const logout = useCallback(() => {
    dispatch(setIsAuth(false));
    auth.logout();
  }, [dispatch]);

  const dispatchBasic = useCallback(
    (object) => dispatch(setBasicInfo(object)),
    [dispatch]
  );

  const dispatchEdit = useCallback(
    (object) => dispatch(setEditEnabled(object)),
    [dispatch]
  );

  const dispatchOnboardingDetails = useCallback(
    (object) => dispatch(setOnbordingDetails(object)),
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
    }
    else {
      dispatchEdit(false);
    }
  };

  const getOnBoarding = useCallback(async () => {
    try {
      const id = params?.onboardingId;
      if (!id) return;
      const response = await getOnBoardingById(headers, id);

      if (response.statusCode === 200) {
        dispatchBasic(response.onBoardingdata);
        dispatchOnboardingDetails(response.onBoardingdata);
      } else if (response.statusCode === 401) {
        logout();
      }
    } catch (error) {
      console.log(error);
    }
  }, [
    params?.onboardingId,
    headers,
    dispatchBasic,
    dispatchOnboardingDetails,
    logout,
  ]);

  useEffect(() => {
    getOnBoarding();
  }, [editDisabled, editEnabled, getOnBoarding]);

  const preSubmitCheck = (event) => {
    event.preventDefault();
    if (
      Object.keys(inputErr).length > 0 ||
      Object.keys(requiredErr).length > 0
    ) {
      return;
    }
    else {
      const checkData = {};
      axios
        .post(`${url}/checks/${basicInfo.id}`, checkData, { headers, })
        .then((response) => {
          if (response.status === 200) {
            updateOnBoardingdata(event);
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
  const setNavPage = (key) => {
    setCurrentPage(key);
  };
  const updateOnBoardingdata = async (event) => {
    event.preventDefault();
    const messgKey = "isLoading";

    try {
      const response = await updateOnBoarding(
        headers,
        basicInfo,
        params?.onboardingId);
      if (response.statusCode === 200) {
        if (0) {
        } else {
          resetAfterAPIRequest();
          setEditDisabled(true);
          dispatchBasic(response.data);
          dispatchOnboardingDetails(response.data.ProjectInfo);
          message.success({
            content: "onBoarding updated!",
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
    history.push("/viewonboardings");
  };
  const confirmDiscardChanges = () => {
    dispatchBasic();
    dispatchEdit(false);
    dispatchOnboardingDetails({});
  };
  const resetAfterAPIRequest = () => {
    dispatchEdit(false);
    dispatch(setOnbordingDetails({}));
  };

  const toggleForm = () => {
    if (editEnabled) {
      confirmDiscardChanges();
    } else {
      dispatchEdit(!editEnabled);
      setEditDisabled(!editDisabled);
    }
  };
  return (
    <PageContainer>
      <PageHeader
        breadcrumbs={
          <Breadcrumbs
            className="header"
            crumbs={[
              { id: 0, text: "Onboardings", onClick: () => closeForm() },
              {
                id: 1,
                text: `${basicInfo?.candidate?.firstName} ${basicInfo?.candidate?.lastName}`,
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
      <ContentPanels>
        <Content className="x-small">
          <Form
            className="column small"
            onSubmit={preSubmitCheck}
            cancel={resetForm}
            formEnabled={editEnabled}
          >
            <BasicInfo />
          </Form>
        </Content>
        <Content className="medium">
          <TabsComponent
            activeKey={currentPage}
            setActiveKey={setNavPage}
            items={[
              {
                key: "1",
                label: (
                  <span>
                    <InfoCircleOutlined /> Details
                  </span>
                ),
                children: <OnboardingDetails />,
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
export default EditOnboardingPage;
