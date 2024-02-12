import BasicInfoUser from "./edit_sections/BasicinfoUser";
import {UserHistory} from "./edit_sections/UserHistory";
import{formNavEditSteps} from "./UserObjects.js";
import Breadcrumbs from "../../common/breadcrumbs/breadcrumbs.component.jsx";
import Button from "../../common/button/button.component.jsx";
import Content from "../../container/content-container/content-container.component.jsx";
import Form from "../../common/form/form.component";
import PopUp from "../../modal/popup/popup.component";
import FormNav from "../../ui/form-nav/form-nav.component.jsx";
import { PageContainer } from "../../container/page-container/PageContainer.jsx";
import { PageHeader } from "../../container/page-header/PageHeader.jsx";
import { Workbench } from "../../container/workbench-container/Workbench.jsx";
import { ContentPanels } from "../../container/content-panels-container/ContentPanels.jsx";
import { EditFilled, ShareAltOutlined, ExportOutlined } from "@ant-design/icons";
import{getUserById, updateUser} from "../../../API/users/user-apis";
import { useHistory } from "react-router-dom";
import {  useState ,useEffect,useCallback} from "react";
import AuthService from "../../../utils/AuthService";
import { setIsAuth } from "../../../Redux/appSlice.js";
import { useParams } from "react-router-dom";
import { setUserDetails ,setEditEnabled} from "../../../Redux/userSlice";
import auth from "../../../utils/AuthService.js";
import {  useSelector,useDispatch } from "react-redux";
import { message } from "antd";

const EditUserPage = () => {
    const [currentPage] = useState("UserRoleHistory");
    const history = useHistory();
    const [headers] = useState(AuthService.getHeaders());
    const params = useParams();
    const dispatch = useDispatch();
    const { userDetails } = useSelector((state) => state.users);
    const [editDisabled, setEditDisabled] = useState(true);
    const { editEnabled } = useSelector((state) => state.users);
    const [popUpMessage, setPopUpMessage] = useState({});
    const [openPopUp, setOpenPopUp] = useState(false);
    const { changesMade } = useSelector((state) => state.users);
    const [pageIndex, setPageIndex] = useState(0);

    const isAdmin = auth.hasAdminRole(); 

    const dispatchUserDetails = useCallback(
      (object) => dispatch(setUserDetails(object)),
      [dispatch]
    );

    const dispatchEdit = useCallback(
      (object) => dispatch(setEditEnabled(object)),
      [dispatch]
    );
    

    const logout = useCallback(() => {
      dispatch(setIsAuth(false));
      auth.logout();
    }, [dispatch]);



    const closePopUp = () => {
      setOpenPopUp(false);
      setPopUpMessage({});
    };

    const setNavPage = (key) => {
      setPageIndex(key);
    };
  

    const toggleForm = () => {
      if (isAdmin) {
        if (editEnabled) {
          confirmDiscardChanges();
        } else {
          dispatchEdit(!editEnabled);
          setEditDisabled(!editDisabled);
        }
      } 
    };
    
       const getUsers = useCallback(async () => {
      try {
        const id = params.userId
        const response = await getUserById(headers, id);
        if (response.statusCode === 200) {
          dispatchUserDetails(response.userdata);
        } else if (response.statusCode === 401) {
          logout();
        }
        console.log(response)
      } catch (error) {
        console.log(error);
      }
    }, [headers, params.userId,  dispatchUserDetails,  logout]);
    useEffect(() => {
      getUsers();
    }, [editDisabled, getUsers]);

console.log(userDetails);
  
const updateUsers= async (event) => {
    event.preventDefault();
    const messgKey = "isLoading";
    try {
      const response = await updateUser(
        headers,
        userDetails,
        params?.userId);
      if (response.statusCode === 200) {
        if (0) {
        } else {
          resetAfterAPIRequest();
          setEditDisabled(true);
          dispatchUserDetails(response.data);
          message.success({
            content: "User updated!",
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

  


    const confirmDiscardChanges = () => {
      dispatchEdit(false);
      dispatchUserDetails({});
    };

    const resetAfterAPIRequest = () => {
      dispatchEdit(false);
      dispatch(setUserDetails({}));
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
  

    const closeForm = () => {
      resetAfterAPIRequest();
        history.push("/viewusers/");
      };
    return(
        <PageContainer>
      <PageHeader
        breadcrumbs={
          <Breadcrumbs
            className="header"
            crumbs={[
              { id: 0, text: "User", onClick: () => closeForm() },
              {
                id: 1,
                text: `${userDetails?.username}`,
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
          className={`btn icon marginX ${auth.hasAdminRole() ? "" : "disabled"}`}
          title="Edit"
          disabled={!auth.hasAdminRole()}
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
        }
      />
      <ContentPanels>
        <Content className="x-small">
          <Form
            className="column small"
            onSubmit={updateUsers}
            cancel={resetForm}
            formEnabled={editEnabled}
          >
            <BasicInfoUser />
          </Form>
        </Content>

        <Content className="medium">
        <FormNav
  steps={formNavEditSteps()}
  submit={updateUsers}
  reset={resetForm}
  canSubmit={editEnabled}
  setCurrentPage={setNavPage}
  clickable={true}
  type="navigation"
  hideNavBtns={true}
  index={pageIndex}
>

   <UserHistory
     history={history}
     currentPage={currentPage}
  />

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
</FormNav>

        </Content>
      </ContentPanels>
    </PageContainer>
  );
};

export default EditUserPage;
