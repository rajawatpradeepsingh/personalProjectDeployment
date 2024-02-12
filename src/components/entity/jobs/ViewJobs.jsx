import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import moment from "moment";
import { config } from "../../../config";
import auth from "../../../utils/AuthService";
import AuthService from "../../../utils/AuthService";
import { getJobTableData, getFilteredJobTableData } from "../../../API/jobs/job-apis";
import { setIsAuth } from "../../../Redux/appSlice";
import { EditJobopeningModal } from "./EditJobModal";
import { statusFilter, priorityFilter } from "./job_utils/jobObjects";
import { sortAscending } from '../../../utils/service';
import ReportModal from "../../../../src/components/utils/reports/report.modal";
import { reportTableFields } from "../../entity/jobs/job_utils/jobObjects";
import reportFormats from "../../utils/reports/reportUtils";
import PopUp from "../../modal/popup/popup.component";
import Button from "../../common/button/button.component";
import { ShareJobs } from "./job_ui_helpers/share-job-components/share-job-modal";
import { TableComponent } from "../../common/table/Table";
import { TableLink } from "../../common/table/TableLink";
import { TableRecordStatus } from "../../common/table/TableRecordStatus";

import { JobsArchive } from "./job_ui_helpers/archive_modal/JobsArchive";
import { RecordWithDetails } from "../../common/table/record_with_details/RecordWithDetails";
import { JobExpanded } from './job_ui_helpers/table/JobExpanded';
import { PageContainer } from "../../container/page-container/PageContainer";
import { PageHeader } from "../../container/page-header/PageHeader";
import { SubmissionPopover } from "./job_ui_helpers/table/SubmissionPopover";
import { PlusOutlined } from "@ant-design/icons";
import { message, Table } from "antd";
import IdleTimeOutHandler from "../../ui/Dashboard/IdleTimeOutHandler";
import "antd/dist/antd.css";


const ViewJobs = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const headers = useMemo(() => AuthService.getHeaders(), []);
  const archiveRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [jobList, setJobList] = useState([]);
  const [sort, setSort] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedJobopening] = useState({});
  const [openPopUp, setOpenPopUp] = useState(false);
  const [openArchive, setOpenArchive] = useState(false);
  const [filters, setFilters] = useState({});
  const [searchOptions, setSearchOptions] = useState([]);
  const [showReportModal, setShowReportModal] = useState(false);
  const [hasRecruiterRole, setHasRecruiterRole] = useState(false);
  const [openShareModal, setOpenShareModal] = useState(false);
  const [batchSelection, setBatchSelection] = useState([]);
  const [clientFilters, setClientFilters] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [columns, setColumns] = useState([]);
  const[isActive,setIsActive]=useState(true)
  const[isLogout,setLogout]=useState(false)
  const user = useMemo(() => auth.getUserInfo(), []);
  const [roleData,setRoleData]=useState(user.roles[0]);
  const [isAdmin, setIsAdmin] = useState(false);
  const[managerRole,setManagerRole]= useState(false);
  console.log(roleData)
  useEffect(() => {
    if (auth.hasAdminRole()) setIsAdmin(true);
  }, []);

  const logout = useCallback(() => {
    AuthService.logout();
    dispatch(setIsAuth(false));
  }, [dispatch]);

  const openEditModal = useCallback((id) => {
    history.push(`/job/${id}`);
  }, [history]);

  const defaultColumns = useMemo(
    () => [
      {
        title: "Job Title",
        dataIndex: "jobTitle",
        key: "jobTitle",
        sorter: true,
        fixed: "left",
        width: 180,
        render: (job, row) => (
          <TableLink
            onClick={() => openEditModal(row.id)}
            label={job}
            extra={row.jobNumber}
          />
        ),
      },
      {
        title: "Client",
        dataIndex: "clientName",
        key: "client.clientName",
        sorter: true,
        render: (client, row) => (
          <RecordWithDetails name={client} location={row.location || ""} />
        ),
        width: 140,
        filters: clientFilters,
        filterSearch: true,
      },
      {
        title: "Created",
        dataIndex: "creationDate",
        key: "creationDate",
        render: (date) => moment(date).format("MM/DD/YYYY"),
        width: 125,
        sorter: true,
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        sorter: true,
        width: 100,
        filters: statusFilter,
        filterMultiple: false,
        render: (status) => <TableRecordStatus status={status} />
      },
      {
        title: "Priority",
        dataIndex: "priority",
        key: "priority",
        sorter: true,
        width: 105,
        filters: priorityFilter,
        filterMultiple: false,
      },
      {
        title: "Openings",
        dataIndex: "noOfJobopenings",
        key: "noOfJobopenings",
        sorter: true,
        width: 100,
        align: 'right',
            },
      
            {
              title: "Submissions",
              dataIndex: "submissionCount",
              key: "submissionCount",
              width: 100,
              align: 'right',
              render: (count, row) => (
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <SubmissionPopover records={row.submissions}>{count}</SubmissionPopover>
                </div>
              ),
            
            },
            
            
      {
        title: "Employment Type",
        dataIndex: "jobType",
        key: "jobType",
        sorter: true,
        width: 120,
      },
      {
        title: "Work Type",
        dataIndex: "workType",
        key: "workType",
        sorter: true,
        width: 100,
      },
      {
        title: "Bill Rate",
        dataIndex: "clientBillRate",
        key: "clientBillRate",
        sorter: true,
        width: 150,
      },
    ],
    [openEditModal, clientFilters]
  );

  useEffect(() => {
    setColumns(defaultColumns);
  }, [defaultColumns, clientFilters]);

  useEffect(() => {
    setHasRecruiterRole(AuthService.hasRecruiterRole());
  }, []);

  const loadJobs = useCallback(async () => {
    // setIsLoading(true);
    if (!Object.keys(filters).length) {
      const res = await getJobTableData(headers, currentPage, pageSize, sort);
      if (res.statusCode === 200) {
        setJobList(res.data);
        setTotalItems(res.totalItems);
        setIsLoading(false);
      };
    } else {
      const sortKey = Object.keys(sort)[0] ? Object.keys(sort)[0] : "";
      const sortOrder = sortKey ? sort[sortKey] : "";
      const filteredRes = await getFilteredJobTableData(headers, currentPage, pageSize, filters,sortKey ? sortKey : "id",sortOrder ? sortOrder : "desc");
      if (filteredRes.statusCode === 200) {
        setJobList(filteredRes.data);
        setTotalItems(filteredRes.totalItems);
        setIsLoading(false);
      };
    }

  }, [headers, currentPage, pageSize, sort, filters]);

  useEffect(() => {
    loadJobs();
  }, [loadJobs, filters, archiveRef?.current?.length]);

  const archiveJobs = () => {
    axios
      .all(
        selectedRowKeys.map((id) =>
          axios.delete(`${config.serverURL}/jobopenings/${id}`, { headers })
        )
      )
      .then((res) => {
        setBatchSelection([]);
        setSelectedRowKeys([]);
        loadJobs();
        archiveRef.current.loadArchive();
      })
      .catch((err) => {
        console.log(err);
        if (err.response && err.response.status === 401) logout();
      });
  };

  const editJobopening = (jobopenings, id) => {
    if (jobopenings.total_experience) {
      jobopenings.total_experience = parseInt(jobopenings.total_experience);
    }
    axios
      .patch(`${config.serverURL}/jobopenings/${id}`, jobopenings, { headers })
      .then((response) => {
        if (response.data != null) {
          loadJobs();
          message.success({
            content: "Job updated!",
            duration: 5,
            style: { marginTop: "5%" },
          });
        }
      })
      .catch((error) => {
        console.log(error);
        if (error.response && error.response.status === 401) {
          logout();
        }
        message.error({
          content: `An error occurred while saving changes (${error.response?.status})`,
          duration: 10,
        });
      });
  };

  const handlePopUpSubmit = () => {
    archiveJobs();
    setOpenPopUp(false);
  };

  const handlePopUpCancel = () => {
    setBatchSelection({});
    setOpenPopUp(false);
  };

  const searchJobs = useCallback(
    (value) => {
      //after applying a search in a filter request all search endpoints could be removed
      setFilters({ ...filters, search: value });
    },
    [filters]
  );

  const getSearchSuggestions = useCallback((obj) => {
    let suggestions = [];
    for (let key in obj) {
      if (
        (typeof obj[key] === "string" || typeof obj[key] === "number") &&
        key !== "id"
      ) {
        if (key === "location") {
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
    if (jobList) {
      let options = [];
      for (let obj of jobList) {
        let results = getSearchSuggestions(obj);
        results.forEach((item) => {
          if (!options.includes(item)) options.push(item);
        });
      }
      setSearchOptions(options);
    }
  }, [jobList, filters, getSearchSuggestions]);


  const handleOpenShareModal = () => setOpenShareModal(true);

  const closeShareModal = (status) => {
    setOpenShareModal(false);
    if (status === 200) message.success("Email(s) sent successfully!");
    setSelectedRowKeys([]);
    setBatchSelection([]);
  };

  const openForm = () => {
    history.push("/addjob");
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (rowKeys, selectedRows) => {
      isAdmin || roleData.projectsPermission ?
      setSelectedRowKeys(rowKeys): setSelectedRowKeys([]);
      setBatchSelection(selectedRows);
    },
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_NONE,
      ...sortAscending("text", clientFilters).map((cl) => ({
        key: cl.value,
        text: <span><span style={{ fontWeight: 200, color: "var(--tertiary)" }}>client:</span>{" "}{cl.text}</span>,
        onSelect: () => {
          let newSelection = [];
          newSelection = jobList.filter((j) => j.client.id === cl.value);
          setSelectedRowKeys(newSelection.map((j) => j.id));
          setBatchSelection(newSelection);
        },
      })),
    ],
  };

  const cancelArchiving = () => {
    setSelectedRowKeys([]);
  };

  const getClientFilters = useCallback(async () => {
    await axios.get(`${config.serverURL}/clients?dropdownFilter=true`, { headers })
      .then((response) => {
        if (response.data) {
          setClientFilters(response.data.map(client => ({
            text: `${client.clientName} (${client.address?.city})`,
            value: client.id
          })));
        }
      })
      .catch((err) => console.log(err));
  }, [headers]);


  useEffect(() => getClientFilters(), [getClientFilters]);

  return (
    <PageContainer>
      <PageHeader
        title="Job Openings"
        actions={
          !hasRecruiterRole && 
          (isAdmin || roleData.jobOpeningsPermission  ?
            <Button
              type="button"
              className="btn main margin-left"
              handleClick={openForm}
            >
              <PlusOutlined className="icon" />
              Add Job Opening
            </Button>:""
          )
        }
      />
       <IdleTimeOutHandler 
    onActive={()=>{setIsActive(true)}} 
    onIdle={()=>{setIsActive(false)}}
    onLogout={()=>{setLogout(true)}}
    />
      <TableComponent
        loading={isLoading}
        data={jobList.map((job) => ({ ...job, key: job.id }))}
        columns={columns}
        setColumns={setColumns}
        defaultColumns={defaultColumns}
        rowSelection={isAdmin || roleData.jobOpeningsPermission ? rowSelection :false}
        expandedRowRender={(row) => <JobExpanded row={row} />}
        total={totalItems}
        setCurrentPage={setCurrentPage}
        setPageSize={setPageSize}
        setSort={setSort}
        setFilters={setFilters}
        filters={filters}
        searchOptions={searchOptions}
        searchList={jobList}
        handleSearch={searchJobs}
        openArchive={() => setOpenArchive(true)}
        openReports={() => setShowReportModal(true)}
        handleConfirmArchive={archiveJobs}
        handleCancelArchiving={cancelArchiving}
        openShareModal={handleOpenShareModal}
        removeableColumns={defaultColumns
          .filter((col) => col.title !== "Job Title" && col.title)
          .map((col) => col.title)}
      />
      <ShareJobs
        open={openShareModal}
        close={closeShareModal}
        jobs={batchSelection}
      />
      <JobsArchive
        open={openArchive}
        setOpen={setOpenArchive}
        ref={archiveRef}
      />
     
      <ReportModal
        showReportModal={showReportModal}
            setShowReportModal={setShowReportModal}
        individualReportName="jobopenings"
        individualList={jobList}
          list={jobList?.map((job) => ({ id: job.id, name: job.jobTitle }))}
        listLabel="Job Openings"
        filename="job_opening_report"
        tableFields={reportTableFields()}
        pdfFormatter={reportFormats.jobPdfFormat}
        csvExcelFormatter={reportFormats.jobCSVExcel}
      />
      <EditJobopeningModal
        showModal={showModal}
        setShowModal={setShowModal}
        selectedJobopening={selectedJobopening}
        submitChange={editJobopening}
      ></EditJobopeningModal>
      <PopUp
        openModal={openPopUp}
        type={"warning"}
        confirmValue="Archive"
        cancelValue="CANCEL"
        handleConfirmClose={handlePopUpSubmit}
        closePopUp={handlePopUpCancel}
        message={{
          title: "Confirm Action",
          details: `Are you sure you want to archive selection?`,
        }}
      ></PopUp>
    </PageContainer>
  );
};

export default ViewJobs;
