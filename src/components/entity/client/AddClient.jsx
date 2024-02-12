import React, { Component, Fragment } from "react";
import { runValidation } from "../../../utils/validation";
import Content from "../../container/content-container/content-container.component";
import Form from "../../common/form/form.component";
import FormNav from "../../ui/form-nav/form-nav.component";
import Input from "../../common/input/inputs.component";
import SingleSelect from "../../common/select/selects.component";
import Breadcrumbs from "../../common/breadcrumbs/breadcrumbs.component";
import PopUp from "../../modal/popup/popup.component";
import * as addr from "../../../utils/serviceAddress";
import { InputPhone } from "../../common/input/input-phone/input-phone.component";
import axios from "axios";
import { config } from "../../../config";
import { Link } from "react-router-dom";
import { PageContainer } from "../../container/page-container/PageContainer";
import { PageHeader } from "../../container/page-header/PageHeader";
import "./client.scss";
import IdleTimeOutHandler from "../../ui/Dashboard/IdleTimeOutHandler";

export default class AddClient extends Component {
  constructor(props) {
    super(props);

    this.state = { ...this.initialState };
    this.clientChange = this.clientChange.bind(this);
    this.submitClient = this.submitClient.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.docRef = React.createRef(null);
  };

  initialState = {
    clientName: "",
    phoneNumber: "",
    website: "",
    addressLine1: "",
    addressLine2: "",
    addressLine3: "",
    city: "",
    clientOptions: [],
    state: "",
    country: "",
    postalCode: "",
    vmsFees: 0,
    adminFees: 0,
    rebateFees: 0,
    isDeleted: false,
    inputErr: "",
    countryList: [],
    stateList: [],
    currentPage: "Basic Information",
    basicRequiredPercent: 0,
    basicRequiredFields: {
      clientName: false,
    },
    currentPercent: 0,
    openPopUp: false,
    showModal: false,
    addressRequiredPercent: 0,
    addressRequiredFields: {
      country: false,
      city: false,
      addressLine1: false,
      postalCode: false,
    },
    submitError: "",
  };

  submitClient = (event) => {
    event.preventDefault();

    const payload = {
      clientName: this.state.clientName,
      website: this.state.website,
      phoneNumber: this.state.phoneNumber,
      vmsFees: this.state.vmsFees,
      adminFees: this.state.adminFees,
      rebateFees: this.state.rebateFees,

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

    const headers = JSON.parse(sessionStorage.getItem("headers"));
    axios
      .post(`${config.serverURL}/clients`, payload, { headers })
      .then((response) => {
        if (response.status === 201) {
          this.resetClient();
          this.setState({ openPopUp: true });
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 409) {
          this.setState({ submitError: error.response });
        }
        if (error.response && error.response.status === 401) {
        }
      });
  };

  async componentDidMount() {
    this.setState({ 
      countryList: addr.getCountries(),
    setIsActive: true,
      setLogout:false,
    });
  }

  handleReset() {
    this.setState({ next: null, status: "" });
  }

  clientChange = (e, validProc = null) => {
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
      this.state.addressRequiredPercent !== 100
    ) {
      const pageName = ["clientName"].includes(name)
        ? "basic"
        : ["country", "city", "addressLine1", "postalCode"].includes(name)
          ? "address"
          : "";
      if (pageName)
        this.checkRequiredFields(name, !isDeleted ? true : false, pageName);
    }
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

  showModal = () => {
    this.setState({ show: !this.state.show });
  };

  handleNext(event) {
    event.preventDefault();
    if (this.state.status && !this.state.clientId) {
      this.setState({ next: this.state.status });
    }
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.state.currentPage !== prevState.currentPage) {
      if (this.state.currentPage === "Basic Information") {
        this.setState({ currentPercent: this.state.basicRequiredPercent });
      }
      if (this.state.currentPage === "Address") {
        this.setState({ currentPercent: this.state.addressRequiredPercent });
      }
    }

    if (this.state.basicRequiredFields !== prevState.basicRequiredFields) {
      let total = 0;
      for (let key in this.state.basicRequiredFields) {
        if (this.state.basicRequiredFields[key]) total += 100;
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
  };

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
      case "taxes":
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

  togglePopUp = () => {
    this.setState({ openPopUp: !this.state.openPopUp });
  };

  cityChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
    if (e.target.value !== "") {
      this.checkRequiredFields("city", true, "address");
    } else {
      this.checkRequiredFields("city", false, "address");
    }
  };

  handlePhoneChange = (value) => {
    this.setState({ phoneNumber: value });
  };

  resetClient = () => {
    this.setState(() => this.initialState);
  };

  closeForm = () => {
    this.props.history.push("/viewclients");
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
                { id: 0, text: "Client", onClick: () => this.closeForm() },
                { id: 1, text: "Add Client", lastCrumb: true },
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
                title: "Taxes",
                hasRequiredFields: true,
                subTitle: <span style={{ fontSize: "20px", marginBottom: "8px", color: "var(--secondary)", }} >*</span>
              },
              { title: `Address` },
            ]}
            canSubmit={
              this.state.basicRequiredPercent >= 100 &&
              this.state.addressRequiredPercent >= 100
            }
            submit={this.submitClient}
            reset={this.resetClient}
            setCurrentPage={this.setCurrentPage}
            percent={this.state.currentPercent}
            error={Object.keys(this.state.inputErr).length}
          >
            <Form>
              {this.state.currentPage === "Basic Information" && (
                <Fragment>
                  <Input
                    type="text"
                    label="Client Name"
                    name="clientName"
                    value={this.state.clientName}
                    onChange={(e) => this.clientChange(e, "validateName")}
                    maxLength="20"
                    errMssg={this.state.inputErr["clientName"]}
                    required
                  />
                  <Input
                    type="text"
                    label="Website"
                    name="website"
                    value={this.state.website}
                    onChange={(e) => this.clientChange(e, "validateURL")}
                    maxLength="20"
                    errMssg={this.state.inputErr["website"]}
                    required
                  />

                  <InputPhone
                    phoneNumber={this.state.phoneNumber}
                    handleChange={this.handlePhoneChange}
                    label="Phone Num."
                    setError={this.setPhoneNumError}
                  />
                </Fragment>
              )}
              {this.state.currentPage.includes("Taxes") && (
                <Fragment>
                  <Input
                    name="vmsFees"
                    label="VMS Fees %"
                    type="number"
                    className="NumAlign"
                    onChange={(e) => this.clientChange(e, "validatePrecentage")}
                    value={Number(this.state.vmsFees).toFixed(2)}
                    errMssg={this.state.inputErr["vmsFees"]}
                  />
                  <Input
                    name="adminFees"
                    label="Admin Fees %"
                    type="number"
                    className="NumAlign"
                    onChange={(e) => this.clientChange(e, "validatePrecentage")}
                    value={Number(this.state.adminFees).toFixed(2)}
                    errMssg={this.state.inputErr["adminFees"]}
                  />
                  <Input
                    name="rebateFees"
                    label="Rebate Fees %"
                    type="number"
                    className="NumAlign"
                    onChange={(e) => this.clientChange(e, "validatePrecentage")}
                    value={Number(this.state.rebateFees).toFixed(2)}
                    errMssg={this.state.inputErr["rebateFees"]}
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
                      onChange={this.clientChange}
                      maxLength="40"
                      required
                      errMssg={this.state.inputErr["city"]}
                    />
                  )}
                  <Input
                    type="text"
                    label="Address Line 1"
                    name="addressLine1"
                    value={this.state.addressLine1}
                    onChange={this.clientChange}
                    maxLength="200"
                    required
                  />
                  <Input
                    type="text"
                    label="Address Line 2"
                    name="addressLine2"
                    maxLength="200"
                    value={this.state.addressLine2}
                    onChange={this.clientChange}
                  />

                  <Input
                    type="text"
                    label="Address Line 3"
                    name="addressLine3"
                    maxLength="200"
                    value={this.state.addressLine3}
                    onChange={this.clientChange}
                  />

                  <Input
                    type="text"
                    label="ZIP Code"
                    name="postalCode"
                    value={this.state.postalCode}
                    //onChange={this.clientChange}
                    onChange={(e) => this.clientChange(e, "validateZip")}
                    required
                    maxLength="6"
                    errMssg={this.state.inputErr["postalCode"]}
                  />
                </Fragment>
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
                : "Client Added Succesfully",
              details: this.state.submitError
                ? `Error while saving record ${this.state.submitError}`
                : "To view client go to ",
            }}
            link={
              this.state.submitError ? (
                ""
              ) : (
                <Link to="viewclients">clients</Link>
              )
            }
          />
        </Content>
      </PageContainer>
    );
  }
}
