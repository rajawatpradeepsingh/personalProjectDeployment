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
import { hiringType, processStatus } from "../../../utils/defaultData";
import IdleTimeOutHandler from "../../ui/Dashboard/IdleTimeOutHandler";

const statusOptions = processStatus.map(stat => ({ id: stat, value: stat, name: stat }));
const hiringTypeOptions = hiringType.map(type => ({ id: type, value: type, name: type }));

export default class AddOnboarding extends Component {
  constructor(props) {
    super(props);
    this.state = { ...this.initialState, navMenuOpen: props.navMenuOpen };
    this.onboardingChange = this.onboardingChange.bind(this);
    this.submitonboarding = this.submitOnboarding.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.docRef = React.createRef(null);
  };

  initialState = {
    currentPage: "Basic Information",
    candidate: "",
    candidateId: "",
    client: "",
    project: "",
    hiringType: "",
    startDate: "",
    endDate: "",
    clientOptions: [],
    candidateOptions: [],
    clientId: "",
    signUpContract: "",
    deliveryOfLaptop: "",
    easePortalSetUp: "",
    workOrder: "",
    backgroundCheck: "",
    next: null,
    relExpBool: false,
    inputErr: {},
    user: JSON.parse(sessionStorage.getItem("userInfo")),
    basicRequiredPercent: 0,
    detailsRequiredPercent: 0,
    basicRequiredFields: {
      candidateId: false,
      clientId: false,
      hiringType: false,
    },
    currentPercent: 0,
    openPopUp: false,
    submitError: "",
  };

  componentDidMount() {
    this.getClients();
    this.getCandidates();
      this.setState({
      setIsActive: true,
      setLogout:false})
  };

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

  getCandidates = () => {
    let headers = JSON.parse(sessionStorage.getItem("headers"));
    axios
      .get(config.serverURL + "/candidates/confirm?dropdownFilter=true", {
        headers,
      })
      .then((resp) => {
        const cand = resp.data;

        if (resp.data) {
          this.setState({ candidateOptions: cand });
        }
      })
      .catch((error) => {
        console.log(error);
        if (error.response && error.response.status === 401) {
          AuthService.logout();
        }
      });
  };

  resetOnboarding = () => this.setState(() => this.initialState);

  showModal = () => this.setState({ show: !this.state.show });

  togglePopUp = () => this.setState({ openPopUp: !this.state.openPopUp });

  submitOnboarding = (event) => {
    event.preventDefault();

    const onboarding = {
      candidate: this.state.candidateId === "" ? null : { id: this.state.candidateId },
      client: this.state.clientId === "" ? null : { id: this.state.clientId },
      project: this.state.project === "" ? "N/A" : this.state.project,
      hiringType: this.state.hiringType,
      startDate: this.state.startDate,
      endDate: this.state.endDate === "" ? "N/A" : this.state.endDate,
      signUpContract: this.state.signUpContract,
      deliveryOfLaptop: this.state.deliveryOfLaptop,
      easePortalSetUp: this.state.easePortalSetUp === "" ? "N/A" : this.state.easePortalSetUp,
      workOrder: this.state.workOrder,
      backgroundCheck: this.state.backgroundCheck,
    };

    let headers = JSON.parse(sessionStorage.getItem("headers"));
    axios
      .post(`${config.serverURL}/onboarding`, onboarding, { headers })
      .then((response) => {
        console.log(response.status);
        if (response.data != null && this.state.file) {
          let id = response.data.id;
          let file = this.state.file;
          let formData = new FormData();

          formData.append("file", file);
          axios
            .post(`${config.serverURL}/onboarding/${id}/resume`, formData, {
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
      .then(() => {
        this.resetOnboarding();
        this.setState({ openPopUp: true });
      })
      .catch((error) => {
        this.setState({
          submitError: error.response.data,
          openPopUp: true,
        });
        if (error.response && error.response.status === 401) {
          AuthService.logout();
        }
      });
  };

  onboardingChange = (e, validProc = null) => {
    const isDeleted = e.target.value === "";
    const isValid = runValidation(validProc, e.target.value, e.target.max);

    this.setState({ [e.target.name]: e.target.value });

    if (!isValid) {
      this.setState({
        inputErr: {
          ...this.state.inputErr,
          [e.target.name]: `Invalid format or characters`,
        },
      });
    } else if (isValid) {
      let temp = { ...this.state.inputErr };
      delete temp[e.target.name];
      this.setState({ inputErr: temp });
    }

    if (
      e.target.name === "candidateId" ||
      e.target.name === "clientId" ||
      e.target.name === "hiringType"
    ) {
      if (!isDeleted) {
        this.checkRequiredFields(e.target.name, true, "basic");
      } else {
        this.checkRequiredFields(e.target.name, false, "basic");
      }
    }
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.props.navMenuOpen !== prevProps.navMenuOpen) {
      this.setState({ navMenuOpen: this.props.navMenuOpen });
    }

    if (
      (this.state.startDate !== prevState.startDate ||
        this.state.endDate !== prevState.endDate) &&
      this.state.endDate
    ) {
      if (this.state.startDate >= this.state.endDate) {
        this.setState({
          inputErr: {
            ...this.state.inputErr,
            endDate: "End date can't be before start date",
          },
        });
      } else {
        let temp = { ...this.state.inputErr };
        delete temp["endDate"];
        this.setState({ inputErr: temp });
      }
    }

    // set percentage of required fields filled for current page
    if (this.state.currentPage !== prevState.currentPage) {
      if (this.state.currentPage === "Basic Information") {
        this.setState({ currentPercent: this.state.basicRequiredPercent });
      }
      if (this.state.currentPage.includes("Details")) {
        this.setState({ currentPercent: this.state.detailsRequiredPercent });
      }
    }

    //update percentage of basic info required fields filled
    if (this.state.basicRequiredFields !== prevState.basicRequiredFields) {
      let total = 0;
      for (let key in this.state.basicRequiredFields) {
        if (this.state.basicRequiredFields[key]) total += 33.4;
      }
      this.setState({ currentPercent: total });
      if (!Object.values(this.state.basicRequiredFields).includes(false))
        this.setState({ basicRequiredPercent: 100 });
    }
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
      default:
        break;
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

  handleNext(event) {
    event.preventDefault();
    if (this.state.hiringType && !this.state.relExpBool) {
      this.setState({ next: this.state.hiringType });
    }
  };

  handleReset() {
    this.setState({ next: null, hiringType: "" });
  };

  showModal = () => {
    this.setState({
      show: !this.state.show,
    });
  };

  //set current page of form for form nav
  setCurrentPage = (page) => {
    this.setState({ currentPage: page.title });
  };

  closeForm = () => {
    this.props.history.push("/viewonboardings");
  };

  render() {
    return (
      <div
        className={
          this.state.navMenuOpen
            ? "page-container"
            : "page-container full-width"
        }
      >
        <div className="page-actions-container">
          <Breadcrumbs
            className="header"
            crumbs={[
              { id: 0, text: "Onboardings", onClick: () => this.closeForm() },
              { id: 1, text: "Add Onboarding", lastCrumb: true },
            ]}
          />
        </div>
        <Content>
              <IdleTimeOutHandler 
           
    onActive={()=>{ this.setState({ setIsActive: true })}}
    onIdle={()=>{ this.setState({ setIsActive: false })}}
    onLogout={()=>{ this.setState({ setLogout: true })}}
    />
          <FormNav
            steps={[
              {
                title: "Basic Information",
                hasRequiredFields: true,
                subTitle: <span style={{ fontSize: "20px", marginBottom: "8px", color: "var(--secondary)", }} >*</span>
              },
              { title: `Details ${this.state.hiringType}` },
            ]}
            canSubmit={this.state.basicRequiredPercent >= 100}
            submit={this.submitOnboarding}
            reset={this.resetOnboarding}
            setCurrentPage={this.setCurrentPage}
            percent={this.state.currentPercent}
            error={Object.keys(this.state.inputErr).length}
          >
            <Form>
              {this.state.currentPage === "Basic Information" && (
                <Fragment>
                  <SingleSelect
                    label="Candidate Name"
                    name="candidateId"
                    data-testid="candidate-options"
                    required
                    onChange={(e) => {
                      this.onboardingChange(e);
                    }}
                    value={this.state.candidateId}
                    options={this.state.candidateOptions.map((candidate) => {
                      let id = candidate.id;
                      return {
                        id: id,
                        name: `${candidate.firstName} ${candidate.lastName}`,
                      };
                    })}
                  />
                  <SingleSelect
                    label="Client"
                    name="clientId"
                    data-testid="client-options"
                    onChange={(e) => {
                      this.onboardingChange(e);
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
                  <Input
                    type="text"
                    label="Project"
                    name="project"
                    value={this.state.project}
                    onChange={(e) => this.onboardingChange(e, "validateName")}
                    maxLength="20"
                    errMssg={this.state.inputErr["project"]}
                  />
                  <SingleSelect
                    label="Hiring Type"
                    name="hiringType"
                    value={this.state.hiringType}
                    onChange={this.onboardingChange}
                    required
                    options={hiringTypeOptions}
                  />
                  <Input
                    type="date"
                    label="Start Date"
                    name="startDate"
                    onChange={this.onboardingChange}
                    value={this.state.startDate}
                    errMssg={this.state.inputErr["startDate"]}
                    max="2999-12-31"
                  />

                  <Input
                    type="date"
                    label="End Date"
                    name="endDate"
                    value={this.state.endDate}
                    onChange={this.onboardingChange}
                    errMssg={this.state.inputErr["endDate"]}
                    max="2999-12-31"
                  />
                </Fragment>
              )}
              {this.state.currentPage.includes("Details") && (
                <Fragment>
                  <SingleSelect
                    label="Sign-Up Contract"
                    name="signUpContract"
                    value={this.state.signUpContract}
                    onChange={(e) => this.onboardingChange(e, "validateName")}
                    options={statusOptions}
                  />
                  <Input
                    type="file"
                    label="Attach Document"
                    data-testid="file"
                    name="file"
                    ref={this.docRef}
                    onChange={(e) => this.handleUploadFile(e)}
                    errMssg={this.state.inputErr["file"]}
                  />
                  <SingleSelect
                    label="Delivery of Laptop"
                    name="deliveryOfLaptop"
                    value={this.state.deliveryOfLaptop}
                    onChange={this.onboardingChange}
                    options={statusOptions}
                  />
                  {this.state.hiringType !== "Corp to Corp Hire" && (
                    <SingleSelect
                      label="Ease Portal Setup"
                      name="easePortalSetUp"
                      value={this.state.easePortalSetUp}
                      onChange={this.onboardingChange}
                      options={statusOptions}
                    />
                  )}
                  <SingleSelect
                    label="Workorder"
                    name="workOrder"
                    value={this.state.workOrder}
                    onChange={this.onboardingChange}
                    options={statusOptions}
                  />
                  <SingleSelect
                    label="Background Check"
                    name="backgroundCheck"
                    value={this.state.backgroundCheck}
                    onChange={this.onboardingChange}
                    options={statusOptions}
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
                : "Onboarding Added Succesfully",
              details: this.state.submitError
                ? `Error while saving record ${this.state.submitError}`
                : "To view onboardings go to ",
            }}
            link={
              this.state.submitError ? (
                ""
              ) : (
                <Link to="viewonboardings">Onboardings</Link>
              )
            }
          />
        </Content>
      </div>
    );
  }
}
