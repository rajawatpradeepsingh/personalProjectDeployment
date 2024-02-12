import { useEffect, useState, useMemo, useCallback,useRef } from "react";
import Button from "../../common/button/button.component";
import { TableComponent } from "../../common/table/Table";
import { PageContainer } from "../../container/page-container/PageContainer";
import { PageHeader } from "../../container/page-header/PageHeader";
import { PlusOutlined } from "@ant-design/icons";
import "antd/dist/antd.css";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { config } from "../../../config";
import auth from "../../../utils/AuthService";
import { getWorkOrders,getWorkorderByParams } from "../../../API/workorder/workOrder-apis";
import { message } from "antd";
import { RecordWithDetails } from "../../common/table/record_with_details/RecordWithDetails";
import moment from "moment";
import { TableLink } from "../../common/table/TableLink";
import { archiveWorkorder } from "../../../API/workorder/workOrder-apis";
import { WorkOrderArchive } from "./Archive_modal/WorkOrderArchive";
import reportFormats from "../../utils/reports/reportUtils";
import ReportModal from "../../utils/reports/report.modal";
import { reportTableFields } from "../worker/WorkOrderObjects";
const ViewWorkOrder = () => {
  const history = useHistory();
  const [filters,setFilters] = useState({});
  const [columns, setColumns] = useState([]);
  const [headers] = useState(auth.getHeaders());
  const [workOrderList, setWorkOrderList] = useState([]);
  const [sort, setSort] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [pageSize, setPageSize]= useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const archiveRef = useRef(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [openArchive,setOpenArchive] = useState(false);
  const [searchOptions, setSearchOptions] = useState([]);
  const [workerFilters, setWorkerFilters] = useState([]);
  const [projectFilters, setProjectFilters] = useState([]);
  const [showReportModal, setShowReportModal] = useState(false);
  const user = useMemo(() => auth.getUserInfo(), []);
  const [roleData,setRoleData]=useState(user.roles[0]);
  

  useEffect(() => {
    if (auth.hasAdminRole()) setIsAdmin(true);
  }, []);

  const loadWokrOrders = useCallback(async () => {
    const pages = `pageNo=${currentPage}&pageSize=-1`;
    if (!Object.keys(filters).length) {
      let params = `?${pages}`;
      for (const key in sort) {
        if (key) {
          params += `&orderBy=${key}&orderMode=${sort[key]}`;
        }
      }
      const res = await getWorkorderByParams(headers, params);
      if (res) setIsLoading(false);
      if (res.statusCode === 200) {
        setWorkOrderList(res.tableData);
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
    const res = await getWorkOrders(headers, currentPage, pageSize,sortParams ? sortParams : `&orderBy=id&orderMode=desc`  ,filterBy);
    if (res) setIsLoading(false);
    if (res.status === 200) {
      setWorkOrderList(res.data);
      setTotalItems(res.totalItems);
    }
    if (res.status !== 200) message.error("Something's gone wrong, refresh page or contact your system admin");
  }
},
   [filters, currentPage, pageSize, headers, sort]);

  useEffect(() => {
    loadWokrOrders();
  }, [loadWokrOrders,archiveRef?.current?.length]);
  
  const searchWorkOrder = useCallback((value) => setFilters({ ...filters, search: value }), [filters]);

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
    if (workOrderList) {
      let options = [];
      for (let obj of workOrderList) {
        let results = getSearchSuggestions(obj);
        results.forEach((item) => {
          if (!options.includes(item)) options.push(item);
        });
      }
      setSearchOptions(options);
    }
  }, [workOrderList, getSearchSuggestions]);


  const openForm = () => {
    history.push("/addworkOrder");
  }

  const openEditPage = useCallback((id)=> 
  {
     history.push(`/workOrders/${id}`);
   }, [history]);


  
  const rowSelection = {
    onChange: (rowKeys) => {
      isAdmin || roleData.workOrderPermission ? setSelectedRowKeys(rowKeys) : setSelectedRowKeys([]);
    },
    selectedRowKeys,
  };

  const cancelArchiving = () => {
    setSelectedRowKeys([]);
  };

  const archiveWorkorders = async () => {
    const status = await archiveWorkorder(headers, selectedRowKeys);
    if (status === 200) {
      loadWokrOrders();
      message.success("Workorder record archived successfully!");
      archiveRef.current.loadArchive();
      setSelectedRowKeys([]);
    } else {
      message.error("Something's gone wrong, refresh page or contact your system admin");
    }
  };

  useEffect(() => {
    loadWokrOrders();
  }, [loadWokrOrders]);

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


  const getProjectFilters = useCallback(async () => {
    await axios
      .get(`${config.serverURL}/projects?dropdownFilter=true`, { headers })
      .then((response) => {
        if (response.data) {
          setProjectFilters(
            response.data.map((prj) => ({
              text: `${prj.projectName} `,
              value: prj.id,
            }))
          );
        }
      })
      .catch((err) => console.log(err));
  }, [headers]);


  useEffect(() => getProjectFilters(), [getProjectFilters]);

  const defaultColumns = useMemo(() => [

    {
      title: "Project",
      dataIndex: "project",
      key: "project.projectName",
      filters: projectFilters,
      sorter: true,
      fixed: "left",
      width: 170,
      render: (project,row) => (
        <TableLink
        label={`${project.projectName} `}
        onClick={() => openEditPage(row.id)}
      />      )
      
    },
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
  title:"Start Date",
  dataIndex: "startDate",
  key: "startDate",
  sorter: true,
  render: (date) => moment(date).format("MM/DD/YYYY"),


} ,
  {
    title:"End Date",
    dataIndex: "endDate",
    key: "endDate",
    sorter:true,
    render: (date) => moment(date).format("MM/DD/YYYY"),
  } ,

  {
    title: "Resource Manager",
    dataIndex: "project",
    key: "project.resourceManager.firstName",
    width: 120,
    sorter: true,
    render: (resourceManager) => (
      <RecordWithDetails name= {`${resourceManager?.resourceManager?.firstName} ${resourceManager?.resourceManager?.lastName}`}/>
    )
  },

  {
    title: "Active Date",
    dataIndex: "activeDate",
    sorter:true,
    key: "activeDate",
  },

  {
    title: "Status",
    dataIndex: "status",
    sorter:true,
    key: "status",
  },
  {
    title: "Rebate Adjusted Bill Rate/hr",
    dataIndex: "billRate",
    key: "billRate",
    render: (billRate) => <div style={{ textAlign: 'right', marginLeft: '10px' }}>{Number(billRate).toFixed(2)}</div>,

  },
  {
    title: "C2C Pay Rate/hr",
    dataIndex: "payRate",
    key: "payRate",
    render: (payRate) => <div style={{ textAlign: 'right', marginLeft: '10px' }}>{Number(payRate).toFixed(2)}</div>,

  },

  {
    title: "Margin/hr",
    dataIndex: "margin",
    key: "margin",
    render: (margin) => <div style={{ textAlign: 'right', marginLeft: '10px' }}>{Number(margin).toFixed(2)}</div>,

  },


  ], [openEditPage,workerFilters,projectFilters]);

  useEffect(() => {
    setColumns(defaultColumns);
  }, [defaultColumns]);


  return (
    <PageContainer>
      <PageHeader
        title="WorkOrder"
        actions={
          (isAdmin || roleData.workOrderPermission ?
            <Button
              type="button"
              className="btn main margin-left"
              handleClick =  {openForm}
            >
              <PlusOutlined className="icon" /> 
              Add WorkOrder
            </Button>:"")
          
        }
      />
      <TableComponent
       columns={columns}
       setColumns={setColumns}
       defaultColumns={defaultColumns}
       filters={filters}
       rowSelection={isAdmin || roleData.workOrderPermission ? rowSelection :false}
     total={totalItems}
     setSort={setSort}
     loading = {isLoading}
     searchOptions={searchOptions}
     searchList={workOrderList}
     handleSearch={searchWorkOrder}
     setPageSize={setPageSize}
     setCurrentPage={setCurrentPage}
     setFilters={setFilters}
openArchive={() => setOpenArchive(true)}
openReports={() => setShowReportModal(true)}
     handleConfirmArchive={archiveWorkorders}
     handleCancelArchiving={cancelArchiving}
       data={workOrderList.map((workorder) => ({ ...workorder, key: workorder.id }))}
       removeableColumns={defaultColumns
         .filter((col) => col.title !== "Project" && col.title)
         .map((col) => col.title)}

      />
     <ReportModal
        showReportModal={showReportModal}
        setShowReportModal={setShowReportModal}
        individualReportName="workOrders"
        individualList={workOrderList}
        list={workOrderList.map((wo) => ({
          id: wo.id,
          name: `${wo.project.projectName}`,
        }))}
        listLabel="workOrder"
        filename="workOrder_report"
        tableFields={reportTableFields()}
        pdfFormatter={reportFormats.workOrderPdfFormat}
        csvExcelFormatter={reportFormats.workOrderCSVExcel}
      />
       <WorkOrderArchive
       open={openArchive}
       setOpen={setOpenArchive}
       ref={archiveRef}
      />  

    </PageContainer>
  );
};

export default ViewWorkOrder;
