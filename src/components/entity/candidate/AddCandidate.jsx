import React, { Component } from "react";
import { Link } from "react-router-dom";
import auth from "../../../utils/AuthService";
import { runValidation } from "../../../utils/validation";
import * as addr from "../../../utils/serviceAddress";
import { getDict, delDict, postDict } from "../../../API/dictionaries/dictionary-apis";
import { mapCandidateBody } from "./utils/utils";
import { checkDuplicates, postCandidate, postResume } from "../../../API/candidates/candidate-apis";
import { getRecruiters } from "../../../API/users/user-apis";
import { gender } from "../../../utils/defaultData";
import { expPeriod, noticePeriod } from "../../../utils/defaultData";
import { Fragment } from "react";
import PopUp from "../../modal/popup/popup.component";
import Input from "../../common/input/inputs.component";
import MultiSelect from "../../common/select/multiSelect/multiSelect.component";
import SingleSelect from "../../common/select/selects.component";
import TextBlock from "../../common/textareas/textareas.component";
import { InputPhone } from "../../common/input/input-phone/input-phone.component";
import { Alert } from "antd";
import Content from "../../container/content-container/content-container.component";
import FormNav from "../../ui/form-nav/form-nav.component";
import Form from "../../common/form/form.component";
import Breadcrumbs from "../../common/breadcrumbs/breadcrumbs.component";
import SwitchComponent from "../../common/switch/switch.component";
import { AddCandidateNavSteps } from "./utils/candidateObjects";
import { PageContainer } from "../../container/page-container/PageContainer";
import { PageHeader } from "../../container/page-header/PageHeader";
import { CurrentCTC } from "./cand_ui_helpers/ctc_inputs/CurrentCTC";
import { ExpectedCTC } from "./cand_ui_helpers/ctc_inputs/ExpectedCTC";
import { message } from "antd";
import IdleTimeOutHandler from "../../ui/Dashboard/IdleTimeOutHandler";
import "antd/dist/antd.css";
import "./style.css";

export default class AddCandidate extends Component {
  constructor(props) {
    super(props);
    this.state = { ...this.initialState, navMenuOpen: props.navMenuOpen };
    this.resumeRef = React.createRef(null);
   
  }

  initialState = {
    city: "",
    country: "",
    countryList: [],
    postalCode: "",
    state: "",
    stateList: [],
    comments: "",
    commentList: [],
    currentCtc: "",
    currentEmployer: "",
    currentEmployerContact: "",
    currentJobTitle: "",
    expectedCtc: "",
    noticePeriod: "",
    primarySoftwareSkill: "",
    secondarySkill: "",
    totalExperience: 0,
    totalExpPeriod: "",
    relExpPeriod: "",
    relevantExperience: 0,
    workAuthStatus: "",
    source: "",
    referralName: "",
    linkedinProfile: "",
    portfolioProfile: "",
    dateOfBirth: "",
    email: "",
    firstName: "",
    gender: "",
    lastName: "",
    phoneNumber: "",
    relocate: "",
    message: "",
    warning: "",
    errorAtIndex: false,
    file: null,
    show: false,
    recruiterOptions: [],
    noticeCountUnits: "",
    noticePeriodType: "",
    currentCtcType: "",
    currentCtcValue: "",
    currentCtcCurrency: "",
    currentCtcTax: "",
    expectedCtcType: "",
    startExpCTC: "",
    endExpCTC: "",
    expectedCtcCurrency: "",
    expectedCtcTax: "",
    healthBenefit: "",
    pto: "",
    sickLeave: "",
    role: "",
    recruiterId: auth.hasRecruiterRole() || auth.hasBDManagerRole() ? auth.getUserId() : "",
    user: auth.getUserInfo(),
    headers: auth.getHeaders(),
    relExpBool: false,
    isDuplicate: false,
    range: false,
    currentPage: "Basic Information",
    basicRequiredPercent: 0,
    basicRequiredFields: {
      firstName: false,
      lastName: false,
      email: false,
      gender: false,
      workAuthStatus: false,
    },
    addressRequiredPercent: 0,
    addressRequiredFields: {
      country: false,
      city: false,
    },
    detailsRequiredPercent: 0,
    currentPercent: 0,
    invalidMssg: "",
    workAuthStatusDict: [],
    sourcesDict: [],
    primeSkillsDict: [],
    secSkillsDict: [],
    showModal: false,
    expRange: {},
  };

  //on component load get data for dropdown menus
  async componentDidMount() {
    const headers = auth.getHeaders();
    const recruiters = await getRecruiters(headers);
    const workAuth = await getDict("workAuthStatus", headers);
    const prime = await getDict("primeSkills", headers);
    const secondary = await getDict("secSkills", headers);
    const sources = await getDict("source", headers);
    const professionalRoles = await getDict("professionalRoles", headers);
   
  
    this.setState({
      setIsActive: true,
      setLogout:false,
      workAuthStatusDict: workAuth,
      primeSkillsDict: prime,
      secSkillsDict: secondary,
      sourcesDict: sources,
      recruiterOptions: recruiters.data,
      genderList: gender,
      professionalRolesDict: professionalRoles.sort((a, b) => a.value.localeCompare(b.value)),
      countryList: addr.getCountries()
    });
  }

  //set current page of form for form nav
  setCurrentPage = (page) => {
    this.setState({ currentPage: page.title });
  };

  //general onChange handler, check valid inputs and update required fields
  candidateChange = (e, validProc = null) => {
    const limit = e.target.max ? +e.target.max : null;
    const isDeleted = e.target.value === "";
    const isValid = runValidation(validProc, e.target.value, limit);

    this.setState({ [e.target.name]: e.target.value });

    if (!isValid) {
      this.setState({
        invalidMssg: {
          ...this.state.invalidMssg,
          [e.target.name]: `Invalid format or characters`,
        },
      });
    } else if (isValid) {
      let temp = { ...this.state.invalidMssg };
      delete temp[e.target.name];
      this.setState({ invalidMssg: temp });
    }

    if (
      e.target.name === "firstName" ||
      e.target.name === "lastName" ||
      e.target.name === "email" ||
      e.target.name === "gender" ||
      e.target.name === "workAuthStatus"
    ) {
      this.checkRequiredFields(e.target.name, !isDeleted, "basic");
    }
  };

  //upload resume file, check size before setting into state
  handleUploadFile = (e) => {
    const maxAllowedSize = 1 * 1024 * 1024;
    if (e.target.files && e.target.files.length > 0) {
      if (e.target.files[0].size > maxAllowedSize) {
        this.setState({
          invalidMssg: {
            ...this.state.invalidMssg,
            file: "File is too big. Please select file with size < 1MB",
          },
          detailsRequiredPercent: 0
        });
        this.resumeRef.current.value = null;
      } else {
        if (e.target.files[0]) {
          let temp = { ...this.state.invalidMssg };
          delete temp["file"];
          this.setState({ file: e.target.files[0], detailsRequiredPercent: 100, invalidMssg: temp });
        }
      }
    } else {
      let temp = { ...this.state.invalidMssg };
      delete temp["file"];
      this.setState({ file: null, detailsRequiredPercent: 0, invalidMssg: temp });
    }
  };

  closeModal = () => {
    this.setState({
      showModal: !this.state.showModal,
      msg: null,
      status: null,
    });
  };

  submitCandidate = (event) => {
    event.preventDefault();

    if (
      this.state.basicRequiredPercent !== 100 ||
      this.state.addressRequiredPercent !== 100 ||
      this.state.detailsRequiredPercent !== 100
    )
      return;

    message.loading({
      content: "Submitting candidate data...",
      style: { marginTop: "5%" },
    });

    postCandidate(this.state.headers, mapCandidateBody(this.state))
      .then((res) => {
        if (res.data != null) {
          if (this.state.file) {
            let formData = new FormData();
            formData.append("file", this.state.file);
            postResume(this.state.headers, res.data.id, formData)
              .catch((err) => console.log("Post resume: ", err));
          } else console.log("No CV attached");
        }
      })
      .then(() => {
        this.resetForm();
        this.setState({ show: !this.state.show, showModal: !this.state.showModal });
      })
      .catch((err) => {
        this.setState({
          msg: err.response.data,
          status: err.response.status,
          showModal: true,
        });
      });
  };

  checkForDuplicates = (candidate) => {
    checkDuplicates(this.state.headers, candidate)
      .then((res) => {
        if (res.status === 201)
          this.setState({ isDuplicate: false, msg: null });

      })
      .catch((err) => {
        if (err.response.status === 409)
          this.setState({ isDuplicate: true, msg: `${err.response.data}` });
      });
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.props.navMenuOpen !== prevProps.navMenuOpen) {
      this.setState({ navMenuOpen: this.props.navMenuOpen });
    }

    // set percentage of required fields filled for current page
    if (this.state.currentPage !== prevState.currentPage) {
      if (this.state.currentPage === "Basic Information") {
        this.setState({ currentPercent: this.state.basicRequiredPercent });
      }
      if (this.state.currentPage === "Address") {
        this.setState({ currentPercent: this.state.addressRequiredPercent });
      }
      if (this.state.currentPage === "Professional Details") {
        this.setState({ currentPercent: this.state.detailsRequiredPercent });
      }
      if (this.state.currentPage === "Comments") {
        this.setState({ currentPercent: 0 });
      }
    }

    //update percentage of basic info required fields filled
    if (this.state.basicRequiredFields !== prevState.basicRequiredFields) {
      let total = 0;
      for (let key in this.state.basicRequiredFields) {
        if (this.state.basicRequiredFields[key]) total += 20;
      }
      this.setState({ currentPercent: total });
      if (!Object.values(this.state.basicRequiredFields).includes(false))
        this.setState({ basicRequiredPercent: 100 });
    }

    //update percentage of address required fields filled
    if (this.state.addressRequiredFields !== prevState.addressRequiredFields) {
      let total = 0;
      for (let key in this.state.addressRequiredFields) {
        if (this.state.addressRequiredFields[key]) total += 50;
      }
      this.setState({ currentPercent: total });
      if (!Object.values(this.state.addressRequiredFields).includes(false))
        this.setState({ addressRequiredPercent: 100 });
    }

    if (
      this.state.detailsRequiredPercent !== prevState.detailsRequiredPercent
    ) {
      this.setState({ currentPercent: this.state.detailsRequiredPercent });
    }

    // check that relevant experience is less than total experience
    if (
      this.state.totalExperience !== prevState.totalExperience ||
      this.state.relevantExperience !== prevState.relevantExperience ||
      this.state.totalExpPeriod !== prevState.totalExpPeriod ||
      this.state.relExpPeriod !== prevState.relExpPeriod
    ) {
      if (
        this.state.totalExpPeriod === "year(s)" &&
        this.state.relExpPeriod === "month(s)"
      ) {
        +this.state.totalExperience >= +this.state.relevantExperience / 12
          ? this.setState({ relExpBool: false })
          : this.setState({ relExpBool: true });
      }
      if (
        this.state.totalExpPeriod === "month(s)" &&
        this.state.relExpPeriod === "year(s)"
      ) {
        +this.state.totalExperience / 12 >= +this.state.relevantExperience
          ? this.setState({ relExpBool: false })
          : this.setState({ relExpBool: true });
      }
      if (this.state.totalExpPeriod === this.state.relExpPeriod) {
        +this.state.totalExperience >= +this.state.relevantExperience
          ? this.setState({ relExpBool: false })
          : this.setState({ relExpBool: true });
      }
    }

    //set key/value pairs for parameters needed to verify if candidate is duplicate
    if (this.state.firstName !== prevState.firstName) {
      this.setState({
        candidateParams: {
          ...this.state.candidateParams,
          firstName: this.state.firstName,
        },
      });
    }
    if (this.state.lastName !== prevState.lastName) {
      this.setState({
        candidateParams: {
          ...this.state.candidateParams,
          lastName: this.state.lastName,
        },
      });
    }
    if (this.state.email !== prevState.email) {
      this.setState({
        candidateParams: {
          ...this.state.candidateParams,
          email: this.state.email,
        },
      });
    }

    //check for duplicate candidate data
    if (
      this.state.candidateParams !== prevState.candidateParams &&
      Object.keys(this.state.candidateParams).length === 3
    ) {
      this.checkForDuplicates(this.state.candidateParams);
    }
  }

  noticePeriodChange = (e, validProc = null) => {
    const limit = e.target.max ? +e.target.max : null;
    const isValid = runValidation(validProc, e.target.value, limit);
    const isDel = e.target.value.length < this.state[e.target.name].length;
    if (isDel || isValid) {
      const cnt = this.state.noticeCountUnits
        ? this.state.noticeCountUnits
        : "";
      const val = this.state.noticePeriodType
        ? this.state.noticePeriodType
        : "week(s)";
      this.setState({
        noticeCountUnits: cnt,
        noticePeriodType: val,
        [e.target.name]: e.target.value,
      });
    }
  };

  totalExperienceChange = (e, validProc = null) => {
    const limit1 = e.target.max ? +e.target.max : null;
    const isValid1 = runValidation(validProc, e.target.value, limit1);
    const isDel1 = e.target.value.length < this.state[e.target.name].length;
    if (isDel1 || isValid1) {
      const val1 = this.state.totalExpPeriod
        ? this.state.totalExpPeriod
        : "year(s)";
      this.setState({
        totalExpPeriod: val1,
        [e.target.name]: e.target.value,
      });
    }
  };

  relExperienceChange = (e, validProc = null) => {
    const limit2 = e.target.max ? +e.target.max : null;
    const isValid2 = runValidation(validProc, e.target.value, limit2);
    const isDel2 = e.target.value.length < this.state[e.target.name].length;
    if (isDel2 || isValid2) {
      const val2 = this.state.relExpPeriod
        ? this.state.relExpPeriod
        : "year(s)";
      this.setState({
        relExpPeriod: val2,
        [e.target.name]: e.target.value,
      });
    }
  };

  getCurrencies = () => {
    getDict("currencies", this.state.headers).then((list) => {
      this.setState({ currencyDict: list });
    });
  };

  currentCTCChange = (e, validProc = null) => {
    const limit = e.target.max ? +e.target.max : null;
    const isValid = runValidation(validProc, e.target.value, limit);
    const isDel = !e.target.value?.length;
    if (isDel || isValid) {
      const curr = this.state.currentCtcCurrency || "$";
      const val = this.state.currentCtcValue || "0";
      const typ = this.state.currentCtcType || "Per hour";
      const tax = this.state.currentCtcTax || "W-2";
      this.setState({
        currentCtcCurrency: curr,
        currentCtcValue: val,
        currentCtcType: typ,
        currentCtcTax: tax,
        [e.target.name]: e.target.value,
      });
    }
  };

  expectedCTCChange = (e, validProc = null) => {
    const limit = e.target.max ? +e.target.max : null;
    const isValid = runValidation(validProc, e.target.value, limit);
    const isDel = !e.target.value?.length;
    if (isDel || isValid) {
      const curr = this.state.expectedCtcCurrency ? this.state.expectedCtcCurrency : "$";
      const typ = this.state?.expectedCtcType ? this.state?.expectedCtcType : "Per hour";
      const tax = this.state.expectedCtcTax ? this.state.expectedCtcTax : "W-2";
      this.setState({
        expectedCtcCurrency: curr,
        expectedCtcType: typ,
        expectedCtcTax: tax,
        [e.target.name]: e.target.value,
      });
    }
  };

  handlePhoneChange = (value) => {
    this.setState({ phoneNumber: value });
  };

  //handle country selection, get related state list
  countryChange = (e) => {
    const index = e.target.selectedOptions[0].index;
    const selected = index
      ? this.state.countryList[e.target.selectedOptions[0].index - 1]
      : {};

    if (index) {
      const cities = addr.getCities(selected.code);
      this.setState({
        country: selected.name,
        countryCode: selected.code,
        stateList: addr.getStates(selected.code),
        stateCode: "",
        citiesList: cities,
        city: "",
        disableCities: cities?.length > 100,
      });
      this.checkRequiredFields("country", true, "address");
    } else {
      this.setState({
        stateList: [],
        citiesList: [],
        country: "",
        countryCode: "",
        state: "",
        stateCode: "",
        city: "",
        disableCities: false,
        mandatory: { ...this.state.mandatory, address: false },
      });
      this.checkRequiredFields("country", false, "address");
    }
  };

  //handle state selection, get related city list
  stateChange = (e) => {
    const index = e.target.selectedOptions[0].index;
    const selected = index
      ? this.state.stateList[e.target.selectedOptions[0].index - 1]
      : {};

    let cities = [];
    if (index) {
      cities = addr.getCities(this.state.countryCode, selected.code);
      this.setState({ disableCities: cities?.length > 100 && !selected?.code });
    } else {
      cities = addr.getCities(this.state.countryCode);
      this.setState({ disableCities: false });
    }
    this.setState({
      [e.target.name]: selected.name,
      stateCode: selected?.code || "",
      citiesList: cities,
      city: "",
      disableCities: cities?.length > 100 && !selected?.code,
    });
    if (index) {
      this.setState({ disableCities: false });
    }
  };

  //handle city change
  cityChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
    this.checkRequiredFields("city", e.target.value !== "", "address");
  };

  //handle changes to multiselect menus
  multiSelectChange = (options, resource) => {
    const selected = options
      .filter((o) => o.selected)
      .map((o) => o.value)
      .join(",");

    let resName = resource;
    if (resource === "primeSkills") resName = "primarySoftwareSkill";
    if (resource === "secSkills") resName = "secondarySkill";
    if (resource === "professionalRoles") resName = "role";
    const change = { target: { name: resName, value: selected || "" } };
    this.candidateChange(change);

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
            if (resource === "source")
              this.setState({
                sourcesDict: [...this.state.sourcesDict, newRec],
              });
            if (resource === "workAuthStatus")
              this.setState({
                workAuthStatusDict: [...this.state.workAuthStatusDict, newRec],
              });
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

    // call delete API for marked as deleted
    options
      .filter((o) => o.isDeleted)
      .forEach((o) => {
        delDict(o.id, this.state.headers).catch((err) => console.log(err));
      });

    const delList = options.filter((o) => !o.isDeleted && o.id);
    if (resource === "source") this.setState({ sourcesDict: delList });
    if (resource === "workAuthStatus") this.setState({ workAuthStatusDict: delList });
    if (resource === "primeSkills") this.setState({ primeSkillsDict: delList });
    if (resource === "secSkills") this.setState({ secSkillsDict: delList });
    if (resource === "professionalRoles") this.setState({ professionalRolesDict: delList });
  };

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

  //set page error if phone number is invalid so that next button is disabled
  setPhoneNumError = (error) => {
    if (error) {
      this.setState({
        invalidMssg: { ...this.state.invalidMssg, phone: true },
      });
    } else {
      let temp = { ...this.state.invalidMssg };
      delete temp["phone"];
      this.setState({ invalidMssg: temp });
    }
  };

  checkExpRange = (value) => {
    this.setState({ expRange: value });
  };

  resetForm = () => {
    this.setState({
      ...this.initialState,
      workAuthStatusDict: this.state.workAuthStatusDict,
      sourcesDict: this.state.sourcesDict,
      primeSkillsDict: this.state.primeSkillsDict,
      secSkillsDict: this.state.secSkillsDict,
      professionalRolesDict: this.state.professionalRolesDict,
      countryList: this.state.countryList,
      stateList: this.state.stateList,
    });
    if (this.resumeRef.current) this.resumeRef.current.value = null;
  };

  showModal = () => {
    this.setState({ show: !this.state.show });
  };

  closeForm = () => {
    this.props.history.push("/viewcandidates");
  };

  render() {
  
    const {
      city,
      country,
      countryList,
      state,
      stateList,
      comments,
      currentEmployer,
      currentEmployerContact,
      totalExperience,
      email,
      firstName,
      gender,
      lastName,
      source,
      relocate,
      referralName,
      reasonForJobChange,
      relevantExperience,
      linkedinProfile,
      currentJobTitle,
      offerInHand,
      noticeCountUnits,
      noticePeriodType,
      currentCtcType,
      currentCtcValue,
      currentCtcCurrency,
      currentCtcTax,
      expectedCtcType,
      expectedCtcCurrency,
      expectedCtcTax,
      currentPage,
    } = this.state;

    return (
      <PageContainer>
        <PageHeader
          breadcrumbs={
            <Breadcrumbs
              className="header"
              crumbs={[
                { id: 0, text: "Candidates", onClick: () => this.closeForm() },
                { id: 1, text: "Add Candidate", lastCrumb: true },
              ]}
            />
          }
        />
           <IdleTimeOutHandler 
           
    onActive={()=>{ this.setState({ setIsActive: true })}}
    onIdle={()=>{ this.setState({ setIsActive: false })}}
    onLogout={()=>{ this.setState({ setLogout: true })}}
    />
        <Content>
          {this.state.isDuplicate && <Alert type="error" showIcon message={this.state.msg} />}
          <FormNav
            steps={AddCandidateNavSteps}
            canSubmit={
              this.state.basicRequiredPercent === 100 &&
              this.state.addressRequiredPercent === 100 &&
              this.state.detailsRequiredPercent === 100
            }
            submit={this.submitCandidate}
            reset={this.resetForm}
            setCurrentPage={this.setCurrentPage}
            percent={this.state.currentPercent}
            error={Object.keys(this.state.invalidMssg).length || this.state.isDuplicate}
          >
            <Form>
              {currentPage === "Basic Information" && (
                <Fragment>
                  {!auth.hasRecruiterRole() && (
                    <SingleSelect
                      label="Recruiter"
                      name="recruiter"
                      value={this.state.recruiterId}
                      onChange={(event) => this.setState({ recruiterId: event.target.value })}
                      options={
                        this.state.recruiterOptions &&
                        this.state.recruiterOptions.map((recruiter) => (
                          { id: recruiter.id, name: `${recruiter.firstName} ${recruiter.lastName}` }
                        ))}
                    />
                  )}
                  <Input
                    type="text"
                    label="First Name"
                    name="firstName"
                    value={firstName}
                    onChange={(e) => this.candidateChange(e, "validateName")}
                    maxLength="20"
                    required
                    errMssg={this.state.invalidMssg["firstName"] && this.state.invalidMssg["firstName"]}
                  />
                  <Input
                    type="text"
                    label="Last Name"
                    name="lastName"
                    value={lastName}
                    onChange={(e) => this.candidateChange(e, "validateName")}
                    maxLength="20"
                    required
                    errMssg={this.state.invalidMssg["lastName"] && this.state.invalidMssg["lastName"]}
                  />
                  <Input
                    type="email"
                    label="E-mail"
                    name="email"
                    value={email}
                    onChange={(e) => this.candidateChange(e, "validateEmail")}
                    required
                    errMssg={this.state.invalidMssg["email"] && this.state.invalidMssg["email"]}
                  />
                  <InputPhone
                    phoneNumber={this.state.phoneNumber}
                    handleChange={this.handlePhoneChange}
                    label="Phone Num."
                    setError={this.setPhoneNumError}
                  />
                  <SingleSelect
                    label="Gender"
                    name="gender"
                    value={gender}
                    onChange={this.candidateChange}
                    required
                    options={
                      this.state.genderList &&
                      this.state.genderList.map((item) => ({
                        id: item,
                        value: item,
                        name: item,
                      }))
                    }
                  />
                  <MultiSelect
                    label="Work Auth Status"
                    options={this.state.workAuthStatusDict.map((o) => ({
                      id: o.id,
                      value: o.value,
                      label: o.value,
                    }))}
                    handleChange={(e) =>
                      this.multiSelectChange(e, "workAuthStatus")
                    }
                    deletable={auth.hasAdminRole()}
                    required
                    creatable
                  />
                  <Input
                    type="text"
                    label="LinkedIn Profile"
                    name="linkedinProfile"
                    value={linkedinProfile}
                    onChange={(e) => this.candidateChange(e, "validateURL")}
                    errMssg={
                      this.state.invalidMssg["linkedinProfile"] &&
                      this.state.invalidMssg["linkedinProfile"]
                    }
                  />
                  <Input
                    type="text"
                    label="Portfolio Link"
                    name="portfolioProfile"
                    value={this.state.portfolioProfile}
                    onChange={(e) => this.candidateChange(e, "validateURL")}
                    errMssg={
                      this.state.invalidMssg["portfolioProfile"] &&
                      this.state.invalidMssg["portfolioProfile"]
                    }
                  />
                  <MultiSelect
                    label="Source"
                    options={this.state.sourcesDict.map((o) => ({
                      id: o.id,
                      value: o.value,
                      label: o.value,
                    }))}
                    handleChange={(e) => this.multiSelectChange(e, "source")}
                    creatable
                    deletable={auth.hasAdminRole()}
                  />
                  {(source === "Referral" ||
                    source === "Vendor" ||
                    source === "Sourcer") && (
                      <Input
                        type="text"
                        label="Source Name"
                        name="referralName"
                        value={referralName}
                        onChange={this.candidateChange}
                      />
                    )}
                  <SingleSelect
                    label="Willing to Relocate"
                    name="relocate"
                    value={relocate}
                    onChange={this.candidateChange}
                    options={[
                      { id: "Yes", value: "Yes", name: "Yes" },
                      { id: "No", value: "No", name: "No" },
                    ]}
                  />
                </Fragment>
              )}
              {currentPage === "Address" && (
                <Fragment>
                  <SingleSelect
                    label="Country"
                    name="country"
                    value={country}
                    onChange={this.countryChange}
                    options={countryList}
                    required
                  />
                  <SingleSelect
                    label="State / Province"
                    name="state"
                    value={state}
                    onChange={this.stateChange}
                    options={stateList}
                  />
                  {this.state.citiesList?.length &&
                    !this.state.disableCities ? (
                    <SingleSelect
                      label="City"
                      name="city"
                      value={city}
                      onChange={this.cityChange}
                      options={this.state.citiesList}
                      placeholder={
                        this.state.disableCities
                          ? "Select State/Province first"
                          : ""
                      }
                      required
                      disabled={this.state.disableCities}
                    />
                  ) : (
                    <Input
                      type="text"
                      label="City"
                      name="city"
                      value={city}
                      placeholder="Select State/Province first"
                      onChange={this.cityChange}
                      required
                      maxLength="40"
                      errMssg={
                        this.state.invalidMssg["city"] &&
                        this.state.invalidMssg["city"]
                      }
                    />
                  )}
                </Fragment>
              )}
              {currentPage === "Professional Details" && (
                <Fragment>
                  <Input
                    type="file"
                    label="Attach Resume"
                    data-testid="file"
                    name="file"
                    ref={this.resumeRef}
                    onChange={(e) => this.handleUploadFile(e)}
                    required
                    errMssg={
                      this.state.invalidMssg["file"] &&
                      this.state.invalidMssg["file"]
                    }
                  />
                  <Input
                    type="text"
                    label="Current Job Title"
                    name="currentJobTitle"
                    value={currentJobTitle}
                    onChange={(e) => this.candidateChange(e, "validateName")}
                    maxLength="40"
                    errMssg={
                      this.state.invalidMssg["currentJobTitle"] &&
                      this.state.invalidMssg["currentJobTitle"]

                    }
                  />
                  <Input
                    type="text"
                    label="Current Employer"
                    name="currentEmployer"
                    value={currentEmployer}
                    onChange={(e) => this.candidateChange(e, "")}
                    maxLength="255"
                  />
                  <Input
                    type="text"
                    label="Current Employer Contact"
                    name="currentEmployerContact"
                    value={currentEmployerContact}
                    onChange={(e) => this.candidateChange(e, "")}
                    maxLength="255"
                  />
                  <Input
                    type="number"
                    label="Total Experience"
                    name="totalExperience"
                    value={totalExperience}
                    onChange={(e) =>
                      this.totalExperienceChange(e, "validateNum")
                    }
                    min="0"
                    max="50"
                    step="any"
                    className="input-menu"
                    hasMenuOptions
                    menuName="totalExpPeriod"
                    menuValue={this.state.totalExpPeriod}
                    menuOnChange={this.totalExperienceChange}
                    menuOptions={expPeriod.map((p) => {
                      return { id: p, value: p, name: p };
                    })}
                  />
                  <Input
                    type="number"
                    label="Relevant Experience"
                    name="relevantExperience"
                    value={relevantExperience}
                    onChange={(e) => this.relExperienceChange(e, "validateNum")}
                    min="0"
                    max="50"
                    step="any"
                    className="input-menu"
                    hasMenuOptions
                    menuName="relExpPeriod"
                    menuValue={this.state.relExpPeriod}
                    menuOnChange={this.relExperienceChange}
                    menuOptions={expPeriod.map((p) => ({ id: p, value: p, name: p }))}
                    errMssg={this.state.relExpBool && "Can't exceed Total Experience."}
                  />
                  <TextBlock
                    label="Reason for Job Change"
                    name="reasonForJobChange"
                    value={reasonForJobChange}
                    onChange={(e) => this.candidateChange(e, "validateHasAlphabet")}
                    className="small"
                    maxLength="200"
                    errMssg={
                      this.state.invalidMssg["reasonForJobChange"] &&
                      this.state.invalidMssg["reasonForJobChange"]
                    }
                  />
                  <MultiSelect
                    label="Role"
                    options={this.state.professionalRolesDict.map((o) => ({
                      id: o.id,
                      value: o.value,
                      label: o.value,
                    }))}
                    handleChange={(e) => this.multiSelectChange(e, "professionalRoles")}
                    creatable
                    deletable={auth.hasAdminRole() || auth.hasBDManagerRole()}
                    required
                  />
                  <MultiSelect
                    label="Primary Software Skills"
                    options={this.state.primeSkillsDict.map((o) => ({
                      id: o.id,
                      value: o.value,
                      label: o.value,
                      selected: this.state.primarySoftwareSkill?.includes(o.value),
                    }))}
                    handleChange={(e) => this.multiSelectChange(e, "primeSkills")}
                    creatable
                    deletable={auth.hasAdminRole()}
                    isMulti
                  />
                  <MultiSelect
                    label="Secondary Software Skills"
                    options={this.state.secSkillsDict.map((o) => ({
                      id: o.id,
                      value: o.value,
                      label: o.value,
                      selected: this.state.secondarySkill?.includes(o.value),
                    }))}
                    handleChange={(e) => this.multiSelectChange(e, "secSkills")}
                    creatable
                    deletable={auth.hasAdminRole()}
                    isMulti
                  />
                  <SingleSelect
                    label="Offer in hand"
                    name="offerInHand"
                    value={offerInHand}
                    onChange={this.candidateChange}
                    options={[
                      { id: "Yes", value: "Yes", name: "Yes" },
                      { id: "No", value: "No", name: "No" },
                    ]}
                  />
                  <Input
                    label="Notice Period"
                    type="number"
                    name="noticeCountUnits"
                    value={noticeCountUnits}
                    onChange={(e) => this.noticePeriodChange(e, "validateInt")}
                    placeholder="Count..."
                    min="1"
                    max="10"
                    className="input-menu"
                    hasMenuOptions
                    menuName="noticePeriodType"
                    menuValue={noticePeriodType}
                    menuOnChange={this.noticePeriodChange}
                    menuOptions={noticePeriod.map((p) => {
                      return { id: p, name: p, value: p };
                    })}
                  />
                  <CurrentCTC
                    disabled={false}
                    handleChange={this.currentCTCChange}
                    currentCtcValue={currentCtcValue}
                    currentCtcType={currentCtcType}
                    currentCtcCurrency={currentCtcCurrency}
                    currentCtcTax={currentCtcTax}
                    currencyDict={this.state.currencyDict}
                  />
                  <ExpectedCTC
                    disabled={false}
                    handleChange={this.expectedCTCChange}
                    expRange={this.state.expRange}
                    startExpCTC={this.state.startExpCTC}
                    endExpCTC={this.state.endExpCTC}
                    expectedCtcValue={this.state.startExpCTC}
                    expectedCtcType={expectedCtcType}
                    expectedCtcCurrency={expectedCtcCurrency}
                    expectedCtcTax={expectedCtcTax}
                    checkExpRange={this.checkExpRange}
                    currencyDict={this.state.currencyDict}
                  />
                  <div className="benefits-input-container">
                    {[
                      { label: "Health Benefits", name: "healthBenefit" },
                      { label: "Sick Leave", name: "sickLeave" },
                      { label: "PTO", name: "pto" }
                    ].map(item => (
                      <SwitchComponent
                        key={item.name}
                        label={item.label}
                        handleSwitch={(value) => this.setState({ [item.name]: value ? "Yes" : "No" })}
                        value={this.state[item.name]}
                      />
                    ))
                    }
                  </div>
                </Fragment>
              )}
              {currentPage === "Comments" && (
                <TextBlock
                  label="Comments"
                  name="comments"
                  value={comments}
                  onChange={this.candidateChange}
                  charCount={`${comments ? 3000 - comments.length : 3000} of 3000`}
                  maxLength="3000"
                />
              )}
            </Form>
          </FormNav>

          <PopUp
            openModal={this.state.showModal}
            handleConfirmClose={this.closeModal}
            closePopUp={this.closeModal}
            type={this.state.status === "error" ? "error" : "success"}
            confirmValue="ok"
            message={{
              title:
                this.state.status === "error"
                  ? "Error"
                  : "Candidate Added Successfully",
              details:
                this.state.status === "error"
                  ? this.state.msg
                  : "To view candidates go to ",
            }}
            link={
              this.state.status === "error" ? (
                ""
              ) : (
                <Link to="/viewcandidates">Candidates</Link>
              )
            }
          />
        </Content>
      </PageContainer>
    );
  }
}
