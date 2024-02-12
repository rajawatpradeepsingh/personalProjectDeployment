import React, { useEffect, useState, useCallback, useRef,useMemo } from "react";
import { useHistory, useParams } from "react-router-dom";
import auth from "../../../utils/AuthService";
import { useSelector, useDispatch } from "react-redux";
import { setAddInterviewOpen } from "../../../Redux/interviewSlice";
import { setAddComment, setShowActivity, setShowBasic } from "../../../Redux/candidateSlice";
import { setEditEnabled, setChangesMade } from "../../../Redux/candidateSlice";
import { setCommentsInfo, setShowComments } from "../../../Redux/candidateSlice";
import { setRequiredErr, setInputErr } from "../../../Redux/candidateSlice";
import { setBasicInfo, setProfessionalInfo } from "../../../Redux/candidateSlice";
import { setNewComment, setCandidate } from "../../../Redux/candidateSlice";
import { getCandidateById, checkCandidate, deleteResume, postResume, updateCandidate } from "../../../API/candidates/candidate-apis";
import { getInterviewsByParams } from "../../../API/interviews/interview-apis";
import ScheduleInterview from "../interview/ScheduleInterview";
import Schedule from "../schedule/schedule.component";
import Form from "../../common/form/form.component";
import Content from "../../container/content-container/content-container.component";
import PopUp from "../../modal/popup/popup.component";
import Activity from "../../others/activity/activity.component";
import { PageContainer } from '../../container/page-container/PageContainer';
import { PageHeader } from '../../container/page-header/PageHeader';
import { ContentPanels } from "../../container/content-panels-container/ContentPanels";
import { TabsComponent } from '../../common/tabs/TabsComponent';
import { candidateActions, crumbs } from "./utils/candidateObjects";
import BasicInfo from "./cand_ui_helpers/edit_sections/BasicInfo";
import ProfessionalDetails from "./cand_ui_helpers/edit_sections/ProfessionalDetails";
import Comments from "./cand_ui_helpers/edit_sections/Comments";
import Button from "../../common/button/button.component";
import { CalendarOutlined, TableOutlined, InfoCircleOutlined, CommentOutlined } from "@ant-design/icons";
import IdleTimeOutHandler from "../../ui/Dashboard/IdleTimeOutHandler";
import { message } from "antd";
import "antd/dist/antd.css";

const EditCandidatePage = (props) => {
  const history = useHistory();
  const [headers] = useState(auth.getHeaders());
  const params = useParams();
  const dispatch = useDispatch();

  const { editEnabled, showComments } = useSelector((state) => state.candidate);
  const { showActivity, changesMade } = useSelector((state) => state.candidate);
  const { candidate, basicInfo } = useSelector((state) => state.candidate);
  const { inputErr, requiredErr } = useSelector((state) => state.candidate);
  const { commentsInfo, newComment } = useSelector((state) => state.candidate);
  const { newJobActivity } = useSelector((state) => state.candidate);
  const profInfo = useSelector((state) => state.candidate.professionalInfo);
  const [resume, setResume] = useState({});
  const [newResume, setNewResume] = useState(null);
  const [replaceResumeEnabled, setReplaceResumeEnabled] = useState(false);
  const [currentPage, setCurrentPage] = useState("");
  const [openPopUp, setOpenPopUp] = useState(false);
  const [popUpMessage, setPopUpMessage] = useState({});
  const [errorBanner, setErrorBanner] = useState(false);
  const [pageIndex, setPageIndex] = useState("1");
  const [candidateName, setCandidateName] = useState("");
  const [interviews, setInterviews] = useState([]);
  const [showEmailActions, setShowEmailActions] = useState(false);
  const user = useMemo(() => auth.getUserInfo(), []);
  const [roleData,setRoleData]=useState(user.roles[0]);
  
  const [isAdmin, setIsAdmin] = useState(false);
  const inputErrRef = useRef(inputErr);
 
   const[isActive,setIsActive]=useState(true)
  const[isLogout,setLogout]=useState(false)

  useEffect(() => {
    if (auth.hasAdminRole()) setIsAdmin(true);
  }, []);
  useEffect(() => inputErrRef.current = inputErr, [inputErr]);

  const dispatchEdit = useCallback(
    (object) => dispatch(setEditEnabled(object)),
    [dispatch]
  );
  const dispatchBasic = useCallback(
    (object) => dispatch(setBasicInfo(object)),
    [dispatch]
  );
  const dispatchProf = useCallback(
    (object) => dispatch(setProfessionalInfo(object)),
    [dispatch]
  );
  const dispatchComments = useCallback(
    (object) => dispatch(setCommentsInfo(object)),
    [dispatch]
  );
  const dispatchNewComment = useCallback(
    (object) => dispatch(setNewComment(object)),
    [dispatch]
  );
  const dispatchErr = useCallback(
    (object) => dispatch(setInputErr(object)),
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
  const dispatchCandidate = useCallback(
    (object) => dispatch(setCandidate(object)),
    [dispatch]
  );

  //set what page of the form to land on
  useEffect(() => {
    if (showComments) {
      setCurrentPage("Comments");
      setPageIndex("2");
    }
    if (showActivity) {
      setCurrentPage("Activity");
      setPageIndex("3");
    }
  }, [showActivity, showComments]);

  useEffect(() => {
    if (!currentPage && basicInfo?.id) {
      setCurrentPage("Professional Details");
      setPageIndex("1");
    }
  }, [currentPage, basicInfo]);

  useEffect(() => {
    if (basicInfo)
      setCandidateName(`${basicInfo.firstName} ${basicInfo.lastName}`);
  }, [basicInfo]);

  //get candidate data on page load
  const getCandidate = useCallback(() => {
    //candidate-form could be opened from notifications list, also added redux-statement
    const id = params.candidateId || candidate.id;
    getCandidateById(headers, id)
      .then(res => {
        if (res.statusCode === 200) {
          dispatchCandidate(res.candidateData);
          dispatchBasic(res.candidateData);
          dispatchProf(res.candidateProfessionalInfo);
          dispatchComments(res.candidateComments);
          setResume(res.resumeData);
        }
      })
      .catch(err => {
        console.log(err);
      })
  }, [
    headers,
    params.candidateId,
    candidate.id,
    dispatchCandidate,
    dispatchBasic,
    dispatchProf,
    dispatchComments,
  ]);

  useEffect(() => {
    getCandidate();
  }, [getCandidate]);

  //navigate through form pages
  const setNavPage = (page) => {
    setPageIndex(page);
    dispatch(setShowBasic(false));
    dispatch(setShowComments(false));
    dispatch(setShowActivity(false));
  };

  //check that relevant exp is less than total exp
  useEffect(() => {
    let error = false;
    const {
      totalExperience,
      relevantExperience,
      totalExpPeriod,
      relExpPeriod,
    } = profInfo;

    if (totalExperience && relevantExperience) {
      const totalYears =
        totalExpPeriod === "month(s)" ? totalExperience / 12 : +totalExperience;
      const relYears =
        relExpPeriod === "month(s)"
          ? relevantExperience / 12
          : +relevantExperience;
      error = totalYears < relYears;
    }

    if (error) {
      dispatchErr({
        ...inputErrRef.current,
        relExp: "Relevant experience can't exceed total exp.",
      });
    } else {
      const { relExp, ...rest } = inputErrRef.current;
      dispatchErr(rest);
    }
  }, [profInfo, dispatchErr]);

  //on blur of field which is required, check if field has an input
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

  //enable replace resume file
  const enableReplaceResume = () => {
    setReplaceResumeEnabled((prev) => !prev);
  };

  //set new resume into state
  const uploadNewResume = (event) => {
    const maxAllowedSize = 1 * 1024 * 1024;
    if (event.target.files[0].size > maxAllowedSize) {
      dispatchErr({
        ...inputErr,
        [event.target.name]:
          "File is too big. Please select file with size < 1MB",
      });
      event.target.value = "";
    } else {
      dispatchChange(true);
      let temp = { ...inputErr };
      delete temp[event.target.name];
      dispatchErr(temp);
      let file = event.target.files[0];
      setNewResume(file);
    }
  };

  //check for errors and required fields, check for duplicate data
  const preSubmitCheck = async (event) => {
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
        firstName: basicInfo.firstName,
        lastName: basicInfo.lastName,
        email: basicInfo.email,
        phoneNumber: basicInfo.phoneNumber,
      };

      await checkCandidate(headers, basicInfo.id, checkData)
        .then((res) => {
          if (res.status === 200) updateCandidateData(event);
        })
        .catch((err) => {
          setOpenPopUp(true);
          setPopUpMessage({
            title: "Error",
            details: err.response ? `${err.response?.data}` : 'Unkown error',
            confirmValue: "Close",
          });
        });
    }
  };

  //submit updated candidate to database
  const updateCandidateData = async (event) => {
    event.preventDefault();
    const messgKey = "isLoading";

    const newCommentsList =
      newComment
        ? [...commentsInfo, { ...newComment, sign: user.username }]
        : [...commentsInfo];

    const candidateData = {
      ...basicInfo,
      ...newJobActivity,
      professionalInfo: {
        ...profInfo,
        commentList: newCommentsList,
      },
    };

    await updateCandidate(headers, candidateData, basicInfo.id)
      .then(res => {
        if (res.statusCode === 200) {
          if (newResume) {
            updateResume();
          } else {
            resetAfterAPIRequest();
            dispatchBasic(res.data);
            dispatchProf(res.data.professionalInfo);
            dispatchComments(res.data.professionalInfo.commentList);
            setResume(res.data.resume);
            message.success({
              content: "Candidate updated!",
              messgKey,
              duration: 5,
              style: { marginTop: "5%" },
            });
          }
        } else {
          message.error({
            content: `An error occurred while saving changes (${res.statusCode})`,
            messgKey,
            duration: 10,
          });
        }
      })
      .catch(err => {
        console.log(err);
      })
  };

  //handle resume update
  const updateResume = async () => {
    try {
      const formData = new FormData();
      formData.append("file", newResume);
      let updResponse = {};

      if (resume) {
        const delResponse = await deleteResume(headers, basicInfo.id);
        if (delResponse.status === 200)
          updResponse = await postResume(headers, basicInfo.id, formData);
      } else {
        updResponse = await postResume(headers, basicInfo.id, formData);
      }

      if (updResponse.status === 201) {
        setResume(newResume);
        dispatchBasic(updResponse.data);
        dispatchProf(updResponse.data.professionalInfo);
        dispatchComments(updResponse.data.professionalInfo.commentList);
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

  //enable or disable form fields
  const toggleForm = () => {
    if (editEnabled) {
      confirmDiscardChanges();
    } else {
      dispatchEdit(!editEnabled);
    }
  };

  //if no changes disable form, if changes confirm user wants to discard changes
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
      dispatch(setAddComment(false));
      dispatch(setNewComment(null));
    }
  };

  const resetAfterAPIRequest = () => {
    dispatchEdit(false);
    dispatch(setAddComment(false));
    dispatchChange(false);
    setReplaceResumeEnabled(false);
    dispatch(setNewComment(null));
  }

  //return to view page
  const closeForm = () => {
    resetAfterAPIRequest();
    dispatchChange(false);
    dispatchBasic({});
    dispatchProf({});
    dispatchComments([]);
    setResume({});
    history.push("/viewcandidates");
  };

  //close pop up component
  const closePopUp = () => {
    setOpenPopUp(false);
    setPopUpMessage({});
  };

  const scheduleInterview = () => {
    dispatch(setAddInterviewOpen(true));
  };

  const getInterviews = useCallback(() => {
    const path = "getfilterforcandidates";
    const par = `?candidateId=${params.candidateId || candidate.id}`;
    getInterviewsByParams(headers, path, par)
      .then(res => setInterviews(res.data))
      .catch(err => console.log(err))
  }, [headers, params.candidateId, candidate.id]);

  useEffect(() => {
    getInterviews();
  }, [getInterviews]);

  //discard changes before disabling form
  const confirmDiscardChanges = () => {
    dispatchCandidate(candidate);
    setNewResume(null);
    dispatchEdit(false);
    setReplaceResumeEnabled(false);
    dispatchChange(false);
    setErrorBanner(false);
    dispatchErr({});
    dispatchReqErr({});
    setOpenPopUp(false);
    dispatchNewComment(null);
    getCandidate();
  };

  useEffect(() => {
    if (editEnabled && +pageIndex > 2) {
      setPageIndex("1");
      setCurrentPage("Professional Details");
    }
  }, [editEnabled, pageIndex])

  return (
    <PageContainer className={props.viewOnly && "bg-white no-padding max-h-full"}>
      <ScheduleInterview
        candidate={{
          id: basicInfo?.id ? basicInfo?.id : "",
          name: candidateName ? candidateName : "",
        }}
        loadInterviews={getCandidate}
      />
        <IdleTimeOutHandler 
    onActive={()=>{setIsActive(true)}} 
    onIdle={()=>{setIsActive(false)}}
    onLogout={()=>{setLogout(true)}}
    />
      <PageHeader
        title={props.viewOnly && candidateName}
        breadcrumbs={!props.viewOnly && crumbs(closeForm, candidateName)}
        actions={
          !props.viewOnly && (
            <>
              {(editEnabled || newComment) && (
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
              { isAdmin || roleData.candidatePermission ?candidateActions({
                toggleForm,
                scheduleInterview,
                showEmailActions,
                setShowEmailActions,
              }):""}
            </>
          )
        }
      />
      {errorBanner && (
        <span className="fixed-error-banner">{`Resolve errors before submitting: ${Object.keys(
          inputErr
        )
          .concat(Object.keys(requiredErr))
          .join(", ")}`}</span>
      )}
      <ContentPanels>
        <Content className="x-small">
          <Form
            className="column small"
            formEnabled={editEnabled}
            onSubmit={preSubmitCheck}
            cancel={resetForm}
          >
            <BasicInfo handleRequiredCheck={handleRequiredCheck} />
          </Form>
        </Content>
        <Content className="medium">
          <TabsComponent
            position="top"
            activeKey={pageIndex}
            setActiveKey={setNavPage}
            items={[
              {
                key: "1",
                label: <span><InfoCircleOutlined /> Details</span>,
                children: (
                  <ProfessionalDetails
                    resume={resume}
                    enableReplaceResume={enableReplaceResume}
                    replaceResumeEnabled={replaceResumeEnabled}
                    uploadNewResume={uploadNewResume}
                  />
                ),
              },
              {
                key: "2",
                label: <span><CommentOutlined /> Comments</span>,
                children: <Comments />,
              },
              {
                key: "3",
                label: <span><TableOutlined /> Activity</span>,
                children: (
                  <Activity
                    data={commentsInfo}
                    candidateId={params.candidateId ? params.candidateId : candidate.id}
                    status={candidate.status}
                  />
                ),
                disabled: editEnabled || newComment,
              },
              {
                key: "4",
                label: <span><CalendarOutlined /> Schedule</span>,
                children: <Schedule interviews={interviews} height={600} />,
                disabled: editEnabled || newComment,
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

export default EditCandidatePage;
