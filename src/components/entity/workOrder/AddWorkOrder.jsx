import React, { useState, useCallback, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import { config } from "../../../config.js";
import AuthService from "../../../utils/AuthService.js";
import { runValidation } from "../../../utils/validation.js";
import PopUp from "../../modal/popup/popup.component.jsx";
import SingleSelect from "../../common/select/selects.component.jsx";
import Content from "../../container/content-container/content-container.component.jsx";
import Form from "../../common/form/form.component.jsx";
import Input from "../../common/input/inputs.component.jsx";
import Breadcrumbs from "../../common/breadcrumbs/breadcrumbs.component.jsx";
import { PageContainer } from "../../container/page-container/PageContainer.jsx";
import { PageHeader } from "../../container/page-header/PageHeader.jsx";
import IdleTimeOutHandler from "../../ui/Dashboard/IdleTimeOutHandler.js";
import moment from "moment";
import ms from "ms";
import"./workOrder.css";

const AddWorkOrder = () => {
  const initialState = {
    startDate: "",
    endDate: "",
    activeDate: "",
    status: "",
    billRate: 0,
    annualBillRate: 0,
    payRate: 0,
    annualPayRate: 0,
    margin: 0,
    comments:"",
    workerName: "",
    workerId: "",
    worker:"",
    project:"",
    projectId: "",
    projectName: "",

  };

  const [formState, setFormState] = useState(initialState);
  const [showModal, setShowModal] = useState(false);
  const [workerOption, setWorkerOption] = useState([]);
  const [projectOption, setProjectOption] = useState([]);
  const [headers] = useState(AuthService.getHeaders());
  const [inputErr, setInputErr] = useState({});
  const [submitErr, setSubmitErr] = useState("");
  const history = useHistory();
  const[isActive,setIsActive]=useState(true);
  const[isLogout,setLogout]=useState(false);
  const [minDate, setMinDate] = useState(null);


  const loadWorker = useCallback(() => {
    axios
      .get(`${config.serverURL}/worker?dropdownFilter=true`, { headers })
      .then((response) => {
        if (response.data) {
          setWorkerOption(response.data);
        }
      })
      .catch((err) => console.log(err));
  }, [headers]);

  useEffect(() => {
    loadWorker();
  }, [loadWorker]);

  useEffect(() => {
    const day = ms("1d");
    const min_date = new Date(+new Date(formState?.startDate) + day);
    setMinDate(moment(min_date).format("YYYY-MM-DD"));
  }, [formState?.startDate]);


  const loadProject = useCallback(() => {
    axios
      .get(`${config.serverURL}/projects?dropdownFilter=true`, { headers })
      .then((response) => {
        if (response.data) {
          setProjectOption(response.data);
        }
      })
      .catch((err) => console.log(err));
  }, [headers]);

  useEffect(() => {
    loadProject();
  }, [loadProject]);

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





  const handleWorkerChange = (event) => {
    event.preventDefault();
    setFormState({ ...formState, worker: event.target.value });
  };
  const handleProjectChange = (event) => {
    event.preventDefault();
    setFormState({ ...formState, project: event.target.value });
  };
  const submitForm = (e) => {
    e.preventDefault();

    const workOrders = {
      startDate: formState.startDate,
      endDate: formState.endDate,
      worker: formState.worker === "" ? null : { id: formState.worker },
      project: formState.project === "" ? null : { id: formState.project },
      activeDate: formState.activeDate,
      workerName: formState.workerName,
      projectName:formState.projectName,
      status: formState.status,
      billRate: formState.billRate,
      annualBillRate: formState.annualBillRate,
      payRate: formState.payRate,
      margin:formState.margin,   
       annualPayRate: formState.annualPayRate,
      comments: formState.comments,

    };

    axios
      .post(`${config.serverURL}/workOrders`, workOrders, { headers })
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

  
  const closeForm = () => {
    history.push("/viewworkOrder");
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
              { id: 0, text: "WorkOrder", onClick: () => closeForm() },
              { id: 1, text: "Add WorkOrder", lastCrumb: true },
            ]}
          />
        }
      />
      <Content>
        <Form cancel={resetForm} onSubmit={submitForm} formEnabled={true}>
 
          <SingleSelect
            label="Project"
            name="projectId"
            data-testid="workOrder-options"

            value={formState.project}
            onChange={handleProjectChange}
            options={projectOption.map((project) => {
              let id = project.id;
              return {
                id: id,
                name: `${project.projectName}`
                            };
            })}
            required
          />
        
        <Input
  label="Net Bill Rate/hr"
  name="billRate"
  value={Number(formState.billRate).toFixed(2)}
  onChange={(e) => handleChange(e, "validateHasDecimal")}
  required
  errMssg={inputErr["billRate"]}
  className="right-align-input"
/>



                 <Input
        label="Start Date"
        type="date"
        name="startDate"
        id="startDate"
        max="2999-12-31"
        value={formState.startDate}
        onChange={(e) => handleChange(e)}
        required
        
      />
       
      <Input
        label="End Date"
        type="date"
        name="endDate"
        id="endDate"
        min={minDate}
        value={formState.endDate}
        onChange={(e) => handleChange(e)}
        required
      />

<SingleSelect
            label="Worker"
            name="workerId"
            data-testid="workerId-options"

            value={formState.worker}
            onChange={handleWorkerChange}
            options={workerOption.map((worker) => {
              let id = worker.id;
              return {
                id: id,
                name: `${worker?.firstName} ${worker?.lastName}`,
              };
            })}
            required
          />

<Input
            label="C2C Pay Rate/hr"
            name="payRate"
           value={Number(formState.payRate).toFixed(2)}
           onChange={(e) => handleChange(e,"validateHasDecimal")}
            required
            errMssg={inputErr["payRate"]}
            className="right-align-input"
          />

<Input
        label="Active Date"
        type="date"
        name="activeDate"
        value={formState.activeDate}
        onChange={(e) => handleChange(e)}
        required
      />
      <Input
           label="Margin/hr"
           name="margin"
           value={Number(formState.margin).toFixed(2)}
           onChange={(e) => handleChange(e,"validateHasDecimal")}
            required
            errMssg={inputErr["margin"]}
            className="right-align-input"
          />
        </Form>

        <PopUp
          openModal={showModal}
          type={submitErr ? "Warning" : "Success"}
          confirmValue="Ok"
          handleConfirmClose={onClose}
          closePopUp={onClose}
          message={{
            title: submitErr ? "Error" : "WorkOrder Added Successfully",
            details: submitErr
              ? `An error ocurred while trying to save: ${submitErr}`
              : `To view WorkOrder go to `,
          }}
          link={
            submitErr ? "" : <Link to="/viewworkOrder">WorkOrder</Link>
          }
        ></PopUp>
      </Content>
    </PageContainer>
  );
};

export default AddWorkOrder;
