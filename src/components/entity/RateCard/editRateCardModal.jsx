import Content from "../../container/content-container/content-container.component";
import Form from "../../common/form/form.component";
import { useEffect,useState,useCallback } from "react";
import FormNav from "../../ui/form-nav/form-nav.component";
import Breadcrumbs from "../../common/breadcrumbs/breadcrumbs.component";
import Button from "../../common/button/button.component";
import { Workbench } from "../../container/workbench-container/Workbench";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { config } from "../../../config";
import * as service from "../../../utils/service.js";
import axios from "axios";
import AuthService from "../../../utils/AuthService";
import { setIsAuth } from "../../../Redux/appSlice.js";
import PopUp from "../../modal/popup/popup.component";
import { setRateCardDetails,setEditEnabled } from "../../../Redux/rateCardSlice";
import { formNavEditSteps } from "./utils/RateCardObjects";
import { getRateCardById,updateRateCard } from "../../../API/rateCard/rateCard-apis";
import { ShareAltOutlined, ExportOutlined, EditFilled } from "@ant-design/icons";
import { PageContainer } from "../../container/page-container/PageContainer.jsx";
import { PageHeader } from "../../container/page-header/PageHeader.jsx";
import { message } from "antd";
import { ContentPanels } from "../../container/content-panels-container/ContentPanels.jsx";
import Alert from "@mui/material/Alert";
import FeeDetails from "./ratecard_ui_helper/edit_sections/FeesDetails"
import RateCardDetails from "./ratecard_ui_helper/edit_sections/RateCardDetails"
import IdleTimeOutHandler from "../../ui/Dashboard/IdleTimeOutHandler";

const EditRateCardPage = () => {

    const params = useParams();
  const [currentPage, setCurrentPage] = useState("Fee Details");
  const [headers] = useState(AuthService.getHeaders());
  const history = useHistory();
  const [openPopUp, setOpenPopUp] = useState(false);
  const [url] = useState(`${config.serverURL}/ratecard`);
  const [inputErr] = useState({});
  const [errorBanner, setErrorBanner] = useState(false);
  const { editEnabled } = useSelector((state) => state.ratecard);
  const { rateCardDetails } = useSelector((state) => state.ratecard);
  const { requiredErr } = useSelector((state) => state.ratecard);
  const { changesMade } = useSelector((state) => state.ratecard);
  const dispatch = useDispatch();
  const [popUpMessage, setPopUpMessage] = useState({});
  const [isRecruiter, setIsRecruiter] = useState(false);
  const [isHr, setIsHr] = useState(false);
  const [isBDManager, setIsBDManager] = useState(false);
  const [isOperations, setIsOperations] = useState(false);
  const [errorMessage,] = useState("");
  const [editDisabled, setEditDisabled] = useState(true);

   const[isActive,setIsActive]=useState(true)
  const[isLogout,setLogout]=useState(false)
  
  const logout = useCallback(() => {
    dispatch(setIsAuth(false));
    AuthService.logout();
  }, [dispatch]);

  
  useEffect(() => {
    if (AuthService.hasHRRole()) setIsHr(true);
    if (AuthService.hasBDManagerRole()) setIsBDManager(true);
    if (AuthService.hasRecruiterRole()) setIsRecruiter(true);
    if (AuthService.hasOperationsRole()) setIsOperations(true)
  }, []);

    const dispatchEdit = useCallback(
    (object) => dispatch(setEditEnabled(object)),
    [dispatch]
  );

  const dispatchRateCardDetails = useCallback(
    (object) => dispatch(setRateCardDetails(object)),
    [dispatch]
  );

  const getRateCard = useCallback(async () => {
    try {
      const id = params?.rateCardId;
      if (!id) return;
      const response = await getRateCardById(headers, id);

      if (response.statusCode === 200) {
        dispatchRateCardDetails(response.rateCardData);
      } else if (response.statusCode === 401) {
        logout();
      }
    } catch (error) {
      console.log(error);
    }
  }, [
    params?.rateCardId,
    headers,
    dispatchRateCardDetails,
    logout,
  ]);

  useEffect(() => {
    getRateCard();
  }, [ editDisabled,editEnabled, getRateCard]);

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
        .post(`${url}/checks/${rateCardDetails.id}`, checkData, {
          headers,
        })
        .then((response) => {
          if (response.status === 200) {
            updateRateCardData(event);
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

    const updateRateCardData = async (event) => {
        event.preventDefault();
        const messgKey = "isLoading";
        const rateCardData = {
          ...rateCardDetails,
        //   vmsFees:rateCardDetails.billRatePerHr * (rateCardDetails.vmsPercentage / 100),
        // vmsbillRate: rateCardDetails.billRatePerHr - (rateCardDetails.billRatePerHr * rateCardDetails.vmsPercentage) / 100,
        //   grossMargin:rateCardDetails.billRatePerHr -
        //   (rateCardDetails.billRatePerHr * rateCardDetails.vmsPercentage) / 100 - rateCardDetails.costToCompanyPerHour,
         }
        try {
          const response = await updateRateCard(
            headers,
            rateCardData,
            rateCardDetails.id);
          if (response.statusCode === 200) {
            if (0) {
            } else {
              resetAfterAPIRequest();
              setEditDisabled(true);
              dispatchRateCardDetails(response.data);
              message.success({
                content: "visa updated!",
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

      const setNavPage = (page) => {
        setCurrentPage(page.title);
      };

      const closePopUp = () => {
        setOpenPopUp(false);
        setPopUpMessage({});
      };  

      const closeForm = () => {
        resetAfterAPIRequest();
        dispatchEdit(false);
        history.push("/viewratecards");
      };
    
      const confirmDiscardChanges = () => {
        dispatchRateCardDetails();
        dispatchEdit(false);
      };

      
    const resetAfterAPIRequest = () => {
        dispatchEdit(false);
        // dispatch(setOnbordingDetails({}));
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
              { id: 0, text: "RateCard", onClick: () => closeForm() },
              {
                id: 1,
                text: `${rateCardDetails?.worker?.firstName} ${rateCardDetails?.worker?.lastName}`,
                lastCrumb: true,
              },
            ]}
          />
        }
        actions={
          !isRecruiter &&
          !isBDManager &&
          !isHr &&
          !isOperations && (
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
          )
        }
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
          <Form className="column small"
            onSubmit={preSubmitCheck}
            cancel={resetForm}
            formEnabled={editEnabled}
          >
            <RateCardDetails />
            {errorMessage && (
              <Alert
                severity="error"
                style={{ width: "100%", marginBottom: "10px" }}
              >
                {errorMessage}
              </Alert>
            )}
          </Form>
        </Content>
        <Content className="medium">
          <FormNav
            steps={formNavEditSteps()}
            submit={preSubmitCheck}
            reset={resetForm}
            canSubmit={editEnabled}
            setCurrentPage={setNavPage}
            clickable={true}
            type="navigation"
            hideNavBtns={true}
          // index={pageIndex}
          >
            <Form>
              {currentPage === "Fee Details" && <FeeDetails />}
            </Form>
          </FormNav>
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
        </Content>
      </ContentPanels>
    </PageContainer>
  );
};
export default EditRateCardPage;
