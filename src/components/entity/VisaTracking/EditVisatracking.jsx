import Content from "../../container/content-container/content-container.component.jsx";
import Form from "../../common/form/form.component";
import { useEffect, useState, useCallback, useMemo } from "react";
import Breadcrumbs from "../../common/breadcrumbs/breadcrumbs.component.jsx";
import Button from "../../common/button/button.component.jsx";
import { Workbench } from "../../container/workbench-container/Workbench.jsx";

import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { config } from "../../../config";
import * as service from "../../../utils/service.js";
import axios from "axios";
import AuthService from "../../../utils/AuthService";
import { setIsAuth } from "../../../Redux/appSlice.js";
import PopUp from "../../modal/popup/popup.component";
import VisaDetails from "./visa_ui_helpers/edit_sections/VisaDetails.jsx";
import VisaHistory from "./visa_ui_helpers/edit_sections/visaHistory.jsx";
import { setEditEnabled, setVisaDeatils, setRequiredErr, setChangesMade } from "../../../Redux/visatrackingSlice.js";
import { getVisaById, updateVisa, postResume, deleteResume } from "../../../API/visaTrackings/visaTracking-apis.js";
import { ShareAltOutlined, ExportOutlined, EditFilled } from "@ant-design/icons";
import { PageContainer } from "../../container/page-container/PageContainer.jsx";
import { PageHeader } from "../../container/page-header/PageHeader.jsx";
import { message } from "antd";
import IdleTimeOutHandler from "../../ui/Dashboard/IdleTimeOutHandler.js";

const EditVisaTrackingPage = () => {
  const params = useParams();
  const [editDisabled, setEditDisabled] = useState(true);
  const [headers] = useState(AuthService.getHeaders());
  const history = useHistory();
  const [openPopUp, setOpenPopUp] = useState(false);
  const [url] = useState(`${config.serverURL}/visatracking`);
  const [inputErr] = useState({});
  const [errorBanner, setErrorBanner] = useState(false);
  const { editEnabled } = useSelector((state) => state.visatracking);
  const { visaDetails } = useSelector((state) => state.visatracking);
  const { requiredErr } = useSelector((state) => state.visatracking);
  const { changesMade } = useSelector((state) => state.visatracking);
  const dispatch = useDispatch();
  const [popUpMessage, setPopUpMessage] = useState({});
  const canEdit = useMemo(() => AuthService.isAdminOrOperations(), []);
  const[isActive,setIsActive]=useState(true)
  const[isLogout,setLogout]=useState(false)
  const [resume, setResume] = useState({});
  const [newResume, setNewResume] = useState(null);
  const [replaceResumeEnabled, setReplaceResumeEnabled] = useState(false);


  const logout = useCallback(() => {
    dispatch(setIsAuth(false));
    AuthService.logout();
  }, [dispatch]);

  const dispatchEdit = useCallback(
    (object) => dispatch(setEditEnabled(object)),
    [dispatch]
  );

  const dispatchVisaDetails = useCallback(
    (object) => dispatch(setVisaDeatils(object)),
    [dispatch]
  );

  const dispatchReqErr = useCallback(
    (object) => dispatch(setRequiredErr(object)),
    [dispatch]
  );

  const dispatchChange = useCallback(
    (object) => dispatch(setChangesMade(object)),
    [dispatch]
  );

  const getVisaTracking = useCallback(async () => {
    try {
      const id = params?.visaTrackingId;
      if (!id) return;
      const response = await getVisaById(headers, id);

      if (response.statusCode === 200) {
        dispatchVisaDetails(response.visaData);
        setResume(response.resumeData);
      } else if (response.statusCode === 401) {
        logout();
      }
    } catch (error) {
      console.log(error);
    }
  }, [
    params?.visaTrackingId,
    headers,
    dispatchVisaDetails,
    logout,
  ]);

  useEffect(() => {
    getVisaTracking();
  }, [editDisabled, editEnabled, getVisaTracking]);

  const enableReplaceResume = () => {
    setReplaceResumeEnabled((prev) => !prev);
  };
  const uploadNewResume = (event) => {
    const maxAllowedSize = 1 * 1024 * 1024;
    if (event.target.files[0].size > maxAllowedSize) {
      dispatchReqErr({
        ...inputErr,
        [event.target.name]:
          "File is too big. Please select file with size < 1MB",
      });
      event.target.value = "";
    } else {
      dispatchChange(true);
      let temp = { ...inputErr };
      delete temp[event.target.name];
      dispatchReqErr(temp);
      let file = event.target.files[0];
      setNewResume(file);
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
        .post(`${url}/checks/${visaDetails.id}`, checkData, {
          headers,
        })
        .then((response) => {
          if (response.status === 200) {
            updateVisadata(event);
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

  const updateVisadata = async (event) => {
    event.preventDefault();
    const messgKey = "isLoading";
    const visaData = {
      ...visaDetails
    }
    try {
      const response = await updateVisa(
        headers,
        visaData,
        visaDetails.id);
      if (response.statusCode === 200) {
        if (newResume) {
          updateResume();
        } else {
          resetAfterAPIRequest();
          setEditDisabled(true);
          dispatchVisaDetails(response.data);
          setResume(response.data.resume);

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

  const updateResume = async () => {
    try {
      const formData = new FormData();
      formData.append("file", newResume);
      let updResponse = {};

      if (resume) {
        const delResponse = await deleteResume(headers, visaDetails.id);
        if (delResponse.status === 200)
          updResponse = await postResume(headers, visaDetails.id, formData);
      } else {
        updResponse = await postResume(headers, visaDetails.id, formData);
      }

      if (updResponse.status === 201) {
        setResume(newResume);
        dispatchVisaDetails(updResponse.data);
        setResume(updResponse.data.resume);
        resetAfterAPIRequest();
        message.success({
          content: "Candidate updated!",
          duration: 5,
          style: { marginTop: "5%" },
        });
      }
    } catch (err) {
      message.error({
        content: `An error occurred while saving changes (${err.response?.status})`,
        duration: 10,
      });
    }
  };

  const closePopUp = () => {
    setOpenPopUp(false);
    setPopUpMessage({});
  };

  const closeForm = () => {
    resetAfterAPIRequest();
    dispatchEdit(false);
    setResume({});
    history.push("/viewvisatrackings");
  };

  const confirmDiscardChanges = () => {
    dispatchVisaDetails();
    dispatchEdit(false);
    setReplaceResumeEnabled(false);
    setNewResume(null)
  };

  const resetAfterAPIRequest = () => {
    dispatchEdit(false);
    setReplaceResumeEnabled(false);
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
              { id: 0, text: "All Visas", onClick: () => closeForm() },
              {
                id: 1,
                text: `${visaDetails?.worker?.firstName} ${visaDetails?.worker?.lastName}`,
                lastCrumb: true,
              },
            ]}
          />
        }
        actions={
          canEdit && (
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
      <Content>
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
          <VisaDetails 
                    resume={resume}
                    enableReplaceResume={enableReplaceResume}
                    replaceResumeEnabled={replaceResumeEnabled}
                    uploadNewResume={uploadNewResume}
          />
        </Form>
        <VisaHistory />
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
    </PageContainer>
  );
};
export default EditVisaTrackingPage;
