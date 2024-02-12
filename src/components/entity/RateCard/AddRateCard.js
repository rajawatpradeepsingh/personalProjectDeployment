import React, { Component, Fragment } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { config } from "../../../config";
import auth from "../../../utils/AuthService";
import { runValidation } from "../../../utils/validation";
import Content from "../../container/content-container/content-container.component";
import Form from "../../common/form/form.component";
import FormNav from "../../ui/form-nav/form-nav.component";
import Input from "../../common/input/inputs.component";
import SingleSelect from "../../common/select/selects.component";
import Breadcrumbs from "../../common/breadcrumbs/breadcrumbs.component";
import PopUp from "../../modal/popup/popup.component";
import { InputCurrencyRate } from "../../common/input/input-currency-rate/input-currency-rate.component";
import { PageContainer } from "../../container/page-container/PageContainer";
import { PageHeader } from "../../container/page-header/PageHeader";
import "./ratecard.scss";
import IdleTimeOutHandler from "../../ui/Dashboard/IdleTimeOutHandler";

export default class AddRateCard extends Component {
  constructor(props) {
    super(props);
    this.state = { ...this.initialState };
    this.docRef = React.createRef(null);
  }

  initialState = {
    headers: auth.getHeaders(),
    contractStartDate: "",
    contractEndDate: "",
    workerStatus: "",
    currency: "",
    billRatePerHr: "",
    vmsPercentage: "",
    vmsFees: "",
    vmsbillRate: "",
    costToCompanyPerHour: "",
    grossMargin: "",
    netMargin: "",
    slHours: "",
    slCost: "",
    slCostPerHr: "",
    seller: "",
    sellerCommissionRate: "",
    recruiter: "",
    recruiterCommissionRate: "",
    sourcerCommissionRate: "",
    source: "",
    empSubContractor1099: "",
    subContractor: "",
    customer: "",
    maxPTOHrPayPerAnnum: "",
    totCostPTOLeavePerAnnum: "",
    hrCostPTOLeavePerHr: "",
    covidLeaveEligible: "",
    ptoEligible: "",
    sickLeaveEligible: "",
    maxSickHrPayPerAnnum: "",
    totCostSickLeavePerAnnum: "",
    hrCostSickLeavePerHr: "",
    effectiveHrMargin: "",
    costRatePayPerHr: "",
    totalCostAfterPTO: "",
    slPolicy: "",
    workBaseCalculation: "",
    sourcer: "",
    isDeleted: false,
    inputErr: "",
    showModal: false,
    invalidMssg: "",
    client: "",
    clientOptions: [],
    clientId: "",
    workerOptions: [],
    worker: "",
    workerId: "",
    parameterAdminOptions: [],
    parameterSickOptions: [],
    parameterPtoOptions: [],
    adminFeeId: "",
    id: "",
    adminId :"",
    sickFeeId: "",
    sickId :"",
    ptoFeeId: "",
    ptoId : "",
    currentPage: "Bill Details",
    billDetailsRequiredPercent: 0,
    billDetailsRequiredField: {
      workerStatus: false,
      clientId: false,
      workerId: false,
    },
    sellerDetailsRequiredPercent: 0,
    sellerDetailsRequiredfield: {
      seller: false,
    },
    recruiterDetailsRequiredPercent: 0,
    recruiterDetailsRequiredField: {
      recruiter: false,
      source: false,
      customer: false,
      empSubContractor1099: false,
      sourcer: false,
    },
    leaveDetailsRequiredPercent: 0,
    leaveDetailsRequiredField: {
      workBaseCalculation: false,
    },
    currentPercent: 0,
    submitError: "",
    openPopUp: false,
  };

  async componentDidMount() {
    this.getClients(this.state.headers);
    this.getWorkers(this.state.headers);
    this.getAdminParameters(this.state.headers);
    this.getPtoParameters(this.state.headers);
    this.getSickParameters(this.state.headers);
  this.setState({
      setIsActive: true,
      setLogout:false,})
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
          auth.logout();
        }
      });
  };

  getWorkers = () => {
    let headers = JSON.parse(sessionStorage.getItem("headers"));
    axios
      .get(config.serverURL + "/worker/?dropdownFilter=true", {
        headers,
      })
      .then((resp) => {
        const work = resp.data;
        if (resp.data) {
          this.setState({ workerOptions: work });
        }
      })
      .catch((error) => {
        console.log(error);
        if (error.response && error.response.status === 401) {
          auth.logout();
        }
      });
  };

  getAdminParameters = () => {
    let headers = JSON.parse(sessionStorage.getItem("headers"));
    axios
      .get(config.serverURL + "/parameter/adminfee", { headers })
      .then((resp) => {
        const param = resp.data;
        if (resp.data) {
          this.setState({ parameterAdminOptions: param });
        }
      })
      .catch((error) => {
        console.log(error);
        if (error.response && error.response.status === 401) {
          auth.logout();
        }
      });
  };

  getSickParameters = () => {
    let headers = JSON.parse(sessionStorage.getItem("headers"));
    axios
      .get(config.serverURL + "/parameter/sickfee", { headers })
      .then((resp) => {
        const param = resp.data;
        if (resp.data) {
          this.setState({ parameterSickOptions: param });
        }
      })
      .catch((error) => {
        console.log(error);
        if (error.response && error.response.status === 401) {
          auth.logout();
        }
      });
  };

  getPtoParameters = () => {
    let headers = JSON.parse(sessionStorage.getItem("headers"));
    axios
      .get(config.serverURL + "/parameter/ptofee", { headers })
      .then((resp) => {
        const param = resp.data;
        if (resp.data) {
          this.setState({ parameterPtoOptions: param });
        }
      })
      .catch((error) => {
        console.log(error);
        if (error.response && error.response.status === 401) {
          auth.logout();
        }
      });
  };

  currencyChange = (e, validProc = "validateNum") => {
    this.rateCardChange(
      e,
      e.target.name === "billRatePerHr",
      "vmsFees" ? validProc : ""
    );
  };

  resetRateCard = () => {
    this.setState(() => this.initialState);
  };

  showModal = () => {
    this.setState({ show: !this.state.show });
  };

  togglePopUp = () => {
    this.setState({ openPopUp: !this.state.openPopUp });
  };

  submitRateCard = (event) => {
    event.preventDefault();

    const rateCard = {
      contractStartDate: this.state.contractStartDate,
      contractEndDate: this.state.contractEndDate,
      workerStatus: this.state.workerStatus,
      currency: this.state.currency || "USD, $",
      billRatePerHr: this.state.billRatePerHr,
      vmsPercentage: this.state.vmsPercentage,
      vmsFees: this.state.vmsFees,
      vmsbillRate: this.state.vmsbillRate,
      costToCompanyPerHour: this.state.costToCompanyPerHour,
      grossMargin: this.state.grossMargin,
      adminFeeId:
        this.state.adminId === "" ? null : { id: this.state.adminId },
      sickFeeId:
        this.state.sickId === "" ? null : { id: this.state.sickId },
      ptoFeeId: 
        this.state.ptoId === "" ? null : { id: this.state.ptoId },
      netMargin: this.state.netMargin,
      slHours: this.state.slHours,
      slCost: this.state.slCost,
      slCostPerHr: this.state.slCostPerHr,
      seller: this.state.seller,
      sellerCommissionRate: this.state.sellerCommissionRate,
      recruiter: this.state.recruiter,
      recruiterCommissionRate: this.state.recruiterCommissionRate,
      source: this.state.source,
      sourcerCommissionRate: this.state.sourcerCommissionRate,
      empSubContractor1099: this.state.empSubContractor1099,
      subContractor: this.state.subContractor,
      customer: this.state.customer,
      maxPTOHrPayPerAnnum: this.state.maxPTOHrPayPerAnnum,
      totCostPTOLeavePerAnnum: this.state.totCostPTOLeavePerAnnum,
      hrCostPTOLeavePerHr: this.state.hrCostPTOLeavePerHr,
      covidLeaveEligible: this.state.covidLeaveEligible,
      ptoEligible: this.state.ptoEligible,
      sickLeaveEligible: this.state.sickLeaveEligible,
      maxSickHrPayPerAnnum: this.state.maxSickHrPayPerAnnum,
      totCostSickLeavePerAnnum: this.state.totCostSickLeavePerAnnum,
      hrCostSickLeavePerHr: this.state.hrCostSickLeavePerHr,
      effectiveHrMargin: this.state.effectiveHrMargin,
      costRatePayPerHr: this.state.costRatePayPerHr,
      totalCostAfterPTO: this.state.totalCostAfterPTO,
      slPolicy: this.state.slPolicy,
      workBaseCalculation: this.state.workBaseCalculation,
      sourcer: this.state.sourcer,
      isDeleted: false,
      client: this.state.clientId === "" ? null : { id: this.state.clientId },
      worker: this.state.workerId === "" ? null : { id: this.state.workerId },
    };

    const headers = this.state.headers;
    axios
      .post(`${config.serverURL}/ratecard`, rateCard, { headers })

      .then((response) => {
        this.resetRateCard();
        this.setState({ openPopUp: true });
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          submitError: error.response.data,
          openPopUp: true,
        });
        if (error.response && error.response.status === 401) {
          auth.logout();
        }
      });
  };

  rateCardChange = (e, validProc = null) => {
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
    } else if (isValid) {
      let temp = { ...this.state.inputErr };
      delete temp[name];
      this.setState({ inputErr: temp });
    }

    if (
      this.state.billDetailsRequiredPercent !== 100 ||
      this.state.sellerDetailsRequiredPercent !== 100 ||
      this.state.recruiterDetailsRequiredPercent !== 100 ||
      this.state.leaveDetailsRequiredPercent !== 100
    ) {
      const pageName = ["workerStatus", "clientId", "workerId"].includes(name)
        ? "bill"
        : ["seller"].includes(name)
        ? "seller"
        : [
            "recruiter",
            "source",
            "customer",
            "empSubContractor1099",
            "sourcer",
          ].includes(name)
        ? "recruiter"
        : ["workBaseCalculation"].includes(name)
        ? "leave"
        : "";
      if (pageName)
        this.checkRequiredFields(name, !isDeleted ? true : false, pageName);
    }
    this.calcVmsFees(e);
    this.calcVmsbillRate(e);
    this.calcGrossMargin(e);
  };

  calcVmsFees = (e) => {
    const { name, value } = e.target;
    var billRatePerHr = this.state.billRatePerHr;
    var vmsPercentage = this.state.vmsPercentage;
    if (name === "billRatePerHr") billRatePerHr = value;
    if (name === "vmsPercentage") vmsPercentage = value;
    this.setState({
      vmsFees: Number((billRatePerHr * vmsPercentage) / 100).toFixed(2),
    });
  };

  calcVmsbillRate = (e) => {
    const { name, value } = e.target;
    var billRatePerHr = this.state.billRatePerHr;
    var vmsPercentage = this.state.vmsPercentage;
    if (name === "billRatePerHr") billRatePerHr = value;
    if (name === "vmsPercentage") vmsPercentage = value;
    this.setState({
      vmsbillRate: Number(
        billRatePerHr - (billRatePerHr * vmsPercentage) / 100
      ).toFixed(2),
    });
  };

  calcGrossMargin = (e) => {
    const { name, value } = e.target;
    var billRatePerHr = this.state.billRatePerHr;
    var vmsFees = this.state.vmsFees;
    var costToCompanyPerHour = this.state.costToCompanyPerHour;
    if (name === "billRatePerHr") billRatePerHr = value;
    if (name === "vmsFees") vmsFees = value;
    if (name === "costToCompanyPerHour") costToCompanyPerHour = value;
    this.setState({
      grossMargin: Number(
        billRatePerHr - vmsFees - costToCompanyPerHour
      ).toFixed(2),
    });
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
      if (this.state.currentPage === "Bill Details") {
        this.setState({
          currentPercent: this.state.billDetailsRequiredPercent,
        });
      }

      if (this.state.currentPage === "Seller Details") {
        this.setState({
          currentPercent: this.state.sellerDetailsRequiredPercent,
        });
      }
      if (this.state.currentPage === "Recruiter Details") {
        this.setState({
          currentPercent: this.state.recruiterDetailsRequiredPercent,
        });
      }
      if (this.state.currentPage === "Leave Details") {
        this.setState({
          currentPercent: this.state.leaveDetailsRequiredPercent,
        });
      }
    }

    if (
      this.state.billDetailsRequiredField !== prevState.billDetailsRequiredField
    ) {
      let total = 0;
      for (let key in this.state.billDetailsRequiredField) {
        if (this.state.billDetailsRequiredField[key]) total += 33.4;
      }
      this.setState({ currentPercent: total });
      if (!Object.values(this.state.billDetailsRequiredField).includes(false))
        this.setState({ billDetailsRequiredPercent: 100 });
    }

    if (
      this.state.sellerDetailsRequiredField !==
      prevState.sellerDetailsRequiredField
    ) {
      let total = 0;
      for (let key in this.state.sellerDetailsRequiredField) {
        if (this.state.sellerDetailsRequiredField[key]) total += 100;
      }
      this.setState({ currentPercent: total });
      if (!Object.values(this.state.sellerDetailsRequiredField).includes(false))
        this.setState({ sellerDetailsRequiredPercent: 100 });
    }

    if (
      this.state.recruiterDetailsRequiredField !==
      prevState.recruiterDetailsRequiredField
    ) {
      let total = 0;
      for (let key in this.state.recruiterDetailsRequiredField) {
        if (this.state.recruiterDetailsRequiredField[key]) total += 20;
      }
      this.setState({ currentPercent: total });
      if (
        !Object.values(this.state.recruiterDetailsRequiredField).includes(false)
      )
        this.setState({ recruiterDetailsRequiredPercent: 100 });
    }

    if (
      this.state.leaveDetailsRequiredField !==
      prevState.leaveDetailsRequiredField
    ) {
      let total = 0;
      for (let key in this.state.leaveDetailsRequiredField) {
        if (this.state.leaveDetailsRequiredField[key]) total += 100;
      }
      this.setState({ currentPercent: total });
      if (!Object.values(this.state.leaveDetailsRequiredField).includes(false))
        this.setState({ leaveDetailsRequiredPercent: 100 });
    }
  }

  checkRequiredFields = (name, bool, section) => {
    switch (section) {
      case "bill":
        this.setState({
          billDetailsRequiredField: {
            ...this.state.billDetailsRequiredField,
            [name]: bool,
          },
        });
        break;
      case "seller":
        this.setState({
          sellerDetailsRequiredField: {
            ...this.state.sellerDetailsRequiredField,
            [name]: bool,
          },
        });
        break;
      case "recruiter":
        this.setState({
          recruiterDetailsRequiredField: {
            ...this.state.recruiterDetailsRequiredField,
            [name]: bool,
          },
        });
        break;
      case "leave":
        this.setState({
          leaveDetailsRequiredField: {
            ...this.state.leaveDetailsRequiredField,
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

  handleNext = (event) => {
    event.preventDefault();
    if (this.state.workerId && !this.state.clientId) {
      this.setState({ next: this.state.status });
    }
  };

  handleReset = () => {
    this.setState({ next: null, workerId: "" });
  };

  //set current page of form for form nav
  setCurrentPage = (page) => {
    this.setState({ currentPage: page.title });
  };

  closeForm = () => {
    this.props.history.push("/viewratecards");
  };
  openForm = () => {
    this.props.history.push("/viewworkers");
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
                { id: 0, text: "Worker", onClick: () => this.openForm() },
                { id: 1, text: "RateCard", onClick: () => this.closeForm() },
                { id: 2, text: "Add RateCard", lastCrumb: true },
              ]}
            />
          }
        />
        <Content>
          <FormNav
            steps={[
              {
                title: "Bill Details",
                hasRequiredFields: true,
                subTitle: (
                  <span
                    style={{
                      fontSize: "20px",
                      marginBottom: "8px",
                      color: "var(--secondary)",
                    }}
                  >
                    *
                  </span>
                ),
              },
              {
                title: "Seller Details",
                hasRequiredFields: true,
                subTitle: (
                  <span
                    style={{
                      fontSize: "20px",
                      marginBottom: "8px",
                      color: "var(--secondary)",
                    }}
                  >
                    *
                  </span>
                ),
              },
              {
                title: "Recruiter Details",
                hasRequiredFields: true,
                subTitle: (
                  <span
                    style={{
                      fontSize: "20px",
                      marginBottom: "8px",
                      color: "var(--secondary)",
                    }}
                  >
                    *
                  </span>
                ),
              },
              { title: `Leave Details` },
            ]}
            canSubmit={
              this.state.billDetailsRequiredPercent >= 100 &&
              this.state.sellerDetailsRequiredPercent >= 100 &&
              this.state.recruiterDetailsRequiredPercent >= 100 &&
              this.state.leaveDetailsRequiredPercent >= 100
            }
            submit={this.submitRateCard}
            reset={this.resetRateCard}
            setCurrentPage={this.setCurrentPage}
            percent={this.state.currentPercent}
            error={Object.keys(this.state.inputErr).length}
          >
            <Form>
              {this.state.currentPage === "Bill Details" && (
                <Fragment>
              {/* <div style={{display: "flex",alignItems: "center",marginRight: '19px', }}> */}
                  <SingleSelect
                    label="Worker Name"
                    name="workerId"
                    data-testid="worker-options"
                    onChange={(e) => {
                      this.rateCardChange(e);
                      // this.setClientAddr(e.target.value);
                    }}
                    value={this.state.workerId}
                    options={this.state.workerOptions.map((worker) => {
                      let id = worker.id;
                      return {
                        id: id,
                        name: `${worker.firstName} ${worker.lastName}`,
                      };
                    })}
                    required
                  />

                  <Input
                    name="contractStartDate"
                    label="Project Start Date"
                    id="contractStartDate"
                    type="date"
                    max="2999-12-31"
                    onChange={(e) => this.rateCardChange(e)}
                    value={this.state.contractStartDate}
                    errMssg={this.state.inputErr["contractStartDate"]}
                  />
                  <Input
                    name="contractEndDate"
                    label="Project End Date"
                    id="contractEndDate"
                    type="date"
                    max="2999-12-31"
                    onChange={(e) => this.rateCardChange(e)}
                    value={this.state.contractEndDate}
                    errMssg={this.state.inputErr["contractEndDate"]}
                  />

                  <Input
                    type="text"
                    label="Worker Status"
                    name="workerStatus"
                    value={this.state.workerStatus}
                    onChange={(e) => this.rateCardChange(e, "validateName")}
                    maxLength="20"
                    errMssg={this.state.inputErr["workerStatus"]}
                    required
                  />
                  <SingleSelect
                    label="Client"
                    name="clientId"
                    data-testid="client-options"
                    onChange={(e) => {
                      this.rateCardChange(e);
                    }}
                    value={this.state.clientId}
                    options={this.state.clientOptions.map((client) => {
                      let id = client.id;
                      return {
                        id: id,
                        name: `${client.clientName} (${
                          client.address?.city || ""
                        })`,
                      };
                    })}
                    required
                  />
                  {/* </div> */}
                  {/* <div style={{display: "flex",alignItems: "center",marginRight: '19px', }}> */}
                  <InputCurrencyRate
                    label="Bill Rate Per Hr "
                    id="currency"
                    type="number"
                    pattern="[0-9]*"
                    nameCurrency="currency"
                    nameRate="billRatePerHr"
                    handleChange={this.currencyChange}
                    onChange={(e) => {
                      this.rateCardChange(e, "validateHasDecimal");
                      this.calcVmsFees(e);
                      this.calcGrossMargin(e);
                    }}
                    valueCurrency={this.state.currency}
                    valueRate={Number(this.state.billRatePerHr).toFixed(2)}
                    required
                  ></InputCurrencyRate>

                  <Input
                    type="number"
                    name="vmsPercentage"
                    className="numAlign"
                    label="VMS Fees %"
                    pattern="[0-9]*"
                    onChange={(e) => {
                      this.rateCardChange(e, "validateHasDecimal");
                      this.calcVmsFees(e);
                      this.calcVmsbillRate(e);
                      this.calcGrossMargin(e);
                    }}
                    value={Number(this.state.vmsPercentage).toFixed(2)}
                  />

                  <InputCurrencyRate
                    label="VMS Fees"
                    id="currency"
                    type="number"
                    pattern="[0-9]*"
                    nameCurrency="currency"
                    nameRate="vmsFees"
                    handleChange={this.currencyChange}
                    onChange={(e) => {
                      this.rateCardChange(e);
                      this.calcVmsbillRate(e);
                      this.calcGrossMargin(e);
                    }}
                    valueCurrency={this.state.currency}
                    valueRate={Number(this.state.vmsFees).toFixed(2)}
                    required
                  ></InputCurrencyRate>

                  <InputCurrencyRate
                    label="VMS Bill Rate"
                    id="currency"
                    type="number"
                    pattern="[0-9]*"
                    nameCurrency="currency"
                    nameRate="vmsbillRate"
                    handleChange={this.currencyChange}
                    onChange={(e) => {
                      this.rateCardChange(e);
                      this.calcGrossMargin(e);
                    }}
                    valueCurrency={this.state.currency}
                    valueRate={Number(this.state.vmsbillRate).toFixed(2)}
                    required
                  ></InputCurrencyRate>

                  <InputCurrencyRate
                    label="Cost To Company Per Hr"
                    id="currency"
                    type="number"
                    pattern="[0-9]*"
                    nameCurrency="currency"
                    nameRate="costToCompanyPerHour"
                    handleChange={this.currencyChange}
                    onChange={(e) => {
                      this.rateCardChange(e, "validateHasDecimal");
                      this.calcGrossMargin(e);
                    }}
                    valueCurrency={this.state.currency}
                    valueRate={Number(this.state.costToCompanyPerHour).toFixed(
                      2
                    )}
                    required
                  ></InputCurrencyRate>
{/* </div> */}
              {/* <div style={{display: "flex",alignItems: "center",marginRight: '19px', }}> */}
                  <Input
                    type="number"
                    name="grossMargin"
                    className="numAlign"
                    label="Gross Margin"
                    pattern="[0-9]*"
                    onChange={(e) => {
                      this.rateCardChange(e);
                      this.calcVmsbillRate(e);
                    }}
                    value={Number(this.state.grossMargin).toFixed(2)}
                  />
                  <SingleSelect
                    label="Admin Fees Type"
                    name="adminId"
                    data-testid="parameter-options"
                    onChange={(e) => {
                      this.rateCardChange(e);
                    }}
                    value={this.state.adminId}
                    options={this.state.parameterAdminOptions.map((parameter) => {
                      let adminId = parameter.id;
                      return {
                        id: adminId,
                        name: `${parameter.paramLevel}  ${parameter.paramValue}`,
                      };
                    })}
                    required
                  />
                  <Input
                    type="number"
                    name="netMargin"
                    className="numAlign"
                    label="Net Margin"
                    pattern="[0-9]*"
                    onChange={(e) =>
                      this.rateCardChange(e, "validateHasDecimal")
                    }
                    value={Number(this.state.netMargin).toFixed(2)}
                    errMssg={this.state.inputErr["netMargin"]}
                  />
                  {/* </div> */}
                </Fragment>
              )}
              {this.state.currentPage === "Seller Details" && (
                <Fragment>
                  <Input
                    type="text"
                    name="seller"
                    label="Seller"
                    onChange={(e) => this.rateCardChange(e, "validateName")}
                    value={this.state.seller}
                    errMssg={this.state.inputErr["seller"]}
                    required
                  />

                  <Input
                    type="number"
                    name="sellerCommissionRate"
                    className="numAlign"
                    label="Seller Commission Rate "
                    pattern="[0-9]*"
                    onChange={(e) =>
                      this.rateCardChange(e, "validateHasDecimal")
                    }
                    value={Number(this.state.sellerCommissionRate).toFixed(2)}
                    errMssg={this.state.inputErr["sellerCommissionRate"]}
                  />
                </Fragment>
              )}
              {this.state.currentPage === "Recruiter Details" && (
                <Fragment>
                  <Input
                    type="text"
                    name="recruiter"
                    label="Recruiter"
                    onChange={(e) => this.rateCardChange(e, "validateName")}
                    value={this.state.recruiter}
                    errMssg={this.state.inputErr["recruiter"]}
                    required
                  />
                  <Input
                    type="number"
                    name="recruiterCommissionRate"
                    label="Recruiter Commission Rate "
                    className="numAlign"
                    pattern="[0-9]*"
                    onChange={(e) =>
                      this.rateCardChange(e, "validateHasDecimal")
                    }
                    value={Number(this.state.recruiterCommissionRate).toFixed(
                      2
                    )}
                    errMssg={this.state.inputErr["recruiterCommissionRate"]}
                  />
                  <Input
                    type="text"
                    name="empSubContractor1099"
                    label="EmployeeSubCOntractor1099"
                    onChange={(e) => this.rateCardChange(e, "validateName")}
                    value={this.state.empSubContractor1099}
                    errMssg={this.state.inputErr["empSubContractor1099"]}
                    required
                  />
                  <SingleSelect
                    label="Pass Thur"
                    name="source"
                    value={this.state.source}
                    onChange={(e) => this.rateCardChange(e)}
                    options={[
                      { id: "Yes", value: "Yes", name: "Yes" },
                      { id: "No", value: "No", name: "No" },
                    ]}
                    required
                  />
                  <SingleSelect
                    label="SubContractor"
                    name="subContractor"
                    value={this.state.subContractor}
                    onChange={(e) => this.rateCardChange(e)}
                    options={[
                      { id: "Yes", value: "Yes", name: "Yes" },
                      { id: "No", value: "No", name: "No" },
                    ]}
                  />
                  <Input
                    type="text"
                    name="sourcer"
                    label="Sourcer"
                    onChange={(e) => this.rateCardChange(e, "validateName")}
                    value={this.state.sourcer}
                    errMssg={this.state.inputErr["sourcer"]}
                    required
                  />
                  <Input
                    type="number"
                    name="sourcerCommissionRate"
                    label="Sourcer Commission Rate "
                    className="numAlign"
                    pattern="[0-9]*"
                    onChange={(e) =>
                      this.rateCardChange(e, "validateHasDecimal")
                    }
                    value={Number(this.state.sourcerCommissionRate).toFixed(2)}
                    errMssg={this.state.inputErr["sourcerCommissionRate"]}
                  />
                  <Input
                    type="text"
                    name="customer"
                    label="VMS Provider"
                    onChange={(e) => this.rateCardChange(e)}
                    value={this.state.customer}
                    required
                    errMssg={this.state.inputErr["customer"]}
                  />
                </Fragment>
              )}
              {this.state.currentPage === "Leave Details" && (
                <Fragment>
                  <Input
                    type="number"
                    name="slHours"
                    label="Sick Leave Hrs"
                    className="numAlign"
                    pattern="[0-9]*"
                    onChange={(e) =>
                      this.rateCardChange(e, "validateHasDecimal")
                    }
                    value={Number(this.state.slHours).toFixed(2)}
                    errMssg={this.state.inputErr["slHours"]}
                  />
                  <Input
                    type="number"
                    name="slCost"
                    label="Sick Leave Cost"
                    className="numAlign"
                    pattern="[0-9]*"
                    onChange={(e) =>
                      this.rateCardChange(e, "validateHasDecimal")
                    }
                    value={Number(this.state.slCost).toFixed(2)}
                    errMssg={this.state.inputErr["slCost"]}
                  />
                  <Input
                    type="number"
                    name="slCostPerHr"
                    label="Sick Leave Cost Per Hr"
                    className="numAlign"
                    pattern="[0-9]*"
                    onChange={(e) =>
                      this.rateCardChange(e, "validateHasDecimal")
                    }
                    value={Number(this.state.slCostPerHr).toFixed(2)}
                    errMssg={this.state.inputErr["slCostPerHr"]}
                  />
                  <Input
                    type="number"
                    name="maxSickHrPayPerAnnum"
                    className="numAlign"
                    label="Max Sick Hr Pay Per Annum"
                    pattern="[0-9]*"
                    onChange={(e) =>
                      this.rateCardChange(e, "validateHasDecimal")
                    }
                    value={Number(this.state.maxSickHrPayPerAnnum).toFixed(2)}
                    errMssg={this.state.inputErr["maxSickHrPayPerAnnum"]}
                  />
                  <Input
                    type="number"
                    name="totCostSickLeavePerAnnum"
                    className="numAlign"
                    label="Total Cost Sick Leave Per Annum"
                    pattern="[0-9]*"
                    onChange={(e) =>
                      this.rateCardChange(e, "validateHasDecimal")
                    }
                    value={Number(this.state.totCostSickLeavePerAnnum).toFixed(
                      2
                    )}
                    errMssg={this.state.inputErr["totCostSickLeavePerAnnum"]}
                  />
                  <Input
                    type="number"
                    name="hrCostSickLeavePerHr"
                    className="numAlign"
                    label="Hr Cost Sick Leave Per Hr"
                    pattern="[0-9]*"
                    onChange={(e) =>
                      this.rateCardChange(e, "validateHasDecimal")
                    }
                    value={Number(this.state.hrCostSickLeavePerHr).toFixed(2)}
                    errMssg={this.state.inputErr["hrCostSickLeavePerHr"]}
                  />

                 <SingleSelect
                    label="Sick Level Type"
                    name="sickId"
                    data-testid="parameter-options"
                    onChange={(e) => {
                      this.rateCardChange(e);
                    }}
                    value={this.state.sickId}
                    options={this.state.parameterSickOptions.map((parameter) => {
                      let sickId = parameter.id;
                      return {
                        id: sickId,
                        name: `${parameter.paramLevel}  ${parameter.paramValue}`,
                      };
                    })}
                    required
                  />

                  <SingleSelect
                    label="Sick Leave Eligible"
                    name="sickLeaveEligible"
                    value={this.state.sickLeaveEligible}
                    onChange={(e) => this.rateCardChange(e)}
                    options={[
                      { id: "Yes", value: "Yes", name: "Yes" },
                      { id: "No", value: "No", name: "No" },
                    ]}
                  />
                  <SingleSelect
                    label="Sick Leave Policy"
                    name="slPolicy"
                    value={this.state.slPolicy}
                    onChange={(e) => this.rateCardChange(e)}
                    options={[
                      { id: "Yes", value: "Yes", name: "Yes" },
                      { id: "No", value: "No", name: "No" },
                    ]}
                  />
                  {/* <SingleSelect
                    label="PTO Level"
                    name="ptoLevel"
                    value={this.state.ptoLevel}
                    onChange={(e) => this.rateCardChange(e)}
                    options={[
                      { id: "0", value: "Level 0", name: "Level 0" },
                      { id: "1", value: "Level 1", name: "Level 1" },
                      { id: "2", value: "Level 2", name: "Level 2" },
                      { id: "3", value: "Level 3", name: "Level 3" },
                      { id: "4", value: "Level 4", name: "Level 4" },
                    ]}
                  /> */}

             <SingleSelect
                    label="PTO Level Type"
                    name="ptoId"
                    data-testid="parameter-options"
                    onChange={(e) => {
                      this.rateCardChange(e);
                    }}
                    value={this.state.ptoId}
                    options={this.state.parameterPtoOptions.map((parameter) => {
                      let ptoId = parameter.id;
                      return {
                        id: ptoId,
                        name: `${parameter.paramLevel}  ${parameter.paramValue}`,
                      };
                    })}
                    required
                  />
                  <Input
                    type="number"
                    name="maxPTOHrPayPerAnnum"
                    label="Max PTO Hr Pay Per Annum"
                    className="numAlign"
                    pattern="[0-9]*"
                    onChange={(e) =>
                      this.rateCardChange(e, "validateHasDecimal")
                    }
                    value={Number(this.state.maxPTOHrPayPerAnnum).toFixed(2)}
                    errMssg={this.state.inputErr["maxPTOHrPayPerAnnum"]}
                  />
                  <Input
                    type="number"
                    name="totCostPTOLeavePerAnnum"
                    label="Total Cost PTO Leave Per Annum"
                    className="numAlign"
                    pattern="[0-9]*"
                    onChange={(e) =>
                      this.rateCardChange(e, "validateHasDecimal")
                    }
                    value={Number(this.state.totCostPTOLeavePerAnnum).toFixed(
                      2
                    )}
                    errMssg={this.state.inputErr["totCostPTOLeavePerAnnum"]}
                  />
                  <Input
                    type="number"
                    name="hrCostPTOLeavePerHr"
                    label="Hr Cost PTO Leave Per Annum"
                    pattern="[0-9]*"
                    className="numAlign"
                    onChange={(e) =>
                      this.rateCardChange(e, "validateHasDecimal")
                    }
                    value={Number(this.state.hrCostPTOLeavePerHr).toFixed(2)}
                    errMssg={this.state.inputErr["hrCostPTOLeavePerHr"]}
                  />
                  <Input
                    type="number"
                    name="totalCostAfterPTO"
                    label="Total Cost After PTO"
                    className="numAlign"
                    pattern="[0-9]*"
                    onChange={(e) =>
                      this.rateCardChange(e, "validateHasDecimal")
                    }
                    value={Number(this.state.totalCostAfterPTO).toFixed(2)}
                    errMssg={this.state.inputErr["totalCostAfterPTO"]}
                  />

                  <SingleSelect
                    label="PTO Eligible"
                    name="ptoEligible"
                    value={this.state.ptoEligible}
                    onChange={(e) => this.rateCardChange(e)}
                    options={[
                      { id: "Yes", value: "Yes", name: "Yes" },
                      { id: "No", value: "No", name: "No" },
                    ]}
                  />
                  <Input
                    type="number"
                    name="effectiveHrMargin"
                    label="Effective Hr Margin"
                    className="numAlign"
                    pattern="[0-9]*"
                    onChange={(e) =>
                      this.rateCardChange(e, "validateHasDecimal")
                    }
                    value={Number(this.state.effectiveHrMargin).toFixed(2)}
                    errMssg={this.state.inputErr["effectiveHrMargin"]}
                  />
                  <Input
                    type="number"
                    name="costRatePayPerHr"
                    className="numAlign"
                    label="Cost Rate Pay Per Hr"
                    pattern="[0-9]*"
                    onChange={(e) =>
                      this.rateCardChange(e, "validateHasDecimal")
                    }
                    value={Number(this.state.costRatePayPerHr).toFixed(2)}
                    errMssg={this.state.inputErr["costRatePayPerHr"]}
                  />
                  <SingleSelect
                    label="Covid Leave Eligible"
                    name="covidLeaveEligible"
                    value={this.state.covidLeaveEligible}
                    onChange={(e) => this.rateCardChange(e)}
                    options={[
                      { id: "Yes", value: "Yes", name: "Yes" },
                      { id: "No", value: "No", name: "No" },
                    ]}
                  />
                  <Input
                    type="text"
                    name="workBaseCalculation"
                    label="Work Base Calculation"
                    onChange={(e) => this.rateCardChange(e, "validateName")}
                    value={this.state.workBaseCalculation}
                    errMssg={this.state.inputErr["workBaseCalculation"]}
                    required
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
                : "rateCard Added Succesfully",
              details: this.state.submitError
                ? `Error while saving record ${this.state.submitError}`
                : "To view rateCard go to ",
            }}
            link={
              this.state.submitError ? (
                ""
              ) : (
                <Link to="viewratecards">RateCard</Link>
              )
            }
          />
        </Content>
      </PageContainer>
    );
  }
}
