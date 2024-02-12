import React, { useState, useEffect } from "react";
import Input from "../../common/input/inputs.component";
import { PageContainer } from "../../container/page-container/PageContainer";
import IdleTimeOutHandler from "../../ui/Dashboard/IdleTimeOutHandler";
import { useHistory } from "react-router-dom";
import { PageHeader } from "../../container/page-header/PageHeader";
import Breadcrumbs from "../../common/breadcrumbs/breadcrumbs.component";
import Content from "../../container/content-container/content-container.component";
import Form from "../../common/form/form.component";
import axios from "axios";
import { config } from "../../../config";
import AuthService from "../../../utils/AuthService";
import CascadingDropdown from "../../common/cascading-dropdown/cascading-dropdown-component";
import { message } from "antd";
import { Link } from "react-router-dom";
import PopUp from "../../modal/popup/popup.component";
import moment from "moment";
import ms from "ms";
const AddCommissionType = (props) => {
  const initialFormState = {
    resourceManager: "",
    startDate: "",
    endDate: "",
  };
  const TOTAL_REQUIRED_FIELDS = 3;
  const history = useHistory();
  const [commissionParams, setCommissionParams] = useState(initialFormState);
  const [cascaderValue, setCascaderValue] = useState([]);
  const [requiredFields, setRequiredFields] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [salesManagers, setSalesManagers] = useState([]);
  const [recruiters, setRecruiters] = useState([]);
  const [bulk, setBulk] = useState(true);
  const[isActive,setIsActive]=useState(true)
  const[isLogout,setLogout]=useState(false)
  const [showModal, setShowModal] = useState(false);
  const [submitErr, setSubmitErr] = useState("");
  const [minDate, setMinDate] = useState(null);

  useEffect(() => {
    if (submitError && Object.keys(requiredFields).length >= TOTAL_REQUIRED_FIELDS) {
      setSubmitError("");
    }
  }, [submitError, requiredFields]);
  useEffect(() => {
    const day = ms("1d");
    const min_date = new Date(+new Date(commissionParams.startDate) + day);
    setMinDate(moment(min_date).format("YYYY-MM-DD"));
  }, [commissionParams.startDate]);

  const getSalesManagers = () => {
    let headers = JSON.parse(sessionStorage.getItem("headers"));
    axios
      .get(config.serverURL + "/resourcemanager?dropdownFilter=true&role=SALESMANAGER", { headers })
      .then((resp) => {
        const resource = resp.data;
        if (resp.data) {
          setSalesManagers(resource.map(rs => ({
            text: `${rs.firstName} ${rs.lastName}`,
            label: `${rs.firstName} ${rs.lastName}`,
            value: rs.resourceManagerId          
                   })));
       
        }
   
     
      })
      .catch((error) => {
        console.log(error);
        if (error.response && error.response.status === 401) {
          AuthService.logout();
        }
      });
  };

  const getRecruiters = () => {
    let headers = JSON.parse(sessionStorage.getItem("headers"));
    axios
      .get(config.serverURL + "/resourcemanager?dropdownFilter=true&role=RECRUITER", { headers })
      .then((resp) => {
        const resource = resp.data;
        if (resp.data) {
         
          setRecruiters(resource.map(rs => ({
            text: `${rs.firstName} ${rs.lastName}`,
            label: `${rs.firstName} ${rs.lastName}`,
            value: rs.resourceManagerId
          })));
        }
      })
      .catch((error) => {
        console.log(error);
        if (error.response && error.response.status === 401) {
          AuthService.logout();
        }
      });
  };
    useEffect(() => {
    getSalesManagers();
    getRecruiters();
  }, []);


  const handleManagerChange = (value) => {
    let name = "resourceManager";
    if (!value || (value.length === 1 && value[0] !== "ALL")) {
      const temp = { ...requiredFields };
      delete temp[name];
      setRequiredFields(temp);
      return;
    }

    if (value[0] === "ALL") {
      setBulk(true);
      setCommissionParams({ ...commissionParams, [name]: null });
    } else if (value.length === 2) {
      setBulk(false);
      setCommissionParams({ ...commissionParams, [name]: value[1] });
    }
    setRequiredFields({ ...requiredFields, [name]: value });
    setCascaderValue(value);

  };


  const handleChange = (event) => {
    const { name, value } = event.target;
    setCommissionParams({ ...commissionParams, [name]: value });
    if (value !== "") {
      setRequiredFields({ ...requiredFields, [name]: value });
    } else {
      const temp = { ...requiredFields };
      delete temp[name];
      setRequiredFields(temp);
    }
  };

  // const resetCT =()=>{
  //   commissionParams.manager="",
  //   commissionParams.startDate="",
  //   commissionParams.endDate=""
  // }

  const handleSubmit = (event) => {
    event.preventDefault();
    if (Object.keys(requiredFields).length < TOTAL_REQUIRED_FIELDS) {
      setSubmitError("Fill out required fields before submitting");
      return;
    } else {
      setSubmitError("");
    }

    let commissionParamsData = {
      resourceManager: { resourceManagerId: parseInt(commissionParams.resourceManager) },
      startDate: commissionParams.startDate,
      endDate: commissionParams.endDate,
    };

    // let commUrl = bulk ? COMMISSION_ENDPOINT.BULK_URL : COMMISSION_ENDPOINT.BASE_URL;

    const headers = JSON.parse(sessionStorage.getItem("headers"));
     bulk? axios.post(`${config.serverURL}/commission/bulk`, commissionParamsData, { headers }):axios.post(`${config.serverURL}/commission/one`, commissionParamsData, { headers })
        .then((res) => {
          if (res.status === 201) {
            setShowModal(true);
            submitErr("");

          }
        })
        .catch((err) => {
      
           
            if (err.response && err.response.status === 500) {
              message.error({
                content: `Fill Out required fields before submitting`, style: { marginTop: "8%" } 
                });
                setSubmitErr(err.res.data);
                 setShowModal(true);
                
            }
        });
    
        setShowModal(true);
    setCommissionParams(initialFormState);
    setRequiredFields({});
    setCascaderValue([]);
  };

  const onClose = () => {
    setShowModal(false);
  };
  const closeForm = () => {
   history.push("/viewcommission");
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
                { id: 0, text: "Commission", onClick: () => closeForm() },
                { id: 1, text: "Add Commission", lastCrumb: true },
              ]}
            />

          }
        />
             <Content>
             <Form formEnabled={true} 
             onSubmit={handleSubmit} 
            //  cancel={resetCT}
             >
               <CascadingDropdown
          name="resourceManager"
          label="Resource Manager"
          required
          value={cascaderValue}
          onChange={handleManagerChange}
          options={[
            { id: "RECRUITER", value: "RECRUITER", label: "Recruiter", 
            children: recruiters },
            {
              id: "SALESMANAGER",
              value: "SALESMANAGER",
              label: "Sales Manager",
              children: salesManagers
            },
            { id: "ALL", value: "ALL", label: "ALL" },
          ]}
        />

        <Input
          label="Start Date"
          type="date"
          name="startDate"
          value={commissionParams?.startDate}
          onChange={handleChange}
          required
        />

        <Input
          label="End Date"
          type="date"
          name="endDate"
          value={commissionParams?.endDate}
          onChange={handleChange}
          required
          min={minDate}

        />



</Form>
<PopUp
          openModal={showModal}
          type={submitErr ? "Warning" : "Success"}
          confirmValue="Ok"
          handleConfirmClose={onClose}
          closePopUp={onClose}
          message={{
            title: submitErr ? "Error" : "Commission Added Successfully",
            details: submitErr
              ? `An error ocurred while trying to save: ${submitErr}`
              : `To view Commission go to `,
          }}
          link={
            submitErr ? "" : <Link to="/viewcommission">Commission</Link>
          }
        ></PopUp>
             </Content>
  </PageContainer>
  );

}

export default AddCommissionType;
