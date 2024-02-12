import React, { useState, useEffect,useMemo, useCallback ,useRef} from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { config } from "../../../config";
import auth from "../../../utils/AuthService";
import Button from "../../common/button/button.component";
import { PlusOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { setIsAuth } from "../../../Redux/appSlice";
import { PageContainer } from "../../container/page-container/PageContainer";
import { PageHeader } from "../../container/page-header/PageHeader";
import { TableLink } from "../../common/table/TableLink";
import IdleTimeOutHandler from "../../ui/Dashboard/IdleTimeOutHandler";
import { TableComponent } from "../../common/table/Table";
import { ParamArchive } from "./archive_modal/ParamArchive";
import { getParameters } from "../../../API/parameter/parameter-apis";
import { message } from "antd";
import AuthService from "../../../utils/AuthService.js";
import {  ParameterFilter } from "../../../utils/defaultData";
import{reportTableFields} from "./ParameterObjects.js";
import reportFormats from "../../utils/reports/reportUtils";
import ReportModal from "../../utils/reports/report.modal";


const ViewParameters = () => {
    const [parameterList, setParameterList] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const ITEMS_PER_PAGE = config.ITEMS_PER_PAGE;
  const [currentPage, setCurrentPage] = useState(1);
  const [openArchive, setOpenArchive] = useState(false);
  const [archive, setArchive] = useState([]);
  const [archiveTotalElements, setArchiveTotalElements] = useState(0);
  const [archiveCurrentPage, setArchiveCurrentPage] = useState(1);
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState({});
  const history = useHistory();
  const [searchOptions, setSearchOptions] = useState([]);
  const dispatch = useDispatch();
  const [columns, setColumns] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [showReportModal, setShowReportModal] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const archiveRef = useRef(null);
  const headers = useMemo(() => AuthService.getHeaders(), []);

  useEffect(() => {
    if (auth.hasAdminRole()) setIsAdmin(true);
  }, []);
  const logout = useCallback(() => {
    dispatch(setIsAuth(false));
    auth.logout();
  }, [dispatch]);
  const[isActive,setIsActive]=useState(true);
  const[isLogout,setLogout]=useState(false);
 
  



  const rowSelection = {
    onChange: (rowKeys) => {
      isAdmin ? setSelectedRowKeys(rowKeys) : setSelectedRowKeys([]);
    },
    selectedRowKeys,
  };



  const loadParameter = useCallback(async () => {
    let sortParams = "";
       for (const key in sort) {
      if (key) {
        sortParams += `&orderBy=${key}&orderMode=${sort[key]}`;
      }
    }
    const filterBy = !Object.keys(filters).length ? null : filters;

    setIsLoading(true);
    const res = await getParameters(headers, currentPage, pageSize,sortParams,filterBy);
    if (res) setIsLoading(false);
    if (res.status === 200) {
      setParameterList(res.data);
      setTotalItems(res.totalItems);
    }
    if (res.status !== 200) message.error("Something's gone wrong, refresh page or contact your system admin");
  }, [filters, currentPage, pageSize, headers, sort]);

  useEffect(() => {
    loadParameter();
  }, [loadParameter,openArchive]);
  
  

  
 
  const cancelArchiving = () => {
    setSelectedRowKeys([]);
  };
 
  
  const openForm = () => {
    history.push("/addparameter");
  };
  const openEditPage = useCallback((id) => {
    history.push(`/parameter/${id}`);
  }, [history]);


  const searchParameter = useCallback((value) => setFilters({ ...filters, search: value }), [filters]);



  const getSearchSuggestions = useCallback((obj) => {
    let suggestions = [];
    for (let key in obj) {
      if (
        (typeof obj[key] === "string" || typeof obj[key] === "number") &&
        key !== "[id]" &&
        obj[key] !== ""
      ) {
        if (key === "paramType") {
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
    if (parameterList) {
      let options = [];
      for (let obj of parameterList) {
        let results = getSearchSuggestions(obj);
        results.forEach((item) => {
          if (!options.includes(item)) options.push(item);
        });
      }
      setSearchOptions(options);
    }
  }, [parameterList, getSearchSuggestions]);



  const defaultColumns = useMemo(
    () => [
      
        {
          title: "Param Type",
          dataIndex: "paramType",
          key: "paramType",
          
            filters: ParameterFilter.map((paramType) => ({


              text: paramType,
              value: paramType,
            })),
            render: (param, row) => (
              
                <TableLink label={param} onClick={() => openEditPage(row.id)} />
              ),
              sorter:true,
              filterMultiple: false,
      },    
      {
        
            title: "Param Level",
            dataIndex: "paramLevel",
            key: "paramLevel",
            sorter:true,
            render: (paramLevel) => <div style={{ textAlign: 'right', marginLeft: '10px' }}>{paramLevel}</div>,
 

    
  } ,{
    title: "Param Value",
    dataIndex: "paramValue",
    key: "paramValue",
    sorter:true,
    render: (paramValue) => <div style={{ textAlign: 'right', marginLeft: '10px' }}>{Number(paramValue).toFixed(2)}</div>,



},{
  title: "Comments",
  dataIndex: "comments",
  key: "comments",
  render: (comments, row) => (
<div>
  <span>
    {comments
                        ? `${comments.substring(0, 40)}...`
                        : ""
}
  </span>
</div>  ),

}

    ],
    [ openEditPage]);

  useEffect(() => {
    setColumns(defaultColumns);
  }, [defaultColumns]);

  const loadArchive = useCallback(() => {
    axios
      .get(
        `${config.serverURL}/parameter?archives=true&pageNo=${
          archiveCurrentPage - 1
        }&pageSize=${ITEMS_PER_PAGE}`,
        { headers }
      )
      .then((res) => {
        if (res.data) {
          setArchiveTotalElements(res.headers["total-elements"]);
          setArchive(
            res.data.map((parameter) => ({
              id: parameter.id,
              cellOne: parameter.paramType,
              cellTwo: parameter.paramLevel,
              cellThree: parameter.paramValue,
              cellFour: parameter.comments
                ? `${parameter.comments.substring(0, 50)}...`
                : "",
            }))
          );
        }
      })
      .catch((error) => {
        console.log(error);
        if (error.response && error.response.status === 401) logout();
      });
  }, [archiveCurrentPage, ITEMS_PER_PAGE, headers, logout]);

  useEffect(() => {
    loadArchive();
  }, [loadArchive, archiveCurrentPage]);
  
  
  const archiveParameter = async () => {
    await axios
      .all(
        selectedRowKeys.map((id) =>
          axios.delete(`${config.serverURL}/parameter/${id}`, { headers })
        )
      )
      .then((res) => {
        loadParameter();
        setSelectedRowKeys([]);
        message.success("Parameter record archived successfully!");
        archiveRef.current.loadArchive();
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) AuthService.logout();
      });
  };

  useEffect(() => {
    loadParameter();
  }, [loadParameter,openArchive]);

  return (
    <PageContainer>
      <PageHeader
        title="Parameter"
        actions={
          isAdmin && (
            <Button type="button" className="btn main" handleClick={openForm}>
              <PlusOutlined className="icon" />
              Add Parameter
            </Button>
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
        data={parameterList.map((parameter) => ({
          ...parameter,
          key: parameter.id,
        }))}
        columns={columns}
        setColumns={setColumns}
        defaultColumns={defaultColumns}
        rowSelection={rowSelection}
        total={totalItems}
        setCurrentPage={setCurrentPage}
        setPageSize={setPageSize}
        setSort={setSort}
        setFilters={setFilters}
        filters={filters}
        searchOptions={searchOptions}
        searchList={parameterList}
        handleSearch={searchParameter}
        openArchive={() => setOpenArchive(true)}
        handleConfirmArchive={archiveParameter}

        openReports={() => setShowReportModal(true)}
        handleCancelArchiving={cancelArchiving}
        removeableColumns={defaultColumns
          .filter((col) => col.title !== "Param Type" && col.title)
          .map((col) => col.title)}
      />

<ParamArchive
        open={openArchive}
        setOpen={setOpenArchive}
        ref={archiveRef}

      />
     
     <ReportModal
    showReportModal={showReportModal}
    setShowReportModal={setShowReportModal}
    individualReportName="parameter"
    individualList={parameterList}
    list={parameterList.map((param) => ({
      id: param.id,
      name: `${param.paramType} (${param.paramLevel})`,

    }))}
    listLabel="Parameter"
    filename="parameter_report"
    tableFields={reportTableFields()}
    pdfFormatter={reportFormats.parameterPdfFormat}
    csvExcelFormatter={reportFormats.parameterCSVExcel}

  />


    </PageContainer>
  );
};

export default ViewParameters;