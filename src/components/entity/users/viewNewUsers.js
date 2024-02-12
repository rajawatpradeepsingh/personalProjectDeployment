import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import auth from "../../../utils/AuthService";
import { config } from "../../../config.js";
import { deleteUser, getAllUsers } from "../../../API/users/user-apis";
import { patchUser } from "../../../API/users/user-apis";
import { getArchivedUsers } from "../../../API/users/user-apis";
import ReportModal from "../../utils/reports/report.modal.jsx";
import reportFormats from "../../utils/reports/reportUtils.js";
import Button from "../../common/button/button.component";
import ArchiveModal from "../../modal/archive-modal/archiveModal";
import { PlusOutlined, EyeOutlined } from "@ant-design/icons";
import { PageContainer } from "../../container/page-container/PageContainer";
import { PageHeader } from "../../container/page-header/PageHeader";
import "antd/dist/antd.css";
import "./user.css";
import { message, Switch } from "antd";
import axios from "axios";
import { TableComponent } from "../../common/table/Table";
import { setIsAuth } from "../../../Redux/appSlice";
import { TableLink } from "../../common/table/TableLink";
import { getFullName } from "../../../utils/service";
import { reportTableFields } from "./utils/UserObjects";

const ViewNewUsers = () => {
  const dispatch = useDispatch();
  const [userList, setUserList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const ITEMS_PER_PAGE = config.ITEMS_PER_PAGE;
  const [openArchive, setOpenArchive] = useState(false);
  const [archive, setArchive] = useState([]);
  const [archiveTotalElements, setArchiveTotalElements] = useState(0);
  const [archiveCurrentPage, setArchiveCurrentPage] = useState(1);
  const headers = useMemo(() => auth.getHeaders(), []);
  const [showReportModal, setShowReportModal] = useState(false);
  const history = useHistory();
  const [searchOptions, setSearchOptions] = useState([]);
  const [roleNameFilter, setroleNameFilter] = useState([]);
  const [usernameFilter, setusernameFilter] = useState([]);
  const [columns, setColumns] = useState([]);
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState({});
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [filterCurrentPage, setFilterCurrentPage] = useState(1);
  const [noData, setNoData] = useState(false);
  const [isSearchResults, setIsSearchResults] = useState(false);
  const [searchCurrentPage, setSearchCurrentPage] = useState(1);
  const currentUser = JSON.parse(sessionStorage.getItem("userInfo"));
  const [filterTrail, setFilterTrail] = useState({});
  const [isEnabled, setIsEnabled] = useState(false);


  useEffect(() => {
    if (auth.hasAdminRole()) setIsAdmin(true);
  }, []);

  const logout = useCallback(() => {
    dispatch(setIsAuth(false));
    auth.logout();
  }, [dispatch]);

  const changeTablePage = (page) => {
    if (Object.keys(filters).length > 0) {
      setFilterCurrentPage(page);
    } else if (isSearchResults) {
      setSearchCurrentPage(page);
    } else {
      setCurrentPage(page);
    }
  };
  

  const refreshUsersList =useCallback( (user) => {
    if (!user?.id) return;
    const upd = userList.map((item) => (item.id === user.id ? user : item));
    setUserList(upd);
  },[userList]);

 /*  const handleSwitch = (user) => {
    if (!user?.id) return;
    setIsLoading(true);
    patchUser(headers, user.id, { enabled: !user.enabled })
      .then((res) => refreshUsersList(res?.data))
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  }; */
  

  const toggleEditModal = useCallback((id) => {
    history.push(`/users/${id}`);
  }, [history]);

  const loadUsers = useCallback(() => {
    getAllUsers(headers)
      .then((res) => {
        if (res.statusCode === 200) setUserList(res.data);
      })
      .catch((err) => console.log(err));
  }, [headers]);

  const loadUser = useCallback(() => {
    if (Object.keys(filters).length !== 0) {
      axios
        .put(
          `${config.serverURL}/users?dropdownFilter=true&pageNo=${
            filterCurrentPage - 1
          }&pageSize=${ITEMS_PER_PAGE}`,
          filters,
          { headers }
        )
        .then((res) => {
          if (res.data) {
            setNoData(false);
            setTotalItems(res.headers["total-elements"]);
            setUserList(res.data);
          }
          if (!res.data.length) {
            setNoData(true);
          }
        })
        .catch((error) => {
          console.log(error);
          if (error.response && error.response.status === 401) {
            logout();
          }
        });
    } else {
      const sortKey = Object.keys(sort)[0] ? Object.keys(sort)[0] : "";
      const sortOrder = sortKey ? sort[sortKey] : "";
      const url = !sortKey
        ? `/users?pageNo=${currentPage - 1}&pageSize=${ITEMS_PER_PAGE}`
        : `/users?pageNo=${
            currentPage - 1
          }&pageSize=${ITEMS_PER_PAGE}&orderBy=${sortKey}&orderMode=${sortOrder}`;
      axios
        .get(`${config.serverURL}${url}`, { headers })
        .then((response) => {
          if (response.data) {
            setIsSearchResults(false);
            setTotalItems(response.headers["total-elements"]);
            setNoData(false);
            setUserList(response.data);
          }
        })
        .catch((err) => console.log(err));
    }
  }, [
    filters,
    currentPage,
    ITEMS_PER_PAGE,
    filterCurrentPage,
    sort,
    headers,
    logout,
  ]);

  useEffect(() => {
    loadUser();
  }, [loadUser, filters, archive]);

   /* useEffect(() => {
    // loadUsers();
  }, [archive, loadUsers]); */

  

  const handleSwitch = useCallback((users) => 
  {
  //  let userId = parseInt(userList[index].id);
  //  let userIsEnabled = userList[index].enabled;
    setIsEnabled(previousState => !previousState);
  /*   patchUser(headers, userId, { enabled: !userIsEnabled })
    .then(() => {
        setIsEnabled({});
        loadUsers();
      })  */
        patchUser(headers,users.id, { enabled: !users.enabled })
      .then((res) => 
      {
      refreshUsersList(res?.data);
       setIsEnabled({});
       loadUsers();
      }
      )
      .catch((err) => console.log(err));
     
  },[headers,refreshUsersList,loadUsers])

  const getUserNameFilters = useCallback(async () => {
    const res = await axios.get(
      `${config.serverURL}/users?dropdownFilter=true`,
      { headers }
    );
    if (res.status === 200) {
      setusernameFilter(
        res.data.map((user) => ({
          text: user.username,
          value: user.id,
        }))
      );
    } else {
      message.warning(
        "Problem getting supplier filter data, refresh page or contact system admin"
      );
    }
  }, [headers]);

  useEffect(() => getUserNameFilters(), [getUserNameFilters]);

  const getRoleFilters = useCallback(async () => {
    const res = await axios.get(
      `${config.serverURL}/roles?dropdownFilter=true`,
      { headers }
    );
    if (res.status === 200) {
      setroleNameFilter(
        res.data.map((roles) => ({
          text: `${`${roles.roleName}`}`,
          value: roles.id,
        }))
      );
    } else {
      message.warning(
        "Problem getting roles filter data, refresh page or contact system admin"
      );
    }
  }, [headers]);

  useEffect(() => getRoleFilters(), [getRoleFilters]);

  const getSearchSuggestions = useCallback((obj) => {
    let suggestions = [];
    for (let key in obj) {
      if (
        (typeof obj[key] === "string" || typeof obj[key] === "number") &&
        key !== "id" &&
        obj[key] !== ""
      ) {
        if (key === "userName") {
          let values = obj[key].split(", ");
          suggestions.push(values[0], values[1], values[2]);
        } else {
          suggestions.push(obj[key]);
        }
      } else if (typeof obj[key] === "object") {
        suggestions = suggestions.concat(getSearchSuggestions(obj[key]));
      }
    }
    return suggestions;
  }, []);

  useEffect(() => {
    if (userList) {
      let options = [];
      for (let obj of userList) {
        let results = getSearchSuggestions(obj);
        results.forEach((item) => {
          if (!options.includes(item)) options.push(item);
        });
      }
      setSearchOptions(options);
    }
  }, [userList, getSearchSuggestions]);

  const defaultColumns = useMemo(
    () => [
      {
        title: "UserName",
        dataIndex: "username",
        key: "username",
        width: 90,
        filters: usernameFilter,
        filterSearch: true,
        className: "clickable",
        render: (user, editUser) => (
          <TableLink
            label={user}
            onClick={() => toggleEditModal(editUser.id)}
          />
        ),
      },
      {
        title: "Name",
        dataIndex: "firstName",
        key: "name",
        render: (_, row) => <span>{getFullName(row)}</span>,
        width: 150,
      },
      {
        title: "Role",
        dataIndex: "roles",
        key: "roleId",
        width: 140,
        filters: roleNameFilter,
        filterSearch: true,
        render: (_, row) => <span>{row.roles?.[0].roleName}</span>,
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email",
        width: 200,
      },
      {
        title: "Phone_Number",
        dataIndex: "phoneNumber",
        key: "phoneNumber",
        ellipsis: true,
        width: 120,
      },
      {
        title: "Authorized",
        dataIndex: "Authorized",
        key: "Authorized",
      render: (first, users,index) => 
      <Switch
        checked={users.enabled}
      
        loading={
         isEnabled[users.id] !== undefined ? true : false
       }
        onChange={() => handleSwitch(users)}
        // disabled={currentUser.id === users.id} 
        disabled={!auth.hasAdminRole()}
       />,
       width: 90,
  },
    ],
    [usernameFilter, roleNameFilter,currentUser.id,handleSwitch,isEnabled,toggleEditModal]);

  useEffect(() => {
    setColumns(defaultColumns);
  }, [defaultColumns, usernameFilter,searchCurrentPage, roleNameFilter,currentUser.id,isLoading]);

  const loadArchive = useCallback(() => {
    getArchivedUsers(headers, archiveCurrentPage, ITEMS_PER_PAGE)
      .then((res) => {
        if (res.data) {
          setArchiveTotalElements(res.totalItems);
          setArchive(
            res.data.map((user) => ({
              id: user.id,
              cellOne: user.username,
              cellTwo: user.firstName,
              cellThree: user.lastName,
              cellFour: user.email,
              cellFive: user.roles.map((roles) => roles.roleName).join(", "),
              cellSix: user.phoneNumber
            }))
          );
        }
      })
      .catch((err) => console.log(err));
  }, [archiveCurrentPage, ITEMS_PER_PAGE, headers]);

  useEffect(() => {
    loadArchive();
  }, [loadArchive, archiveCurrentPage, openArchive]);

  const archiveUsers = () => {
    const ids = [...selectedRowKeys];

    Promise.all(ids.map((id) => patchUser(headers, id, { enabled: false })))
      .then(() => {
        Promise.all(ids.map((id) => deleteUser(headers, id))).then(() => {
          loadUsers();
          cancelArchiving();
        });
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const updateFilters = (value) => {
    setFilterCurrentPage(1);
    setFilters(value);
  };

  const cancelArchiving = () => {
    setSelectedRowKeys([]);
  };

  const searchUser = useCallback(
    (value) => setFilters({ ...filters, search: value }),
    [filters]
  );

  const rowSelection = {
    onChange: (rowKeys, selectedRows) => {
      isAdmin ? setSelectedRowKeys(rowKeys) : setSelectedRowKeys([]);
    },
    selectedRowKeys,
  };

  const openForm = (url) => {
    history.push(url);
  };

  return (
    <PageContainer>
      <PageHeader
        title="Users"
        actions={
          <>
            <Button
              type="button"
              className="btn main margin-left"
              handleClick={() => openForm("/viewroles")}
            >
              <EyeOutlined className="icon" />
              View Roles
            </Button>
            <Button
              type="button"
              className="btn main margin-left"
              handleClick={() => openForm("/addrole")}
            >
              <PlusOutlined className="icon" />
              Add Role
            </Button>
          </>
        }
      />
      <TableComponent
        loading={isLoading}
        data={userList.map((users) => ({
          ...users,
          key: users.id,
        }))}
        columns={columns}
        setColumns={setColumns}
        defaultColumns={defaultColumns}
        rowSelection={rowSelection}
        setFilterTrail={setFilterTrail}
        setFilters={updateFilters}
        total={totalItems}
        setCurrentPage={setCurrentPage}
        setPageSize={setPageSize}
        setSort={setSort}
        filters={filters}
        searchOptions={searchOptions}
        searchList={userList}
        filterTrail={filterTrail}
        handleSearch={searchUser}
        filterNoMatch={noData}
        onPageChange={(page) => changeTablePage(page)}
        openArchive={() => setOpenArchive(true)}
        openReports={() => setShowReportModal(true)}
        handleConfirmArchive={archiveUsers}
        handleCancelArchiving={cancelArchiving}
        removeableColumns={defaultColumns
          .filter((col) => col.title !== "Users" && col.title)
          .map((col) => col.title)}
      />
     <ReportModal
      showReportModal={showReportModal}
      setShowReportModal={setShowReportModal}
       individualReportName={"users"}
      individualList={userList}
      list={userList.map((users) => ({
        id: users.id,
        name: `${users.firstName + " " + users.lastName}`,
      }))}
      listLabel="Users"
      filename="users_report"
       tableFields={reportTableFields()}
     
      pdfFormatter={reportFormats.userPdfFormat}
      csvExcelFormatter={reportFormats.userCSVExcel}
    />
      <ArchiveModal
        openArchive={openArchive}
        setOpenArchive={setOpenArchive}
        loadArchive={loadArchive}
        archive={archive}
        archivedData="users"
        headers={[
          "Username",
          "FirstName",
          "LastName",
          "Email",
          "Role",
          "Phone Num.",
        ]}
        totalItems={archiveTotalElements}
        setArchiveCurrentPage={setArchiveCurrentPage}
        archiveCurrentPage={archiveCurrentPage}
      />
    </PageContainer>
  );
};

export default ViewNewUsers;
