import React, { useState, useEffect, useCallback,useMemo } from "react";
import axios from "axios";
import { config } from "../../../config";
import auth from "../../../utils/AuthService";
import { runValidation } from "../../../utils/validation";
import { InputCurrencyRate } from "../../common/input/input-currency-rate/input-currency-rate.component";
import LargeModal from "../../modal/large-modal/large-modal.component";
import Form from "../../common/form/form.component";
import Input from "../../common/input/inputs.component";
import SingleSelect from "../../common/select/selects.component";
import TextBlock from "../../common/textareas/textareas.component";
import { ctcType, jobTypes, statuses } from "../../../utils/defaultData";
import { priorities } from "../../../utils/defaultData";
import { getAllClients } from "../../../API/clients/clients-apis";
import IdleTimeOutHandler from "../../ui/Dashboard/IdleTimeOutHandler";

export const EditJobopeningModal = ({
  showModal,
  setShowModal,
  selectedJobopening,
  submitChange,
  viewOnly,
}) => {
  const [headers] = useState(auth.getHeaders());
  const [editedJobopening, setEditedJobopening] = useState({});
  const [clientOptions, setClientOptions] = useState([]);
  const [patchJobopening, setPatchJobopening] = useState({});
  const [errMsg, setErrMsg] = useState({});
  const [editDisabled, setEditDisabled] = useState(false);
const[isActive,setIsActive]=useState(true);
  const[isLogout,setLogout]=useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const user = useMemo(() => auth.getUserInfo(), []);
  const [roleData,setRoleData]=useState(user.roles[0]);
  useEffect(() => {
    if (auth.hasAdminRole()) setIsAdmin(true);
  }, []);

  useEffect(() => {
    if (viewOnly) setEditDisabled(true);
    else setEditDisabled(auth.canEdit("jobTable"));
  }, [viewOnly]);

  useEffect(() => setEditedJobopening(selectedJobopening), [selectedJobopening]);

  const handleChange = (e, validProc = null) => {
    const isDeleted = e.target.value === "";
    const isValid = runValidation(validProc, e.target.value, e.target.max);
    if (isDeleted || isValid) {
      if (e.target.name === "clientId") {
        const cli = clientOptions.filter(
          (item) => +item.id === +e.target.value
        );
        setEditedJobopening({
          ...editedJobopening,
          client: cli[0],
        });
        setPatchJobopening({ ...patchJobopening, client: cli[0] });
      } else {
        setEditedJobopening({
          ...editedJobopening,
          [e.target.name]: e.target.value,
        });
        setPatchJobopening({
          ...patchJobopening,
          [e.target.name]: e.target.value,
        });
      }
    }
  };

  const postValidation = (e, postValidProc = null) => {
    const isInvalid = e.target.value.length
      ? postValidProc && !runValidation(postValidProc, e.target.value)
      : true;
    setErrMsg({ ...errMsg, [`${e.target.name}ErrFlag`]: Boolean(isInvalid) });
  };

  const currencyChange = (e, validProc = "validateNum") => {
    // USD by default
    e.target.value = e.target.value === "" ? "USD, $" : e.target.value;
    handleChange(e, e.target.name === "clientBillRate" ? validProc : "");
  };

  const preSubmitCheck = (job, id) => {
    axios
      .post(`${config.serverURL}/jobopenings/checks/${id}`, job, { headers })
      .then(() => {
        submitChange(job, id);
        closeModal();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (errMsg.jobDescriptionErrFlag) return;

    if (Object.keys(patchJobopening).length)
      preSubmitCheck(patchJobopening, editedJobopening.id);
    else
      closeModal();
  };

  const closeModal = () => {
    setPatchJobopening({});
    setErrMsg({});
    setShowModal(false);
  };

  const getClients = useCallback(() => {
    if (auth.hasAdminRole() || auth.hasBDManagerRole) {
      getAllClients(headers)
        .then((res) => {
          if (res.tableData) setClientOptions(res.tableData);
        })
    } else if (auth.hasRecruiterRole()) {
      const recr = [JSON.parse(sessionStorage.getItem("userInfo"))];
      setClientOptions(recr);
    }
  }, [headers]);

  useEffect(() => {
    if (showModal) getClients();
  }, [showModal, getClients]);

  return (
    <LargeModal
      open={showModal}
      close={closeModal}
      header={{
        text: `№DH${("00000" + editedJobopening?.id).slice(-5)} ${editedJobopening?.jobTitle
          } (${editedJobopening?.client?.clientName} - ${editedJobopening?.client?.address?.city
          }) `,
      }}
    >
           <IdleTimeOutHandler 
    onActive={()=>{setIsActive(true)}} 
    onIdle={()=>{setIsActive(false)}}
    onLogout={()=>{setLogout(true)}}
    />
      <Form
        onSubmit={handleSubmit}
        cancel={closeModal}
        formEnabled={!editDisabled}
      >
        <Input
          label="Job Title"
          type="text"
          name="jobTitle"
          value={editedJobopening?.jobTitle}
          onChange={handleChange}
          pattern="[^0-9@#%^$&*?]+"
          maxLength="50"
          required
          disabled={editDisabled}
        />
        <SingleSelect
          label="Client"
          name="clientId"
          value={editedJobopening?.client?.id || ""}
          onChange={handleChange}
          options={clientOptions.map((client) => {
            let id = client.id;
            let name = `${client.clientName} (${client.address?.city || ""})`;
            return { id: id, name: name };
          })}
          required
          disabled={editDisabled}
        />
        <Input
          label="Hiring Manager"
          name="hiringManager"
          type="text"
          value={editedJobopening?.hiringManager}
          onChange={(e) => handleChange(e, "validateName")}
          maxLength="20"
          required
          disabled={editDisabled}
        />
        <SingleSelect
          label="Employment Type"
          name="jobType"
          value={editedJobopening?.jobType || ""}
          onChange={handleChange}
          options={jobTypes.map((t) => ({ id: t, name: t }))}
          disabled={editDisabled}
          required
        />
        <SingleSelect
          label="Work Type"
          name="workType"
          value={editedJobopening?.workType || ""}
          onChange={handleChange}
          options={[
            { id: "Hybrid", value: "Hybrid Work", name: "Hybrid Work" },
            { id: "Onsite", value: "Onsite Work", name: "Onsite Work" },
            { id: "Remote", value: "Remote Work", name: "Remote Work" },
          ]}
          required
          disabled={editDisabled}
        />
        <SingleSelect
          label="Period"
          name="period"
          className="short"
          value={editedJobopening?.period || "Per hour"}
          onChange={handleChange}
          options={ctcType.map((ctc) => ({ id: ctc, value: ctc, name: ctc }))}
          required
          disabled={editDisabled}
        />
        <InputCurrencyRate
          label="Client Bill Rate"
          guide={`${editedJobopening?.period || "Per hour"}`}
          id="currency"
          nameCurrency="currency"
          nameRate="clientBillRate"
          handleChange={currencyChange}
          valueCurrency={editedJobopening?.currency}
          valueRate={editedJobopening?.clientBillRate || ""}
          required
          disabled={editDisabled}
        />
        <SingleSelect
          label="Priority"
          name="priority"
          value={editedJobopening?.priority || ""}
          onChange={handleChange}
          options={priorities.map((p) => ({ id: p, value: p, name: p }))}
          disabled={editDisabled}
          required
        />
        <Input
          type="text"
          label="No. of Openings"
          name="noOfJobopenings"
          value={editedJobopening?.noOfJobopenings}
          onChange={(e) => {
            handleChange(e, "validateInt");
          }}
          maxLength="3"
          required
          disabled={editDisabled}
          className="small"
        />
        <SingleSelect
          label="Status"
          name="status"
          value={editedJobopening?.status || ""}
          onChange={handleChange}
          options={statuses.map((s) => ({ id: s, value: s, name: s }))}
          disabled={editDisabled}
        />
        <SingleSelect
          label="Tax Type"
          name="taxType"
          value={editedJobopening?.taxType || ""}
          onChange={handleChange}
          options={[
            { id: "C2C", value: "C2C", name: "C2C" },
            { id: "W-2", value: "W-2", name: "W-2" },
          ]}
          disabled={editDisabled}
        />
        <SingleSelect
          label="FLSA Type"
          name="flsaType"
          value={editedJobopening?.flsaType || ""}
          onChange={handleChange}
          options={[
            { id: "Exempt", value: "Exempt", name: "Exempt" },
            { id: "Non Exempt", value: "Non Exempt", name: "Non Exempt" },
          ]}
          disabled={editDisabled}
        />
        <TextBlock
          label="Job Description"
          name="jobDescription"
          value={editedJobopening?.jobDescription || ""}
          onChange={(e) => {
            postValidation(e, "validateHasAlphabet");
            handleChange(e);
          }}
          charCount={`${editedJobopening?.jobDescription
            ? 3000 - editedJobopening?.jobDescription.length
            : 3000
            } of 3000`}
          required
          errMssg={
            editedJobopening?.jobDescription?.length > 0 &&
            errMsg.jobDescriptionErrFlag &&
            "Description can't only contain numbers"
          }
          maxLength="3000"
          disabled={editDisabled}
        />
        <TextBlock
          label="Comments"
          name="comments"
          value={editedJobopening?.comments || ""}
          onChange={handleChange}
          maxLength="3000"
          disabled={editDisabled}
          charCount={`${editedJobopening?.comments
            ? 3000 - editedJobopening?.comments.length
            : 3000
            } of 3000`}
        />
      </Form>
    </LargeModal>
  );
};
