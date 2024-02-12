import React, { useEffect, useState, useMemo, useCallback,useRef } from "react";
import Button from "../../common/button/button.component";
import { TableComponent } from "../../common/table/Table";
import { PageContainer } from "../../container/page-container/PageContainer";
import { PageHeader } from "../../container/page-header/PageHeader";
import { PlusOutlined } from "@ant-design/icons";
import "antd/dist/antd.css";
import { useHistory } from "react-router-dom";
import moment from "moment";
import axios from "axios";
import { config } from "../../../config";
import auth from "../../../utils/AuthService";
import { useDispatch } from "react-redux";
import { message } from "antd"; 
import { getTimeSheet,getTimeSheetByParams } from "../../../API/timesheet/timesheet apis";
import { archiveTimesheets } from "../../../API/timesheet/timesheet apis";
import { TimesheetArchive } from "./archive_modal/TimesheetArchive";
import { TableLink } from "../../common/table/TableLink";
import ReportModal from "../../../../src/components/utils/reports/report.modal";
import reportFormats from "../../utils/reports/reportUtils";
import { reportTableFields } from "./timesheet utils/timesheetObjects";

import { timesheetStatus } from "../../../utils/defaultData";
const ViewTimesheet = () => {
  const headers = useMemo(() => auth.getHeaders(), []);
  const history = useHistory();
  const [filters,setFilters] = useState({});
  const [columns, setColumns] = useState([]);
 
  const [timesheetList, setTimeSheetList] = useState([]);
  const [sort, setSort] = useState({});
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [pageSize, setPageSize]= useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const archiveRef = useRef(null);
  const [openArchive, setOpenArchive] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchOptions, setSearchOptions] = useState([]);
  const user = useMemo(() => auth.getUserInfo(), []);
  const [roleData,setRoleData]=useState(user.roles[0]);
  const [showReportModal, setShowReportModal] = useState(false);
  const [workerFilters, setWorkerFilters] = useState([]);
  const [clientFilters, setClientFilters] = useState([]);
  const [timeSheetStatusFilters, setTimeSheetStatusFilters] = useState([]);

  useEffect(() => {
    if (auth.hasAdminRole()) setIsAdmin(true);
  }, []);
  const openForm = () => {
    history.push("/addtimesheet");
  }
 const rowSelection = {
    onChange: (rowKeys, selectedRows) => {
      isAdmin || roleData.timesheetPermission ? setSelectedRowKeys(rowKeys) : setSelectedRowKeys([]);
    },
    selectedRowKeys,
  };

  const openEditPage = useCallback((id) => {
    history.push(`/timesheet/${id}`);
  }, [history]);

  const cancelArchiving = () => {
    setSelectedRowKeys([]);
  };

  const searchTimesheet = useCallback(
    (value) => {
      setFilters({ ...filters, search: value });
    },
    [filters]
  );

  const getSearchSuggestions = useCallback((obj) => {
    let suggestions = [];
    for (let key in obj) {
      if (
        (typeof obj[key] === "string" || typeof obj[key] === "number") &&
        key !== "id" &&
        obj[key] !== ""
      ) {
        suggestions.push(obj[key]);
      } else if (typeof obj[key] === "object") {
        suggestions = suggestions.concat(getSearchSuggestions(obj[key]));
      }
    }
    return suggestions;
  }, []);
  const getWorkerFilters = useCallback(async () => {
    await axios
      .get(`${config.serverURL}/worker?dropdownFilter=true`, { headers })
      .then((response) => {
        if (response.data) {
          setWorkerFilters(
            response.data.map((wrk) => ({
              text: `${wrk.firstName} (${wrk.lastName})`,
              value: wrk.id,
            }))
          );
        }
      })
      .catch((err) => console.log(err));
  }, [headers]);

  useEffect(() => getWorkerFilters(), [getWorkerFilters]);

 
  

  const getClientFilters = useCallback(async () => {
    await axios
      .get(`${config.serverURL}/clients?dropdownFilter=true`, { headers })
      .then((response) => {
        if (response.data) {
          setClientFilters(
            response.data.map((client) => ({
              text: `${client.clientName} `,
              value: client.clientName,
            }))
          );
        }
      })
      .catch((err) => console.log(err));
  }, [headers]);

  useEffect(() => getClientFilters(), [getClientFilters]);

  useEffect(() => {
    if (timesheetList) {
      let options = [];
      for (let obj of timesheetList) {
        let results = getSearchSuggestions(obj);
        results.forEach((item) => {
          if (!options.includes(item)) options.push(item);
        });
      }
      setSearchOptions(options);
    }
  }, [timesheetList, filters, getSearchSuggestions]);
console.log(timesheetList);
  const defaultColumns = useMemo(() => [
   
    {
      title: "WorkerName",
      dataIndex: "worker",
    key: "worker.firstName",
    filters: workerFilters,
      sorter: true,
      fixed: "left",
      width: 170,
      render: (worker,row) => (
        <TableLink
        label={`${worker?.firstName} ${worker?.lastName}`}
        onClick={() => openEditPage(row.id)}
      />

      )
    }, 
  
    {
      title: "Client",
      key:"clientId",
      dataIndex: "clientId",
      width: 120,
      sorter: true,
      filters: clientFilters,
      
      // render: (workOrder,row,client) => (
      //      <span>
      //        {`${workOrder?.workOrder?.project?.client?.clientName}`}
      //       </span>
      //     )
     
    },
    // {
    //   title: "Client",
    //   key: "clientId",
    //   dataIndex: "clientId",
    //   width: 120,
    //   sorter: true,
    //   filters: clientFilters,
     
     
    // },
    
    {
      title: "Status",
      dataIndex: "timeSheetStatus",
      sorter: true,
      key: "timeSheetStatus",
      width: 160,
      ellipsis: true,
      // filterMultiple: false,
      filters: timesheetStatus.map((timesheetStatus) => ({
        text:timesheetStatus,
        value:timesheetStatus
      })),
    },
    {
      title: "Updated On",
      dataIndex: "updatedOn",
      key: "updatedOn",
      render: (date) => date ? moment(date).format("MM/DD/YYYY") : ""
    },

    {
      title: "Billable Hours",
      // dataIndex: "billableHours",
      // key: "billableHours",
      render: (timeSheetDetails,row) => (
        <span style={{paddingLeft:"100px"}}>
         {`${timeSheetDetails?.billableHours || ""}`}
         </span>
       )
    },

    {
      title: "Timesheet EndDate",
      render: (timeSheetDetails,row) => (
       <span>
        {`${timeSheetDetails?.timesheetWeekDays?.sundayDate || ""}`}
       </span>
      )
    },

    {
      title: "Timesheet Attachment",
      render: (timeSheetDetails,row) => (
        <span>
         {`${timeSheetDetails?.resume?.resumeName || ""}`}
        </span>
       )
    }, 
    
    {
      title: "Comment",
      dataIndex: "comments",
      key: "comments",
    },
   
    
  ], [workerFilters,clientFilters]);

  useEffect(() => {
    setColumns(defaultColumns);
  }, [defaultColumns]);

  const loadTimeSheet = useCallback(async () => {
    const pages = `pageNo=${currentPage}&pageSize=-1`;
    if (!Object.keys(filters).length) {
      let params = `?${pages}`;
      for (const key in sort) {
        if (key) {
          params += `&orderBy=${key}&orderMode=${sort[key]}`;
        }
      }
      const res = await getTimeSheetByParams(headers, params);
      if (res) setIsLoading(false);
      if (res.statusCode === 200) {
        setTimeSheetList(res.tableData);
        setTotalItems(res.totalItems);
      }
      if (res.statusCode !== 200) message.error("Something's gone wrong, refresh page or contact your system admin");
    } else {
      let sortParams = "";
      for (const key in sort) {
        if (key) {
          sortParams += `&orderBy=${key}&orderMode=${sort[key]}`;
        }
      }
      const filterBy = !Object.keys(filters).length ? null : filters;
      setIsLoading(true);
      const res = await getTimeSheet(headers, currentPage, pageSize, sortParams ? sortParams : `&orderBy=id&orderMode=desc`  , filterBy);
      if (res) setIsLoading(false);
      if (res.status === 200) {
        setTimeSheetList(res.data);
        setTotalItems(res.totalItems);
      }
      if (res.status !== 200) message.error("Something's gone wrong, refresh page or contact your system admin");
  }
  
  }, [headers, currentPage, pageSize, sort, filters]);
  useEffect(() => {
    loadTimeSheet();
  }, [loadTimeSheet, filters, archiveRef?.current?.length]);
  const archiveTimesheet = async () => {
    const status = await archiveTimesheets(headers, selectedRowKeys);
    if (status === 200) {
      loadTimeSheet();
      message.success("Timesheet record archived successfully!");
      archiveRef.current.loadArchive();
      setSelectedRowKeys([]);
    } else {
      message.error("Something's gone wrong, refresh page or contact your system admin");
    }
  };

  useEffect(() => {
    loadTimeSheet();
  }, [loadTimeSheet]);
  return (
    <PageContainer>
      <PageHeader
        title="TimeSheet"
        actions={
          (isAdmin || roleData.timesheetPermission ?
            <Button
              type="button"
              className="btn main margin-left"
              handleClick =  {openForm}
            >
              <PlusOutlined className="icon" /> 
              Add TimeSheet
            </Button>:"")
          
        }
      />
      <TableComponent
              openReports={() => setShowReportModal(true)}
loading={isLoading}
        columns={columns}
        setColumns={setColumns}
        defaultColumns={defaultColumns}
        filters={filters}
        rowSelection={isAdmin || roleData.timesheetPermission? rowSelection :false}
      total={totalItems}
      setSort={setSort}
      setPageSize={setPageSize}
      setCurrentPage={setCurrentPage}
      setFilters={setFilters}
      searchOptions={searchOptions}
      searchList={timesheetList}
      handleSearch={searchTimesheet}
     openArchive={() => setOpenArchive(true)}
     handleConfirmArchive={archiveTimesheet}
      handleCancelArchiving={cancelArchiving}
        data={timesheetList.map((timesheet) => ({ ...timesheet, key: timesheet.id }))}
        removeableColumns={defaultColumns
          .filter((col) => col.title !== "TimeSheet" && col.title)
          .map((col) => col.title)}
      />
      <ReportModal
        showReportModal={showReportModal}
        setShowReportModal={setShowReportModal}
        individualReportName="timesheet"
        individualList={timesheetList}
        list={timesheetList.map((timesheet) => ({
          id: timesheet.id,
          name: `${timesheet.worker.firstName + " " + timesheet.worker.lastName}`,
        }))}
        listLabel="TimeSheet"
        filename="timesheet_report"
        tableFields={reportTableFields()}
        pdfFormatter={reportFormats.timesheetPdfFormat}
        csvExcelFormatter={reportFormats.timesheetCSVExcel}
      />

      
      <TimesheetArchive
       open={openArchive}
       setOpen={setOpenArchive}
       ref={archiveRef}
      />
      

    </PageContainer>
  );
};

export default ViewTimesheet;