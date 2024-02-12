import React, { useState, useCallback, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import { config } from "../../../config.js";
import AuthService from "../../../utils/AuthService.js";
import { InputPhone } from "../../common/input/input-phone/input-phone.component.jsx";
import { runValidation } from "../../../utils/validation.js";
import PopUp from "../../modal/popup/popup.component.jsx";
import { getDict, delDict } from "../../../API/dictionaries/dictionary-apis.js";
import { postDict } from "../../../API/dictionaries/dictionary-apis.js";
import MultiSelect from "../../common/select/multiSelect/multiSelect.component.jsx";
import SingleSelect from "../../common/select/selects.component.jsx";
import Content from "../../container/content-container/content-container.component.jsx";
import Form from "../../common/form/form.component.jsx";
import Input from "../../common/input/inputs.component.jsx";
import { AddressSelect } from "../../common/address-select/AddressSelect.jsx";
import Breadcrumbs from "../../common/breadcrumbs/breadcrumbs.component.jsx";
import { PageContainer } from "../../container/page-container/PageContainer.jsx";
import { PageHeader } from "../../container/page-header/PageHeader.jsx";
import IdleTimeOutHandler from "../../ui/Dashboard/IdleTimeOutHandler.js";
import "./interview.css"

const AddInterviewer = () => {
  const initialState = {
    firstName: "",
    lastName: "",
    city: "",
    country: "",
    state: "",
    postalCode: "",
    phoneNumber: "",
    email: "",
    client: "",
    clientName: "",
    clientId: "",
    totalExperience: "",
    interviewSkills: "",
  };

  const [formState, setFormState] = useState(initialState);
  const [showModal, setShowModal] = useState(false);
  const [clients, setClients] = useState([]);
  const [primeSkillsDict, setPrimeSkillsDict] = useState([]);
  const [headers] = useState(AuthService.getHeaders());
  const [inputErr, setInputErr] = useState({});
  const [submitErr, setSubmitErr] = useState("");
  const history = useHistory();
  const[isActive,setIsActive]=useState(true);
  const[isLogout,setLogout]=useState(false);

  useEffect(() => {
    getDict("primeSkills", headers)
      .then((dictionary) => setPrimeSkillsDict(dictionary))
      .catch((err) => console.log(err));
  }, [headers]);

  const { client, postalCode, phoneNumber, email, totalExperience } = formState;

  const loadClients = useCallback(() => {
    axios
      .get(`${config.serverURL}/clients`, { headers })
      .then((response) => {
        if (response.data) {
          setClients(response.data);
        }
      })
      .catch((err) => console.log(err));
  }, [headers]);

  useEffect(() => {
    loadClients();
  }, [loadClients]);

  const handleChange = (e, validProc = null) => {
    e.preventDefault?.();
    const limit = e.target.max ? +e.target.max : null;
    const isValid = runValidation(validProc, e.target.value, limit);
    const isDeleted = e.target.value === "";

    setFormState({ ...formState, [e.target.name]: e.target.value });

    if (!isValid) {
      setInputErr({
        ...inputErr,
        [e.target.name]: `Invalid format or characters`,
      });
    } else if (isValid || isDeleted) {
      let temp = { ...inputErr };
      delete temp[e.target.name];
      setInputErr({ inputErr: temp });
    }
  };

  const handleAddressChange = (address) => {
    const { country, state, city } = address;
    setFormState({
      ...formState,
      country: country.country,
      countryCode: country.code,
      state: state.state,
      stateCode: state.code,
      city: city
    });
    
  }

  const handlePhoneChange = (value) => {
    setFormState({ ...formState, phoneNumber: value });
  };

  const handleClientChange = (event) => {
    event.preventDefault();
    setFormState({ ...formState, client: event.target.value });
  };

  const submitForm = (e) => {
    e.preventDefault();

    const interviewer = {
      firstName: formState.firstName,
      lastName: formState.lastName,
      client: formState.client === "" ? null : { id: formState.client },
      phone_no: formState.phoneNumber,
      email: formState.email,
      interview_skills: formState.interviewSkills,
      client_name: formState.clientName,
      total_experience: formState.totalExperience,
      address: {
        city: formState.city,
        country: formState.country,
        countryCode: formState.countryCode,
        state: formState.state,
        stateCode: formState?.stateCode || "",
        postalCode: formState.postalCode,
      },
    };

    axios
      .post(`${config.serverURL}/interviewer`, interviewer, { headers })
      .then((response) => {
        if (response.status === 201) {
          setShowModal(true);
          setFormState(initialState);
          submitErr("");
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 409) {
          setSubmitErr(error.res.data);
          setShowModal(true);
        }
        if (error.response && error.response.status === 401) {
          AuthService.logout();
        }
      });
  };

  const resetForm = () => {
    setFormState(initialState);
  };

  const onClose = () => {
    setShowModal(false);
  };

  const multiSelectChange = (options, resource) => {
    const selected = options
      .filter((o) => o.selected)
      .map((o) => o.value)
      .join(",");

    handleChange({
      target: { name: "interviewSkills", value: selected || "" },
    });

    // call add API for new /* TODO: decompose and make as new function */
    options
      .filter((o) => !o.id && !o.isDeleted)
      .forEach((o) => {
        postDict(resource, o.value, headers)
          .then((res) => setPrimeSkillsDict([...primeSkillsDict, res]))
          .catch((err) => console.log(err));
      });

    // call delete API for marked as deleted
    options
      .filter((o) => o.isDeleted)
      .forEach((o) => {
        delDict(o.id, headers).catch((err) => console.log(err));
      });
    const delList = options.filter((o) => !o.isDeleted);
    setPrimeSkillsDict(delList);
  };

  const closeForm = () => {
    history.push("/viewinterviewers");
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
              { id: 0, text: "Interviewers", onClick: () => closeForm() },
              { id: 1, text: "Add Interviewer", lastCrumb: true },
            ]}
          />
        }
      />
      <Content>
        <Form cancel={resetForm} onSubmit={submitForm} formEnabled={true}>
          <Input
            type="text"
            label="First Name"
            name="firstName"
            value={formState.firstName}
            onChange={(e) => handleChange(e, "validateName")}
            maxLength="40"
            required
            errMssg={inputErr["firstName"]}
          />
          <Input
            type="text"
            label="Last Name"
            name="lastName"
            value={formState.lastName}
            onChange={(e) => handleChange(e, "validateName")}
            maxLength="40"
            required
            errMssg={inputErr["lastName"]}
          />
          <SingleSelect
            label="Client"
            name="clientId"
            value={client}
            onChange={handleClientChange}
            options={clients.map((client) => {
              let id = client.id;
              return {
                id: id,
                name: `${client.clientName} (${client.address?.city || ""})`,
              };
            })}
            required
          />
          <InputPhone
            phoneNumber={phoneNumber}
            handleChange={handlePhoneChange}
            label="Phone Num."
          />
          <Input
            type="email"
            label="E-mail"
            name="email"
            value={email}
            onChange={(e) => handleChange(e, "validateEmail")}
            title="example@example.com"
            required
            errMssg={inputErr["email"]}
          />
          <AddressSelect
            requiredCountry
            requiredCity
            handleAddressChange={handleAddressChange}
            country={formState.country || ""}
            state={formState.state || ""}
            city={formState.city || ""}
          />
          <Input
            type="text"
            label="Zip Code"
            name="postalCode"
            value={postalCode}
            onChange={(e) => handleChange(e, "validateZip")}
            errMssg={inputErr["postalCode"]}
            maxLength="6"
          />
          <Input
            type="number"
            label="Total Experience"
            name="totalExperience"
            value={totalExperience}
            onChange={(e) => handleChange(e, "validateNum")}
            min="0"
            max="50"
            step="any"
            errMssg={inputErr["totalExperience"]}
            info="Exp. in years"
            style={{ textAlign: "right" }}
            className="alignRight"

            />
          <MultiSelect
            label="Interview Skills"
            options={primeSkillsDict.map((o) => ({
              id: o.id,
              value: o.value,
              label: o.value,
              selected: formState.interviewSkills?.includes(o.value),
            }))}
            handleChange={(e) => multiSelectChange(e, "primeSkills")}
            isMulti
            creatable
            deletable={AuthService.hasAdminRole()}
          />
        </Form>

        <PopUp
          openModal={showModal}
          type={submitErr ? "Warning" : "Success"}
          confirmValue="Ok"
          handleConfirmClose={onClose}
          closePopUp={onClose}
          message={{
            title: submitErr ? "Error" : "Interviewer Added Successfully",
            details: submitErr
              ? `An error ocurred while trying to save: ${submitErr}`
              : `To view interviewers go to `,
          }}
          link={
            submitErr ? "" : <Link to="/viewinterviewers">Interviewers</Link>
          }
        ></PopUp>
      </Content>
    </PageContainer>
  );
};

export default AddInterviewer;
