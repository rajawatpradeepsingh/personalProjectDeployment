import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import auth from "../../../utils/AuthService";
import { reportTableFields } from "./utils/candidateObjects";
import reportFormats from "../../utils/reports/reportUtils";
import { getCountries } from "../../../utils/serviceAddress";
import { candidateStatus } from "../../../utils/defaultData";
import {
  archiveCandidates,
  getCandidateActivityData,
  getCandidatesPage,
  getFilteredCandidates,
  updateCandidate,
} from "../../../API/candidates/candidate-apis";
import { getAllClients } from "../../../API/clients/clients-apis";
import { getAllJobs } from "../../../API/jobs/job-apis";
import {
  getCandidateRolesDictionary,
  getWorkAuthDictionary,
} from "../../../API/dictionaries/dictionary-apis";
import { getAllRecruiters } from "../../../API/users/user-apis";
import {
  setShowActivity,
  setShowBasic,
  setCandidatesList,
  setShowComments,
} from "../../../Redux/candidateSlice";
import { setAddInterviewOpen } from "../../../Redux/interviewSlice";
import { setJobsList } from "../../../Redux/jobSlice";
import { setClientsList } from "../../../Redux/clientSlice";
import { setCountriesList } from "../../../Redux/addressSlice";
import { setCandidateRoles } from "../../../Redux/dictionariesSlice";
import { generateSearchSuggestions } from "./utils/utils";
import { useParams } from "react-router-dom";
import { getUserById } from "../../../API/users/user-apis";
import Button from "../../common/button/button.component";
import ScheduleInterview from "../interview/ScheduleInterview";
import { TableComponent } from "../../common/table/Table";
import { TableLink } from "../../common/table/TableLink";
import { RangeFilter } from "../../common/table/table-filters/RangeFilter";
import { CandidateExpandedRow } from "./cand_ui_helpers/table/candidate-expanded-row";
import { StatusSelect } from "./cand_ui_helpers/table/status-select";
import { CandidateArchive } from "./cand_ui_helpers/archive_modal/candidate-archive";
import ReportModal from "../../../../src/components/utils/reports/report.modal";
import { CandidateResume } from "./cand_ui_helpers/resume/CandidateResume";
import { PageContainer } from "../../container/page-container/PageContainer";
import { PageHeader } from "../../container/page-header/PageHeader";
import { message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import IdleTimeOutHandler from "../../ui/Dashboard/IdleTimeOutHandler";
import "antd/dist/antd.css";
import "./style.css";

export const ViewCandidates = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [headers] = useState(auth.getHeaders());
  const [userIsRecruiter, setUserIsRecruiter] = useState(false);
  const [openArchive, setOpenArchive] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [searchOptions, setSearchOptions] = useState([]);
  const [showFile, setShowFile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  //table data state
  const { candidatesList } = useSelector((state) => state.candidate);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [childData, setChildData] = useState({});
  const [filters, setFilters] = useState({});
  const user = useMemo(() => auth.getUserInfo(), []);
  const [sort, setSort] = useState({});
  const roles = useSelector((state) => state.dictionaries.candidateRoles);
  const [recruiters, setRecruiters] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [workAuthFilters, setWorkAuthFilters] = useState([]);
  const [columns, setColumns] = useState([]);
  const [roleData, setRoleData] = useState(user.roles[0]);
  const params = useParams();
  const [isActive, setIsActive] = useState(true);
  const [isLogout, setLogout] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [managerRole, setManagerRole] = useState(false);
  const [candList, setCandList] = useState([]);

  useEffect(() => {
    if (auth.hasAdminRole()) setIsAdmin(true);
  }, []);
  // get candidate table data, filtered and unfiltered
  const getCandidatesData = useCallback(async () => {
    // setIsLoading(true);
    if (!Object.keys(filters).length) {
      const sortKey = Object.keys(sort)[0] ? Object.keys(sort)[0] : "";
      const sortOrder = sortKey ? sort[sortKey] : "";
      const res = await getCandidatesPage(
        headers,
        currentPage,
        pageSize,
        sortKey,
        sortOrder
      );
      if (res) setIsLoading(false);
      return res;
    } else {
      const sortKey = Object.keys(sort)[0] ? Object.keys(sort)[0] : "";
      const sortOrder = sortKey ? sort[sortKey] : "";
      const res = await getFilteredCandidates(
        headers,
        filters,
        currentPage,
        pageSize,
        sortKey ? sortKey : "id",
        sortOrder ? sortOrder : "desc"
      );
      if (res) setIsLoading(false);
      return res;
    }
  }, [headers, currentPage, pageSize, filters, sort]);

   // call getCandidatesData on page load, filter changes and pagination
   useEffect(() => {
    let isCancelled = false;
    getCandidatesData()
      .then((res) => {
        if (res.statusCode === 200) {
          setIsLoading(false);
          setCandList(res.tableData);
          setTotalItems(res.totalItems);
          dispatch(setCandidatesList(res.tableData));
          
        }
      })
      .catch((err) => {
        if (!isCancelled) {
          console.log(err);
        }
      });
    return () => (isCancelled = true);
  }, [
    headers,
    currentPage,
    pageSize,
    filters,
    openArchive,
    getCandidatesData,
    dispatch,
  ]);
  
  const getCandidate = useCallback(
    (id, target) => {
      if (target === "open-basic") dispatch(setShowBasic(true));
      if (target === "open-comments") dispatch(setShowComments(true));
      if (target === "open-activity") dispatch(setShowActivity(true));
      history.push(`/candidate/${id}`);
    },
    [dispatch, history]
  );

  //inline status change
  const updateCandidateStatus = useCallback(
    (id, status) => {
      updateCandidate(headers, { status: status }, id)
        .then((res) => {
          if (res.statusCode === 200) {
            getCandidatesData()
              .then((res) => {
                if (res.statusCode === 200) {
                  dispatch(setCandidatesList(res.tableData));
                  setTotalItems(res.totalItems);
                  setIsLoading(false);
                  message.success({
                    content: "Status updated!",
                    style: { marginTop: "5%" },
                  });
                }
              })
              .catch(() => {
                message.error({
                  content: "Something went wrong, please try again",
                  style: { marginTop: "5%" },
                });
              });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    [dispatch, getCandidatesData, headers]
  );
  const getUsers = useCallback(async () => {
    try {
      let headers = JSON.parse(sessionStorage.getItem("headers"));
      const id = JSON.parse(sessionStorage.getItem("userInfo"));
      const response = await getUserById(headers, id.id);
      setRoleData(response.userdata.roles[0]);
} catch (error) {
      console.log(error);
    }
  }, []);
  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const defaultColumns = useMemo(
    () => [
      {
        title: "Name",
        dataIndex: "fullName",
        sorter: true,
        fixed: "left",
        width: 170,
        render: (fullName, row) => (
          <TableLink
            onClick={() => getCandidate(row.id, "open-basic")}
            label={fullName}
            extra={moment(row.date).format("MM/DD/YYYY")}
            styleRed={row.isSuspicious ? true : false}
          />
        ),
        key: "firstName",
      },
      {
        title: "Role",
        dataIndex: "role",
        key: "role",
        sorter: true,
        filters: roles?.map((role) => ({
          text: role.value,
          value: role.value,
        })),
        filterSearch: true,
        ellipsis: true,
      },
      {
        title: "Experience",
        dataIndex: "experience",
        key: "professionalInfo.totalExperience",
        sorter: true,
        className: "algin",
        filterDropdown: () => (
          <RangeFilter setFilters={setFilters} filters={filters} />
        ),
      },
      {
        title: "Work Auth",
        dataIndex: "workAuth",
        key: "workAuthStatus",
        sorter: true,
        width: 105,
        filters: workAuthFilters,
      },
      {
        title: "Location",
        dataIndex: "location",
        key: "address.city",
        sorter: true,
        ellipsis: true,
      },
      {
        title: "Relocate",
        dataIndex: "relocate",
        key: "relocate",
        sorter: true,
        width: 90,
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        sorter: true,
        ellipsis: true,
        filters: candidateStatus.map((status) => ({
          text: status,
          value: status,
        })),
        render: (value, row) => (
          <StatusSelect
            value={value}
            id={row.id}
            options={candidateStatus}
            update={updateCandidateStatus}
          />
        ),
      },
      {
        title: "Expected CTC",
        dataIndex: "ctc",
        key: "professionalInfo.startExpCTC",
        sorter: true,
        className: "algin",
      },
      {
        title: "Recruiter",
        dataIndex: "recruiterName",
        key: "recruiter.firstName",
        filterKey: "recruiterId",
        sorter: true,
        filters: userIsRecruiter ? false : recruiters,
      },
    ],
    [
      filters,
      workAuthFilters,
      roles,
      recruiters,
      userIsRecruiter,
      getCandidate,
      updateCandidateStatus,
    ]
  );

  useEffect(() => {
    setColumns(defaultColumns);
  }, [workAuthFilters, roles, recruiters, defaultColumns]);

  useEffect(() => {
    if (auth.hasRecruiterRole()) setUserIsRecruiter(true);
  }, []);

  const getRecruiters = useCallback(() => {
    const role = auth.hasAdminRole() ? "admin" : "business_dev_manager";
    getAllRecruiters(headers, role).then((res) => {
      if (res.statusCode === 200) {
        const recruiters = res.recruiters.map((recruiter) => ({
          value: recruiter.id,
          text: `${recruiter?.firstName} ${recruiter?.lastName}`,
        }));
        setRecruiters(recruiters);
      }
    });
  }, [headers]);

  const getAllCandidateRoles = useCallback(
    (headers) => {
      getCandidateRolesDictionary(headers)
        .then((res) => {
          if (res) dispatch(setCandidateRoles(res));
        })
        .catch((err) => {
          console.log(err);
        });
    },
    [dispatch]
  );

  const getWorkAuthOptions = useCallback((headers) => {
    getWorkAuthDictionary(headers)
      .then((res) => {
        if (res) {
          setWorkAuthFilters(
            res.map((auth) => ({ text: auth.value, value: auth.value }))
          );
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    getAllCandidateRoles(headers);
    getWorkAuthOptions(headers);
  }, [headers, getAllCandidateRoles, getWorkAuthOptions]);

  useEffect(
    () => !userIsRecruiter && getRecruiters(),
    [getRecruiters, userIsRecruiter]
  );

 

  const loadClients = useCallback(() => {
    getAllClients(headers)
      .then((res) => {
        if (res.tableData) {
          dispatch(setClientsList(res.tableData));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [headers, dispatch]);

  const loadJobs = useCallback(() => {
    getAllJobs(headers)
      .then((res) => {
        if (res.data) {
          dispatch(setJobsList(res.data));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [headers, dispatch]);

  const loadCountries = useCallback(() => {
    dispatch(setCountriesList(getCountries()));
  }, [dispatch]);

  useEffect(() => loadClients(), [loadClients]);

  useEffect(() => loadJobs(), [loadJobs]);

  useEffect(() => loadCountries(), [loadCountries]);

  // archive selected candidates (soft delete)
  const archiveSelectedCandidates = () => {
    archiveCandidates(headers, selectedRowKeys)
      .then(() => {
        getCandidatesData()
          .then((res) => {
            if (res.statusCode === 200) {
              setSelectedRowKeys([]);
              dispatch(setCandidatesList(res.tableData));
              setCandList(res.tableData);
              setTotalItems(res.totalItems);
              setIsLoading(false);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const cancelArchiving = () => {
    setSelectedRowKeys([]);
  };

  // open resume in file view
  const viewResume = (id, resume) => {
    setShowFile({ id: id, resume: resume });
  };

  const expandedRowRender = (row) => {
    if (!childData[row.id]) {
      getChildData(row.id, row.comments, row);
      return;
    } else {
      const data = [
        ...childData[row.id],
        { resume: row.resume, source: row.source, id: row.id },
      ];
      return (
        <CandidateExpandedRow
          data={data}
          viewResume={() => viewResume(row.id, row.resume)}
          getCandidate={getCandidate}
        />
      );
    }
  };

  const getChildData = (id, comments, row) => {
    getCandidateActivityData(headers, id, comments)
      .then((data) => {
        if (data) setChildData({ ...childData, [id]: data });
        return (
          <CandidateExpandedRow
            data={[
              ...data,
              { resume: row.resume, source: row.source, id: row.id },
            ]}
            viewResume={() => viewResume(row.id, row.resume)}
            getCandidate={getCandidate}
          />
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // get search results
  const searchCandidates = (value) => {
    //after applying a search in a filter request all search endpoints could be removed
    setFilters({ ...filters, search: value });
  };

  // get search options on page load (results vary per table page)
  useEffect(() => {
    if (candidatesList) {
      setSearchOptions(generateSearchSuggestions(candidatesList));
    }
  }, [candidatesList, filters]);

  const openForm = () => {
    history.push("/addcandidate");
  };

  const openScheduleInterviewForm = () => {
    dispatch(setAddInterviewOpen(true));
  };

  const rowSelection = {
    onChange: (rowKeys, selectedRows) => {
      setSelectedRowKeys(rowKeys);
    },
    selectedRowKeys,
  };

  return (
    <PageContainer>
      <PageHeader
        title="Candidates"
        actions={
          <>
            {isAdmin ||
            (roleData.candidatePermission && !managerRole === true) ? (
              <Button
                type="button"
                className="btn main margin-left"
                handleClick={openForm}
              >
                <PlusOutlined className="icon" />
                Add Candidate
              </Button>
            ) : (
              ""
            )}

            {isAdmin || roleData.candidatePermission ? (
              <Button
                type="button"
                className="btn main margin-left"
                handleClick={openScheduleInterviewForm}
              >
                <PlusOutlined className="icon" />
                Schedule Interview
              </Button>
            ) : (
              ""
            )}
          </>
        }
      />

      <IdleTimeOutHandler
        onActive={() => {
          setIsActive(true);
        }}
        onIdle={() => {
          setIsActive(false);
        }}
        onLogout={() => {
          setLogout(true);
        }}
      />
      <TableComponent
        loading={isLoading}
        expandedRowRender={expandedRowRender}
        data={candList.map((cand) => ({ ...cand, key: cand.id }))}
        columns={columns}
        setColumns={setColumns}
        defaultColumns={defaultColumns}
        rowSelection={
          isAdmin || roleData.candidatePermission ? rowSelection : false
        }
        total={totalItems}
        setCurrentPage={setCurrentPage}
        setPageSize={setPageSize}
        setSort={setSort}
        setFilters={setFilters}
        filters={filters}
        searchOptions={searchOptions}
        searchList={candidatesList}
        handleSearch={searchCandidates}
        openArchive={() => setOpenArchive(true)}
        openReports={() => setShowReportModal(true)}
        handleConfirmArchive={archiveSelectedCandidates}
        handleCancelArchiving={cancelArchiving}
        removeableColumns={defaultColumns
          .filter((col) => col.title !== "Name" && col.title)
          .map((col) => col.title)}
      />
      <CandidateResume show={showFile} setShow={setShowFile} />
      <ReportModal
        showReportModal={showReportModal}
        setShowReportModal={setShowReportModal}
        individualReportName="candidates"
        individualList={candidatesList}
        list={candidatesList.map((cand) => ({
          id: cand.id,
          name: `${cand.fullName}`,
        }))}
        listLabel="Candidates"
        filename="candidate_report"
        tableFields={reportTableFields()}
        pdfFormatter={reportFormats.candidatePDF}
        csvExcelFormatter={reportFormats.candidateCSVExcel}
      />

      <CandidateArchive open={openArchive} setOpen={setOpenArchive} />
      <ScheduleInterview />
    </PageContainer>
  );
};

export default ViewCandidates;
