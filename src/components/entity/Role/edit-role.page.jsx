import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useHistory, useParams } from "react-router-dom";
import { runValidation } from "../../../utils/validation";
import { useSelector, useDispatch } from "react-redux";
import Content from "../../container/content-container/content-container.component.jsx";
import Form from "../../common/form/form.component.jsx";
import Input from "../../common/input/inputs.component";
import Breadcrumbs from "../../common/breadcrumbs/breadcrumbs.component.jsx";
import "./edit-role.page.styles.css";
import PopUp from "../../modal/popup/popup.component.jsx";
import {
  patchRoles,
  getRoleById,
} from "../../../API/roles/role_apis";
import { PageContainer } from "../../container/page-container/PageContainer";
import { PageHeader } from "../../container/page-header/PageHeader";
import auth from "../../../utils/AuthService.js";
import { setIsAuth } from "../../../Redux/appSlice.js";
import { setSelectedRole } from "../../../Redux/rolesSlice.js";
import ExpandableTable from "../../ui/expandable-table/expandable-table.component";
import { Switch } from "antd";
const EditRolePage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const params = useParams();
  const headers = useMemo(() => auth.getHeaders(), []);
  const { selectedRole, roles } = useSelector((state) => state.roles);
  const [role, setRole] = useState(selectedRole.roleName);
  const [duplicateWarning, setDuplicateWarning] = useState("");
  const [inputErr, setInputErr] = useState("");
  const [openPopUp, setOpenPopUp] = useState(false);
  const [roleData, setRoleData] = useState({});

  const logout = useCallback(() => {
    dispatch(setIsAuth(false));
    auth.logout();
  }, [dispatch]);

  const dispatchRoleData = useCallback(
    (object) => dispatch(setSelectedRole(object)),
    [dispatch]
  );
  const getRoles = useCallback(async () => {
    const id = params?.roleId || roleData?.id;
    if (!id) return;
    getRoleById(headers, id).then((response) => {
      if (response.statusCode === 200) {
        console.log(response);
        dispatchRoleData(response.roledata);
        setRoleData(response.roledata);
      } else if (response.statusCode === 401) {
        logout();
      }
    });
  }, [params?.roleId, roleData?.id, headers, logout]);

  useEffect(() => {
    getRoles();
  }, [getRoles]);

  const handleChange = (e, validProc) => {
    const isValid = runValidation(validProc, e.target.value);
    setRole(e.target.value);
    setInputErr(!isValid ? "Role names can only contain letters" : "");
  };

  useEffect(() => {
    const existingRole = roles.find(
      (item) =>
        item.roleName.toLowerCase() === role.toLowerCase() &&
        item.id !== selectedRole.id
    );
    setDuplicateWarning(existingRole ? "This role already exists" : "");
  }, [role, roles, selectedRole.id, selectedRole]);

  const handleSubmit = (e) => {
    history.push("/viewroles");
    e.preventDefault();
    const rolesR = {
      roleName: role.toUpperCase(),

      manager: roleData.manager,
      managerPermission: roleData.managerPermission,
      candidates: roleData.candidates,
      candidatePermission: roleData.candidatePermission,
      client: roleData.client,
      clientPermission: roleData.clientPermission,
      jobOpenings: roleData.jobOpenings,
      jobOpeningsPermission: roleData.jobOpeningsPermission,
      interviews: roleData.interviews,
      interviewsPermission: roleData.interviewsPermission,
      onBoardings: roleData.onBoardings,
      onBoardingsPermission: roleData.onBoardingsPermission,
      suppliers: roleData.suppliers,
      suppliersPermission: roleData.suppliersPermission,
      settings: roleData.settings,
      settingsPermission: roleData.settingsPermission,
      worker: roleData.worker,
      workerPermission: roleData.workerPermission,
      projects: roleData.projects,
      projectsPermission: roleData.projectsPermission,
      workOrder: roleData.workOrder,
      workOrderPermission: roleData.workOrderPermission,
      calendar: roleData.calendar,
      calendarPermission: roleData.calendarPermission,
      timesheet: roleData.timesheet,
      timesheetPermission: roleData.timesheetPermission,
    };
    let headers = JSON.parse(sessionStorage.getItem("headers"));
    if (!duplicateWarning) {
      patchRoles(headers, selectedRole.id, rolesR).then((res) => {
        if (res.status === 200) setOpenPopUp(true);
      });
    }
  };

  const closePopUp = () => {
    setOpenPopUp(false);
  };

  const resetForm = () => {
    setRoleData({
      ...roleData,
      roleName: selectedRole.roleName,
      manager: selectedRole.manager,
      client: selectedRole.client,
      worker: selectedRole.worker,
      candidates: selectedRole.candidates,
      jobOpenings: selectedRole.jobOpenings,
      suppliers: selectedRole.suppliers,
      onBoardings: selectedRole.onBoardings,
      settings: selectedRole.settings,
      interviews: selectedRole.interviews,
    });
    closeForm();
  };

  const closeForm = () => {
    history.push("/viewroles");
  };

  return (
    <PageContainer>
      <PageHeader
        breadcrumbs={
          <Breadcrumbs
            className="header"
            crumbs={[
              { text: "Roles", onClick: () => closeForm(), id: 0 },
              { text: "Edit Role", lastCrumb: true, id: 1 },
            ]}
          />
        }
      />
      <Content>
        <Form
          cancel={resetForm}
          onSubmit={handleSubmit}
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
                value={role || roleData.roleName}
                onChange={(e) => handleChange(e, "validateName")}
                maxLength="20"
                errMssg={duplicateWarning || inputErr}
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
                        {
                          label: "manager",
                          name: "manager",
                          toggleButton: roleData.manager,
                        },
                        {
                          label: "candidate",
                          name: "candidates",
                          toggleButton: roleData.candidates,
                        },
                        {
                          label: "worker",
                          name: "worker",
                          toggleButton: roleData.worker,
                        },
                        {
                          label: "client",
                          name: "client",
                          toggleButton: roleData.client,
                        },
                        {
                          label: "job Openings",
                          name: "jobOpenings",
                          toggleButton: roleData.jobOpenings,
                        },
                        {
                          label: "interviews",
                          name: "interviews",
                          toggleButton: roleData.interviews,
                        },
                        {
                          label: "suppliers",
                          name: "suppliers",
                          toggleButton: roleData.suppliers,
                        },
                        {
                          label: "on Boardings",
                          name: "onBoardings",
                          toggleButton: roleData.onBoardings,
                        },
                        {
                          label: "projects",
                          name: "projects",
                          toggleButton: roleData.projects,
                        },
                        {
                          label: "timesheet",
                          name: "timesheet",
                          toggleButton: roleData.timesheet,
                        },
                        {
                          label: "calendar",
                          name: "calendar",
                          toggleButton: roleData.calendar,
                        },
                        {
                          label: "work Order",
                          name: "workOrder",
                          toggleButton: roleData.workOrder,
                        },
                        {
                          label: "settings",
                          name: "settings",
                          toggleButton: roleData.settings,
                        },
                      ].map((item) => (
                        <div
                          style={{
                          
                            marginBottom: 5.5,
                          }}
                        >
                          <Switch
                            key={item.name}
                            label={item.label}
                            onChange={(checked) =>
                              setRoleData({
                                ...roleData,
                                [item.name]: checked ? true : false,
                              })
                            }
                            checked={item.toggleButton ? "Yes" : ""}
                            size="small"
                          />
                        </div>
                      )),
                    },
                    {
                      id: 2,
                      data: [
                        {
                          label: "manager",
                          name: "managerPermission",
                          toggleButton: roleData.managerPermission,
                        },
                        {
                          label: "candidate",
                          name: "candidatePermission",
                          toggleButton: roleData.candidatePermission,
                        },
                        {
                          label: "worker",
                          name: "workerPermission",
                          toggleButton: roleData.workerPermission,
                        },
                        {
                          label: "client",
                          name: "clientPermission",
                          toggleButton: roleData.clientPermission,
                        },
                        {
                          label: "jobOpenings",
                          name: "jobOpeningsPermission",
                          toggleButton: roleData.jobOpeningsPermission,
                        },
                        {
                          label: "interviews",
                          name: "interviewsPermission",
                          toggleButton: roleData.interviewsPermission,
                        },
                        {
                          label: "suppliers",
                          name: "suppliersPermission",
                          toggleButton: roleData.suppliersPermission,
                        },
                        {
                          label: "onBoardings",
                          name: "onBoardingsPermission",
                          toggleButton: roleData.onBoardingsPermission,
                        },
                        {
                          label: "projects",
                          name: "projectsPermission",
                          toggleButton: roleData.projectsPermission,
                        },
                        {
                          label: "timesheet",
                          name: "timesheetPermission",
                          toggleButton: roleData.timesheetPermission,
                        },
                        {
                          label: "calendar",
                          name: "calendarPermission",
                          toggleButton: roleData.calendarPermission,
                        },
                        {
                          label: "workOrder",
                          name: "workOrderPermission",
                          toggleButton: roleData.workOrderPermission,
                        },
                        {
                          label: "settings",
                          name: "settingsPermission",
                          toggleButton: roleData.settingsPermission,
                        },
                      ].map((item) => (
                        //  item.name.includes("manager") && this.state.manager ||item.name.includes("candidate") && this.state.candidates ||item.name.includes("worker") && this.state.worker|| item.name.includes("client") && this.state.client || item.name.includes("jobOpenings") && this.state.jobOpenings||item.name.includes("interviews") && this.state.interviews||item.name.includes("suppliers") && this.state.suppliers ||item.name.includes("onBoardings") && this.state.onBoardings ||item.name.includes("settings") && this.state.settings?
                        <div key={item.name} style={{ marginBottom: 5.5 }}>
                          <Switch
                            checkedChildren="Editable"
                            unCheckedChildren="Read Only"
                            key={item.name}
                            label={item.label}
                            onChange={(checked) =>
                              setRoleData({
                                ...roleData,
                                [item.name]: checked ? true : false,
                              })
                            }
                            checked={item.toggleButton ? "Yes" : ""}
                            size="small"
                            disabled={
                              (item.name.includes("manager") &&
                                !roleData.manager) ||
                              (item.name.includes("candidate") &&
                                !roleData.candidates) ||
                              (item.name.includes("worker") &&
                                !roleData.worker) ||
                              (item.name.includes("client") &&
                                !roleData.client) ||
                              (item.name.includes("jobOpenings") &&
                                !roleData.jobOpenings) ||
                              (item.name.includes("interviews") &&
                                !roleData.interviews) ||
                              (item.name.includes("suppliers") &&
                                !roleData.suppliers) ||
                              (item.name.includes("onBoardings") &&
                                !roleData.onBoardings) ||
                              (item.name.includes("settings") &&
                                !roleData.settings) ||
                              (item.name.includes("projects") &&
                                !roleData.projects) ||
                              (item.name.includes("workOrder") &&
                                !roleData.workOrder) ||
                              (item.name.includes("timesheet") &&
                                !roleData.timesheet) ||
                              (item.name.includes("calendar") &&
                                !roleData.calendar)
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
          type="Success"
          openModal={openPopUp}
          closePopUp={closePopUp}
          handleConfirmClose={closePopUp}
          confirmValue="Ok"
          message={{
            title: "Success",
            details: "Role updated successfully.",
          }}
        />
      </Content>
    </PageContainer>
  );
};

export default EditRolePage;
