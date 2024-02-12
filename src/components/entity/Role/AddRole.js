import React, { Component } from "react";
import { Link } from "react-router-dom";
import Content from "../../container/content-container/content-container.component";
import Form from "../../common/form/form.component";
import Input from "../../common/input/inputs.component";
import PopUp from "../../modal/popup/popup.component";
import Breadcrumbs from "../../common/breadcrumbs/breadcrumbs.component";
import { postRoles } from "../../../API/roles/role_apis";
import { PageContainer } from "../../container/page-container/PageContainer";
import { PageHeader } from "../../container/page-header/PageHeader";
import { Alert } from "antd";
import { message } from "antd";
import { Switch } from "antd";
import "./role.css";
import ExpandableTable from "../../ui/expandable-table/expandable-table.component";

export default class AddRole extends Component {
  constructor(props) {
    super(props);
    this.state = { ...this.initialState, navMenuOpen: props.navMenuOpen };
  }

  initialState = {
    roleName: "",
    show: false,
    errMssg: "",
    inputErr: "",
    manager: false,
    worker: false,
    candidates: false,
    client: false,
    suppliers: false,
    jobOpenings: false,
    interviews: false,
    onBoardings: false,
    managerPermission: false,
    candidatePermission: false,
    workerPermission: false,
    clientPermission: false,
    jobOpeningsPermission: false,
    interviewsPermission: false,
    suppliersPermission: false,
    onBoardingsPermission: false,
    settingsPermission: false,
    projectsPermission: false,
    workOrderPermission: false,
    timesheetPermission: false,
    calendarPermission: false,
    projects: false,
    workOrder: false,
    timesheet: false,
    calendar: false,
    settings: false,
  };

  closeForm = () => {
    this.props.history.push("/viewroles");
  };
  componentDidUpdate(prevProps) {
    if (this.props.navMenuOpen !== prevProps.navMenuOpen)
      this.setState({ navMenuOpen: this.props.navMenuOpen });
  }
  resetRole = () => {
    this.setState(() => this.initialState);
    this.closeForm();
  };

  toggleSuccessPopUp = () => {
    this.setState({ show: this.state.show });
  };

  handlePermissionChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  submitRole = (event) => {
    event.preventDefault();

    const roles = {
      roleName: this.state.roleName,
      managerPermission: this.state.managerPermission,
      candidatePermission: this.state.candidatePermission,
      workerPermission: this.state.workerPermission,
      clientPermission: this.state.clientPermission,
      jobOpeningsPermission: this.state.jobOpeningsPermission,
      interviewsPermission: this.state.interviewsPermission,
      suppliersPermission: this.state.suppliersPermission,
      onBoardingsPermission: this.state.onBoardingsPermission,
      settingsPermission: this.state.settingsPermission,
      manager: this.state.manager,
      candidates: this.state.candidates,
      worker: this.state.worker,
      client: this.state.client,
      jobOpenings: this.state.jobOpenings,
      interviews: this.state.interviews,
      suppliers: this.state.suppliers,
      onBoardings: this.state.onBoardings,
      settings: this.state.settings,
      projectsPermission: this.state.projectsPermission,
      workOrderPermission: this.state.workOrderPermission,
      timesheetPermission: this.state.timesheetPermission,
      calendarPermission: this.state.calendarPermission,
      projects: this.state.projects,
      workOrder: this.state.workOrder,
      timesheet: this.state.timesheet,
      calendar: this.state.calendar,
    };
    console.log(roles);
    let headers = JSON.parse(sessionStorage.getItem("headers"));
    postRoles(headers, roles).then((res) => {
      if (res.status === 201) {
        message.success("Role Created Successfully");
        this.goBack("viewroles");
      }
      // if (res.data) this.setState(this.initialState);
      if (res.err)
        this.setState({
          errMssg: `Error, could not create role: ${res.err}`,
        });
    });
  };

  rolesChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
    this.roleNamecharAllow(event.target.value);
  };

  roleNamecharAllow(value) {
    const regex = /[^a-zA-Z]/gi;
    if (regex.test(value) && value !== "") {
      this.setState({ inputErr: "Invalid character, only letters accepted" });
    } else {
      this.setState({ inputErr: "" });
    }
  }
  handleSwitch = (event) => {
    const { name } = event.target;
    this.setState({ [name]: event.target.switch });
  };
 

  goBack = (url) => {
    this.props.history.push(url);
  };

  render() {
    const { roleName } = this.state;
    console.log(this.state.manager, this.state.managerPermission);
    return (
      <PageContainer>
        <PageHeader
          breadcrumbs={
            <Breadcrumbs
              className="header"
              crumbs={[
                {
                  id: 0,
                  text: "Users",
                  onClick: () => this.goBack("viewusers"),
                },
                {
                  id: 1,
                  text: "Roles",
                  onClick: () => this.goBack("viewroles"),
                },
                { id: 2, text: "Add Role", lastCrumb: true },
              ]}
            />
          }
        />
        <Content>
          <div className="role-alert">
            <Alert
              type="warning"
              showIcon
              message={
                <span>
                  Before creating any roles please check the existing roles in{" "}
                  <Link to="viewroles">View Roles</Link>. Duplicates are not
                  allowed (roles are case-sensitive).
                </span>
              }
            />
            {this.state.errMssg && (
              <Alert type="error" showIcon message={this.state.errMssg} />
            )}
          </div>

          <Form
            cancel={this.resetRole}
            onSubmit={this.submitRole}
            formEnabled={true}
            className="centered"
          >
            <div
              style={{
                justifyContent: "space-between",
                flexDirection: "column",
                display: "flex",
                width: 465,
              }}
            >
              <div style={{ width: 500, marginBottom: 5, marginLeft: 115 }}>
                <Input
                  type="text"
                  label="Role Name"
                  name="roleName"
                  value={roleName}
                  onChange={this.rolesChange}
                  maxLength="20"
                  errMssg={this.state.inputErr}
                  required
                />
              </div>

              <ExpandableTable
                headers={[
                  { label: "Module Name" },
                  { label: "Visibility" },
                  { label: "Permission" },
                ]}
                body={[
                  {
                    id: 1,
                    key: "key",
                    cells: [
                      {
                        id: 0,
                        className: "cell",
                        data: [
                          { label: "manager", name: "manager" },
                          { label: "candidates", name: "candidates" },
                          { label: "worker", name: "worker" },
                          { label: "client", name: "client" },
                          { label: "job Openings", name: "jobOpenings" },
                          { label: "interviews", name: "interviews" },
                          { label: "suppliers", name: "suppliers" },
                          { label: "on Boardings", name: "onBoardings" },
                          { label: "projects", name: "projects" },
                          { label: "timesheet", name: "timesheet" },
                          { label: "calendar", name: "calendar" },
                          { label: "work Order", name: "workOrder" },
                          { label: "settings", name: "settings" },
                        ].map((item) => (
                          <div style={{}}>
                            <h5 key={item.name}>{item.label.toUpperCase()}</h5>
                          </div>
                        )),
                      },
                      {
                        id: 1,
                        data: [
                          { label: "manager", name: "manager" },
                          { label: "candidates", name: "candidates" },
                          { label: "worker", name: "worker" },
                          { label: "client", name: "client" },
                          { label: "job Openings", name: "jobOpenings" },
                          { label: "interviews", name: "interviews" },
                          { label: "suppliers", name: "suppliers" },
                          { label: "on Boardings", name: "onBoardings" },
                          { label: "projects", name: "projects" },
                          { label: "timesheet", name: "timesheet" },
                          { label: "calendar", name: "calendar" },
                          { label: "work Order", name: "workOrder" },
                          { label: "settings", name: "settings" },
                        ].map((item) => (
                          <div
                            style={{
                            
                              marginBottom: 5.5,
                            }}
                          >
                            <Switch
                              key={item.name}
                              label={item.label}
                              onChange={(value) =>
                                this.setState({
                                  [item.name]: value ? true : false,
                                })
                              }
                              checked={this.state[item.name]}
                              size="small"
                            />
                          </div>
                        )),
                      },
                      {
                        id: 2,
                        data: [
                          { label: "manager", name: "managerPermission" },
                          { label: "candidate", name: "candidatePermission" },
                          { label: "worker", name: "workerPermission" },
                          { label: "client", name: "clientPermission" },
                          {
                            label: "jobOpenings",
                            name: "jobOpeningsPermission",
                          },
                          { label: "interviews", name: "interviewsPermission" },
                          { label: "suppliers", name: "suppliersPermission" },
                          {
                            label: "onBoardings",
                            name: "onBoardingsPermission",
                          },
                          { label: "projects", name: "projectsPermission" },
                          { label: "timesheet", name: "timesheetPermission" },
                          { label: "calendar", name: "calendarPermission" },
                          { label: "workOrder", name: "workOrderPermission" },
                          { label: "settings", name: "settingsPermission" },
                        ].map((item) => (

                          <div key={item.name} style={{ marginBottom: 5.5 }}>
                            <Switch
                              checkedChildren="Editable"
                              unCheckedChildren="Read Only"
                              key={item.name}
                              label={item.label}
                              onChange={(value) =>
                                this.setState({
                                  [item.name]: value ? true : false,
                                })
                              }
                              checked={this.state[item.name]}
                              size="small"
                              disabled={
                                (item.name.includes("manager") &&
                                  !this.state.manager) ||
                                (item.name.includes("candidate") &&
                                  !this.state.candidates) ||
                                (item.name.includes("worker") &&
                                  !this.state.worker) ||
                                (item.name.includes("client") &&
                                  !this.state.client) ||
                                (item.name.includes("jobOpenings") &&
                                  !this.state.jobOpenings) ||
                                (item.name.includes("interviews") &&
                                  !this.state.interviews) ||
                                (item.name.includes("suppliers") &&
                                  !this.state.suppliers) ||
                                (item.name.includes("onBoardings") &&
                                  !this.state.onBoardings) ||
                                (item.name.includes("settings") &&
                                  !this.state.settings) ||
                                (item.name.includes("projects") &&
                                  !this.state.projects) ||
                                (item.name.includes("workOrder") &&
                                  !this.state.workOrder) ||
                                (item.name.includes("timesheet") &&
                                  !this.state.timesheet) ||
                                (item.name.includes("calendar") &&
                                  !this.state.calendar)
                              }
                            />
                          </div>
                          // :""
                        )),
                      },
                    ],
                  },
                ]}
              />
            </div>
          </Form>

          <PopUp
            openModal={this.state.show}
            closePopUp={this.toggleSuccessPopUp}
            handleConfirmClose={this.toggleSuccessPopUp}
            confirmValue="Ok"
            message={{
              title: `Success`,
              details: `Role created succesfully.`,
            }}
          />
        </Content>
      </PageContainer>
    );
  }
}
