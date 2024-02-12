import axios from "axios";
import { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { config } from "../../../config";
import { runValidation } from "../../../utils/validation";
import Content from "../../container/content-container/content-container.component";
import Form from "../../common/form/form.component";
import Input from "../../common/input/inputs.component";
import Breadcrumbs from "../../common/breadcrumbs/breadcrumbs.component";
import PopUp from "../../modal/popup/popup.component";
import TextBlock from "../../common/textareas/textareas.component";
import { PageContainer } from "../../container/page-container/PageContainer";
import { PageHeader } from "../../container/page-header/PageHeader";import IdleTimeOutHandler from "../../ui/Dashboard/IdleTimeOutHandler";
import "./param.css";

const AddParameter = () => {
  const initialState = {
    paramType: "",
    paramLevel: "",
    paramValue: "",
    comments: "",
    isDeleted: false,
  };

  const [formState, setFormState] = useState(initialState);
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [submitErr, setSubmitErr] = useState("");
  const [inputErr, setInputErr] = useState({});
  const history = useHistory();
  const headers = JSON.parse(sessionStorage.getItem("headers"));
  
   const[isActive,setIsActive]=useState(true)
  const[isLogout,setLogout]=useState(false)

  const handleChange = (e, validProc = null) => {
    const isValid = runValidation(validProc, e.target.value);
    setFormState({ ...formState, [e.target.name]: e.target.value });
    if (!isValid) {
      setInputErr({
        ...inputErr,
        [e.target.name]: `Invalid format or characters`,
      });
    } else if (isValid || e.target.value === "") {
      let temp = { ...inputErr };
      delete temp[e.target.name];
      setInputErr({ inputErr: temp });
    }
  };

  const submitForm = (e) => {
    e.preventDefault();

    const newParameter = {
      paramType: formState.paramType,
      paramLevel: formState.paramLevel,
      paramValue: formState.paramValue,
      comments: formState.comments,
      isDeleted: false,
    };
    axios
      .post(`${config.serverURL}/parameter`, newParameter, { headers })
      .then((response) => {
        if (response.status === 201) {
          setShowModal(true);
          setFormState(initialState);
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 409) {
          setSubmitErr(error.response);
          setShowModal(true);
        }
      });
  };

  const onClose = (e) => {
    if (!submitErr) setFormState(initialState);
    setShowModal(false);
  };

  const resetForm = () => {
    setFormState(initialState);
    setMessage("");
  };

  const closeForm = () => {
    history.push("/viewparameters");
  };

  return (
    <PageContainer>
      <PageHeader
        breadcrumbs={
          <Breadcrumbs
            className="header"
            crumbs={[
              { id: 0, text: "Parameters", onClick: () => closeForm() },
              { id: 1, text: "Add Parameter", lastCrumb: true },
            ]}
          />
        }
      />
        <IdleTimeOutHandler 
    onActive={()=>{setIsActive(true)}} 
    onIdle={()=>{setIsActive(false)}}
    onLogout={()=>{setLogout(true)}}
    />
      <Content>
        {message && <p className="text-err-messg-top">{message}</p>}
        <Form formEnabled={true} onSubmit={submitForm} cancel={resetForm}>
          <Input
            type="text"
            label="Param Type"
            name="paramType"
            value={formState.paramType}
            onChange={(e) => handleChange(e, "validateName")}
            maxLength="20"
            required
            errMssg={inputErr["paramType"]}
          />
          <Input
            type="text"
            label="Param Level"
            name="paramLevel"
            value={formState.paramLevel}
            onChange={(e) => handleChange(e, "validateHasAlpha")}
            maxLength="20"
            required
            errMssg={inputErr["paramLevel"]}
            className="rightalign"

          />
          <Input
            type="text"
            label="Param Value"
            name="paramValue"
            value={formState.paramValue}
            onChange={(e) => handleChange(e, "validateNum")}
            maxLength="20"
            required
            errMssg={inputErr["paramValue"]}
            className="rightalign"

          />
          <TextBlock
            type="text"
            label="Comments"
            name="comments"
            value={formState.comments || ""}
            onChange={(e) => handleChange(e)}
            maxLength="3000"
            charCount={`${
              formState.comments ? 3000 - formState.comments.length : 3000
            } of 3000`}
          />
        </Form>
        <PopUp
          openModal={showModal}
          closePopUp={onClose}
          handleConfirmClose={onClose}
          type={submitErr ? "Warning" : "Success"}
          message={{
            title: submitErr ? "Error" : "Parameter Added Successfully",
            details: submitErr
              ? `An error ocurred, parameter not created: ${submitErr}`
              : "To view parameters go to ",
          }}
          confirmValue="Ok"
          link={submitErr ? "" : <Link to="/viewparameters">Parameters</Link>}
        />
      </Content>
    </PageContainer>
  );
};

export default AddParameter;
