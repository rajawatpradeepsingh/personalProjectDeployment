import BasicInfoParameter from "./edit_sections/BasicInfoParameter";
import ParameterComments from "./edit_sections/ParameterComments";
import{formNavEditSteps} from "./ParameterObjects.js";
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
import{getParameterById,updateParameter} from "../../../API/parameter/parameter-apis";
import { useHistory } from "react-router-dom";
import {  useState ,useEffect,useCallback} from "react";
import AuthService from "../../../utils/AuthService";
import { setIsAuth } from "../../../Redux/appSlice.js";
import { useParams } from "react-router-dom";
import { setParameterDetails ,setEditEnabled} from "../../../Redux/parameterSlice";
import auth from "../../../utils/AuthService.js";
import {  useSelector,useDispatch } from "react-redux";
import { message } from "antd";
import IdleTimeOutHandler from "../../ui/Dashboard/IdleTimeOutHandler";

const EditParameterPage = () => {
    const [currentPage] = useState("ParameterComments");
    const history = useHistory();
    const [headers] = useState(AuthService.getHeaders());
    const params = useParams();
    const dispatch = useDispatch();
    const { parameterDetails } = useSelector((state) => state.parameter);
    const [editDisabled, setEditDisabled] = useState(true);
    const { editEnabled } = useSelector((state) => state.parameter);
    const [popUpMessage, setPopUpMessage] = useState({});
    const [openPopUp, setOpenPopUp] = useState(false);
    const { changesMade } = useSelector((state) => state.parameter);
    const [pageIndex, setPageIndex] = useState(0);
    
   const[isActive,setIsActive]=useState(true)
  const[isLogout,setLogout]=useState(false)


    const dispatchParameterDetails = useCallback(
      (object) => dispatch(setParameterDetails(object)),
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
      if (editEnabled) {
        confirmDiscardChanges();
      } else {
        dispatchEdit(!editEnabled);
        setEditDisabled(!editDisabled);
      }
    };
   
    const getParameter = useCallback(async () => {
      try {
        const id = params.parameterId 
        const response = await getParameterById(headers, id);
        if (response.statusCode === 200) {
          dispatchParameterDetails(response.parameterdata);
        } else if (response.statusCode === 401) {
          logout();
        }
        console.log(response)
      } catch (error) {
        console.log(error);
      }
    }, [headers, params.parameterId,  dispatchParameterDetails,  logout]);
    useEffect(() => {
      getParameter();
    }, [editDisabled, editEnabled, getParameter]);



    const updateParam = async (event) => {
      event.preventDefault();
      const messgKey = "isLoading";
      try {
        const response = await updateParameter(
          headers,
          parameterDetails,
          params?.parameterId);
        if (response.statusCode === 200) {
          if (0) {
          } else {
            resetAfterAPIRequest();
            setEditDisabled(true);
            dispatchParameterDetails(response.data);
            message.success({
              content: "Parameter updated!",
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
      dispatchParameterDetails({});
    };

    const resetAfterAPIRequest = () => {
      dispatchEdit(false);
      dispatch(setParameterDetails({}));
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
        history.push("/viewparameters/");
      };
    return(
        <PageContainer>
      <PageHeader
        breadcrumbs={
          <Breadcrumbs
            className="header"
            crumbs={[
              { id: 0, text: "Parameter", onClick: () => closeForm() },
              {
                id: 1,
                text: `${parameterDetails?.paramType}`,
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
      <ContentPanels>
        <Content className="x-small">
          <Form
            className="column small"
            onSubmit={updateParam}
            cancel={resetForm}
            formEnabled={editEnabled}
          >
            <BasicInfoParameter />
          </Form>
        </Content>

        <Content className="medium">
          <FormNav
            steps={formNavEditSteps()}
            submit={updateParam}
            reset={resetForm}
            canSubmit={editEnabled}
            setCurrentPage={setNavPage}
            clickable={true}
            type="navigation"
            hideNavBtns={true}
            index={pageIndex}
          >
            <Form>
              {currentPage === "ParameterComments" && <ParameterComments />}
            </Form>

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

export default EditParameterPage;
