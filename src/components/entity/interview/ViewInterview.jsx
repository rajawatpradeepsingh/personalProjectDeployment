import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import auth from "../../../utils/AuthService";
import { setAddInterviewOpen, setInterview, setViewFeedback, setViewSchedule, } from "../../../Redux/interviewSlice";
import * as apis from "../../../API/interviews/interview-apis"
import { deleteMeeting, parseUrlForID } from "./int_ui_helpers/zoom/zoomService";
import { roundOptionsFilter, decisionOptionsFilter } from "../../../utils/defaultData";
import { reportTableFields } from "../interview/utils/interviewObjects";
import reportFormats from "../../utils/reports/reportUtils";
import ReportModal from "../../../../src/components/utils/reports/report.modal";
import Button from "../../common/button/button.component";
import { roundDisplay, mapInterviewList } from "./utils/int_utils";
import { IntArchive } from "./int_ui_helpers/archive_modal/IntArchive";
import { TableComponent } from "../../common/table/Table";
import { TableLink } from "../../common/table/TableLink";
import { ViewDateTime } from "./int_ui_helpers/table/ViewDateTime";
import { ViewJobDetails } from "./int_ui_helpers/table/ViewJobDetails";
import ScheduleInterview from "./ScheduleInterview";
import { IntExpandedRow } from "./int_ui_helpers/table/IntExpandedRow";
import { DateTimeFilter } from "../../common/table/table-filters/DateTimeFilter";
import { JobDetailsFilter } from "../../common/table/table-filters/JobDetailsFilter";
import { PageContainer } from "../../container/page-container/PageContainer";
import { PageHeader } from "../../container/page-header/PageHeader";
import { FilterFilled, PlusOutlined, EyeOutlined } from "@ant-design/icons";
import IdleTimeOutHandler from "../../ui/Dashboard/IdleTimeOutHandler";
import "./interview.css";
import { getInterviewsByParams } from "../../../API/interviews/interview-apis";


const ViewInterviews = () => {
  const headers = useMemo(() => auth.getHeaders(), []);
  const dispatch = useDispatch();
  const history = useHistory();
  const [interviewsList, setInterviewsList] = useState([]);
  const [hasRecruiterRole, setHasRecruiterRole] = useState(false);
  const [userId, setUserId] = useState("");
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({});
  const [openArchive, setOpenArchive] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [childData, setChildData] = useState({});
  const [sort, setSort] = useState({});
  const [searchOptions, setSearchOptions] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [columns, setColumns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const[isActive,setIsActive]=useState(true);
  const[isLogout,setLogout]=useState(false);

  const user = useMemo(() => auth.getUserInfo(), []);
  const [roleData,setRoleData]=useState(user.roles[0]);
  const [isAdmin, setIsAdmin] = useState(false);
  const[managerRole,setManagerRole]= useState(false);
  console.log(roleData)
  useEffect(() => {
    if (auth.hasAdminRole()) setIsAdmin(true);
  }, []);
  const openEditPage = useCallback(async (id, page) => {
    apis
      .getInterview(headers, id)
      .then((res) => {
        if (res) {
          if (page === "schedule") dispatch(setViewSchedule(true));
          if (page === "feedback") dispatch(setViewFeedback(true));
          dispatch(setInterview(res.data));
          history.push("/edit/interview");
        }
      })
      .catch((err) => console.log(err));
  }, [dispatch, history, headers]);

  const defaultColumns = useMemo(
    () => [
      {
        title: "Candidate",
        dataIndex: "candFullName",
        key: "candidate.firstName",
        sorter: true,
        fixed: "left",
        width: 170,
        render: (fullName, row) => (
          <TableLink
            onClick={() => openEditPage(row.id, "schedule")}
            label={fullName}
          />
        ),
      },
      {
        title: "Job Details",
        dataIndex: "jobOpening",
        key: "jobOpening.jobTitle",
        sorter: true,
        width: 200,
        render: (job, row) => (
          <ViewJobDetails
            title={job}
            client={row.client}
            type={row.jobType}
            id={row.jobId}
          />
        ),
        filterDropdown: () => (
          <JobDetailsFilter setFilters={setFilters} filters={filters} />
        ),
        filterIcon: () => (
          <FilterFilled
            style={{
              color:
                Object.keys(filters).includes("jobId") ||
                  Object.keys(filters).includes("clientId")
                  ? "var(--secondary)"
                  : undefined,
            }}
          />
        ),
      },
      {
        title: "Round",
        dataIndex: "roundType",
        key: "roundType",
        sorter: true,
        filters: roundOptionsFilter,
        filterMultiple: false,
        width: 140,
        render: (round) => roundDisplay(round),
      },
      {
        title: "Schedule",
        dataIndex: "date",
        key: "date",
        sorter: true,
        width: 150,
        render: (date, row) => (
          <ViewDateTime
            date={date}
            start={row.schedule?.startTimeZ}
            end={row.schedule?.endTimeZ}
          />
        ),
        filterDropdown: () => (
          <DateTimeFilter setFilters={setFilters} filters={filters} />
        ),
        filterIcon: () => (
          <FilterFilled
            style={{
              color: Object.keys(filters).includes("date")
                ? "var(--secondary)"
                : undefined,
            }}
          />
        ),
      },
      {
        title: "Interviewer(s)",
        dataIndex: "interviewers",
        key: "interviewers.firstName",
        sorter: true,
        ellipsis: true,
      },
      {
        title: "Decision",
        ellipsis: true,
        dataIndex: "decision",
        filters: decisionOptionsFilter,
        key: "decision",
        filterMultiple: false,
        width: 115,
        render: (decision) => (
          <span
            style={
              !decision
                ? { color: "rgba(0,0,0,0.2)" }
                : {
                  color:
                    decision === "REJECTED"
                      ? "var(--error)"
                      : decision === "TENTATIVE"
                        ? "var(--warning)"
                        : "var(--success)",
                }
            }
          >
            {decision ? decision : "pending"}
          </span>
        ),
        sorter: true,
      },
      {
        title: "Feedback",
        ellipsis: true,
        dataIndex: "feedback",
        key: "feedback",
      },
      {
        title: "Recording",
        dataIndex: "interviewLink",
        key: "interviewLink",
        render: (link) => (
          <TableLink
            label={link}
            className={"small ellipses"}
            onClick={() => window.open(`${link}`, "_blank")}
          />
        ),
      },
    ],
    [filters, openEditPage]
  );

  useEffect(() => {
    setColumns(defaultColumns);
  }, [filters, defaultColumns]);

  useEffect(() => {
    setHasRecruiterRole(auth.hasRecruiterRole());
    setUserId(auth.getUserId());
  }, []);

  const loadInterviews = useCallback(async () => {
    const pages = `pageNo=${currentPage - 1}&pageSize=-1`
    if (!Object.keys(filters).length) {
      const sKey = Object.keys(sort)[0] ? Object.keys(sort)[0] : ""; // sortKey
      const sOrder = sKey ? sort[sKey] : ""; // sortOrder
      const order = sKey ? `orderBy=${sKey}&orderMode=${sOrder}` : "";
      const params = `?${pages}&${order}`;
      return await apis.getLatestRecord(headers, params)
    } else {
      const filter = `dropdownFilter=true`
      const params = `?${filter}&${pages}`;
      return await apis.putLatestRecord(headers, filters, params)
    }
  }, [filters, currentPage, pageSize, headers, sort]);
    
  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);
    loadInterviews()
      .then(res => {
        if (res.status === 200) {
          setInterviewsList(mapInterviewList(res.data))
          setTotalItems(res.totalItems);
        }
      })
      .catch(err => {
        if (!isCancelled) console.log(err)
      })
      .finally(() => setIsLoading(false))
    return () => (isCancelled = true);
  }, [openArchive, loadInterviews]);

  const expandedRowRender = (row) => {
    if (!childData[row.id]) {
      getChildData(row.id, row.candidate.id, row.jobId);
      return;
    } else {
      return <IntExpandedRow data={childData[row.id]} openEditPage={openEditPage} />
    }
  }

  const getChildData = async (id, candidateId, jobId) => {
    const path = jobId ? "getfilter" : "getfilterforcandidates";
    const params = `?candidateId=${candidateId}${jobId ? `&jobId=${jobId}` : ""}`

    apis.getInterviewsByParams(headers, path, params)
      .then(res => {
        const data = mapInterviewList(res.data.filter((int) => (!jobId ? (!int.jobOpening && int.id !== id) : (int.id !== id))))
        if (data.length) {
          setChildData({ ...childData, [id]: data });
        } else {
          setChildData({ ...childData, [id]: [] });
        }
        return <IntExpandedRow data={data} openEditPage={openEditPage} />
      })
      .catch(err => console.log(err))
  };

  const archiveInterviews = async () => {
    apis
      .archiveInterviews(headers, selectedRowKeys)
      .then(() => {
        setSelectedRowKeys([]);
        loadInterviews().then((res) => {
          if (res.status === 200) {
            setInterviewsList(mapInterviewList(res.data));
            setTotalItems(res.totalItems);
          }
        });
        const keys = Object.keys(childData);
        if (keys.length) {
          const filterDeleted = childData[keys[0]].filter(
            (i) => !selectedRowKeys.includes(i.id)
          );
          setChildData(filterDeleted);
        }
      })
      .catch((err) => console.log(err));

    // delete ZoomMeetings
    const filteredForZoom = interviewsList.filter((int) => selectedRowKeys.includes(int.id) && int.schedule.meetingURL?.includes("zoom"))
    if (filteredForZoom.length) {
      let meetingIds = filteredForZoom
        .map((int) => parseUrlForID(int.schedule.meetingURL))
        .filter((id) => id);
      Promise.all(meetingIds.forEach((id) => deleteMeeting(id, headers))).catch(
        () => console.log("Error when deleating zoom meeting")
      );
    }
  };

  const searchInterview = (value) => {
    setFilters({ ...filters, search: value });
  };

  const getSearchSuggestions = useCallback((obj) => {
    let suggestions = [];
    for (let key in obj) {
      if (
        (typeof obj[key] === "string" || typeof obj[key] === "number") &&
        key !== "id" &&
        obj[key] !== ""
      ) {
        if (obj[key] === "Internal Interview") continue;
        if (key === "fullName") {
          let values = obj[key].split(" ");
          suggestions.push(values[0], values[1]);
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
    if (interviewsList) {
      let options = [];
      for (let obj of interviewsList) {
        let results = getSearchSuggestions(obj);
        results.forEach((item) => {
          if (!options.includes(item)) options.push(item);
        });
      }
      setSearchOptions(options);
    }
  }, [interviewsList, filters, getSearchSuggestions]);

  const openForm = () => {
    dispatch(setAddInterviewOpen(true));
  };

  const openZoomLinks = () => {
    history.push("/viewzoomlink");
  };

  const cancelArchiving = () => {
    setSelectedRowKeys([]);
  };

  const rowSelection = {
    onChange: (rowKeys, selectedRows) => {
      if (!rowKeys.length || !hasRecruiterRole) {
        setSelectedRowKeys(rowKeys);
      } else {
        const datafilteredByRecruiter = interviewsList.filter(int => int.candidate.recruiterId === userId);
        const selectionIncluded = datafilteredByRecruiter.some(int => rowKeys.includes(int.id));
        if (hasRecruiterRole && selectionIncluded) {
          const keys = rowKeys.filter(key => datafilteredByRecruiter.filter(int => int.id === key).length);
          setSelectedRowKeys(keys);
        }
      };
    },
    selectedRowKeys,
  };


  return (
    <PageContainer>
      <PageHeader
        title="Interviews"
        actions={

          <>
          {isAdmin || roleData.managerPermission || roleData.candidatesPermission  ||roleData.clientPermission  ||roleData.interviewsPermission  ||roleData.jobOpeningsPermission  ||roleData.onBoardingsPermission ||roleData.settingsPermission  ||roleData.suppliersPermission ?
            <Button
              type="button"
              className="btn main margin-left"
              handleClick={openForm}
            >
              <PlusOutlined className="icon" />
              Schedule Interview
            </Button>:""
        }
        
            <Button
              type="button"
              className="btn main margin-left"
              handleClick={openZoomLinks}
            >
              <EyeOutlined className="icon" /> Zoom Meetings
            </Button>
          </>
        }
      />
       <IdleTimeOutHandler 
    onActive={()=>{setIsActive(true)}} 
    onIdle={()=>{setIsActive(false)}}
    onLogout={()=>{setLogout(true)}}
    />
      <TableComponent
        loading={isLoading}
        expandedRowRender={expandedRowRender}
        data={interviewsList.map((int) => ({ ...int, key: int.id }))}
        columns={columns}
        setColumns={setColumns}
        defaultColumns={defaultColumns}
        rowSelection={isAdmin || roleData.interviewsPermission ? rowSelection :false}
        total={totalItems}
        setCurrentPage={setCurrentPage}
        setPageSize={setPageSize}
        setSort={setSort}
        setFilters={setFilters}
        filters={filters}
        searchOptions={searchOptions}
        searchList={interviewsList}
        handleSearch={searchInterview}
        openArchive={() => setOpenArchive(true)}
        openReports={() => setShowReportModal(true)}
        handleConfirmArchive={archiveInterviews}
        handleCancelArchiving={cancelArchiving}
        removeableColumns={defaultColumns
          .filter((col) => col.title !== "Candidate" && col.title)
          .map((col) => col.title)}
      />
      <IntArchive open={openArchive} setOpen={setOpenArchive} />
      
      <ReportModal
        showReportModal={showReportModal}
            setShowReportModal={setShowReportModal}
        individualReportName="interviews"
        individualList={interviewsList}
        list={interviewsList.map((int) => ({
          id: int.id,
          name: int.candidate?.fullName,
        }))}
        listLabel="Interviews"
        filename="interview_report"
        tableFields={reportTableFields()}
        pdfFormatter={reportFormats.interviewPdfFormat}
        csvExcelFormatter={reportFormats.interviewCSVExcel}
      />
     
      <ScheduleInterview loadInterviews={loadInterviews} />
    </PageContainer>
  );
};

export default ViewInterviews;