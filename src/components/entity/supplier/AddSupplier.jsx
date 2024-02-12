import React, { Component, Fragment } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { config } from "../../../config";
import AuthService from "../../../utils/AuthService";
import { runValidation } from "../../../utils/validation";
import Content from "../../container/content-container/content-container.component";
import Form from "../../common/form/form.component";
import FormNav from "../../ui/form-nav/form-nav.component";
import Input from "../../common/input/inputs.component";
import SingleSelect from "../../common/select/selects.component";
import Breadcrumbs from "../../common/breadcrumbs/breadcrumbs.component";
import PopUp from "../../modal/popup/popup.component";
import "./supplier.css";
import * as addr from "../../../utils/serviceAddress";
import { InputPhone } from "../../common/input/input-phone/input-phone.component";
import { PageContainer } from "../../container/page-container/PageContainer";
import { PageHeader } from "../../container/page-header/PageHeader";
import TextBlock from "../../common/textareas/textareas.component";
import IdleTimeOutHandler from "../../ui/Dashboard/IdleTimeOutHandler";
import { getDict, delDict, postDict } from "../../../API/dictionaries/dictionary-apis";
import MultiSelect from "../../common/select/multiSelect/multiSelect.component";

export default class AddSupplier extends Component {
  constructor(props) {
    super(props);
    this.state = { ...this.initialState };
    this.supplierChange = this.supplierChange.bind(this);
    this.submitSupplier = this.submitSupplier.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.docRef = React.createRef(null);
  }

  initialState = {
    firstName: "",
    lastName: "",
    email: "",
    phone_no: "",
    designation: "",
    netTerms: "",
    supplierCompanyName: "",
    w8Bene: "",
    d590: "",
    w9: "",
    a1099: "",
    certificateOfInsurance: "",
    contractStartDate: "",
    contractEndDate: "",
    website: "",
    comments: "",
    status: "",
    addressLine1: "",
    addressLine2: "",
    addressLine3: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    inputErr: "",
    countryList: [],
    stateList: [],
    headers: AuthService.getHeaders(),
    relExpBool: false,
    isDuplicate: false,
    currentPage: "Basic Information",
    basicRequiredPercent: 0,
    basicRequiredFields: {
      firstName: false,
      lastName: false,
      email: false,
      designation: false,
      supplierCompanyName: false,
    },
    detailsRequiredPercent: 0,
    detailsRequiredFields: {
      certificateOfInsurance: false,
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
    submitError: "",
    openPopUp: false,
    designationDict: [],
    supplierDict: [],
  };

  async componentDidMount() {
    const headers = AuthService.getHeaders();
    const designation = await getDict("designation", headers);
    const supplierCompanyName = await getDict("supplierCompanyName", headers);

    this.setState({ 
      countryList: addr.getCountries(),
      designationDict: designation,
      supplierDict: supplierCompanyName,
      setIsActive: true,
      setLogout:false
     });
  };

  resetSupplier = () => {
    this.setState(() => this.initialState);
  };

  showModal = () => {
    this.setState({ show: !this.state.show });
  };

  togglePopUp = () => {
    this.setState({ openPopUp: !this.state.openPopUp });
  };

  submitSupplier = (event) => {
    event.preventDefault();

    const supplier = {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      phone_no: this.state.phone_no,
      email: this.state.email,
      supplierCompanyName: this.state.supplierCompanyName,
      designation: this.state.designation,
      website: this.state.website,
      status: this.state.status,
      netTerms: this.state.netTerms,
      w8Bene: this.state.w8Bene,
      d590: this.state.d590,
      w9: this.state.w9,
      a1099: this.state.a1099,
      certificateOfInsurance: this.state.certificateOfInsurance,
      contractStartDate: this.state.contractStartDate,
      contractEndDate: this.state.contractEndDate,
      comments: this.state.comments,
      isDeleted: false,
      address: {
        city: this.state.city,
        country: this.state.country,
        state: this.state.state,
        postalCode: this.state.postalCode,
        addressLine1: this.state.addressLine1,
        addressLine2: this.state.addressLine2,
        addressLine3: this.state.addressLine3,
        countryCode: this.state.countryCode,
        stateCode: this.state.stateCode,
      },
    };

    let headers = JSON.parse(sessionStorage.getItem("headers"));
    
    axios
      .post(`${config.serverURL}/supplier`, supplier, { headers })
      .then(() => {
        this.resetSupplier();
        this.setState({ openPopUp: true });
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          submitError: error.res.data,
          openPopUp: true,
        });
        if (error.res && error.res.status === 401) {
          AuthService.logout();
        }
      });
  };

  supplierChange = (e, validProc = null) => {
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
      this.state.detailsRequiredPercent !== 100 ||
      this.state.addressRequiredPercent !== 100
    ) {
      const pageName = [
        "firstName",
        "lastName",
        "supplierCompanyName",
        "email",
        "designation",
      ].includes(name)
        ? "basic"
        : ["certificateOfInsurance"].includes(name)
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
      if (this.state.currentPage === "Comments") {
        this.setState({ currentPercent: 0 });
      }
    }

    if (this.state.basicRequiredFields !== prevState.basicRequiredFields) {
      let total = 0;
      for (let key in this.state.basicRequiredFields) {
        if (this.state.basicRequiredFields[key]) total += 20;
      }
      this.setState({ currentPercent: total });
      if (!Object.values(this.state.basicRequiredFields).includes(false))
        this.setState({ basicRequiredPercent: 100 });
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
    if (this.state.addressRequiredFields !== prevState.addressRequiredFields) {
      let total = 0;
      for (let key in this.state.addressRequiredFields) {
        if (this.state.addressRequiredFields[key]) total += 25;
      }
      this.setState({ currentPercent: total });
      if (!Object.values(this.state.addressRequiredFields).includes(false))
        this.setState({ addressRequiredPercent: 100 });
    }
  };

  multiSelectChange = (options, resource) => {
    const selected = options
      .filter((o) => o.selected)
      .map((o) => o.value)
      .join(",");

    let resName = resource;
    const change = { target: { name: resName, value: selected || "" } };
    this.supplierChange(change);

    // call add API for new
    options
      .filter((o) => !o.id && !o.isDeleted && o.value)
      .forEach((o) => {
        postDict(resource, o.value, this.state.headers)
          .then((response) => {
            const newRec = {
              id: response.id,
              value: response.value,
              selected: true,
              isDeleted: response.isDeleted,
            };
            console.log(newRec)

            if (resource === "designation")
              this.setState({
                designationDict: [...this.state.designationDict, newRec],
              });
              if (resource === "supplierCompanyName")
              this.setState({
                supplierDict: [...this.state.supplierDict, newRec],
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
    if (resource === "designation") this.setState({ designationDict: delList });
    if (resource === "supplierCompanyName") this.setState({ supplierDict: delList });
  };


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
    this.setState({ phone_no: value });
  };

  handleNext(event) {
    event.preventDefault();
    if (this.state.firstName && !this.state.lastName) {
      this.setState({ next: this.state.lastName });
    }
  };

  handleReset() {
    this.setState({ next: null, lastName: "" });
  };

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

  cityChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
    if (e.target.value !== "") {
      this.checkRequiredFields("city", true, "address");
    } else {
      this.checkRequiredFields("city", false, "address");
    }
  };

  closeForm = () => {
    this.props.history.push("/viewsuppliers");
  };

  render() {
    return (
      <PageContainer>
            <IdleTimeOutHandler 
           
    onActive={()=>{ this.setState({ setIsActive: true })}}
    onIdle={()=>{ this.setState({ setIsActive: false })}}
    onLogout={()=>{ this.setState({ setLogout: true })}}
    />
        <PageHeader
          breadcrumbs={
            <Breadcrumbs
              className="header"
              crumbs={[
                { id: 0, text: "Suppliers", onClick: () => this.closeForm() },
                { id: 1, text: "Add Supplier", lastCrumb: true },
              ]}
            />
          }
        />
        <Content>
          <FormNav
            steps={[
              {
                title: "Basic Information",
                hasRequiredFields: true,
                subTitle: <span style={{ fontSize: "20px", marginBottom: "8px", color: "var(--secondary)", }} >*</span>
              },
              {
                title: "Details",
                hasRequiredFields: true,
                subTitle: <span style={{ fontSize: "20px", marginBottom: "8px", color: "var(--secondary)", }} >*</span>
              },
              {
                title: `Address`,
                hasRequiredFields: true,
                subTitle: <span style={{ fontSize: "20px", marginBottom: "8px", color: "var(--secondary)", }} >*</span>
              },
              { title: "Comments" },

            ]}
            canSubmit={
              this.state.basicRequiredPercent >= 100 &&
              this.state.detailsRequiredPercent >= 100 &&
              this.state.addressRequiredPercent >= 100
            }
            submit={this.submitSupplier}
            reset={this.resetSupplier}
            setCurrentPage={this.setCurrentPage}
            percent={this.state.currentPercent}
            error={Object.keys(this.state.inputErr).length}
          >
            <Form>
              {this.state.currentPage === "Basic Information" && (
                <Fragment>
                   <MultiSelect
                    label="Supplier"
                    options={this.state.supplierDict.map((o) => ({
                      id: o.id,
                      value: o.value,
                      label: o.value,
                    }))}
                    handleChange={(e) =>
                      this.multiSelectChange(e, "supplierCompanyName")
                    }
                    required
                    deletable={AuthService.hasAdminRole()}
                    creatable
                  />
                  <Input
                    type="text"
                    label="First Name"
                    name="firstName"
                    value={this.state.firstName}
                    onChange={(e) => this.supplierChange(e, "validateName")}
                    maxLength="20"
                    errMssg={this.state.inputErr["firstName"]}
                    required
                  />
                  <Input
                    type="text"
                    label="Last Name"
                    name="lastName"
                    value={this.state.lastName}
                    onChange={(e) => this.supplierChange(e, "validateName")}
                    maxLength="20"
                    errMssg={this.state.inputErr["lastName"]}
                    required
                  />
                  <MultiSelect
                    label="Title"
                    options={this.state.designationDict.map((o) => ({
                      id: o.id,
                      value: o.value,
                      label: o.value,
                    }))}
                    handleChange={(e) =>
                      this.multiSelectChange(e, "designation")
                    }
                    required
                    deletable={AuthService.hasAdminRole()}
                    creatable
                  />

                  <InputPhone
                    phoneNumber={this.state.phone_no}
                    handleChange={this.handlePhoneChange}
                    label="Phone Num."
                    setError={this.setPhoneNumError}
                  />
                  <Input
                    type="email"
                    label="E-mail"
                    name="email"
                    value={this.state.email}
                    onChange={(e) => this.supplierChange(e, "validateEmail")}
                    required
                    errMssg={this.state.inputErr["email"]}
                  />
                  <Input
                    type="text"
                    label="Website"
                    name="website"
                    value={this.state.website}
                    onChange={(e) => this.supplierChange(e, "validateURL")}
                    errMssg={this.state.inputErr["website"]}
                  />
                  <SingleSelect
                    name="status"
                    label="Status"
                    type="status"
                    id="status"
                    onChange={(e) => this.supplierChange(e)}
                    value={this.state.status}
                    options={[
                      { id: 1, value: "ACTIVE", name: "Active" },
                      { id: 2, value: "INACTIVE", name: "Inactive" },
                    ]}
                  />
                </Fragment>
              )}
              {this.state.currentPage.includes("Details") && (
                <Fragment>
                  <Input
                    type="text"
                    label="Net Terms"
                    name="netTerms"
                    value={this.state.netTerms}
                    onChange={(e) => this.supplierChange(e, "validateNum")}
                    errMssg={this.state.inputErr["netTerms"]}
                  />
                  <SingleSelect
                    label="W-8Ben"
                    name="w8Bene"
                    value={this.state.w8Bene}
                    onChange={(e) => this.supplierChange(e)}
                    options={[
                      { id: "Yes", value: "Yes", name: "Yes" },
                      { id: "No", value: "No", name: "No" },
                      { id: "Pending", value: "Pending", name: "Pending" },
                    ]}
                  />
                  <SingleSelect
                    label="D-590"
                    name="d590"
                    value={this.state.d590}
                    onChange={(e) => this.supplierChange(e)}
                    options={[
                      { id: "Yes", value: "Yes", name: "Yes" },
                      { id: "No", value: "No", name: "No" },
                      { id: "Pending", value: "Pending", name: "Pending" },
                    ]}
                  />
                  <SingleSelect
                    label="W-9"
                    name="w9"
                    value={this.state.w9}
                    onChange={(e) => this.supplierChange(e)}
                    options={[
                      { id: "Yes", value: "Yes", name: "Yes" },
                      { id: "No", value: "No", name: "No" },
                      { id: "Pending", value: "Pending", name: "Pending" },
                    ]}
                  />
                  <SingleSelect
                    label="A-1099"
                    name="a1099"
                    value={this.state.a1099}
                    onChange={(e) => this.supplierChange(e)}
                    options={[
                      { id: "Yes", value: "Yes", name: "Yes" },
                      { id: "No", value: "No", name: "No" },
                      { id: "Pending", value: "Pending", name: "Pending" },
                    ]}
                  />
                  <Input
                    type="date"
                    label="Certificate Of Insurance"
                    name="certificateOfInsurance"
                    onChange={(e) => this.supplierChange(e)}
                    value={this.state.certificateOfInsurance}
                    max="2999-12-31"
                    errMssg={this.state.inputErr["certificateOfInsurance"]}
                    required
                  />
                  <Input
                    name="contractStartDate"
                    label="Contract Start Date"
                    id="contractStartDate"
                    type="date"
                    max="2999-12-31"
                    onChange={(e) => this.supplierChange(e)}
                    value={this.state.contractStartDate}
                    errMssg={this.state.inputErr["contractStartDate"]}
                  />
                  <Input
                    name="contractEndDate"
                    label="Contract End Date"
                    id="contractEndDate"
                    type="date"
                    // min={minDate}
                    max="2999-12-31"
                    onChange={(e) => this.supplierChange(e)}
                    value={this.state.contractEndDate}
                    errMssg={this.state.inputErr["contractEndDate"]}
                  />


                </Fragment>
              )}
              {this.state.currentPage.includes("Address") && (
                <Fragment>
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
                    value={this.state.state}
                    onChange={this.stateChange}
                    options={this.state.stateList}
                    required={this.state.stateList.length > 0}
                  />
                  {this.state.citiesList?.length &&
                    !this.state.disableCities ? (
                    <SingleSelect
                      label="City"
                      name="city"
                      value={this.state.city}
                      onChange={this.cityChange}
                      options={this.state.citiesList}
                      required
                      placeholder={
                        this.state.disableCities
                          ? "Select State/Province first"
                          : ""
                      }
                      disabled={this.state.disableCities}
                    />
                  ) : (
                    <Input
                      type="text"
                      label="City"
                      name="city"
                      value={this.state.city}
                      placeholder="Enter city"
                      onChange={(e) => this.supplierChange(e, "validateName")}
                      maxLength="40"
                      required
                      //disabled={disableCities}
                      errMssg={this.state.inputErr["city"]}
                    />
                  )}
                  <Input
                    type="text"
                    label="Address Line 1"
                    name="addressLine1"
                    value={this.state.addressLine1}
                    onChange={(e) => this.supplierChange(e, "validateName")}
                    maxLength="200"
                    required
                  />
                  <Input
                    type="text"
                    label="Address Line 2"
                    name="addressLine2"
                    maxLength="200"
                    value={this.state.addressLine2}
                    onChange={(e) => this.supplierChange(e, "validateName")}
                  />

                  <Input
                    type="text"
                    label="Address Line 3"
                    name="addressLine3"
                    maxLength="200"
                    value={this.state.addressLine3}
                    onChange={(e) => this.supplierChange(e, "validateName")}
                  />

                  <Input
                    type="text"
                    label="ZIP Code"
                    name="postalCode"
                    value={this.state.postalCode}
                    onChange={(e) => this.supplierChange(e, "validateZip")}
                    required
                    maxLength="6"
                    errMssg={this.state.inputErr["postalCode"]}
                  />
                </Fragment>
              )}
              {this.state.currentPage === "Comments" && (
                <TextBlock
                  label="Comments"
                  name="comments"
                  value={this.state.comments}
                  onChange={this.supplierChange}
                  charCount={`${this.state.comments ? 3000 - this.state.comments.length : 3000
                    } of 3000`}
                  maxLength="3000"
                />
              )}

            </Form>
          </FormNav>
          <PopUp
            openModal={this.state.openPopUp}
            closePopUp={this.togglePopUp}
            handleConfirmClose={this.togglePopUp}
            type={this.state.submitError ? "Warning" : "Success"}
            message={{
              title: this.state.submitError
                ? "Error"
                : "Supplier Added Succesfully",
              details: this.state.submitError
                ? `Error while saving record ${this.state.submitError}`
                : "To view supplier go to ",
            }}
            link={
              this.state.submitError ? (
                ""
              ) : (
                <Link to="/viewsuppliers">Suppliers</Link>
              )
            }
          />
        </Content>
      </PageContainer>
    );
  }
}
