import { useEffect, useState, useMemo, useCallback,useRef} from "react";
import Button from "../../common/button/button.component";
import { TableComponent } from "../../common/table/Table";
import { PageContainer } from "../../container/page-container/PageContainer";
import { PageHeader } from "../../container/page-header/PageHeader";
import { getManagers,archiveManagers,getManagerByParams } from "../../../API/resourcemanagers/resourcemanagers_api";
import { PlusOutlined } from "@ant-design/icons";
import { TableLink } from "../../common/table/TableLink";
import { useHistory } from "react-router-dom";
import auth from "../../../utils/AuthService";
import { useParams } from "react-router-dom";
import{getUserById} from "../../../API/users/user-apis";
import { ManagerArchive } from "./manager_ui_helpers/archive_modal/ManagerArchive";
import { message } from "antd";
import reportFormats from "../../utils/reports/reportUtils";
import ReportModal from "../../utils/reports/report.modal";
import { reportTableFields } from "./ManagerObjects";
import {  ManagerRole } from "../../../utils/defaultData";

const ViewResourceManager = () => {
  const history = useHistory();
  const headers = useMemo(() => auth.getHeaders(), []);
  
  const archiveRef = useRef(null);
  const [filters, setFilters] = useState({});
  const [columns, setColumns] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const params = useParams();



  const searchManager = useCallback((value) => setFilters({ ...filters, search: value }), [filters]);
 const [managerList, setManagerList] = useState([]);

  const [sort, setSort] = useState({});
  const [showReportModal, setShowReportModal] = useState(false);

  const[managerRole,setManagerRole]= useState(false);
  const [openArchive, setOpenArchive] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchOptions, setSearchOptions] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [pageSize, setPageSize]= useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [roleData,setRoleData]=useState({});

useEffect(() => {
    if (auth.hasAdminRole()) setIsAdmin(true);
  }, []);


 

  const openEditPage = useCallback((id) => {
    history.push(`/resourcemanager/${id}`);
  }, [history]);


  const openForm = () => {
    history.push("/addresourceManager");
  };



const getUsers = useCallback(async () => {
  try {
    let headers = JSON.parse(sessionStorage.getItem("headers"));
    const id = JSON.parse(sessionStorage.getItem("userInfo"))
    const response = await getUserById(headers, id.id);
    setRoleData(response.userdata.roles[0])

    let role = response.userdata.roles[0].managerPermission      
 
    managerRole=role

   
      } catch (error) {
    console.log(error);
  }
}, [headers, params.userId,  ]);
useEffect(() => {
  getUsers();
}, [ getUsers]);




const loadManagers = useCallback(async () => {
  const pages = `pageNo=${currentPage}&pageSize=-1`;
  if (!Object.keys(filters).length) {
    let params = `?${pages}`;
    for (const key in sort) {
      if (key) {
        params += `&orderBy=${key}&orderMode=${sort[key]}`;
      }
    }
    const res = await getManagerByParams(headers, params);
    if (res) setIsLoading(false);
    if (res.statusCode === 200) {
      setManagerList(res.tableData);
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
    const res = await getManagers(headers, currentPage, pageSize, sortParams ? sortParams : `&orderBy=resourceManagerId&orderMode=desc`  , filterBy);
    if (res) setIsLoading(false);
    if (res.status === 200) {
      setManagerList(res.data);
      setTotalItems(res.totalItems);
    }
    if (res.status !== 200) message.error("Something's gone wrong, refresh page or contact your system admin");
}
}, [filters, currentPage, pageSize, headers, sort]);

useEffect(() => {
    loadManagers();
  }, [loadManagers, filters, archiveRef?.current?.length]);

  const rowSelection = {
    onChange: (rowKeys, ) => {
      isAdmin || roleData.managerPermission ? setSelectedRowKeys(rowKeys) : setSelectedRowKeys([]);
    },
    selectedRowKeys,
  };

  const cancelArchiving = () => {
    setSelectedRowKeys([]);
  };


  const archiveManager = async () => {
    const status = await archiveManagers(headers, selectedRowKeys);
    if (status === 200) {
      loadManagers();
      message.success("Manager record archived successfully!");
      archiveRef.current.loadArchive();
      setSelectedRowKeys([]);
    } else {
      message.error("Something's gone wrong, refresh page or contact your system admin");
    }
  };

  useEffect(() => {
    loadManagers();
  }, [loadManagers]);

  const defaultColumns = useMemo(() => [
   
    {
      title: "FullName",
      dataIndex: "firstName",
      key: "firstName",
      sorter: true,
      render: (resourcemanager, row) => (
        <TableLink label={`${resourcemanager}${row.lastName}`} onClick={() => openEditPage(row.resourceManagerId)} />
      ),
     
      filterSearch: true,
      
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      filters: ManagerRole.map((role) => ({
        text: role,
        value: role,
      })),
      filterMultiple: false,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 190,
      ellipsis: true,
    },
    {
      title: "Phone No.",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Status",
      dataIndex: "state",
      key: "state",
      sorter: true,
      width: 190,
      render: (status) => <span className={`table-record-status ${status && status.toLowerCase()}`}>{status}</span>
    },

  ],
  [ openEditPage]); 

  useEffect(() => {
    setColumns(defaultColumns);
  }, [defaultColumns]);

  const getSearchSuggestions = useCallback((obj) => {
    let suggestions = [];
    for (let key in obj) {
      if (
        (typeof obj[key] === "string" || typeof obj[key] === "number") &&
        key !== "id" &&
        obj[key] !== ""
      ) {
        if (key === "FullName") {
          let values = obj[key].split(" ");
          suggestions.push(values[0], values[1], values[2]);
        } else {
          suggestions.push(obj[key]);
        }
      } else if (
        typeof obj[key] === "object" &&
        key !== "FullName"
      ) {
        suggestions = suggestions.concat(getSearchSuggestions(obj[key]));
      }
    }
    return suggestions;
  }, []);

  useEffect(() => {
    if (managerList) {
      let options = [];
      for (let obj of managerList) {
        let results = getSearchSuggestions(obj);
        results.forEach((item) => {
          if (!options.includes(item)) options.push(item);
        });
      }
      setSearchOptions(options);
    }
  }, [managerList, filters, getSearchSuggestions]);

  
  return (
 <PageContainer>
        
      <PageHeader
        title="Managers"
        actions={
       ! managerRole === true  && 
        (isAdmin || roleData.managerPermission  ?
           <Button 
          
                  type="button"
                   className="btn main margin-left"
                   handleClick =  {openForm}
                   
                   
                 >
                   <PlusOutlined className="icon" /> 
                   Add Manager
                 </Button>:""
  )}
         
      
      />
      
      <TableComponent
      loading={isLoading}
      data={managerList.map((resourcemanager) => ({
        ...resourcemanager,
        key: resourcemanager.resourceManagerId,
      }))}
      rowSelection={isAdmin || roleData.managerPermission ? rowSelection :false}
      total={totalItems}
        columns={columns}
        setColumns={setColumns}
        defaultColumns={defaultColumns}
        setCurrentPage={setCurrentPage}
        setPageSize={setPageSize}
        setSort={setSort}
        filters={filters}
        setFilters={setFilters}
        searchOptions={searchOptions}
        searchList={managerList}
        handleSearch={searchManager}
        openArchive={() => setOpenArchive(true)}
        openReports={() => setShowReportModal(true)}
        handleConfirmArchive={archiveManager}
        handleCancelArchiving={cancelArchiving}
        removeableColumns={defaultColumns
          .filter((col) => col.title !== "Manager" && col.title)
          .map((col) => col.title)}
            />
        <ManagerArchive
        open={openArchive}
        setOpen={setOpenArchive}
        ref={archiveRef}
      />
      
      <ReportModal
    showReportModal={showReportModal}
    setShowReportModal={setShowReportModal}
    individualReportName="resourcemanager"
    individualList={managerList}
    list={managerList.map((manager) => ({
      id: manager.resourceManagerId,
      name: `${manager.firstName} ${manager.lastName}`,
    }))}
    listLabel="Managers"
    filename="manager_report"
    tableFields={reportTableFields()}
    pdfFormatter={reportFormats.managerPdfFormat}
    csvExcelFormatter={reportFormats.managerCSVExcel}
/>
      

    </PageContainer>
  );
        
};

export default ViewResourceManager;
