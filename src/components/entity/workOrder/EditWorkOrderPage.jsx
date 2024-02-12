import { useEffect, useState, useCallback, useMemo } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import auth from "../../../utils/AuthService.js";
import axios from "axios";
import { config } from "../../../config.js";
import { setIsAuth } from "../../../Redux/appSlice.js";
import { setRequiredErr,setEditEnabled,setBasicInfo,setWorkOrder,setChangesMade, setShowWorkOrderDetails} from "../../../Redux/workOrderSlice.js";
import {getWorkOrderById ,updateWorkOrder} from "../../../API/workorder/workOrder-apis.js";
import { TabsComponent } from "../../common/tabs/TabsComponent";
import { PageContainer } from "../../container/page-container/PageContainer";
import { PageHeader } from "../../container/page-header/PageHeader.jsx";
import Breadcrumbs from "../../common/breadcrumbs/breadcrumbs.component.jsx";
import { Workbench } from "../../container/workbench-container/Workbench.jsx";
import Content from "../../container/content-container/content-container.component.jsx";
import PopUp from "../../modal/popup/popup.component.jsx";
// import WorkOrderDetails from "./edit sections/WorkOrderDetails.jsx";
import BasicInfoWorkOrder from "./edit sections/BasicInfoWorkOrder.jsx";
import Form from "../../common/form/form.component.jsx";
import Button from "../../common/button/button.component.jsx";
import IdleTimeOutHandler from "../../ui/Dashboard/IdleTimeOutHandler.js";
import { EditFilled, ShareAltOutlined, ExportOutlined,  } from "@ant-design/icons";
import * as service from "../../../utils/service.js";
import { message } from "antd";








const EditWorkOrderPage = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const params = useParams();
    const headers = useMemo(() => auth.getHeaders(), []);
    const url = useMemo(() => `${config.serverURL}/workOrders`, []);
    const { basicInfo } = useSelector((state) => state.workOrder);
    const { changesMade } = useSelector((state) => state.workOrder);
    const { requiredErr } = useSelector((state) => state.workOrder);
    const { editEnabled,showWorkOrderDetails } = useSelector((state) => state.workOrder);
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
 
      const dispatchWorkOrder = useCallback(
        (object) => dispatch(setWorkOrder(object)),
        [dispatch]
      );

      const dispatchBasic = useCallback(
        (object) => dispatch(setBasicInfo(object)),
        [dispatch]
      );

      const dispatchEdit = useCallback((object) => {
        dispatch(setEditEnabled(object));
        setPageIndex("1");
      }, [dispatch]);
      
      const dispatchChange = useCallback(
        (object) => dispatch(setChangesMade(object)),
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
        if (showWorkOrderDetails) {
          setPageIndex("2");
        }
      }, [showWorkOrderDetails]);



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
           projectName:basicInfo.projectName,
           
           
          };
    
          axios
          .post(`${url}/checks/${basicInfo.id}`, checkData, {
            headers,
          })
            .then((response) => {
              if (response.status === 200) {
                updateWorkOrderData(event);
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

      const updateWorkOrderData = async (event) => {
        event.preventDefault();
    
        const messgKey = "isLoading";
        const workOrderData = {
          ...basicInfo,
        };
    
        try {
          const response = await updateWorkOrder(
            headers,
            workOrderData,
            basicInfo.id,
          );
          if (response.statusCode === 200) {
            if (0) {
    
            } else {
              resetAfterAPIRequest();
              setEditDisabled(true);
              dispatchBasic(response.data);
              message.success({
                content: "workOrder updated!",
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
    
      
      const  getWorkOrder = useCallback(async () => {
        try {
          const id = params.workOrderId || basicInfo.id;
          if (!id) return;
          const response = await getWorkOrderById(headers, id);
    
          if (response.statusCode === 200) {
            dispatchBasic(response.workOrderData);
          } else if (response.statusCode === 401) {
            logout();
          }
        } catch (error) {
          console.log(error);
        }
      }, [
        params?.workOrderId,
        basicInfo?.id,
        headers,
        dispatchBasic,
        logout
      ]);
    
      useEffect(() => {
        getWorkOrder();
      }, [getWorkOrder]);

      const closeForm = () => {
        resetAfterAPIRequest();
        dispatchEdit(false);
    
        history.push("/viewworkOrder");
      };

      const setNavPage = (key) => {
        setPageIndex(key);
        dispatch(setShowWorkOrderDetails(false));;
      };
    
         console.log(basicInfo)
      const confirmDiscardChanges = () => {
        dispatchWorkOrder({});
        dispatchEdit(false);
        getWorkOrder();
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
                { id: 0, text: "WorkOrder", onClick: () => closeForm() },
                {
                  id: 1,
                  text: `PRJ-${basicInfo?.project?.client?.clientName.toUpperCase().substr(0, 3)}-${("00" + basicInfo?.id).slice(-5)}`,
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
                <BasicInfoWorkOrder
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
    
                  // {
                  //   key: "1",
                  //   label: (
                  //     <span>
                  //        Details
                  //     </span>
                  //   ),
                  //   children: <WorkOrderDetails />,
                  // },
                 
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
    
    export default EditWorkOrderPage;
    

