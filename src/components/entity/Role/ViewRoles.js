import React, { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setRoles, setSelectedRole } from "../../../Redux/rolesSlice";
import { config } from "../../../config";
import auth from "../../../utils/AuthService";
import PopUp from "../../modal/popup/popup.component";
import Button from "../../common/button/button.component";
import ArchiveModal from "../../modal/archive-modal/archiveModal";
import Content from "../../container/content-container/content-container.component";
import ContentActions from "../../container/content-actions-container/content-actions-container.component";
import ExpandableTable from "../../ui/expandable-table/expandable-table.component";
import Breadcrumbs from "../../common/breadcrumbs/breadcrumbs.component";
import Check from "../../common/checkbox/checkbox.component";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";

import "./role.css";
import { archiveRoles, getRoles } from "../../../API/roles/role_apis";
import { getArhivedRoles } from "../../../API/roles/role_apis";
import { PageContainer } from "../../container/page-container/PageContainer";
import { PageHeader } from "../../container/page-header/PageHeader";


const ViewRoles = () => {
  const [roleList, setRoleList] = useState([]);
  const [rolesToArchive, setRolesToArchive] = useState({});
  const [totalItems, setTotalItems] = useState(0);
  const ITEMS_PER_PAGE = config.ITEMS_PER_PAGE;
  const [currentPage, setCurrentPage] = useState(1);
  const [openPopUp, setOpenPopUp] = useState(false);
  const [openArchive, setOpenArchive] = useState(false);
  const [archive, setArchive] = useState([]);
  const [archiveTotalElements, setArchiveTotalElements] = useState(0);
  const [archiveCurrentPage, setArchiveCurrentPage] = useState(1);
  const [headers] = useState(auth.getHeaders());
  const dispatch = useDispatch();
  const history = useHistory();

  console.log(roleList);
  const loadRoles = useCallback(() => {
    getRoles(headers, currentPage).then((response) => {
      if (response.data) {
        let res = response.data.map((item, index) => ({
          ...item,
          index: index,
        }));
        setRoleList(res);
        dispatch(setRoles(response.data));
        setTotalItems(response.headers["total-elements"]);
      }
    });
  }, [currentPage, headers, dispatch]);

  useEffect(() => {
    loadRoles();
  }, [loadRoles, archive]);

  const loadArchive = useCallback(() => {
    getArhivedRoles(headers, archiveCurrentPage).then((res) => {
      if (res.data) {
        setArchiveTotalElements(res.headers["total-elements"]);
        setArchive(
          res.data.map((roles) => ({
            id: roles.id,
            cellOne: roles.roleName,
          }))
        );
      }
    });
  }, [archiveCurrentPage, headers, loadRoles]);

  useEffect(() => {
    loadArchive();
  }, [loadArchive]);

  const archiveRole = () => {
    archiveRoles(headers, rolesToArchive).then(() => {
      setRolesToArchive({});
      loadRoles();
    });
  };

  const navigateToEditPage = useCallback(
    (role) => {
      dispatch(setSelectedRole(role));
      history.push(`/edit/${role.id}`);
    },
    [history, dispatch]
  );

  const handlePopUpSubmit = () => {
    archiveRole();
    setOpenPopUp(false);
  };

  const handlePopUpCancel = () => {
    setOpenPopUp(false);
    setRolesToArchive({});
  };

  const openArchiveModal = () => {
    loadArchive();
    setOpenArchive(true);
  };

  const openForm = () => {
    history.push("/addrole");
  };

  const goBack = (url) => {
    history.push(url);
  };
  // const refreshRolesList = useCallback(
  //   (role) => {
  //     if (!role?.id) return;
  //     const upd = roleList.map((item) => (item.id === role.id ? role : item));
  //     setRoleList(upd);
  //   },
  //   [roleList]
  // );
  // const handleSwitch = useCallback(
  //   (role) => {
  //     //  let userId = parseInt(userList[index].id);
  //     //  let userIsEnabled = userList[index].enabled;
  //     setIsEnabled((previousState) => !previousState);
  //     /*   patchUser(headers, userId, { enabled: !userIsEnabled })
  //   .then(() => {
  //       setIsEnabled({});
  //       loadUsers();
  //     })  */
  //     patchRoles(headers, role.id, { enabled: !role.enabled })
  //       .then((res) => {
  //         refreshRolesList(res?.data);
  //         setIsEnabled({});
  //         loadRoles();
  //       })
  //       .catch((err) => console.log(err));
  //   },
  //   [headers, refreshRolesList, loadRoles]
  // );

  return (
    <PageContainer>
      <PageHeader
        breadcrumbs={
          <Breadcrumbs
            className="header"
            crumbs={[
              { id: 0, text: "Users", onClick: () => goBack("/viewusers") },
              { id: 1, text: "Roles", lastCrumb: true },
            ]}
          />
        }
        actions={
          <Button type="button" className="btn main" handleClick={openForm}>
            <PlusOutlined className="icon" />
            Add Role
          </Button>
        }
      />
      <Content>
        <ContentActions>
          <div
            className="content-subactions"
            style={{ justifyContent: "flex-start", width: "100%" }}
          >
            <Button
              type="button"
              name="archive"
              className="btn main outlined margin-right marginY"
              handleClick={openArchiveModal}
            >
              <DeleteOutlined style={{ marginRight: "5px" }} />
              Archive
            </Button>
          </div>
        </ContentActions>
        <ExpandableTable
          headers={[
            { label: "Archive" },
            { label: "Role Name" },
            { label: "Managers" },
            { label: "Candidates" },
            { label: "Client" },
            { label: "Worker" },
            { label: "JobOpenings" },
            { label: "Interviews" },
            { label: "Suppliers" },
            { label: "OnBoardings" },
            { label: "Settings" },
            { label: "Projects" },
            { label: "Timesheet" },
            { label: "WorkOrder" },
            { label: "Calendar" },
          ]}
          body={
            roleList
              ? roleList.map((role) => ({
                  id: role.id,

                  cells: [
                    {
                      id: 0,
                      data: (
                        <Check
                          id={`${role.id}`}
                          name={role.roleName}
                          checkedList={rolesToArchive}
                          setCheckedList={setRolesToArchive}
                          disabled={false}
                        />
                      ),
                    },
                    {
                      id: 1,
                      data: role.roleName,
                      onClick: () => navigateToEditPage(role),
                      className: "clickable",
                    },
                    {
                      id: 2,
                      data: `${role.manager ? "Enabled" : "Disabled"}/${
                        role.managerPermission ? "Editable" : "ReadOnly"
                      }`,
                    },
                    {
                      id: 3,
                      data: `${role.candidates ? "Enabled" : "Disabled"}/${
                        role.candidatePermission ? "Editable" : "ReadOnly"
                      }`,
                    },
                    {
                      id: 4,
                      data: `${role.client ? "Enabled" : "Disabled"}/${
                        role.clientPermission ? "Editable" : "ReadOnly"
                      }`,
                    },
                    {
                      id: 5,
                      data: `${role.worker ? "Enabled" : "Disabled"}/${
                        role.workerPermission ? "Editable" : "ReadOnly"
                      }`,
                    },
                    {
                      id: 6,
                      data: `${role.jobOpenings ? "Enabled" : "Disabled"}/${
                        role.jobOpeningsPermission
                          ? "Editable"
                          : "ReadOnly"
                      }`,
                    },
                    {
                      id: 7,
                      data: `${role.interviews ? "Enabled" : "Disabled"}/${
                        role.interviewsPermission
                          ? "Editable"
                          : "ReadOnly"
                      }`,
                    },
                    {
                      id: 8,
                      data: `${role.suppliers ? "Enabled" : "Disabled"}/${
                        role.suppliersPermission ? "Editable" : "ReadOnly"
                      }`,
                    },
                    {
                      id: 9,
                      data: `${role.onBoardings ? "Enabled" : "Disabled"}/${
                        role.onBoardingsPermission
                          ? "Editable"
                          : "ReadOnly"
                      }`,
                    },
                    {
                      id: 10,
                      data: `${role.settings ? "Enabled" : "Disabled"}/${
                        role.settingsPermission ? "Editable" : "ReadOnly"
                      }`,
                    },
                    {
                      id: 11,
                      data: `${role.projects ? "Enabled" : "Disabled"}/${
                        role.projectsPermission ? "Editable" : "ReadOnly"
                      }`,
                    },
                    {
                      id: 12,
                      data: `${role.timesheet ? "Enabled" : "Disabled"}/${
                        role.timesheetPermission ? "Editable" : "ReadOnly"
                      }`,
                    },
                    {
                      id: 13,
                      data: `${role.workOrder ? "Enabled" : "Disabled"}/${
                        role.workOrderPermission ? "Editable" : "ReadOnly"
                      }`,
                    },
                    {
                      id: 14,
                      data: `${role.calendar ? "Enabled" : "Disabled"}/${
                        role.calendarPermission ? "Editable" : "ReadOnly"
                      }`,
                    },
                  ],
                }))
              : []
          }
          disableArchive={!Object.keys(rolesToArchive).length}
          handleClickArchive={() => setOpenPopUp(true)}
          totalItems={totalItems}
          perPage={ITEMS_PER_PAGE}
          currentPage={currentPage}
          onPageChange={(page) => setCurrentPage(page)}
          items={"Roles"}
          includePagination={true}
        />
        <PopUp
          openModal={openPopUp}
          type={"warning"}
          confirmValue="Archive"
          cancelValue="CANCEL"
          handleConfirmClose={handlePopUpSubmit}
          closePopUp={handlePopUpCancel}
          message={{
            title: "Warning",
            details: `Are you sure you want to archive selected role(s)?`,
          }}
        ></PopUp>
        <ArchiveModal
          openArchive={openArchive}
          setOpenArchive={setOpenArchive}
          loadArchive={loadArchive}
          archive={archive}
          archivedData="roles"
          headers={["Role Name"]}
          totalItems={archiveTotalElements}
          setArchiveCurrentPage={setArchiveCurrentPage}
          archiveCurrentPage={archiveCurrentPage}
        />
      </Content>
    </PageContainer>
  );
};

export default ViewRoles;
