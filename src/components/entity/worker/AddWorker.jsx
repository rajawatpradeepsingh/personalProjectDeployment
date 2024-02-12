import React, { Component, Fragment } from "react";
import axios from "axios";
import { config } from "../../../config";
import AuthService from "../../../utils/AuthService";
import { runValidation } from "../../../utils/validation";
import Form from "../../common/form/form.component";
import FormNav from "../../ui/form-nav/form-nav.component";
import Input from "../../common/input/inputs.component";
import SingleSelect from "../../common/select/selects.component";
import { InputCurrencyRate } from "../../common/input/input-currency-rate/input-currency-rate.component";
import { ctcType } from "../../../utils/defaultData";
import * as addr from "../../../utils/serviceAddress";
import { InputPhone } from "../../common/input/input-phone/input-phone.component";
import { FutureDate } from "../../common/input/input-date/FutureDate";
import TextBlock from "../../common/textareas/textareas.component";
import  LargeModal  from "../../modal/large-modal/large-modal.component";
import { message } from "antd";
import "antd/dist/antd.css";
import { getDict, delDict, postDict } from "../../../API/dictionaries/dictionary-apis";
import MultiSelect from "../../common/select/multiSelect/multiSelect.component";
import auth from "../../../utils/AuthService";
import IdleTimeOutHandler from "../../ui/Dashboard/IdleTimeOutHandler";
import { Checkbox } from "antd";
export default class AddWorker extends Component {
  constructor(props) {
    super(props);
    this.state = { ...this.initialState };
    this.workerChange = this.workerChange.bind(this);
    this.submitWorker = this.submitWorker.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.docRef = React.createRef(null);
  }

  initialState = {
    firstName: "",
    lastName: "",
    email: "",
    clientOptions: [],
    client: "",
    clientId: "",
    clientName: "",
    phoneNumber: "",
    designation: "",
    gender: "",
    primarySoftwareSkill: "",
    secondarySkill: "",
    subContractorCompanyName: "",
    dateOfBirth: "",
    workAuthStatus: "",
    laptopProvided: "",
    isLaptopProvided:"",
    signedEquipmentForm: "",
    isSubContractor: "",
    contractStartDate: "",
    contractEndDate: "",
    comments: "",
    status: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    isDeleted: false,
    inputErr: "",
    headers: auth.getHeaders(),

    countryList: [],
    permanentCountryList: [],
    laptopReturnedDate: "",
    laptopReturned: "",
    laptopProvidedBy: "",
    stateList: [],
    permanentStateList: [],
    payRate:"",
    netPayRate:"",
    annualPayRate:"",
    annualNetPayRate:"",
    payRateType:"",
    period:"",
    annualPayRateType:"",
    resourceManagerOptions: [],
    resourceManager: "",
    resourceManagerId: "",
    name: "",
    currentPage: "Basic Information",
    basicRequiredPercent: 0,
    basicRequiredFields: {
      firstName: false,
      lastName: false,
      email: false,
      designation: false,
      status: false,
     resourceManagerId: "",
      payRate:"",
    netPayRate:"",

    },
    detailsRequiredPercent: 0,
    detailsRequiredFields: {
      primarySoftwareSkill: false,
    },
    addressRequiredPercent: 0,
    addressRequiredFields: {
      country: false,
      city: false,
      addressLine1: false,
      postalCode: false,
    },
    currentPercent: 0,
    showModal: false,
    invalidMssg: "",
    primeSkillsDict: [],
    secSkillsDict: [],
    professionalRolesDict:[],
    submitError: "",
    openPopUp: false,
    permanentStreet: "",
    permanentStreet1: "",
    permanentCity: "",
    permanentState: "",
    permanentCountry: "",
    permanentPostalCode:"",
    sameAsCurrentAddress:"",
    permanentCountryCode:"",
    permanentStateCode:""
  };

  async componentDidMount() {
    const headers = auth.getHeaders();
    const prime = await getDict("primeSkills", headers);
    const secondary = await getDict("secSkills", headers);
    const professionalRoles = await getDict("professionalRoles", headers);

    this.getClients();
   this.getResourceManager();

    this.setState({ countryList: addr.getCountries(),
      permanentCountryList: addr.getCountries(),
    primeSkillsDict: prime,
    secSkillsDict: secondary,
    professionalRolesDict: professionalRoles.sort((a, b) => a.value.localeCompare(b.value)),
  });
   this.setState({
      setIsActive: true,
      setLogout:false});
  }
  getClients = () => {
    let headers = JSON.parse(sessionStorage.getItem("headers"));
    axios
      .get(config.serverURL + "/clients?dropdownFilter=true", { headers })
      .then((resp) => {
        const cli = resp.data;
        if (resp.data) {
          this.setState({ clientOptions: cli });
        }
      })
      .catch((error) => {
        console.log(error);
        if (error.response && error.response.status === 401) {
          AuthService.logout();
        }
      });
  };
  getResourceManager = () => {
    let headers = JSON.parse(sessionStorage.getItem("headers"));
    axios
    .get(config.serverURL + "/resourcemanager?dropdownFilter=true&role=RECRUITER", { headers })
    .then((resp) => {
        const resource = resp.data;
        if (resp.data) {
          this.setState({ resourceManagerOptions: resource });
        }
      })
      .catch((error) => {
        console.log(error);
        if (error.response && error.response.status === 401) {
          AuthService.logout();
        }
      });
  };
  resetWorker = () => {
    this.setState({
      ...this.initialState, 
      primeSkillsDict: this.state.primeSkillsDict,
      secSkillsDict: this.state.secSkillsDict,
      professionalRolesDict: this.state.professionalRolesDict,   
    });
  };

  showModal = () => {
    this.setState({ show: !this.state.show });
  };

  togglePopUp = () => {
    this.setState({ openPopUp: !this.state.openPopUp });
  };

  submitWorker = (event) => {
    event.preventDefault();

    const worker = {
      ...this.state,
      client: this.state.clientId === "" ? null : { id: this.state.clientId },
      resourceManager: this.state.resourceManagerId === "" ? null :{resourceManagerId : this.state.resourceManagerId},
       title: this.state.designation,
      isDeleted: false,
      permanentAddress:{
      permanentCountry: this.state.permanentCountry,
      permanentCity: this.state.permanentCity,
      permanentState: this.state.permanentState,
      permanentPostalCode: this.state.permanentPostalCode,
      permanentStreet: this.state.permanentStreet,
      permanentStreet1: this.state.permanentStreet1,
      permanentCountryCode: this.state.permanentCountryCode,
      permanentStateCode: this.state.permanentStateCode,
      },
      address: {
        city: this.state.city,
        country: this.state.country,
        state: this.state.state,
        postalCode: this.state.postalCode,
        addressLine1: this.state.addressLine1,
        countryCode: this.state.countryCode,
        stateCode: this.state.stateCode,
      },
    };

    let headers = JSON.parse(sessionStorage.getItem("headers"));
    axios
      .post(`${config.serverURL}/worker`, worker, { headers })
      .then((response) => {
        this.resetWorker();
        message.success("Worker added successfully!");
        this.props.setOpen(false);
        this.props.refresh();
        if (response.data != null && this.state.file) {
          let id = response.data.id;
          let file = this.state.file;
          let formData = new FormData();

          formData.append("file", file);
          axios
            .post(`${config.serverURL}/worker/${id}/resume`, formData, {
              headers,
            })
            .then((response) => {
              console.log(response.status);
            })
            .catch((error) => {
              console.log(error);
              if (error.response && error.response.status === 401) {
                AuthService.logout();
              }
            });
        }
      })
      .catch((error) => {
        if(error.response && error.response.status === 400){
          message.error(`Fill all the requried fields`);         }
        
          if(error.response && error.response.status === 409){
            message.error(`This worker is already exits`);
           }
           if(error.response && error.response.status !== 400 || error.response && error.response.status !== 409 ){

        message.error(`Error! Could not add worker, refresh or contact system admin if error persists`);

       }
        if (error.response && error.response.status === 401) {
          AuthService.logout();
        }
      });
  };

  workerChange = (e, validProc = null) => {
    const { value, max, name } = e.target;
    const isDeleted = value === "";
    const isValid = runValidation(validProc, value, max);
    this.setState({ [name]: value });

    if (!isValid) {
      this.setState({
        inputErr: {
          ...this.state.inputErr,
          [name]: `Invalid format or characters`,
        },
      });
    } else {
      let temp = { ...this.state.inputErr };
      delete temp[name];
      this.setState({ inputErr: temp });
    }

    if (
      this.state.basicRequiredPercent !== 100 ||
      this.state.addressRequiredPercent !== 100 ||
      this.state.detailsRequiredPercent !== 100
    ) {
      const pageName = [
        "firstName",
        "lastName",
        "clientId",
        "status",
        "email",
        "designation",
         "resourceManagerId",
        "payRate",
      "netPayRate",
      "payRateType",
      "period"
      ].includes(name)
        ? "basic"
        : ["primarySoftwareSkill"].includes(name)
          ? "details"
          : ["country", "city", "addressLine1", "postalCode"].includes(name)
            ? "address"
            : "";
      if (pageName)
        this.checkRequiredFields(name, !isDeleted ? true : false, pageName);
    }
  };

  componentDidUpdate(prevProps, prevState) {
    if (
      (this.state.contractStartDate !== prevState.contractStartDate ||
        this.state.contractEndDate !== prevState.contractEndDate) &&
      this.state.contractEndDate
    ) {
      if (this.state.contractStartDate >= this.state.contractEndDate) {
        this.setState({
          inputErr: {
            ...this.state.inputErr,
            contractEndDate: "End date can't be before start date",
          },
        });
      } else {
        let temp = { ...this.state.inputErr };
        delete temp["contractEndDate"];
        this.setState({ inputErr: temp });
      }
    }

    if (this.state.currentPage !== prevState.currentPage) {
      if (this.state.currentPage === "Basic Information") {
        this.setState({ currentPercent: this.state.basicRequiredPercent });
      }
      if (this.state.currentPage === "Details") {
        this.setState({ currentPercent: this.state.detailsRequiredPercent });
      }
      if (this.state.currentPage === "Address") {
        this.setState({ currentPercent: this.state.addressRequiredPercent });
      }
      if (this.state.currentPage === "Additional Information") {
        this.setState({ currentPercent: 0 });
      }
    }

    if (this.state.basicRequiredFields !== prevState.basicRequiredFields) {
      let total = 0;
      for (let key in this.state.basicRequiredFields) {
        if (this.state.basicRequiredFields[key]) total += 9.1;//11.12
      }
      this.setState({ currentPercent: total });
      if (!Object.values(this.state.basicRequiredFields).includes(false))
        this.setState({ basicRequiredPercent: 100 });
    }

    if (this.state.addressRequiredFields !== prevState.addressRequiredFields) {
      let total = 0;
      for (let key in this.state.addressRequiredFields) {
        if (this.state.addressRequiredFields[key]) total += 25;
      }
      this.setState({ currentPercent: total });
      if (!Object.values(this.state.addressRequiredFields).includes(false))
        this.setState({ addressRequiredPercent: 100 });
    }

    if (this.state.detailsRequiredFields !== prevState.detailsRequiredFields) {
      let total = 0;
      for (let key in this.state.detailsRequiredFields) {
        if (this.state.detailsRequiredFields[key]) total += 100;
      }
      this.setState({ currentPercent: total });
      if (!Object.values(this.state.detailsRequiredFields).includes(false))
        this.setState({ detailsRequiredPercent: 100 });
    }
  }

  //set if required fields are filled or not
  checkRequiredFields = (name, bool, section) => {
    switch (section) {
      case "basic":
        this.setState({
          basicRequiredFields: {
            ...this.state.basicRequiredFields,
            [name]: bool,
          },
        });
        break;
      case "details":
        this.setState({
          detailsRequiredFields: {
            ...this.state.detailsRequiredFields,
            [name]: bool,
          },
        });
        break;
      case "address":
        this.setState({
          addressRequiredFields: {
            ...this.state.addressRequiredFields,
            [name]: bool,
          },
        });
        break;
      default:
        break;
    }
  };

  handlePhoneChange = (value) => {
    this.setState({ phoneNumber: value });
  };

  setClientAddr = (id) => {
    const clientAddr = this.state.clientOptions
      .filter((item) => +item.id === +id)
      .pop().address;
    this.setState({
      address: {
        city: clientAddr?.city || "",
        country: clientAddr?.country || "",
        postalCode: clientAddr?.postalCode || "",
        state: clientAddr?.state || "",
      },
    });
  };

  handleNext(event) {
    event.preventDefault();
    if (this.state.status && !this.state.clientId) {
      this.setState({ next: this.state.status });
    }
    if (this.state.status && !this.state.resourceManagerId) {
      this.setState({ next: this.state.status });
    }
  }

  handleReset() {
    this.setState({ next: null, status: "" });
  }

  //set current page of form for form nav
  setCurrentPage = (page) => {
    this.setState({ currentPage: page.title });
  };

  countryChange = (e) => {
    const index = e.target.selectedOptions[0].index;
    const selected = index
      ? this.state.countryList[e.target.selectedOptions[0].index - 1]
      : {};

    if (index) {
      
      this.setState({
        country: selected.name,
        countryCode: selected.code,
        stateList: addr.getStates(selected.code),
        stateCode: "",
      });
      this.checkRequiredFields("country", true, "address");
    } else {
      this.setState({
        stateList: [],
        country: "",
        countryCode: "",
        state: "",
        stateCode: "",
        mandatory: { ...this.state.mandatory, address: false },
      });
      this.checkRequiredFields("country", false, "address");
    }
  };

  permanentCountryChange = (e) => {
    const index = e.target.selectedOptions[0].index;
    const selected = index
      ? this.state.permanentCountryList[e.target.selectedOptions[0].index - 1]
      : {};

    if (index) {
      
      this.setState({
        permanentCountry: selected.name,
        permanentCountryCode: selected.code,
        permanentStateList: addr.getStates(selected.code),
        permanentStateCode: "",
      });
      this.checkRequiredFields("permanentCountry", true, "address");
    } else {
      this.setState({
        permanentStateList: [],
        permanentCountry: "",
        permanentCountryCode: "",
        permanentState: "",
        permanentStateCode: "",
        mandatory: { ...this.state.mandatory, address: false },
      });
      this.checkRequiredFields("permanentCountry", true, "address");
    }
  };
  stateChange = (e) => {
    const index = e.target.selectedOptions[0].index;
    const selected = index
      ? this.state.stateList[e.target.selectedOptions[0].index - 1]
      : {};

    
    this.setState({
      [e.target.name]: selected.name,
      stateCode: selected?.code || "",
    });
   
  };

  permanentStateChange = (e) => {
    const index = e.target.selectedOptions[0].index;
    const selected = index
      ? this.state.permanentStateList[e.target.selectedOptions[0].index - 1]
      : {};

    
    this.setState({
      [e.target.name]: selected.name,
      permanentStateCode: selected?.code || "",
    });
   
  };

  cityChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
    if (e.target.value !== "") {
      this.checkRequiredFields("city", true, "address");
    } else {
      this.checkRequiredFields("city", false, "address");
    }
  };

  closeForm = () => {
    this.resetWorker();
    this.props.setOpen(false);
  };
  multiSelectChange = (options, resource) => {
    const selected = options
      .filter((o) => o.selected)
      .map((o) => o.value)
      .join(",");

    let resName = resource;
    if (resource === "primeSkills") resName = "primarySoftwareSkill";
    if (resource === "secSkills") resName = "secondarySkill";
    if (resource === "professionalRoles") resName = "designation";
    const change = { target: { name: resName, value: selected || "" } };
    this.workerChange(change);

    // call add API for new
    options
      .filter((o) => !o.id && !o.isDeleted && o.value)
      .forEach((o) => {
        postDict(resource, o.value, this.state.headers)
          .then((res) => {
            const newRec = {
              id: res.id,
              value: res.value,
              selected: true,
              isDeleted: res.isDeleted,
            };
            
          
            if (resource === "primeSkills")
              this.setState({
                primeSkillsDict: [...this.state.primeSkillsDict, newRec],
              });
            if (resource === "secSkills")
              this.setState({
                secSkillsDict: [...this.state.secSkillsDict, newRec],
              });
            if (resource === "professionalRoles")
              this.setState({
                professionalRolesDict: [
                  ...this.state.professionalRolesDict,
                  newRec,
                ],
              });
          })
          .catch((err) => console.log(err));
      });
      options
      .filter((o) => o.isDeleted)
      .forEach((o) => {
        delDict(o.id, this.state.headers).catch((err) => console.log(err));
      });

    const delList = options.filter((o) => !o.isDeleted && o.id);
    if (resource === "primeSkills") this.setState({ primeSkillsDict: delList });
    if (resource === "secSkills") this.setState({ secSkillsDict: delList });
    if (resource === "professionalRoles") this.setState({ professionalRolesDict: delList });
  };
  currencyChange = (e, validProc = "validateNum") => {
    this.workerChange(e, e.target.name === "currency" ? validProc : "");
  };

  handleCheckBoxChange = (event) => {
   
   // const { value, max, name } = event.target;
   // this.setState({ [name]: event.target.checked });
    let val = event.target.checked;
       if (val) {
      this.setState({
        permanentCountry: this.state.country,
        permanentState:this.state.state,
        permanentCity: this.state.city,
        permanentCountryCode:this.state.countryCode,
        permanentStateCode:this.state.stateCode ,
        permanentStreet :this.state.addressLine1,
        permanentStreet1 :this.state.addressLine2,
        permanentPostalCode :this.state.postalCode,

        
      });
   
    }
    else{
      this.setState({
        permanentCountry: "",
        permanentState: "",
        permanentCity:"",
        permanentCountryCode:"",
        permanentStateCode:"",
        permanentStreet :"",
        permanentStreet1 :"",
        permanentPostalCode :"",
       
      });
   }
   
  };

  handleCheckChangeIsSubContract = (event) => {
    const {name } = event.target;
  this.setState({ [name]: event.target.checked });
  if (event.target.checked ) {
   this.setState({
     subContractorCompanyName: this.state.subContractorCompanyName,     
   });

 }
 else{
   this.setState({
     subContractorCompanyName: ""
   });
}
 }
 handleCheckChange= (event) => {
  const {name } = event.target;
this.setState({ [name]: event.target.checked });
if (event.target.checked ) {
 this.setState({
   laptopProvided: this.state.laptopProvided,   
   laptopProvidedBy: this.state.laptopProvidedBy, 
   laptopReturned: this.state.laptopReturned, 
   laptopReturnedDate: this.state.laptopReturnedDate, 

 });

}
else{
 this.setState({
  laptopProvided: "",   
  laptopProvidedBy: "", 
  laptopReturned:"", 
  laptopReturnedDate:"", 
 });
}
}
handleCheckChangeSE= (event) => {
  const {name } = event.target;
this.setState({ [name]: event.target.checked });

}
handleCheckChangeLR= (event) => {
  const {name } = event.target;
this.setState({ [name]: event.target.checked });
if (event.target.checked ) {
 this.setState({
  
   laptopReturnedDate: this.state.laptopReturnedDate, 

 });

}
else{
 this.setState({

  laptopReturnedDate:"", 
 });
}
}
handleUploadFile = (e) => {
  const maxAllowedSize = 1 * 1024 * 1024;
  if (e.target.files && e.target.files.length > 0) {
    if (e.target.files[0].size > maxAllowedSize) {
      this.setState({
        inputErr: {
          ...this.state.inputErr,
          file: "File is too big. Please select file with size < 1MB",
        },
      });
      this.docRef.current.value = null;
      this.setState({ file: null });
      return;
    } else {
      this.setState({ file: e.target.files[0] });
      let temp = { ...this.state.inputErr };
      delete temp["file"];
      this.setState({ inputErr: temp });
    }
  } else {
    this.setState({ file: null });
  }
};
  render() {
    return (
            <LargeModal
        header={{ text: "Add Worker" }}
        open={this.props.open}
        close={this.closeForm}
        minHeight={"50vh"}
      >
                <FormNav
          steps={[
            {
              title: "Basic Information",
              hasRequiredFields: true,
              subTitle: (
                <span
                  style={{
                    fontSize: "20px",
                    marginBottom: "4px",
                    color: "var(--secondary)",
                  }}
                >
                  *
                </span>
              ),
            },
            {
              title: "Details",
              hasRequiredFields: true,
              subTitle: (
                <span
                  style={{
                    fontSize: "20px",
                    marginBottom: "4px",
                    color: "var(--secondary)",
                  }}
                >
                  *
                </span>
              ),
            },
            {
              title: "Address",
              hasRequiredFields: true,
              subTitle: (
                <span
                  style={{
                    fontSize: "20px",
                    marginBottom: "4px",
                    color: "var(--secondary)",
                  }}
                >
                  *
                </span>
              ),
            },
            { title: `Additional Information` },

          ]}
          canSubmit={
            this.state.basicRequiredPercent >= 100 &&
            this.state.detailsRequiredPercent >= 100 &&
            this.state.addressRequiredPercent === 100
          }
          submit={this.submitWorker}
          reset={this.resetWorker}
          setCurrentPage={this.setCurrentPage}
          percent={this.state.currentPercent}
          error={Object.keys(this.state.inputErr).length}
        >
          <Form>
            {this.state.currentPage === "Basic Information" && (
              <Fragment>
                <Input
                  type="text"
                  label="First Name"
                  name="firstName"
                  value={this.state.firstName}
                  onChange={(e) => this.workerChange(e, "validateName")}
                  maxLength="20"
                  errMssg={this.state.inputErr["firstName"]}
                  required
                />
                <Input
                  type="text"
                  label="Last Name"
                  name="lastName"
                  value={this.state.lastName}
                  onChange={(e) => this.workerChange(e, "validateName")}
                  maxLength="20"
                  errMssg={this.state.inputErr["lastName"]}
                  required
                />
                <SingleSelect
                  label="Client"
                  name="clientId"
                  data-testid="client-options"
                  onChange={(e) => {
                    this.workerChange(e);
                    this.setClientAddr(e.target.value);
                  }}
                  value={this.state.clientId}
                  options={this.state.clientOptions.map((client) => {
                    let id = client.id;
                    return {
                      id: id,
                      name: `${client.clientName} (${client.address?.city || ""
                        })`,
                    };
                  })}
                  required
                />
               
                   <MultiSelect
                  label="Title"
                  options={this.state.professionalRolesDict.map((o) => ({
                    id: o.id,
                    value: o.value,
                    label: o.value,
                  }))}
                  handleChange={(e) => this.multiSelectChange(e, "professionalRoles")}
                  creatable
                  required
                  placeholder="please select"
                  deletable={auth.hasAdminRole() || auth.hasBDManagerRole()}
                />
                <InputPhone
                  phoneNumber={this.state.phoneNumber}
                  handleChange={this.handlePhoneChange}
                  label="Phone Num."
                  setError={this.setPhoneNumError}
                />
                <Input
                  type="email"
                  label="E-mail"
                  name="email"
                  value={this.state.email}
                  onChange={(e) => this.workerChange(e, "validateEmail")}
                  required
                  errMssg={this.state.inputErr["email"]}
                />
                <SingleSelect
                  name="status"
                  label="Status"
                  type="status"
                  id="status"
                  onChange={(e) => this.workerChange(e)}
                  value={this.state.status}
                  options={[
                    { id: 1, value: "ACTIVE", name: "Active" },
                    { id: 2, value: "TERMINATED", name: "Terminated" },
                    {
                      id: 3,
                      value: "LEAVEWITHOUTPAY",
                      name: "LeaveWithoutPay",
                    },
                    { id: 4, value: "RE-HIRE", name: "Re-Hire" },
                  ]}
                  required
                />
                   <FutureDate
                  name="dateOfBirth"
                  label="Dob"
                  id="dateOfBirth"
                  type="date"
                  max={new Date().toLocaleDateString("en-ca")}
                  onChange={(e) => this.workerChange(e, "validateDob")}
                  value={this.state.dateOfBirth}
              
                />
               
                <SingleSelect
                  name="gender"
                  label="Gender"
                  type="gender"
                  onChange={this.workerChange}
                  value={this.state.gender}
                  options={[
                    { id: 1, value: "MALE", name: "Male" },
                    { id: 2, value: "FEMALE", name: "Female" },
                    { id: 3, value: "Non-Binary", name: "Non-Binary" },
                    { id: 4, value: "Trans-Fem", name: "Trans-Fem" },
                    { id: 5, value: "Trans-Masc", name: "Trans-Masc" },
                    {
                      id: 6,
                      value: "Prefer Not to Say",
                      name: "Prefer Not to Say",
                    },
                  ]}
                />
                <SingleSelect
                  label="Resource Manager"
                  name="resourceManagerId"
                  data-testid="resourceManager-options"
                  onChange={(e) => {
                    this.workerChange(e);
                  }}
                  value={this.state.resourceManagerId}
                  options={this.state.resourceManagerOptions.map((rs) => {
                    let id = rs.resourceManagerId;
                    return {
                      id: id,
                      name: `${rs.firstName} ${rs.lastName}`
                   };
                  })}
                  required
                />
                                                 
                 <SingleSelect
                  name="payRateType"
                  label="payRateType"
                  type="payRateType"
                  onChange={this.workerChange}
                  value={this.state.payRateType}
                  options={[
                    { id: 1, value: "crop to crop", name: "crop to crop" },
                    { id: 2, value: "w2", name: "w2" },
            
                  ]}
                  required
                />
              <div style={{display: "flex",alignItems: "center",marginRight: '19px', }}>
              <InputCurrencyRate
              label="Pay Rate"
              id="currency"
              nameCurrency="currency"
              nameRate="payRate"
              handleChange={this.currencyChange}
              valueCurrency={this.state.currency}
              valueRate={Number(this.state.payRate).toFixed(2)}
              placeholder="Enter the amount"
              required
            ></InputCurrencyRate>
                <SingleSelect
              label="Pay Rate Period"
              name="period"
              className="short"
              value={this.state.period}
              onChange={this.workerChange}
              required
              options={ctcType.map((ctc) => ({
                id: ctc,
                value: ctc,
                name: ctc,
              }))}
            />
 <InputCurrencyRate
              label="Net Pay Rate"
              id="currency"
              nameCurrency="currency"
              nameRate="netPayRate"
              handleChange={this.currencyChange}
              valueCurrency={this.state.currency}
              valueRate={Number(this.state.netPayRate).toFixed(2)}
              placeholder="Enter the amount"
              required
            ></InputCurrencyRate>
                <SingleSelect
              label="Net Pay Rate Period"
              name="period"
              className="short"
              value={this.state.period}
              onChange={this.workerChange}
              required
              options={ctcType.map((ctc) => ({
                id: ctc,
                value: ctc,
                name: ctc,
              }))}
            />
              </div>
             
              </Fragment>
            )}
            {this.state.currentPage.includes("Details") && (
              <Fragment>
                <Input
                  name="contractStartDate"
                  label="Project Start Date"
                  id="contractStartDate"
                  type="date"
                  max="2999-12-31"
                  onChange={(e) => this.workerChange(e)}
                  value={this.state.contractStartDate}
                  errMssg={this.state.inputErr["contractStartDate"]}
                />
                <Input
                  name="contractEndDate"
                  label="Project End Date"
                  id="contractEndDate"
                  type="date"
                  // min={minDate}
                  max="2999-12-31"
                  onChange={(e) => this.workerChange(e)}
                  value={this.state.contractEndDate}
                  errMssg={this.state.inputErr["contractEndDate"]}
                />
               <div style={{ fontSize: "12px", display: "flex", flexDirection: "column", paddingRight: "134px" }}>
                  <label style={{ fontWeight: "200", fontSize: "12px", textTransform: "uppercase", color: "rgba(0, 0, 0, 0.8)" }} >Is SubContractor ?</label>
                  <div style={{ fontSize: "12px", paddingLeft: "50px" }}>
                    <Checkbox
                   name="isSubContractor"
                   label="Is SubContractor"
                   id="isSubContractor"
                   value={this.state.isSubContractor}
                    onChange={(event) => {
                    this.handleCheckChangeIsSubContract(event);
                        
                      }}
                    />
                  </div>
                </div>
                {(this.state.isSubContractor === true ||
                  this.state.isSubContractor === "true") && (
                    <div style={{ fontSize: "12px"}}>

                <Input
                  type="text"
                  label="SubContractor Name"
                  name="subContractorCompanyName"
                  value={this.state.subContractorCompanyName}
                  onChange={(e) => this.workerChange(e, "validateName")}
                  maxLength="20"
                  errMssg={this.state.inputErr["subContractorCompanyName"]}

                />
                </div>
                  )}
                <div style={{display: "flex"}}>

                <MultiSelect
                  label="Primary  Skills"
                  options={this.state.primeSkillsDict.map((o) => ({
                    id: o.id,
                    value: o.value,
                    label: o.value,
                    selected: this.state.primarySoftwareSkill?.includes(o.value),
                  }))}
                  handleChange={(e) => this.multiSelectChange(e, "primeSkills")}
                  creatable
                  isMulti
                  deletable={auth.hasAdminRole() || auth.hasBDManagerRole()}
                  required

                />
<div style={{position: "relative", right: "18px"}}>
<MultiSelect
                  label="Secondary Skills"
                  options={this.state.secSkillsDict.map((o) => ({
                    id: o.id,
                    value: o.value,
                    label: o.value,
                    selected: this.state.secondarySkill?.includes(o.value),
                  }))}
                  handleChange={(e) => this.multiSelectChange(e, "secSkills")}
                  creatable
                  deletable={auth.hasAdminRole() || auth.hasBDManagerRole()}
                  isMulti
                />

          </div> 
                </div> 

                <h3 className="disabled-form-section-header"> Asset Details</h3>

                <div style={{ fontSize: "12px", display: "flex", flexDirection: "column", paddingRight: "133px"
 }}>
                  <label style={{ fontWeight: "200", fontSize: "12px", textTransform: "uppercase", color: "rgba(0, 0, 0, 0.8)" }} >Is Laptop Provided ?</label>
                  <div style={{ fontSize: "12px", paddingLeft: "50px" }}>
                    <Checkbox
                      name="isLaptopProvided"
                      label="Is Laptop Provided?"
                      id="isLaptopProvided"
                      value={this.state.isLaptopProvided}
                      onChange={(event) => {
                        this.handleCheckChange(event);
                        
                      }}
                    />
                  </div>
                </div>
                {(this.state.isLaptopProvided === true ||
                  this.state.isLaptopProvided === "true") && (
                    <div style={{ fontSize: "12px",display:"flex"}}>
<SingleSelect
                  name="laptopProvided"
                  label="Laptop Provided"
                  id="laptopProvided"
                  onChange={this.workerChange}
                  value={this.state.laptopProvided}
                  options={[
                    {
                      id: "Initiated",
                      value: "Initiated",
                      name: "Initiated",
                    },
                    {
                      id: "In process",
                      value: "In process",
                      name: "In process",
                    },
                    {
                      id: "Completed",
                      value: "Completed",
                      name: "Completed",
                    },
                  ]}
                />
                <SingleSelect
                  name="laptopProvidedBy"
                  label="Laptop Provided By"
                  id="laptopProvidedBy"
                  onChange={this.workerChange}
                  placeholder={"If Yes, Please Select..."}
                  value={this.state.laptopProvidedBy}
                  options={[
                    { id: 1, value: "Drishticon", name: "Drishticon" },
                    { id: 2, value: "Client", name: "Client" },
                    { id: 3, value: "NA", name: "NA" },
                  ]}
                />
                 
                 
                      </div>
                  )}
                    {(this.state.isLaptopProvided === true ||
                  this.state.isLaptopProvided === "true") && (
                    <div style={{ fontSize: "12px",display:"flex"}}>

                  
                 <div style={{ fontSize: "12px", display: "flex", flexDirection: "column" ,paddingRight:"153px"}}>
                  <label style={{ fontWeight: "200", fontSize: "12px", textTransform: "uppercase", color: "rgba(0, 0, 0, 0.8)" }} >Laptop Returned</label>
                  <div style={{ fontSize: "12px", paddingLeft: "50px" }}>
                    <Checkbox
                      name="laptopReturned"
                      label="Laptop Returned"
                      id="laptopReturned"
                      value={this.state.laptopReturned}
                      onChange={(event) => {
                        this.handleCheckChangeLR(event);
                      }}
                    />
                  </div>
                </div>
                {(this.state.laptopReturned === true ||
                  this.state.laptopReturned === "true") && (
                    <div style={{ fontSize: "12px" }}>

                      <Input
                        name="laptopReturnedDate"
                        label="Laptop Returned Date"
                        type="Date"
                        id="laptopReturnedDate"
                        onChange={this.workerChange}
                        value={this.state.laptopReturnedDate}
                      />
                    </div>
                  )}
                    </div>
                  )}

       
                        <div style={{ fontSize: "12px", display: "flex", flexDirection: "column",paddingRight:"100px" }}>
                  <label style={{ fontWeight: "200", fontSize: "12px", textTransform: "uppercase", color: "rgba(0, 0, 0, 0.8)" }} >Signed Equipment Form ?</label>
                  <div style={{ fontSize: "12px", paddingLeft: "50px" }}>
                    <Checkbox
                    name="signedEquipmentForm"
                    label="Signed Equipment Form"
                    id="signedEquipmentForm"
                      value={this.state.signedEquipmentForm}
                      onChange={(event) => {
                        this.handleCheckChangeSE(event);
                        
                      }}
                    />
                  </div>
                </div>
                {(this.state.signedEquipmentForm === true ||
                  this.state.signedEquipmentForm === "true") && (
                    <div style={{ fontSize: "12px",display:"flex"}}>
                       <Input
                    type="file"
                    label="Attach Document"
                    data-testid="file"
                    name="file"
                    ref={this.docRef}
                    onChange={(e) => this.handleUploadFile(e)}
                    errMssg={this.state.inputErr["file"]}
                  />
                      </div>
                  )}
            


              </Fragment>
            )}
            {this.state.currentPage.includes("Address") && (
              <Fragment>
                <h3 className="disabled-form-section-header"> Current Address</h3>

                <Input
                  type="text"
                  label="Street 1"
                  name="addressLine1"
                  value={this.state.addressLine1}
                  onChange={(e) => this.workerChange(e)}
                  maxLength="200"
                  required
                />
 <Input
                  type="text"
                  label="Street 2"
                  name="addressLine2"
                  value={this.state.addressLine2}
                  onChange={(e) => this.workerChange(e)}
                  maxLength="200"
                  
                />

                <Input
                  type="text"
                  label="City"
                  name="city"
                  value={this.state.city}
                  placeholder="Enter city"
                  onChange={(e) => this.workerChange(e, "validateName")}
                  maxLength="40"
                  required
                  //disabled={disableCities}
                  errMssg={this.state.inputErr["city"]}
                />

                <SingleSelect
                  label="Country"
                  name="country"
                  value={this.state.country}
                  onChange={this.countryChange}
                  placeholder="Select Country"
                  options={this.state.countryList}
                  required
                />
                <SingleSelect
                  label="State / Province"
                  name="state"
                  id="state"
                  placeholder="select State/Province"
                  value={this.state.state}
                  onChange={this.stateChange}
                  options={this.state.stateList}
                />



                <Input
                  type="text"
                  label="ZIP Code/Postal Code"
                  name="postalCode"
                  value={this.state.postalCode}
                  onChange={(e) => this.workerChange(e, "validateZip")}
                  required
                  maxLength="6"
                  errMssg={this.state.inputErr["postalCode"]}
                />

                <h3 className="disabled-form-section-header"> Permanent Address  
                (
<input type="checkbox" onClick={(event) => {this.handleCheckBoxChange(event)} }/> 
                  {/* <Checkbox
                name="sameAsCurrentAddress"
                id="sameAsCurrentAddress"
                checked={this.state.sameAsCurrentAddress}
                onChange={(event) => {
                 this.handleCheckBoxChange(event);
                 
            
                }}
              /> */}
                 <label 
                   style={{
                  fontSize: "15px",
                  marginBottom: "4px",
                  color: "var(--secondary)",
                }}
                  >Same as Current Address</label>  )  
             
             </h3>
            

                <Input
                  type="text"
                  label="Street 1"
                  name="permanentStreet"
                  value={this.state.permanentStreet}
                  onChange={(e) => this.workerChange(e)}
                  maxLength="200"
                  required
                />

<Input
                  type="text"
                  label="Street 2"
                  name="permanentStreet1"
                  value={this.state.permanentStreet1}
                  onChange={(e) => this.workerChange(e)}
                  maxLength="200"
                  
                />
                <Input
                  type="text"
                  label="City"
                  name="permanentCity"
                  value={this.state.permanentCity}
                  placeholder="Enter city"
                  onChange={(e) => this.workerChange(e, "validateName")}
                  maxLength="40"
                  required
                  //disabled={disableCities}
                  errMssg={this.state.inputErr["permanentCity"]}
                />

                <SingleSelect
                  label="Country"
                  name="permanentCountry"
                  value={this.state.permanentCountry}
                  onChange={(e) => this.permanentCountryChange(e)}
                  placeholder="Select Country"
                  options={this.state.permanentCountryList}
                  required
                />
                {/* <SingleSelect
                  label="State/Province"
                  name="permanentState"
                  id="permanentState"
                  value={this.state?.permanentState}
                  onChange={(e) => this.permanentStateChange(e)}
                  options={this.state.permanentStateList}
                /> */}
{this.state.permanentStateList.length > 0 ? (
                 <SingleSelect
                 label="State/Province"
                 name="permanentState"
                 placeholder="select State/Province"
                 value={this.state?.permanentState}
                 onChange={(e) => this.permanentStateChange(e)}
                 options={this.state.permanentStateList}
               />
                ) : (
                  <Input
                    type="text"
                    label="State/Province"
                    name="permanentState"
                    value={this.state.permanentState}                    
                    placeholder="select State/Province"
                    onChange={(e) => this.workerChange(e)}
                    maxLength="40"
                  />
                )}
                <Input
                  type="text"
                  label="ZIP Code/Postal Code"
                  name="permanentPostalCode"
                  value={this.state.permanentPostalCode}
                  onChange={(e) => this.workerChange(e, "validateZip")}
                  required
                  maxLength="6"
                  errMssg={this.state.inputErr["permanentPostalCode"]}
                />

               
              </Fragment>

            )}
              {this.state.currentPage.includes("Additional Information") && (
 <TextBlock
                  label="Additional Information for worker"
                  name="comments"
                  value={this.state.comments}
                  onChange={this.workerChange}
                  charCount={`${this.state.comments ? 3000 - this.state.comments.length : 3000
                    } of 3000`}
                  maxLength="3000"
                />
              )}


          </Form>
        </FormNav>
        <IdleTimeOutHandler

          onActive={() => { this.setState({ setIsActive: true }) }}
          onIdle={() => { this.setState({ setIsActive: false }) }}
          onLogout={() => { this.setState({ setLogout: true }) }}
        />
      </LargeModal>
    );
  }
}
