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
import { setCommissionTypeDetails,setEditEnabled } from "../../../Redux/commissionTypeSlice.js";
import { getCommissionTypesById,updateCommissionType } from "../../../API/commissionType/commission-apis.js";
import { ShareAltOutlined, ExportOutlined, EditFilled } from "@ant-design/icons";
import { PageContainer } from "../../container/page-container/PageContainer.jsx";
import { PageHeader } from "../../container/page-header/PageHeader.jsx";
import { message } from "antd";
import { ContentPanels } from "../../container/content-panels-container/ContentPanels.jsx";
import Alert from "@mui/material/Alert";
import IdleTimeOutHandler from "../../ui/Dashboard/IdleTimeOutHandler";
import BasisCommissionType from "./edit_sections/BasicCommType.jsx";
import Comments from "./edit_sections/Comments.jsx";
import { TabsComponent } from "../../common/tabs/TabsComponent.jsx";
import { CommentOutlined } from '@ant-design/icons';

const EditCommissionTypePage = () => {

    const params = useParams();
   const [pageIndex, setPageIndex] = useState("1");

  const [headers] = useState(AuthService.getHeaders());
  const history = useHistory();
  const [openPopUp, setOpenPopUp] = useState(false);
  const [url] = useState(`${config.serverURL}/commissionType`);
  const [inputErr] = useState({});
  const [errorBanner, setErrorBanner] = useState(false);
  const { editEnabled } = useSelector((state) => state.commissionType);
  const { commissionTypeDetails } = useSelector((state) => state.commissionType);
  const { requiredErr } = useSelector((state) => state.commissionType);
  const { changesMade } = useSelector((state) => state.commissionType);
  const dispatch = useDispatch();
  const [popUpMessage, setPopUpMessage] = useState({});

  const [errorMessage,] = useState("");
  const [editDisabled, setEditDisabled] = useState(true);

   const[isActive,setIsActive]=useState(true)
  const[isLogout,setLogout]=useState(false)
  
  const logout = useCallback(() => {
    dispatch(setIsAuth(false));
    AuthService.logout();
  }, [dispatch]);



    const dispatchEdit = useCallback(
    (object) => dispatch(setEditEnabled(object)),
    
    [dispatch]
  );
  useEffect(() => {
    if (editEnabled && +pageIndex > 2) {
      setPageIndex("1");
    }
  }, [editEnabled, pageIndex]);
  const setNavPage = (key) => {
    setPageIndex(key);
  };
  const dispatchCommTypeDetails = useCallback(
    (object) => dispatch(setCommissionTypeDetails(object)),
    [dispatch]
  );

  const getCommissionType = useCallback(async () => {
    try {
      const id = params?.commTypeId;
      if (!id) return;
      const response = await getCommissionTypesById(headers, id);

      if (response.statusCode === 200) {
        dispatchCommTypeDetails(response.commTypeData);
      } else if (response.statusCode === 401) {
        logout();
      }
    } catch (error) {
      console.log(error);
    }
  }, [
    params?.commTypeId,
    headers,
    dispatchCommTypeDetails,
    logout,
  ]);

  useEffect(() => {
    getCommissionType();
  }, [ editDisabled,editEnabled, getCommissionType]);

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
        .post(`${url}/checks/${commissionTypeDetails.id}`, checkData, {
          headers,
        })
        .then((response) => {
          if (response.status === 200) {
            updateCommTypeData(event);
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

    const updateCommTypeData = async (event) => {
        event.preventDefault();
        const messgKey = "isLoading";
        const commTypeData = {
          ...commissionTypeDetails,

         }
        try {
          const response = await updateCommissionType(
            headers,
            commTypeData,
            commissionTypeDetails.id);
          if (response.statusCode === 200) {
            if (0) {
            } else {
              resetAfterAPIRequest();
              setEditDisabled(true);
              dispatchCommTypeDetails(response.data);
              message.success({
                content: "Commission Type updated!",
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
        history.push("/viewcommissiontype");
      };
    
      const confirmDiscardChanges = () => {
        dispatchCommTypeDetails();
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
              { id: 0, text: "Commission Type", onClick: () => closeForm() },
              {
                id: 1,
                text: `${commissionTypeDetails?.name}`,
                lastCrumb: true,
              },
            ]}
          />
        }
        actions={
         
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
            <BasisCommissionType />
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
          
             <Form className="column small"
            onSubmit={preSubmitCheck}
            cancel={resetForm}
            formEnabled={editEnabled}
          >
            
          
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
                    children: <Comments />,
                  },
                 
                ]}
              />
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
    
      </ContentPanels>
    </PageContainer>
  );
};
export default EditCommissionTypePage;
