import Breadcrumbs from "../../common/breadcrumbs/breadcrumbs.component.jsx";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import AuthService from "../../../utils/AuthService";
import { useEffect, useState, useCallback ,useMemo} from "react";
import auth from "../../../utils/AuthService.js";
import Button from "../../common/button/button.component.jsx";
import Content from "../../container/content-container/content-container.component.jsx";
import Form from "../../common/form/form.component";
import PopUp from "../../modal/popup/popup.component";
import BasicInfo from "./supp_ui_helpers/edit_sections/BasicInfo.jsx";
import SupplierDetalis from "./supp_ui_helpers/edit_sections/SupplierDetails.jsx";
import Comments from "./supp_ui_helpers/edit_sections/Comments.jsx";
import { getSupplierById, updateSupplier } from "../../../API/supplier/supplier.apis.js";
import { useDispatch } from "react-redux";
import { setIsAuth } from "../../../Redux/appSlice.js";
import { useParams } from "react-router-dom";
import { setBasicInfo, setEditEnabled, setShowComments, setSupplierDetails } from "../../../Redux/supplierSlice.js";
import { message } from "antd";
import { PageContainer } from "../../container/page-container/PageContainer.jsx";
import { PageHeader } from "../../container/page-header/PageHeader.jsx";
import { Workbench } from "../../container/workbench-container/Workbench.jsx";
import { ContentPanels } from "../../container/content-panels-container/ContentPanels.jsx";
import { TabsComponent } from "../../common/tabs/TabsComponent.jsx";
import { EditFilled, ShareAltOutlined, ExportOutlined, InfoCircleOutlined, CommentOutlined } from "@ant-design/icons";
import IdleTimeOutHandler from "../../ui/Dashboard/IdleTimeOutHandler.js";

const EditSupplierPage = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const history = useHistory();
  const [pageIndex, setPageIndex] = useState("1");
  const { basicInfo } = useSelector((state) => state.supplier);
  const [headers] = useState(AuthService.getHeaders());
  const { editEnabled } = useSelector((state) => state.supplier);
  const [editDisabled, setEditDisabled] = useState(true);
  const [popUpMessage, setPopUpMessage] = useState({});
  const { changesMade } = useSelector((state) => state.supplier);
  const [openPopUp, setOpenPopUp] = useState(false);
  const { showComments, showSupplier } = useSelector((state) => state.supplier);
  const[isActive,setIsActive]=useState(true);
  const[isLogout,setLogout]=useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const user = useMemo(() => auth.getUserInfo(), []);
  const [roleData,setRoleData]=useState(user.roles[0]);
  useEffect(() => {
    if (auth.hasAdminRole()) setIsAdmin(true);
  }, []);

  const logout = useCallback(() => {
    dispatch(setIsAuth(false));
    AuthService.logout();
  }, [dispatch]);

  const dispatchBasic = useCallback(
    (object) => dispatch(setBasicInfo(object)),
    [dispatch]
  );

  const dispatchSupplierDetails = useCallback(
    (object) => dispatch(setSupplierDetails(object)),
    [dispatch]
  );

  const dispatchEdit = useCallback(
    (object) => dispatch(setEditEnabled(object)),
    [dispatch]
  );

  const closePopUp = () => {
    setOpenPopUp(false);
    setPopUpMessage({});
  };

  const getSupplier = useCallback(async () => {
    try {
      const id = params?.supplierId;
      if (!id) return;
      const response = await getSupplierById(headers, id);

      if (response.statusCode === 200) {
        dispatchBasic(response.supplierData);
        dispatchSupplierDetails(response.supplierData);
      } else if (response.statusCode === 401) {
        logout();
      }
    } catch (error) {
      console.log(error);
    }
  }, [
    params?.supplierId,
    headers,
    dispatchBasic,
    dispatchSupplierDetails,
    logout
  ]);

  useEffect(() => {
    getSupplier();
  }, [editDisabled, editEnabled, getSupplier]);

  const updateSuppliers = async (event) => {
    event.preventDefault();
    const messgKey = "isLoading";
    const supplierData = {
      ...basicInfo,
    };
    try {
      const response = await updateSupplier(
        headers,
        supplierData,
        basicInfo.id,
      );
      if (response.statusCode === 200) {
        if (0) {

        } else {
          resetAfterAPIRequest();
          setEditDisabled(true);
          dispatchBasic(response.data);
          dispatchSupplierDetails(response.data.SupplierDetalis);
          message.success({
            content: "Supplier updated!",
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

  const closeForm = () => {
    history.push("/viewsuppliers");
    resetAfterAPIRequest();
  };

  const resetAfterAPIRequest = () => {
    dispatchEdit(false);
  };

  useEffect(() => {
    if (showComments) {
      setPageIndex("1");
    }
    if (showSupplier) {
      setPageIndex("2");
    }
  }, [showSupplier, showComments]);

  const confirmDiscardChanges = () => {
    dispatchBasic();
    dispatchEdit(false);
    dispatchSupplierDetails({});
  };

  const setNavPage = (key) => {
    setPageIndex(key)
    dispatch(setShowComments(false));
  };

  const toggleForm = () => {
    if (editEnabled) {
      confirmDiscardChanges();
    } else {
      dispatchEdit(!editEnabled);
      setEditDisabled(!editDisabled);
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
    }
    else {
      dispatchEdit(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        breadcrumbs={
          <Breadcrumbs
            className="header"
            crumbs={[
              { id: 0, text: "Supplier", onClick: () => closeForm() },
              {
                id: 1,
                text: `${basicInfo?.firstName} ${basicInfo?.lastName}`,
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
                  handleClick={updateSuppliers}
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
            {isAdmin || roleData.managerPermission || roleData.candidatesPermission  ||roleData.clientPermission  ||roleData.interviewsPermission  ||roleData.jobOpeningsPermission  ||roleData.onBoardingsPermission ||roleData.settingsPermission  ||roleData.suppliersPermission ?
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
            onSubmit={updateSuppliers}
            cancel={resetForm}
            formEnabled={editEnabled}
          >
            <BasicInfo />
          </Form>
        </Content>

        <Content className="medium">
          <TabsComponent
            activeKey={pageIndex}
            setActiveKey={setNavPage}
            position="left"
            items={[
              {
                key: "1",
                label: (
                  <span>
                    <InfoCircleOutlined /> Details
                  </span>
                ),
                children: <SupplierDetalis />,
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

export default EditSupplierPage;
