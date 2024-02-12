import { useEffect, useState, useCallback ,useMemo} from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import moment from "moment";
import AuthService from "../../../utils/AuthService";
import axios from "axios";
import auth from "../../../utils/AuthService.js";
import { config } from "../../../config";
import { setAddInterviewOpen } from "../../../Redux/interviewSlice";
import { getDict, delDict } from "../../../API/dictionaries/dictionary-apis";
import { postDict } from "../../../API/dictionaries/dictionary-apis";
import { getInterviewsByParams } from "../../../API/interviews/interview-apis";
import { runValidation } from "../../../utils/validation";
import ScheduleInterview from "../interview/ScheduleInterview";
import Content from "../../container/content-container/content-container.component";
import Form from "../../common/form/form.component";
import Input from "../../common/input/inputs.component";
import { AddressSelect } from "../../common/address-select/AddressSelect";
import { InputPhone } from "../../common/input/input-phone/input-phone.component";
import SingleSelect from "../../common/select/selects.component";
import MultiSelect from "../../common/select/multiSelect/multiSelect.component";
import Schedule from "../schedule/schedule.component";
import Breadcrumbs from "../../common/breadcrumbs/breadcrumbs.component";
import Button from "../../common/button/button.component";
import { Alert } from "antd";
import { PlusOutlined, EditFilled } from "@ant-design/icons";
import { PageContainer } from "../../container/page-container/PageContainer";
import { PageHeader } from "../../container/page-header/PageHeader";
import { ContentPanels } from "../../container/content-panels-container/ContentPanels";
import { Workbench } from "../../container/workbench-container/Workbench";
import { message } from "antd";
import "antd/dist/antd.css";
import IdleTimeOutHandler from "../../ui/Dashboard/IdleTimeOutHandler";

const EditInterviewerPage = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const params = useParams();
  const [headers] = useState(AuthService.getHeaders());
  const [interviewer, setInterviewer] = useState({});
  const [editDisabled, setEditDisabled] = useState(true);
  const [primeSkillsDict, setPrimeSkillsDict] = useState([]);
  const [clientOptions, setClientOptions] = useState([]);
  const [inputErr, setInputErr] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [interviews, setInterviews] = useState([]);
  const [fullName, setFullName] = useState("");
  const [month, setMonth] = useState(moment(new Date()).month() + 1);
  const [year, setYear] = useState(moment(new Date()).year());
const[isActive,setIsActive]=useState(true);
  const[isLogout,setLogout]=useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const user = useMemo(() => auth.getUserInfo(), []);
  const [roleData,setRoleData]=useState(user.roles[0]);
  useEffect(() => {
    if (auth.hasAdminRole()) setIsAdmin(true);
  }, []);
  
  const getInterviewerData = useCallback(async () => {
    try {
      return await axios.get(
        `${config.serverURL}/interviewer/${params.interviewerId}`,
        { headers }
      );
    } catch (error) {
      console.log(error);
    }
  }, [headers, params.interviewerId]);

  useEffect(() => {
    let isCancelled = false;
    const fetchData = async () => {
      try {
        if (!isCancelled) {
          const response = await getInterviewerData();
          if (response.status === 200) {
            setInterviewer(response.data);
            setFullName(`${response.data.firstName} ${response.data.lastName}`);
          }
        }
      } catch (error) {
        if (!isCancelled) {
          if (error.response?.status === 401) AuthService.logout();
          console.log(error);
        }
      }
    };
    fetchData();
    return () => (isCancelled = true);
  }, [getInterviewerData]);

  const getOptions = useCallback(async () => {
    try {
      return await getDict("primeSkills", headers);
    } catch (error) {
      console.log(error);
    }
  }, [headers]);

  useEffect(() => {
    let isCancelled = false;
    const fetchData = async () => {
      try {
        if (!isCancelled) {
          const dictionary = await getOptions();
          if (dictionary) setPrimeSkillsDict(dictionary);
        }
      } catch (error) {
        if (!isCancelled) console.log(error);
      }
    };
    fetchData();
    //cleanup function:
    return () => (isCancelled = true);
  }, [headers, getOptions]);

  const getClients = useCallback(async () => {
    try {
      return await axios.get(
        config.serverURL + "/clients?dropdownFilter=true",
        { headers }
      );
    } catch (error) {
      console.log(error);
    }
  }, [headers]);

  useEffect(() => {
    let isCancelled = false;
    const fetchData = async () => {
      try {
        if (!isCancelled) {
          const response = await getClients();
          if (response.status === 200) {
            setClientOptions(response.data);
          }
        }
      } catch (error) {
        if (!isCancelled && error.response?.status === 401)
          AuthService.logout();
      }
    };
    fetchData();
    //cleanup function:
    return () => (isCancelled = true);
  }, [getClients]);

  const toggleEditForm = () => setEditDisabled((prevState) => !prevState);

  const handleChange = (e, validProc = null) => {
    const limit = e.target.max ? +e.target.max : null;
    const isValid = runValidation(validProc, e.target.value, limit);
    const isDeleted = e.target.value === "";
    if (e.target.name === "postalCode") {
      setInterviewer({
        ...interviewer,
        address: {
          ...interviewer.address,
          [e.target.name]: e.target.value,
        },
      });
    } else {
      setInterviewer({
        ...interviewer,
        [e.target.name]: e.target.value,
      });
    }

    if (!isValid) {
      setInputErr({ ...inputErr, [e.target.name]: "Invalid characters" });
    } else if (isValid || isDeleted) {
      let temp = { ...inputErr };
      delete temp[e.target.name];
      setInputErr(temp);
    }
  };

  const handleAddressChange = (address) => {
    const { country, state, city } = address;
    setInterviewer({
      ...interviewer,
      address: {
        country: country.country,
        countryCode: country.code,
        state: state.state,
        stateCode: state.stateCode,
        city: city,
      },
    });
  };

  const handlePhoneChange = (value) => {
    setInterviewer({ ...interviewer, phone_no: value });
  };

  const handlePhoneError = (error) => {
    if (error) {
      setInputErr({ ...inputErr, phoneNumber: true });
    } else {
      let temp = { ...inputErr };
      delete temp["phoneNumber"];
      setInputErr(temp);
    }
  };

  const handleChangeClient = (e) => {
    const client = clientOptions.filter(
      (item) => +item.id === +e.target.value
    )[0];

    setInterviewer({
      ...interviewer,
      client: { clientName: client.clientName, id: client.id },
    });
  };

  const multiSelectChange = (options, resource) => {
    const selected = options
      .filter((o) => o.selected)
      .map((o) => o.value)
      .join(",");

    handleChange({
      target: { name: "interview_skills", value: selected || "" },
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

  const submitChanges = (e, id) => {
    e.preventDefault();

    if (Object.keys(inputErr).length) {
      setErrorMessage(
        `Fix errors before submitting: ${Object.keys(inputErr).join(", ")}`
      );
      return;
    } else {
      setErrorMessage("");
    }

    const interviewerData = {
      firstName: interviewer.firstName,
      lastName: interviewer.lastName,
      email: interviewer.email,
      phone_no: interviewer.phone_no ? interviewer.phone_no : "",
      interview_skills: interviewer.interview_skills,
      total_experience: interviewer.total_experience,
      client: {
        clientName: interviewer.client.clientName,
        id: interviewer.client.id,
      },
      address: { ...interviewer.address },
    };
    preSubmitCheck(interviewerData, id);
  };

  const preSubmitCheck = (data, id) => {
    axios
      .post(`${config.serverURL}/interviewer/checks/${id}`, data, { headers })
      .then(() => {
        updateInterviewer(data, id);
      })
      .catch((err) => {
        console.log(err);
        // setErrorMessage(err);
      });
  };

  const updateInterviewer = (data, id) => {
    axios
      .patch(`${config.serverURL}/interviewer/${id}`, data, { headers })
      .then((response) => {
        if (response.status === 200) {
          message.success({
            content: "Interviewer updated!",
            duration: 5,
            style: { marginTop: "5%" },
          });
          setEditDisabled(true);
          setInterviewer(response.data);
          setFullName(`${response.data.firstName} ${response.data.lastName}`);
        }
      })
      .catch((error) => {
        console.log(error);
        if (error.response && error.response.status === 401) {
          AuthService.logout();
        }
        message.error({
          content: `An error occurred while saving changes (${error.response?.status})`,
          duration: 10,
        });
      });
  };

  const getSchedule = useCallback(() => {
    const path = `interviewer/${interviewer.id}`
    const params = `?year=${year}&month=${month}`
    getInterviewsByParams(headers, path, params)
      .then(res => setInterviews(res.data))
      .catch(err => console.log(err))
  }, [headers, interviewer.id, month, year]);

  useEffect(() => {
    if (interviewer.id) getSchedule();
  }, [interviewer.id, getSchedule]);

  const cancelEdit = async () => {
    try {
      const response = await getInterviewerData();
      if (response.status === 200) {
        setEditDisabled(true);
        setInterviewer({...response.data});
        setFullName(`${response.data.firstName} ${response.data.lastName}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const openScheduleInterviewForm = () => dispatch(setAddInterviewOpen(true));

  //return to view page
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
              {
                id: 1,
                text: fullName
                  ? `Interviewer: ${fullName}`
                  : `Interviewer Profile`,
                lastCrumb: true,
              },
            ]}
          />
        }
        actions={
          <>
            { isAdmin || roleData.managerPermission || roleData.candidatesPermission  ||roleData.clientPermission  ||roleData.interviewsPermission  ||roleData.jobOpeningsPermission  ||roleData.onBoardingsPermission ||roleData.settingsPermission  ||roleData.suppliersPermission ?
            <Button

              type="button"
              className="btn main margin-right"
              handleClick={openScheduleInterviewForm}
            >
              <PlusOutlined className="icon" />
              Schedule Interview
            </Button>:""
        }
            <Workbench>
            { isAdmin || roleData.managerPermission || roleData.candidatesPermission  ||roleData.clientPermission  ||roleData.interviewsPermission  ||roleData.jobOpeningsPermission  ||roleData.onBoardingsPermission ||roleData.settingsPermission  ||roleData.suppliersPermission ?
              <Button
                className={"btn icon marginX"}
                type="button"
                handleClick={toggleEditForm}
              >
                <EditFilled />
              </Button>:""
        }
            </Workbench>
            
          </>
        }
      />
      <ContentPanels>
        <Content className="x-small">
          <Form
            onSubmit={(e) => submitChanges(e, interviewer.id)}
            cancel={cancelEdit}
            formEnabled={!editDisabled}
            className="column small"
          >
            {errorMessage && (
              <Alert type="error" showIcon message={errorMessage} />
            )}
            <h3 className="disabled-form-section-header">Contact</h3>
            {editDisabled ? (
              <Input
                type="text"
                label="Name"
                name="fullName"
                value={fullName || ""}
                readOnly
              />
            ) : (
              <>
                <Input
                  type="text"
                  label="First Name"
                  name="firstName"
                  value={interviewer?.firstName || ""}
                  onChange={(e) => handleChange(e, "validateName")}
                  maxLength="40"
                  required
                  disabled={editDisabled}
                  errMssg={inputErr["firstName"]}
                />
                <Input
                  type="text"
                  label="Last Name"
                  name="lastName"
                  value={interviewer?.lastName || ""}
                  onChange={(e) => handleChange(e, "validateName")}
                  maxLength="40"
                  required
                  disabled={editDisabled}
                  errMssg={inputErr["lastName"]}
                />
              </>
            )}
            <Input
              type="email"
              label="Email"
              name="email"
              value={interviewer?.email || ""}
              onChange={(e) => handleChange(e, "validateEmail")}
              required
              disabled={editDisabled}
              errMssg={inputErr["email"]}
            />
            <InputPhone
              label="Phone Num."
              phoneNumber={interviewer?.phone_no || ""}
              handleChange={handlePhoneChange}
              disabled={editDisabled}
              setError={handlePhoneError}
            />
            <h3 className="disabled-form-section-header">
              Professional Details
            </h3>
            <SingleSelect
              label="Client"
              name="clientId"
              data-testid="client-options"
              onChange={handleChangeClient}
              value={interviewer.client?.id || ""}
              options={clientOptions.map((client) => {
                let id = client.id;
                let name = client.clientName;
                return { id: id, name: name };
              })}
              required
              disabled={editDisabled}
            />
            <Input
              type="number"
              label="Work Experience"
              info="Years"
              name="total_experience"
              value={interviewer?.total_experience || ""}
              onChange={(e) => handleChange(e, "validateNum")}
              min="0"
              max="50"
              step="any"
              disabled={editDisabled}
              errMssg={inputErr["total_experience"]}
            />
            <MultiSelect
              label="Interview Skills"
              options={primeSkillsDict?.map((o) => ({
                id: o.id,
                value: o.value,
                label: o.value,
                selected: interviewer.interview_skills?.includes(o.value),
              }))}
              handleChange={(e) => multiSelectChange(e, "primeSkills")}
              isMulti
              creatable
              deletable={AuthService.hasAdminRole()}
              disabled={editDisabled}
            />
            <h3 className="disabled-form-section-header">Location</h3>
            <AddressSelect
              disabled={editDisabled}
              requiredCountry
              requiredCity
              country={interviewer?.address?.country || ""}
              countryCode={interviewer?.address?.countryCode || ""}
              state={interviewer?.address?.state || ""}
              stateCode={interviewer?.address?.stateCode || ""}
              city={interviewer?.address?.city || ""}
              handleAddressChange={handleAddressChange}
            />
            <Input
              type="text"
              label="Zip Code"
              name="postalCode"
              value={interviewer?.address?.postalCode || ""}
              onChange={(e) => handleChange(e, "validateZip")}
              maxLength="6"
              disabled={editDisabled}
              errMssg={inputErr["postalCode"]}
            />
          </Form>
        </Content>
        <Content className="medium">
          <h2 className="content-header">Schedule</h2>
          <Schedule
            interviews={interviews}
            setMonth={setMonth}
            setYear={setYear}
          />
        </Content>
      </ContentPanels>
      <ScheduleInterview
        interviewer={{
          id: interviewer.id,
          name: `${interviewer.firstName} ${interviewer.lastName}`,
        }}
        loadInterviews={getSchedule}
      />
    </PageContainer>
  );
};

export default EditInterviewerPage;
