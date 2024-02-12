import { PageContainer } from "../../container/page-container/PageContainer";
import { PageHeader } from "../../container/page-header/PageHeader";
import Button from "../../common/button/button.component";
import { PlusOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import * as api from "../../../API/commissionType/commission-apis";
import { useCallback, useEffect, useState, useMemo } from "react";
import auth from "../../../utils/AuthService";
import { TableLink } from "../../common/table/TableLink";
import axios from "axios";
import { message } from "antd";
import { config } from "../../../config";
import {  useDispatch } from "react-redux";
import { setIsAuth } from "../../../Redux/appSlice";
import IdleTimeOutHandler from "../../ui/Dashboard/IdleTimeOutHandler";
import { TableComponent } from "../../common/table/Table";
import { CommissionTypeArchive } from "./archive_modal/CommissionTypeArchive";
import Breadcrumbs from "../../common/breadcrumbs/breadcrumbs.component";
import ReportModal from "../../utils/reports/report.modal";
import reportFormats from "../../utils/reports/reportUtils";
import { reportTableFields } from "./CommissionTypeObjects";
export const ViewCommissionType = () => {
    
    const [isLoading, setIsLoading] = useState(false);
    const history = useHistory();
    const [commissionTypeList, setCommissionTypeList] = useState([]);
    const headers = useMemo(() => auth.getHeaders(), []);
    const [columns, setColumns] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [filters, setFilters] = useState({});
    const [openArchive, setOpenArchive] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [sort, setSort] = useState({});
    const [searchOptions, setSearchOptions] = useState([]);
    const [isRecruiter, setIsRecruiter] = useState(false);
    const[isActive,setIsActive]=useState(true)
    const[isLogout,setLogout]=useState(false)
    const dispatch = useDispatch();

    const logout = useCallback(() => {
        dispatch(setIsAuth(false));
        auth.logout();
      }, [dispatch]);

      const openEditPage = useCallback((id) => {
        history.push(`/commissionType/${id}`);
      }, [history]);

    const defaultColumns = useMemo(() => [
        {
          title: "Commision Type",
          dataIndex: "name",
          key: "name",
          fixed: 'left',
          width: 170,
          render: (name, row) => (
            <TableLink
              onClick={() => openEditPage(row.id)}
              label={name}
            />
          )
        },
        {
       
          title: "Commission Rate",
          dataIndex: "commRate",
          key: "commRate",
          align: 'center',
          sorter: true,
          render: (commRate, row) => (
          
            <div style={{textAlign:"right"}}> 
              <span >{commRate}</span>
              </div>
  
          ),
            },
        {
          title: "Margin Bracket ($)",
          dataIndex: "commMargin",
          key: "commMargin",
          align: 'center',
          sorter: true,
          render: (commMargin, row) => (
          
            <div style={{textAlign:"right"}}> 
              <span >{commMargin}</span>
              </div>
  
          ),
        },
             ], [ ]);
    
      useEffect(() => {
        setColumns(defaultColumns);
      }, [defaultColumns]);
    
      const loadCommType = useCallback(async () => {
        const pages = `pageNo=${currentPage - 1}&pageSize=-1`;
    
        if (!Object.keys(filters).length) {
          let params = `?${pages}`;
          for (const key in sort) {
            if (key) {
              params += `&orderBy=${key}&orderMode=${sort[key]}`;
            }
          }
          return await api.getCommissionTypesByParams(headers, params);
        } else {
          const sortKey = Object.keys(sort)[0] ? Object.keys(sort)[0] : "";
          const sortOrder = sortKey ? sort[sortKey] : "";
          const filteredRes = await api.getFilteredCommissionTypes(headers, currentPage, pageSize, filters,sortKey ? sortKey : "id",sortOrder ? sortOrder : "desc");
          if (filteredRes.statusCode === 200) {
            setCommissionTypeList(filteredRes.data);
            setTotalItems(filteredRes.totalItems);
            setIsLoading(false);
          };
        }
      }, [headers, currentPage, pageSize, sort, filters]);
      useEffect(() => {
        let isCancelled = false;
        setIsLoading(true);
        loadCommType()
          .then((res) => {
            if (res.statusCode === 200) {
              setCommissionTypeList(res.tableData);
              setTotalItems(res.totalItems);
            }
          })
          .catch((err) => {
            if (!isCancelled) console.log(err);
          })
          .finally(() => setIsLoading(false));
        return () => (isCancelled = true);
      }, [loadCommType, openArchive]);

      const archiveCommissionType= async () => {
        try {
          const res = await axios.all(
            selectedRowKeys.map((id) =>
              axios.delete(`${config.serverURL}/commissionType/${id}`, { headers })
            )
          );
          if (res) {
            const commTypes = await loadCommType();
            if (commTypes) {
              setCommissionTypeList(commTypes.tableData);
              setTotalItems(commTypes.totalItems);
              message.success("commission Type archived successfully!");
              setSelectedRowKeys([]);
            }
          }
        } catch (error) {
          message.error(`Error ${error.response?.status}`);
          if (error.response && error.response.status === 401) {
            logout();
          }
        }
      };
      const searchCommType = useCallback(
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

      useEffect(() => {
        if (commissionTypeList) {
          let options = [];
          for (let obj of commissionTypeList) {
            let results = getSearchSuggestions(obj);
            results.forEach((item) => {
              if (!options.includes(item)) options.push(item);
            });
          }
          setSearchOptions(options);
        }
      }, [commissionTypeList, filters, getSearchSuggestions]);

      const rowSelection = {
        onChange: (rowKeys, selectedRows) => {
          !isRecruiter ? setSelectedRowKeys(rowKeys) : setSelectedRowKeys([])
        },
        selectedRowKeys,
      };
    
      const cancelArchiving = () => {
        setSelectedRowKeys([]);
      };
    


    const redirect = (path) => {
      history.push(path);
    };
    const closeForm = () => {
      history.push("/viewcommission");
    };
  
    return (
      <PageContainer>
               <IdleTimeOutHandler 
    onActive={()=>{setIsActive(true)}} 
    onIdle={()=>{setIsActive(false)}}
    onLogout={()=>{setLogout(true)}}
    />
        <PageHeader
           breadcrumbs={
          <Breadcrumbs
            className="header"
            crumbs={[
              { id: 0, text: "Commission", onClick: () => closeForm() },
              { id: 1, text: "Commission Type", lastCrumb: true },
            ]}
          />

        }
        actions={
          <>
           
            <Button
              type="button"
              className="btn main margin-left"
              handleClick={() => redirect("/addcommissiontype")}
            >
              <PlusOutlined className="icon"/>
              Add Commission Type
            </Button>
          
          </>
        }
      />

     <TableComponent
        loading={isLoading}
        data={commissionTypeList.map((ct) => ({ ...ct, key: ct.id }))}
        columns={columns}
        setColumns={setColumns}
        defaultColumns={defaultColumns}
        rowSelection={!isRecruiter ? rowSelection : null}
        total={totalItems}
        setCurrentPage={setCurrentPage}
        setPageSize={setPageSize}
        setSort={setSort}
        setFilters={setFilters}
        filters={filters}
        searchOptions={searchOptions}
        searchList={commissionTypeList}
        handleSearch={searchCommType}
        openArchive={() => setOpenArchive(true)}
        openReports={() => setShowReportModal(true)}
        handleConfirmArchive={archiveCommissionType}
        handleCancelArchiving={cancelArchiving}
        removeableColumns={defaultColumns
          .filter((col) => col.title !== "Commision Type" && col.title)
          .map((col) => col.title)}
      />
  <CommissionTypeArchive open={openArchive} setOpen={setOpenArchive} />

      <ReportModal
        showReportModal={showReportModal}
        setShowReportModal={setShowReportModal}
        individualReportName="commissionType"
        individualList={commissionTypeList}
        list={commissionTypeList.map((ct) => ({
          id: ct.id,
          // name: ct.commRate,
          name:ct.name
        }))}
        listLabel="commissionType"
        filename="commissionType_report"
        tableFields={reportTableFields()}
        pdfFormatter={reportFormats.commissionTypePdfFormat}
        csvExcelFormatter={reportFormats.commissionTypeCSVExcel}
      />
      

      </PageContainer>
    )
};
export default ViewCommissionType;