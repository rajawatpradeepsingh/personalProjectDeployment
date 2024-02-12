import { PageContainer } from "../../container/page-container/PageContainer";
import { PageHeader } from "../../container/page-header/PageHeader";
import Button from "../../common/button/button.component";
import { PlusOutlined } from "@ant-design/icons";
import auth from "../../../utils/AuthService";
import { useCallback, useEffect, useState, useMemo } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { message } from "antd";
import { config } from "../../../config";
import { useDispatch } from "react-redux";
import IdleTimeOutHandler from "../../ui/Dashboard/IdleTimeOutHandler";
import { TableComponent } from "../../common/table/Table";
import { setIsAuth } from "../../../Redux/appSlice";
import { RecordWithDetails } from "../../common/table/record_with_details/RecordWithDetails";
import { getCommissionByParams, getFilteredCommission } from "../../../API/commission/commission-apis";
import { FileTextOutlined } from "@ant-design/icons";
import { TableLink } from "../../common/table/TableLink";
import { CommissionArchive } from "./archive_modal/CommissionArchive";
import ReportModal from "../../utils/reports/report.modal";
import reportFormats from "../../utils/reports/reportUtils";
import { reportTableFields } from "./CommissionObjects";
export const ViewCommission = () => {
  const [isLoading, setIsLoading] = useState(true);
  const history = useHistory();
  const [commissionList, setCommissionList] = useState([]);
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
  const [isActive, setIsActive] = useState(true)
  const [isLogout, setLogout] = useState(false)
  const [resourceManagerFilters, setResourceManagerFilters] = useState([]);
  const dispatch = useDispatch();

  const logout = useCallback(() => {
    dispatch(setIsAuth(false));
    auth.logout();
  }, [dispatch]);
  
  const openEditPage = useCallback((id) => {
      history.push(`/commission/${id}`)

    
  }, [history]);

  const getResourceManagerFilters = useCallback(async () => {
    await axios
    .get(`${config.serverURL}/resourcemanager?dropdown=true`, { headers })
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

  const defaultColumns = useMemo(() => [
    {
      width: "100px",
      
      render: (commission, row) => (
      <TableLink
       
      onClick={() => openEditPage(row.id)}
      label={
      
        <div style={{ fontSize: "25px", paddingLeft: "25px" }}>
          <FileTextOutlined />
        </div>
      
      }
    />

    
        
      )
    },
    {
      title: "Resource Manager",
      dataIndex: "resourceManager",
      key: "resourceManager.firstName",
      sorter: true,
      render: (resourceManager) => (
        <RecordWithDetails name={`${resourceManager?.firstName} ${resourceManager?.lastName}`} />
      ),
      filters: resourceManagerFilters,
      filterSearch: true
    },
    {

      title: "Role",
      dataIndex: "resourceManager",
      key: "resourceManager.role",
      sorter: true,
      render: (resourceManager) => (
        <span>{resourceManager.role}</span>
      )
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      sorter: true,
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      sorter: true,
    },
    {
      title: "Commission Amount",
      dataIndex: "commissionAmount",
      key: "commissionAmount",
      align: 'center',
      sorter: true,
      render: (commissionAmount) => (
        <div style={{ textAlign: "right" }}>
          <span>${Number(commissionAmount).toFixed(2)}</span>
        </div>

      )

    },
  ], [resourceManagerFilters,openEditPage,openArchive]);

  useEffect(() => {
    setColumns(defaultColumns);
  }, [defaultColumns]);

  const loadCommission = useCallback(async () => {
    const pages = `pageNo=${currentPage - 1}&pageSize=-1`;

    if (!Object.keys(filters).length) {
      let params = `?${pages}`;
      for (const key in sort) {
        if (key) {
          params += `&orderBy=${key}&orderMode=${sort[key]}`;
        }
      }
      return await getCommissionByParams(headers, params);
    } else {
      const sortKey = Object.keys(sort)[0] ? Object.keys(sort)[0] : "";
      const sortOrder = sortKey ? sort[sortKey] : "";
      const filteredRes = await getFilteredCommission(headers, currentPage, pageSize, filters, sortKey ? sortKey : "id", sortOrder ? sortOrder : "desc");
      if (filteredRes.statusCode === 200) {
        setCommissionList(filteredRes.data);
        setTotalItems(filteredRes.totalItems);
        setIsLoading(false);
      };
    }
  }, [headers, currentPage, pageSize, sort, filters]);
  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);
    loadCommission()
      .then((res) => {
        if (res.statusCode === 200) {
          setCommissionList(res.tableData);
          setTotalItems(res.totalItems);
        }
      })
      .catch((err) => {
        if (!isCancelled) console.log(err);
      })
      .finally(() => setIsLoading(false));
    return () => (isCancelled = true);
  }, [loadCommission,filters, openArchive]);

  const archiveCommission = async () => {
    try {
      const res = await axios.all(
        selectedRowKeys.map((id) =>
          axios.delete(`${config.serverURL}/commission/${id}`, { headers })
        )
      );
      if (res) {
        const commTypes = await loadCommission();
        if (commTypes) {
          setCommissionList(commTypes.tableData);
          setTotalItems(commTypes.totalItems);
          message.success("commission archived successfully!");
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

  const searchCommission = useCallback(
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
    if (commissionList) {
      let options = [];
      for (let obj of commissionList) {
        let results = getSearchSuggestions(obj);
        results.forEach((item) => {
          if (!options.includes(item)) options.push(item);
        });
      }
      setSearchOptions(options);
    }
  }, [commissionList, filters, getSearchSuggestions]);

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

  return (
    <PageContainer>
      <IdleTimeOutHandler
        onActive={() => { setIsActive(true) }}
        onIdle={() => { setIsActive(false) }}
        onLogout={() => { setLogout(true) }}
      />
      <PageHeader
        title="Commission"
        actions={
          <>
            <Button
              type="button"
              className="btn main margin-left"
              handleClick={() => redirect("/addcommission")}
            >
              <PlusOutlined className="icon" />
              Add Commission
            </Button>
            <Button
              type="button"
              className="btn main margin-left"
              handleClick={() => redirect("/viewcommissiontype")}
            >
              <PlusOutlined className="icon" />
              view Commission Type
            </Button>

           
          </>
        }
      />
      <TableComponent
        loading={isLoading}
        data={commissionList.map((ct) => ({ ...ct, key: ct.id }))}
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
        searchList={commissionList}
        handleSearch={searchCommission}
        openArchive={() => setOpenArchive(true)}
        openReports={() => setShowReportModal(true)}
        handleConfirmArchive={archiveCommission}
        handleCancelArchiving={cancelArchiving}
        removeableColumns={defaultColumns
          .filter((col) => col.title !== "Resource Manager" && col.title)
          .map((col) => col.title)}
      />
        <CommissionArchive 
        open={openArchive} 
        setOpen={setOpenArchive} />

<ReportModal
        showReportModal={showReportModal}
        setShowReportModal={setShowReportModal}
        individualReportName="commission"
        individualList={commissionList}
        list={commissionList.map((ct) => ({
          id: ct.id,
          name:`${ct.resourceManager.firstName + " " + ct.resourceManager.lastName}`

        }))}
        listLabel="commission"
        filename="commission_report"
        tableFields={reportTableFields()}
        pdfFormatter={reportFormats.commissionPdfFormat}
        csvExcelFormatter={reportFormats.commissionCSVExcel}
      />
    </PageContainer>

  )
};
export default ViewCommission;