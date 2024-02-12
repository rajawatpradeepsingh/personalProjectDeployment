import React, { useEffect, useState } from "react";
import axios from "axios";
import { config } from "../../../config";
import auth from "../../../utils/AuthService";
import { useDispatch, useSelector } from "react-redux";
import { setShowModal } from "../../../Redux/parameterSlice";
import { runValidation } from "../../../utils/validation";
import LargeModal from "../../modal/large-modal/large-modal.component";
import Form from "../../common/form/form.component";
import Input from "../../common/input/inputs.component";
import { Alert } from "antd";
import TextBlock from "../../common/textareas/textareas.component";
import IdleTimeOutHandler from "../../ui/Dashboard/IdleTimeOutHandler";

const EditParameterModal = ({ editParameter, viewOnly }) => {
  const [editedParameter, setEditedParameter] = useState({});
  const [message, setMessage] = useState("");
  const [headers] = useState(auth.getHeaders());
  const [inputErr, setInputErr] = useState({});
  const dispatch = useDispatch();
  const { showModal, selectedParameter } = useSelector(
    (state) => state.parameter
  );
  const [formDisabled, setFormDisabled] = useState(false);
  
   const[isActive,setIsActive]=useState(true)
  const[isLogout,setLogout]=useState(false)

  useEffect(() => {
    if (
      viewOnly ||
      auth.hasHRRole() ||
      auth.hasBDManagerRole() ||
      auth.hasRecruiterRole()
    )
      setFormDisabled(true);
  }, [viewOnly]);

  useEffect(() => {
    setEditedParameter(selectedParameter);
  }, [showModal, selectedParameter]);

  const handleChange = (e, validProc = null) => {
    const limit = e.target.max ? +e.target.max : null;
    const isValid = runValidation(validProc, e.target.value, limit);
    const isDeleted = e.target.value === "";
    setEditedParameter({
      ...editedParameter,
      [e.target.name]: e.target.value,
    });

    if (!isValid) {
      setInputErr({ ...inputErr, [e.target.name]: "Invalid characters" });
    } else if (isValid || isDeleted) {
      let temp = { ...inputErr };
      delete temp[e.target.name];
      setInputErr(temp);
    }
  };

  const closeModal = () => {
    setEditedParameter({});
    setMessage("");
    setInputErr({});
    dispatch(setShowModal(false));
  };

  const handleEditParameter = (e, ParameterId) => {
    e.preventDefault();
    if (Object.keys(inputErr).length) {
      setMessage(
        `Fix errors before submitting: ${Object.keys(inputErr).join(", ")}`
      );
      return;
    } else {
      setMessage("");
    }

    const ParameterPatchInfo = {
      id: editedParameter.id,
      paramType: editedParameter.paramType,
      paramLevel: editedParameter.paramLevel,
      paramValue: editedParameter.paramValue,
      comments: editedParameter.comments,
    };
    preSubmitCheck(ParameterPatchInfo, ParameterId);
  };

  const preSubmitCheck = (patchInfo, id) => {
    axios
      .post(`${config.serverURL}/parameter/checks/${id}`, patchInfo, {
        headers,
      })
      .then(() => {
        closeModal();
        editParameter(patchInfo, id);
      })
      .catch((err) => {});
  };

  return (
    <>
      <LargeModal
        open={showModal}
        close={closeModal}
        header={{
          text: `Parameter: ${editedParameter?.paramType}`,
        }}
      >
        <Form
          onSubmit={(e) => handleEditParameter(e, editedParameter.id)}
          cancel={closeModal}
          formEnabled={!formDisabled}
        >
          {message && <Alert type="error" showIcon message={message} />}
          <Input
            type="text"
            label="Param Type"
            name="paramType"
            value={editedParameter.paramType || ""}
            onChange={(e) => handleChange(e, "validateName")}
            maxLength="20"
            required
            errMssg={inputErr["paramType"]}
            disabled={formDisabled}
          />
          <Input
            type="text"
            label="Param Level"
            name="paramLevel"
            maxLength="200"
            value={editedParameter?.paramLevel || ""}
            onChange={(e) => handleChange(e, "validateHasAlpha")}
            disabled={formDisabled}
          />
          <Input
            type="text"
            label="Param Value"
            name="paramValue"
            maxLength="20"
            value={editedParameter.paramValue}
            onChange={(e) => handleChange(e, "validateHasAlpha")}
            required
            errMssg={inputErr["paramLevel"]}
          />
          <TextBlock
            type="text"
            label="Comments"
            name="comments"
            value={editedParameter.comments || ""}
            onChange={(e) => handleChange(e)}
            maxLength="3000"
            disabled={formDisabled}
            charCount={`${
              editedParameter.comments
                ? 3000 - editedParameter.comments.length
                : 3000
            } of 3000`}
          />
        </Form>
      </LargeModal>
         <IdleTimeOutHandler 
    onActive={()=>{setIsActive(true)}} 
    onIdle={()=>{setIsActive(false)}}
    onLogout={()=>{setLogout(true)}}
    />
    </>
  );
};

export default EditParameterModal;
