
import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useHistory } from "react-router-dom";
import moment from "moment";
import axios from "axios";
import { config } from "../../../config";
import auth from "../../../utils/AuthService.js";
import { formatPhoneNumberIntl } from "react-phone-number-input";
import { getWorkers, archiveWorkers,getWorkerByParams } from "../../../API/workers/worker-apis.js";
import { generateOptions } from "./worker_utils/utils.js";
import reportFormats from "../../utils/reports/reportUtils";
import { reportTableFields } from "./worker_utils/workerObjects";
import Button from "../../common/button/button.component.jsx";
import { PageContainer } from "../../container/page-container/PageContainer.jsx";
import { PageHeader } from "../../container/page-header/PageHeader.jsx";
import { TableComponent } from "../../common/table/Table";
import { TableLink } from "../../common/table/TableLink";
import { Boolean } from "../../common/table/boolean/Boolean.jsx";
import { RecordWithDetails } from "../../common/table/record_with_details/RecordWithDetails.jsx";
import { WorkersArchive } from "./worker_ui_helpers/archive_modal/WorkersArchive.jsx";
import ReportModal from "../../utils/reports/report.modal";
import AddWorker from "./AddWorker";
import { PlusOutlined, EyeOutlined } from "@ant-design/icons";
import IdleTimeOutHandler from "../../ui/Dashboard/IdleTimeOutHandler";
import { message } from "antd";
import "antd/dist/antd.css";
import {  workerStatus } from "../../../utils/defaultData";
import {  recordStatus } from "../../../utils/defaultData";


const ViewWorkers = () => {
  const history = useHistory();
  const headers = useMemo(() => auth.getHeaders(), []);
  const archiveRef = useRef(null);
  const [workerList, setWorkerList] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize, setPageSize]= useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [openArchive, setOpenArchive] = useState(false);
  const [filters, setFilters] = useState({});
  const [showReportModal, setShowReportModal] = useState(false);
  const [sort, setSort] = useState({});
  const [searchOptions, setSearchOptions] = useState([]);
  const [columns, setColumns] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [clientFilters, setClientFilters] = useState([]);
  const [openAddWorker, setOpenAddWorker] = useState(false);
   const[isActive,setIsActive]=useState(true)
  const[isLogout,setLogout]=useState(false)
  const [resourceManagerFilters, setResourceManagerFilters] = useState([]);

  //const [resourceManagerFilters, setResourceManagerFilters] = useState([]);
  const user = useMemo(() => auth.getUserInfo(), []);
  const [roleData,setRoleData]=useState(user.roles[0]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [workerFilter, setWorkerFilters] = useState([]);
 


  useEffect(() => {
    
    if (auth.hasAdminRole()) setIsAdmin(true);
  }, []);
 

  const openEditPage = useCallback((id) => {
    history.push(`/worker/${id}`);
  }, [history]);

  const getClientFilters = useCallback(async () => {
    await axios
      .get(`${config.serverURL}/clients?dropdownFilter=true`, { headers })
      .then((response) => {
        if (response.data) {
          setClientFilters(
            response.data.map((client) => ({
              text: `${client.clientName} (${client.address?.city})`,
              value: client.id,
            }))
          );
        }
      })
      .catch((err) => console.log(err));
  }, [headers]);

  useEffect(() => getClientFilters(), [getClientFilters]);
  const getResourceManagerFilters = useCallback(async () => {
    await axios
      .get(`${config.serverURL}/resourcemanager?dropdown=true`, { headers })
      .then((response) => {
        if (response.data) {
          setResourceManagerFilters(
            response.data.map((resourceManager) => ({
              text: `${resourceManager?.firstName} ${resourceManager?.lastName}`,
              value: resourceManager.resourceManagerId,
            }))
          );
        }
      })
      
      .catch((err) => console.log(err));
  }, [headers]);

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

  useEffect(() => getResourceManagerFilters(), [getResourceManagerFilters]);
  const defaultColumns = useMemo(() => [
    {
      title: "Name",
      dataIndex: "firstName",
      key: "firstName",
      fixed: "left",
      width: 170,
      sorter: true,
      filters:workerFilter,
      render: (firstName, row) => (
          <TableLink label={`${firstName} ${row.lastName}`} onClick={() => openEditPage(row.id)} />
        ),
    },
    {
      title: "Contact",
      dataIndex: "email",
      key: "email",
      width: 160,
      ellipsis: true,
      render: (email, row) => (
        <RecordWithDetails name={email} location={row.phoneNumber ? formatPhoneNumberIntl(row.phoneNumber) : ""}/>
      )
    },
    {
      title: "Location",
      dataIndex: "address",
      key: "address.city",
      width: 120,
      sorter: true,
      render: (add) => (
        <RecordWithDetails name={add.city} location={`${add?.state}, ${add?.country}`}/>
      )
    },
    {
      title: "Active Date",
      dataIndex: "createdDate",
      key: "createdDate",
      sorter: true,
      width: 110,
      render: (date) => date ? moment(date).format("MM/DD/YYYY") : ""
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      filters: workerStatus.map((status) => ({
        text: status,
        value: status,
      })),
      render: (status) => <span className={`table-record-status ${status && status.toLowerCase()}`}>{status}</span>
    },
    {
      title: "Client",
      dataIndex: "client",
      key: "client.clientName",
      width: 120,
      filters: clientFilters,
      sorter: true,
      render: (client) => (
        <RecordWithDetails name={client.clientName} location={`${client.address?.city}`}/>
      )
    },
    {
      title: "Record Status",
      dataIndex: "workerStatus",
      key: "workerStatus",
      width: 120,
      filters: recordStatus.map((status) => ({
        text: status,
        value: status,
      })),
      render: (workerStatus, row) => (
        <div>
          {workerStatus === "Completed" && (
          <span style={{ width: "120px", display: "inline-block", textAlign: "center" ,color:"green"}}>{workerStatus}</span>

          )}
             {workerStatus === "Pending" && (
               <span style={{ width: "120px", display: "inline-block", textAlign: "center" ,color:"red"}}>{workerStatus}</span>

          )}
        </div>
      ),    },
    {
      title: "C2C Pay Rate",
      dataIndex: "netPayRate",
      key: "netPayRate",
      width: 120,
      render: (netPayRate, row) => (
        <div className="bill" style={{ textAlign: 'center' }}>
          <span>{row.currency}</span>
          <span style={{ marginLeft: '10px' }}>{Number(netPayRate).toFixed(2)}</span>
        </div>
      ),
    },
    
    {
      title: "Resource Manager",
      dataIndex: "resourceManager",
      key: "resourceManager.firstName",
      width: 120,
      sorter: true,
     filters: resourceManagerFilters,
      render: (resourceManager) => (
        <RecordWithDetails name= {`${resourceManager?.firstName} ${resourceManager?.lastName}`}/>
      )
    },
  ], [openEditPage, clientFilters,resourceManagerFilters,workerFilter]);

  

  useEffect(() => {
    setColumns(defaultColumns);
  }, [defaultColumns, clientFilters]);

  const loadWorkers = useCallback(async () => {
    const pages = `pageNo=${currentPage}&pageSize=-1`;
    if (!Object.keys(filters).length) {
      let params = `?${pages}`;
      for (const key in sort) {
        if (key) {
          params += `&orderBy=${key}&orderMode=${sort[key]}`;
        }
      }
      const res = await getWorkerByParams(headers, params);
      if (res) setIsLoading(false);
      if (res.statusCode === 200) {
        setWorkerList(res.tableData);
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
      const res = await getWorkers(headers, currentPage, pageSize, sortParams ? sortParams : `&orderBy=id&orderMode=desc`  , filterBy);
      if (res) setIsLoading(false);
      if (res.status === 200) {
        setWorkerList(res.data);
        setTotalItems(res.totalItems);
      }
      if (res.status !== 200) message.error("Something's gone wrong, refresh page or contact your system admin");
  }
  
  }, [headers, currentPage, pageSize, sort, filters]);

  useEffect(() => {
    loadWorkers();
  }, [loadWorkers, filters, archiveRef?.current?.length]);

  const archiveWorker = async () => {
    const res = await archiveWorkers(headers, selectedRowKeys);
    if (res.status === 200) {
      loadWorkers();
      message.success("Worker record archived successfully!");
      archiveRef.current.loadArchive();
      setSelectedRowKeys([]);
    } else {
      message.error("Something's gone wrong, refresh page or contact your system admin");
    }
  };

  const searchWorker = useCallback((value) => setFilters({ ...filters, search: value }), [filters]);

  useEffect(() => {
    if (workerList.length) setSearchOptions(generateOptions(workerList));
  }, [workerList]);

  const redirect = (path) => {
    history.push(path);
  };

  const rowSelection = {
    onChange: (rowKeys) => {
      isAdmin || roleData.workerPermission ? setSelectedRowKeys(rowKeys) : setSelectedRowKeys([]);
    },
    selectedRowKeys,
  };

  const cancelArchiving = () => {
    setSelectedRowKeys([]);
  };

  return (
    <PageContainer>
      <PageHeader
        title="Workers"
        actions={
          <>
            {
           ( isAdmin || roleData.workerPermission ?
              <Button
                type="button"
                className="btn main margin-left"
                handleClick={() => setOpenAddWorker(true)}
              >
                <PlusOutlined className="icon" />
                Add Worker
              </Button>:""
            )}

            <Button
              type="button"
              className="btn main margin-left"
              handleClick={() => redirect("/viewvisatrackings")}
            >
              <EyeOutlined className="icon" />
              View Visa Details
            </Button>
            <Button
              type="button"
              className="btn main margin-left"
              handleClick={() => redirect("/viewratecards")}
            >
              <EyeOutlined className="icon" />
              View Rate Card
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
        data={workerList.map((worker) => ({
          ...worker,
          key: worker.id,
        }))}
        columns={columns}
        setColumns={setColumns}
        defaultColumns={defaultColumns}
        rowSelection={isAdmin || roleData.workerPermission? rowSelection :false}
        total={totalItems}
        setCurrentPage={setCurrentPage}
        setPageSize={setPageSize}
        setSort={setSort}
        setFilters={setFilters}
        filters={filters}
        searchOptions={searchOptions}
        searchList={workerList}
        handleSearch={searchWorker}
        openArchive={() => setOpenArchive(true)}
        openReports={() => setShowReportModal(true)}
        handleConfirmArchive={archiveWorker}
        handleCancelArchiving={cancelArchiving}
        removeableColumns={defaultColumns
          .filter((col) => col.title !== "Name" && col.title)
          .map((col) => col.title)}
      />
      <ReportModal
        showReportModal={showReportModal}
        setShowReportModal={setShowReportModal}
        individualReportName="worker"
        individualList={workerList}
        list={workerList.map((worker) => ({
          id: worker.id,
          name: `${worker.firstName + " " + worker.lastName}`,
        }))}
        listLabel="Workers"
        filename="worker_report"
        tableFields={reportTableFields()}
        pdfFormatter={reportFormats.workerPdfFormat}
        csvExcelFormatter={reportFormats.workerCSVExcel}
      />
      <WorkersArchive
        open={openArchive}
        setOpen={setOpenArchive}
        ref={archiveRef}
      />
      <AddWorker
        open={openAddWorker}
        setOpen={setOpenAddWorker}
        refresh={loadWorkers}
      />
    </PageContainer>
  );
};

export default ViewWorkers;


