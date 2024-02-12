import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { config } from "../../../config.js";
import AuthService from "../../../utils/AuthService.js";
import moment from "moment";
import { runValidation } from "../../../utils/validation.js";
import { InputCurrencyRate } from "../../common/input/input-currency-rate/input-currency-rate.component.jsx";
import Content from "../../container/content-container/content-container.component.jsx";
import Form from "../../common/form/form.component.jsx";
import Input from "../../common/input/inputs.component.jsx";
import SingleSelect from "../../common/select/selects.component.jsx";
import TextBlock from "../../common/textareas/textareas.component.jsx";
import Breadcrumbs from "../../common/breadcrumbs/breadcrumbs.component.jsx";
import PopUp from "../../modal/popup/popup.component.jsx";
import { ctcType, jobTypes } from "../../../utils/defaultData.js";
import { priorities } from "../../../utils/defaultData.js";
import IdleTimeOutHandler from "../../ui/Dashboard/IdleTimeOutHandler.js";
import"./job.css"

export default class AddJob extends Component {
  constructor(props) {
    super(props);
    this.state = {
      city: "",
      country: "",
      state: "",
      client: "",
      clientId: "",
      clientBillRate: "",
      recruiterName: "",
      clientOptions: [],
      jobTitle: "",
      jobDescription: "",
      comments: "",
      jobType: "",
      workLocation: "",
      flsaType: "",
      taxType: "",
      creationDate: moment().format("YYYY-MM-DD"),
      workType: "",
      currency: "",
      postalCode: "",
      noOfJobopenings: "",
      priority: "",
      hiringManager: "",
      recruiterId: AuthService.hasRecruiterRole()
        ? AuthService.getUserId()
        : "",

      user: JSON.parse(sessionStorage.getItem("userInfo")),
      show: false,
      navMenuOpen: props.navMenuOpen,
      period: "Per hour",
    };
    this.jobChange = this.jobChange.bind(this);
    this.submitJob = this.submitJob.bind(this);
  };

  initialState = {
    clientId: "",
    client: "",
    clientBillRate: "",
    recruiterName: "",
    jobTitle: "",
    jobDescription: "",
    comments: "",
    jobType: "",
    workLocation: "",
    flsaType: "",
    taxType: "",
    creationDate: moment().format("YYYY-MM-DD"),
    workType: "",
    currency: "",
    city: "",
    country: "",
    postalCode: "",
    state: "",
    noOfJobopenings: "",
    priority: "",
    hiringManager: "",
    recruiterId: AuthService.hasRecruiterRole() ? AuthService.getUserId() : "",
    period: "Per hour",
  };

  componentDidMount() {
    this.getClients();
     this.setState({
      setIsActive: true,
      setLogout:false})
  };

  componentDidUpdate(prevProps) {
    if (this.props.navMenuOpen !== prevProps.navMenuOpen) {
      this.setState({ navMenuOpen: this.props.navMenuOpen });
    }
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

  resetJob = () => {
    this.setState(() => this.initialState);
  };

  handlePhoneChange = (value) => {
    this.setState({ phoneNumber: value });
  };

  closePopUp = () => {
    this.setState({ show: false });
  };

  submitJob(event) {
    event.preventDefault();

    if (this.state.jobDescriptionErrFlag) return;

    const job = {
      //clientName: this.state.clientName,
      client: this.state.clientId === "" ? null : { id: this.state.clientId },
      clientBillRate: this.state.clientBillRate,
      jobTitle: this.state.jobTitle,
      jobDescription: this.state.jobDescription,
      comments: this.state.comments,
      jobType: this.state.jobType,
      workLocation: this.state.workLocation,
      flsaType: this.state.flsaType,
      taxType: this.state.taxType,
      creationDate: this.state.creationDate,
      workType: this.state.workType,
      currency: this.state.currency || "USD, $",
      noOfJobopenings: this.state.noOfJobopenings,
      priority: this.state.priority,
      hiringManager: this.state.hiringManager,
      recruiter:
        this.state.recruiterId === ""
          ? { id: JSON.parse(sessionStorage.getItem("userInfo")).id }
          : { id: this.state.recruiterId },
      period: this.state.period,
    };

    let headers = JSON.parse(sessionStorage.getItem("headers"));
    axios
      .post(config.serverURL + "/jobopenings", job, { headers })
      .then((response) => {
        if (response.data != null) {
          this.resetJob();
          this.setState({
            show: true,
            message: "To view jobs go to ",
            status: "Success",
          });
        }
      })
      .catch((err) => {
        this.setState({
          show: true,
          message: err.response.data,
          status: "Error",
        });
        console.log(err);
      });
  };

  jobChange(e, validProc = null) {
    const isDeleted = e.target.value === "";
    const isValid = runValidation(validProc, e.target.value, e.target.max);
    if (isDeleted || isValid)
      this.setState({ [e.target.name]: e.target.value });
  };

  postValidation(e, postValidProc = null) {
    const isInvalid =
      postValidProc && !runValidation(postValidProc, e.target.value);
    this.setState({ [`${e.target.name}ErrFlag`]: Boolean(isInvalid) });
  };

  currencyChange = (e, validProc = "validateNum") => {
    this.jobChange(e, e.target.name === "clientBillRate" ? validProc : "");
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

  closeForm = () => {
    this.props.history.push("/viewjobs");
  };

  render() {
    const {
      clientId,
      jobTitle,
      jobDescription,
      comments,
      jobType,
      flsaType,
      taxType,
      workType,
      priority,
      hiringManager,
      noOfJobopenings,
      navMenuOpen,
      period,
    } = this.state;

    return (
      <div
        className={navMenuOpen ? "page-container" : "page-container full-width"}
      >
        <div className="page-actions-container">
          <Breadcrumbs
            className="header"
            crumbs={[
              { id: 0, text: "Jobs", onClick: () => this.closeForm() },
              { id: 1, text: "Add Job Opening", lastCrumb: true },
            ]}
          />
        </div>
        <Content>
            <IdleTimeOutHandler 
           
    onActive={()=>{ this.setState({ setIsActive: true })}}
    onIdle={()=>{ this.setState({ setIsActive: false })}}
    onLogout={()=>{ this.setState({ setLogout: true })}}
    />
          <Form
            onSubmit={this.submitJob}
            cancel={this.resetJob}
            formEnabled={true}
          >
            <Input
              label="Job Title"
              type="text"
              name="jobTitle"
              value={jobTitle}
              onChange={(e) => this.jobChange(e, "validateName")}
              pattern="[^0-9@#%^$&*?]+"
              maxLength="50"
              required
            />

            <Input
              label="No. of Openings"
              type="number"
              name="noOfJobopenings"
              value={noOfJobopenings}
              onChange={(e) => {
                this.jobChange(e, "validateInt");
              }}
              max="9999"
              required
              // className="small"
              style={{ textAlign: "right" }}
              className="align"
            />
            <SingleSelect
              label="Period"
              name="period"
              className="short"
              value={period}
              onChange={this.jobChange}
              required
              options={ctcType.map((ctc) => ({
                id: ctc,
                value: ctc,
                name: ctc,
              }))}
            />
            <InputCurrencyRate
              label="Client Bill Rate"
              guide={this.state.period || "Per hour"}
              id="currency"
              nameCurrency="currency"
              nameRate="clientBillRate"
              handleChange={this.currencyChange}
              valueCurrency={this.state.currency}
              valueRate={this.state.clientBillRate}
              placeholder="Enter the amount"
              required
            ></InputCurrencyRate>

            <SingleSelect
              label="Work Type"
              name="workType"
              value={workType}
              onChange={this.jobChange}
              required
              options={[
                { id: "Hybrid", value: "Hybrid Work", name: "Hybrid Work" },
                { id: "Onsite", value: "Onsite Work", name: "Onsite Work" },
                { id: "Remote", value: "Remote Work", name: "Remote Work" },
              ]}
            />

            <SingleSelect
              label="Priority"
              name="priority"
              value={priority}
              onChange={this.jobChange}
              required
              options={priorities.map((p) => ({ id: p, value: p, name: p }))}
            />

            <Input
              label="Hiring Manager"
              type="text"
              name="hiringManager"
              value={hiringManager}
              onChange={(e) => this.jobChange(e, "validateName")}
              maxLength="20"
              required
            />

            <SingleSelect
              label="Client"
              name="clientId"
              data-testid="client-options"
              required
              value={clientId}
              onChange={(e) => {
                this.jobChange(e);
                this.setClientAddr(e.target.value);
              }}
              options={this.state.clientOptions.map((client) => {
                let id = client.id;
                return {
                  id: id,
                  name: `${client.clientName} (${client.address?.city || ""})`,
                };
              })}
            />

            <SingleSelect
              label="Employment Type"
              name="jobType"
              value={jobType}
              onChange={this.jobChange}
              required
              options={jobTypes.map((type) => ({
                id: type,
                value: type,
                name: type,
              }))}
            />

            <SingleSelect
              label="FLSA Type"
              name="flsaType"
              value={flsaType}
              onChange={this.jobChange}
              options={[
                { id: "Exempt", value: "Exempt", name: "Exempt" },
                { id: "Non Exempt", value: "Non Exempt", name: "Non Exempt" },
              ]}
            />

            <SingleSelect
              label="Tax Type"
              name="taxType"
              value={taxType}
              onChange={this.jobChange}
              options={[
                { id: "C2C", value: "C2C", name: "C2C" },
                { id: "W-2", value: "W-2", name: "W-2" },
              ]}
            />

            <TextBlock
              label="Job Description"
              name="jobDescription"
              value={jobDescription}
              onChange={(e) => {
                this.postValidation(e, "validateHasAlphabet");
                this.jobChange(e);
              }}
              required
              charCount={`${jobDescription ? 3000 - jobDescription.length : 3000
                } of 3000`}
              errMssg={
                this.state.jobDescriptionErrFlag &&
                "Description can't only contain numbers"
              }
              maxLength="3000"
            />
            <TextBlock
              label="Comments"
              name="comments"
              value={comments}
              onChange={(e) => {
                this.jobChange(e);
              }}
              charCount={`${comments ? 3000 - comments.length : 3000} of 3000`}
              maxLength="3000"
            />
          </Form>

          <PopUp
            openModal={this.state.show}
            closePopUp={this.closePopUp}
            type={this.state?.status}
            message={{
              title:
                this.state?.status === "Error"
                  ? "Error"
                  : "Job Added Succesfully",
              details: this.state?.message,
            }}
            link={
              this.state?.status === "Error" ? (
                ""
              ) : (
                <Link to="/viewjobs">Job Openings</Link>
              )
            }
          />
        </Content>
      </div>
    );
  }
}
