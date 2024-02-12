import React, { Component, Fragment } from "react";
import { config } from "../../../config.js";
import Content from "../../container/content-container/content-container.component";
import Form from "../../common/form/form.component";
import Input from "../../common/input/inputs.component";
import Breadcrumbs from "../../common/breadcrumbs/breadcrumbs.component";
import PopUp from "../../modal/popup/popup.component";
import { Link } from "react-router-dom";
import { PageContainer } from "../../container/page-container/PageContainer";
import { PageHeader } from "../../container/page-header/PageHeader";
import axios from "axios";
import { runValidation } from "../../../utils/validation";
import AuthService from "../../../utils/AuthService.js";
import { message } from "antd";
import IdleTimeOutHandler from "../../ui/Dashboard/IdleTimeOutHandler";
import SingleSelect from "../../common/select/selects.component.jsx";
import"./project.css";
export default class AddProjects extends Component {
  constructor(props) {
    super(props);
    
this.state = {
  ...this.initialState
 };
 this.sumbitprojects = this.sumbitprojects.bind(this);
this.projectChange = this.projectChange.bind(this);
  
  };

  initialState = {
    projectName: "",
    hiringManager:"",
    clientOptions: [],
    workerOptions: [],
    clientName:"",
    clientId: "",
    workerId :"",
    resourceManagerOptions: [],
    resourceManager: "",
    resourceManagerId: "",
    worker:"",
    client: "",
    workerName:"",
    clientRate: "",
    billRate: "",
    netBillRate: "",
    billRateType: "",
    startDate: "",
    endDate: "",
    activeDate: "",
    state: "",
    preBillRate: "",
    preNetBillRate: "",
    isDeleted: false, 
    inputErr: "",
  };

  getWorkers = () => {
    let headers = JSON.parse(sessionStorage.getItem("headers"));
    axios
      .get(config.serverURL + "/worker?dropdownFilter=true", {
        headers,
      })
      .then((resp) => {
        const cand = resp.data;

        if (resp.data) {
          this.setState({ workerOptions: cand });
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
      .get(config.serverURL + "/resourcemanager?dropdownFilter=true&role=SALESMANAGER", { headers })
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

 

  // handleNext(event) {
  //   event.preventDefault();
  //   if (this.state.status && !this.state.projectId) {
  //     this.setState({ next: this.state.status });
  //   }
  // };

  
  projectChange = (e, validProc = null) => {
    const isDeleted = e.target.value === "";
    const isValid = runValidation(validProc, e.target.value, e.target.max);
    if (isDeleted || isValid)
      this.setState({ [e.target.name]: e.target.value });
  };

  showModal = () => {
    this.setState({ show: !this.state.show });
  };

  resetProjects = () => {
    this.setState(() => this.initialState);
  };

  closeForm = () => {
    this.props.history.push("/viewprojects");
  };
  closePopUp = () => {
    this.setState({ show: false });
  };

  togglePopUp = () => {
    this.setState({ openPopUp: !this.state.openPopUp });
  };
  sumbitprojects(event) {
    event.preventDefault();

    const projects = {
      projectName: this.state.projectName,
      hiringManager: this.state.hiringManager,
      client: this.state.clientId === "" ? null : { id: this.state.clientId },
      worker: this.state.workerId === "" ? null : { id: this.state.workerId },
      resourceManager: this.state.resourceManagerId === "" ? null :{resourceManagerId : this.state.resourceManagerId},
      clientRate: this.state.clientRate,
      billRate: this.state.billRate,
      netBillRate: this.state.netBillRate,
      billRateType: this.state.billRateType,
      startDate: this.state.startDate,
      endDate: this.state.endDate,
      activeDate: this.state.activeDate,
      state: this.state.state,
      preBillRate: this.state.preBillRate,
      preNetBillRate: this.state.preNetBillRate,
      isDeleted: false,


    };

    let headers = JSON.parse(sessionStorage.getItem("headers"));
    axios
    .post(`${config.serverURL}/projects`, projects, { headers })
    .then((response) => {
      console.log(projects)
      if (response.data != null) {
        this.resetProjects();
        this.setState({
          
          show: true,
          message: "To view projects go to ",
          status: "Success",
        });
      }
    })
    .catch((err) => {
      this.setState({
        show: true,
        message: err.response.data,
        status: "Error in adding",
      });
      console.log(err);
      });
  };

  componentDidMount() {
    this.getClients();
    this.getWorkers();
    this.getResourceManager();
      this.setState({
      setIsActive: true,
      setLogout:false})
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









  render() {
    const {
      clientId,
      workerId,
      resourceManagerId,
    } = this.state;
    return (
      
      <PageContainer>
        <PageHeader
          breadcrumbs={
            <Breadcrumbs
              className="header"
              crumbs={[
                { id: 0, text: "Projects", onClick: () => this.closeForm() },
                { id: 1, text: "Add Projects", lastCrumb: true },
              ]}
            />
          }
        />
        <Content>
          
             <Form
            onSubmit={this.sumbitprojects}
            formEnabled={true}
            cancel={this.resetProjects}

          >
                <Fragment>


                <SingleSelect
                  label="Client"
                  name="clientId"
                  data-testid="client-options"
                  onChange={(e) => {
                    this.projectChange(e);
                    this.setClientAddr(e.target.value);
                  }}
                  value={clientId}
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

<Input
        label="Project Name"
        type="text"
        name="projectName"
        onChange={(e) => this.projectChange(e,"validateName")}
        value={this.state.projectName}        
        required
  /> 

        <Input
        label="Hiring Manager"
        type="text"
        name="hiringManager"
        onChange={(e) => this.projectChange(e,"validateName")}
        value={this.state.hiringManager}
        // errMssg={this.state.inputErr["hiringManager"]}

      />
         <SingleSelect
                  label="Resource Manager"
                  name="resourceManagerId"
                  data-testid="resourceManager-options"
                  onChange={(e) => {
                    this.projectChange(e);
                  }}
                  value={resourceManagerId}
                  options={this.state.resourceManagerOptions.map((resourceManager) => {
                    let id = resourceManager.resourceManagerId;
                    return {
                      id: id,
                      name: `${resourceManager.firstName} ${resourceManager.lastName}`
                   };
                  })}
                  required
                />

                 

<Input
                    type="date"
                    label="Start Date"
                    name="startDate"
                    id="startDate"
                    max="2999-12-31"
                    value={this.state.startDate}
                    onChange={(e) => this.projectChange(e)}
                    errMssg={this.state.inputErr["startDate"]}

                  />


                   <Input
                    type="date"
                    label="End Date"
                    name="endDate"
                    id="endDate"
                    max="2999-12-31"
                    value={this.state.endDate}
                    onChange={(e) => this.projectChange(e)}
                    errMssg={this.state.inputErr["endDate"]}

                  />
                 
              
                
       <Input
                 type="text"
                 label="client Rate"
                 name="clientRate"
                 value={Number(this.state.clientRate).toFixed(2)}
                 onChange={(e) => this.projectChange(e,"validateHasDecimal")}
                 style={{ textAlign: 'right' }}
                 className="right-align"

                /> 
                  <Input
                   type="text"
                   label="VMS Adjusted
                   Bill Rate"
                   name="billRate"
                   value={Number(this.state.billRate).toFixed(2)}
                   onChange={(e) => this.projectChange(e,"validateHasDecimal")}
                   className="right-align"
                      />

                    
                 <Input
                 type="text"
                 label="Rebate Adjusted
                 Bill Rate"
                 name="netBillRate"
                 value={Number(this.state.netBillRate).toFixed(2)}
                 onChange={(e) => this.projectChange(e,"validateHasDecimal")}
                 required
                 className="right-align"
                /> 


               
<SingleSelect
                  label="worker"
                  name="workerId"
                  data-testid="worker-options"
                  onChange={(e) => {
                    this.projectChange(e);
                  }}
                  value={workerId}
                  options={this.state.workerOptions.map((worker) => {
                    let id = worker.id;
                    return {
                      id: id,
                      name: `${worker?.firstName} ${worker?.lastName}`,
                    };
                  })}
                  required
                  />
  
                </Fragment>
              
              
            </Form>
          <PopUp
           openModal={this.state.show}
           closePopUp={this.closePopUp}
           type={this.state?.status}
           message={{
             title:
               this.state?.status === "Error"
                 ? "Error"
                 : "projects Added Succesfully",
             details: this.state?.message,
           }}
            link={
              this.state?.status === "Error" ? (
                ""
              ) : (
                <Link to="viewprojects">projects</Link>
              )
            }
          />
        </Content>
      </PageContainer>
    );
  }
}
