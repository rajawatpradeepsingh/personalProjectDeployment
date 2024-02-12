import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useHistory } from "react-router-dom";
import auth from "../../../utils/AuthService";
import Button from "../../common/button/button.component";
import { PageContainer } from "../../container/page-container/PageContainer";
import { PageHeader } from "../../container/page-header/PageHeader";
import { TableComponent } from "../../common/table/Table";
import { TableLink } from "../../common/table/TableLink";
import { RecordWithDetails } from "../../common/table/record_with_details/RecordWithDetails";
import { message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import IdleTimeOutHandler from "../../ui/Dashboard/IdleTimeOutHandler";
import moment from "moment";
import { ProjectArchive } from "./archive_modal/ProjectArchive";
import { getProjectByParams,getProjects,archiveProjects } from "../../../API/projects/projects-apis";
import axios from "axios";
import { config } from "../../../config";
import { reportTableFields } from "./ProjectsObjects";
import ReportModal from "../../utils/reports/report.modal";
import reportFormats from "../../utils/reports/reportUtils";

const ViewProjects = () => {
  const history = useHistory();
  const headers = useMemo(() => auth.getHeaders(), []);
  const archiveRef = useRef(null);
  const [openArchive, setOpenArchive] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [projectsList, setProjectsList] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchOptions, setSearchOptions] = useState([]);
  const [sort, setSort] = useState({});
  const [filters, setFilters] = useState({});
  const [columns, setColumns] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const[isActive,setIsActive]=useState(true);
  const[isLogout,setLogout]=useState(false);
  const [clientFilters, setClientFilters] = useState([]);
  const [workerFilters, setWorkerFilters] = useState([]);
  const [resourceManagerFilters, setResourceManagerFilters] = useState([]);
   //const [convertDataForReport, ConvertDataForReport] = useState([]);
   const user = useMemo(() => auth.getUserInfo(), []);
  const [roleData,setRoleData]=useState(user.roles[0]);

  useEffect(() => {
    if (auth.hasAdminRole()) setIsAdmin(true);
  }, []);

  const openEditPage = useCallback((id) => {
    history.push(`/projects/${id}`);
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

  const getResourceManagerFilters = useCallback(async () => {
    await axios
    .get(config.serverURL + "/resourcemanager?dropdownFilter=true&role=SALESMANAGER", { headers })
    .then((response) => {
        if (response.data) {
          setResourceManagerFilters(
            response.data.map((resourceManager) => ({
              text: `${resourceManager.firstName} (${resourceManager.lastName})`,
              value: resourceManager.resourceManagerId,
            }))
          );
        }
      })
      
      .catch((err) => console.log(err));
  }, [headers]);

  useEffect(() => getResourceManagerFilters(), [getResourceManagerFilters]);

  const defaultColumns = useMemo(
    () => [
      {
        title: "Project",
        dataIndex: "projectName",
        key: "projectName",
        sorter: true,
        fixed: "left",
        width: 170,
        render: (project,row) => (
          <TableLink
          label={`${project} `}
          onClick={() => openEditPage(row.id)}
          extra={row.projectNumber}
        />      )
        
      },
      {
        title: "Worker",
        dataIndex: "worker",
        key: "worker.firstName",
       filters: workerFilters,
        sorter: true,
        fixed: "left",
        width: 170,
        render: (worker, row) => (
          <TableLink
            label={`${worker.firstName} ${worker.lastName}`}
            onClick={() => openEditPage(row.id)}
          />
        ),
        filterSearch: true
      },
      {
        title: "Client",
        dataIndex: "client",
        key: "client.clientName",
        width: 120,
        sorter: true,
        filters: clientFilters,
        render: (client) => (
          <RecordWithDetails name={client.clientName} location={`${client.address?.city}`}/>
        ),
        filterSearch: true
      },
      
    {
    title:"Start Date",
    dataIndex: "startDate",
    key: "startDate",
    sorter: true,
    render: (date) => moment(date).format("MM/DD/YYYY"),
  
  
  } ,{
    title:"End Date",
    dataIndex: "endDate",
    key: "endDate",
    sorter: true,
    render: (date) => moment(date).format("MM/DD/YYYY"),
  } ,
  {
    title: "Resource Manager",
    dataIndex: "resourceManager",
    key: "resourceManager.firstName",
    width: 120,
    sorter: true,
    // filters: resourceManagerFilters,
    render: (resourceManager) => (
      <RecordWithDetails name= {`${resourceManager?.firstName} ${resourceManager?.lastName}`}/>
    ),
    filters: resourceManagerFilters,
    filterSearch: true
  },
  {
    title: "Client Rate",
    dataIndex: "clientRate",
    key: "clientRate",
    render: (clientRate) => <div style={{ textAlign: 'right', marginLeft: '10px' }}>{Number(clientRate).toFixed(2)}</div>,
  },
  {
    title: "VMS Adjusted Bill Rate",
    // width: 145,
    dataIndex: "billRate",
    key: "billRate",
    render: (billRate) => <div style={{ textAlign: 'right', marginLeft: '10px' }}>{Number(billRate).toFixed(2)}</div>,
  },
  {
    title: "Rebate Adjusted Bill Rate",
    dataIndex: "netBillRate",
    key: "netBillRate",
    render: (netBillRate) => <div style={{ textAlign: 'right', marginLeft: '10px' }}>{Number(netBillRate).toFixed(2)}</div>,
  }
  
  
     
      
    ], [workerFilters,clientFilters,resourceManagerFilters]);

  useEffect(() => {
    setColumns(defaultColumns);
  }, [defaultColumns]);

  const loadProject = useCallback(async () => {
    const pages = `pageNo=${currentPage}&pageSize=-1`;
    if (!Object.keys(filters).length) {
      let params = `?${pages}`;
      for (const key in sort) {
        if (key) {
          params += `&orderBy=${key}&orderMode=${sort[key]}`;
        }
      }
      const res = await getProjectByParams(headers, params);
      if (res) setIsLoading(false);
      if (res.statusCode === 200) {
        setProjectsList(res.tableData);
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
      const res = await getProjects(headers, currentPage, pageSize, sortParams ? sortParams : `&orderBy=id&orderMode=desc`  , filterBy);
      if (res) setIsLoading(false);
      if (res.status === 200) {
        setProjectsList(res.data);
        setTotalItems(res.totalItems);
      }
      if (res.status !== 200) message.error("Something's gone wrong, refresh page or contact your system admin");
  }
  
  }, [headers, currentPage, pageSize, sort, filters]);

  useEffect(() => {
    loadProject();
  }, [loadProject, filters, archiveRef?.current?.length]);


  const archiveProject = async () => {
    const status = await archiveProjects(headers, selectedRowKeys);
    if (status === 200) {
      loadProject();
      message.success("Project record archived successfully!");
      archiveRef.current.loadArchive();
      setSelectedRowKeys([]);
    } else {
      message.error("Something's gone wrong, refresh page or contact your system admin");
    }
  };

  useEffect(() => {
    loadProject();
  }, [loadProject]);

  const searchProject = useCallback((value) => setFilters({ ...filters, search: value }), [filters]);

  const getSearchSuggestions = useCallback((obj) => {
    let suggestions = [];
    for (let key in obj) {
      if (
        (typeof obj[key] === "string" || typeof obj[key] === "number") &&
        key !== "id" &&
        obj[key] !== ""
      ) {
        if (key === "projectName") {
          let values = obj[key].split(", ");
          suggestions.push(values[0], values[1], values[2]);
        } 

        else {
          suggestions.push(obj[key]);
        }
      } else if (typeof obj[key] === "object") {
        suggestions = suggestions.concat(getSearchSuggestions(obj[key]));
      }
    }
    return suggestions;
  }, []);

  useEffect(() => {
    if (projectsList) {
      let options = [];
      for (let obj of projectsList) {
        let results = getSearchSuggestions(obj);
        results.forEach((item) => {
          if (!options.includes(item)) options.push(item);
        });
      }
      setSearchOptions(options);
    }
  }, [projectsList, getSearchSuggestions]);

  const openForm = () => {
    history.push("/addprojects");
  };

  const rowSelection = {
    onChange: (rowKeys, selectedRows) => {
      isAdmin || roleData.projectsPermission ? setSelectedRowKeys(rowKeys) : setSelectedRowKeys([]);
    },
    selectedRowKeys,
  };

  const cancelArchiving = () => {
    setSelectedRowKeys([]);
  };


  return (
    <PageContainer>
      <PageHeader
        title="Projects"
        actions={
          (isAdmin || roleData.projectsPermission ?
            <Button type="button" className="btn main" handleClick={openForm}>
              <PlusOutlined className="icon" />
              Add Project
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
        data={projectsList.map((project) => ({
          ...project,
          key: project.id,
        }))}
        columns={columns}
        setColumns={setColumns}
        defaultColumns={defaultColumns}
        rowSelection={isAdmin || roleData.projectsPermission ? rowSelection :false}
        total={totalItems}
        setCurrentPage={setCurrentPage}
        setPageSize={setPageSize}
        setSort={setSort}
        setFilters={setFilters}
        filters={filters}
        searchOptions={searchOptions}
        searchList={projectsList}
        handleSearch={searchProject}
        openArchive={() => setOpenArchive(true)}
        openReports={() => setShowReportModal(true)}
        handleConfirmArchive={archiveProject}
        handleCancelArchiving={cancelArchiving}
        removeableColumns={defaultColumns
          .filter((col) => col.title !== "Project" && col.title)
          .map((col) => col.title)}
      />

<ReportModal
        showReportModal={showReportModal}
        setShowReportModal={setShowReportModal}
        individualReportName="projects"
        individualList={projectsList}
        list={projectsList.map((project) => ({
          id: project.id,
          name: `${project.projectName}`,
        }))}
        listLabel="Projects"
        filename="project_report"
        tableFields={reportTableFields()}
        pdfFormatter={reportFormats.projectPdfFormat}
        csvExcelFormatter={reportFormats.projectCSVExcel}
      />

<ProjectArchive
       open={openArchive}
       setOpen={setOpenArchive}
       ref={archiveRef}
      />
    </PageContainer>
  );
};

export default ViewProjects;