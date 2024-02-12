import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { config } from "../../../config";
import reportFormats from "../../utils/reports/reportUtils";
import auth from "../../../utils/AuthService";
import { getSuppliers, archiveSuppliers ,getSupplierByParams} from "../../../API/supplier/supplier.apis";
import { formatPhoneNumberIntl } from "react-phone-number-input";
import Button from "../../common/button/button.component";
import { PageContainer } from "../../container/page-container/PageContainer";
import { PageHeader } from "../../container/page-header/PageHeader";
import { TableComponent } from "../../common/table/Table";
import { TableLink } from "../../common/table/TableLink";
import { RecordWithDetails } from "../../common/table/record_with_details/RecordWithDetails";
import { SuppArchive } from "./supp_ui_helpers/archive_modal/SuppArchive";
import { message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import ReportModal from "../../../../src/components/utils/reports/report.modal";
import { reportTableFields } from "./supp_utils/SupplierObjects";
import IdleTimeOutHandler from "../../ui/Dashboard/IdleTimeOutHandler";
import { getDesignationDictionary } from "../../../API/dictionaries/dictionary-apis";
import { supplierDict } from "../../../API/dictionaries/dictionary-apis";
const ViewSuppliers = () => {
  const history = useHistory();
  const headers = useMemo(() => auth.getHeaders(), []);
  const archiveRef = useRef(null);
  const [openArchive, setOpenArchive] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [supplierList, setSupplierList] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchOptions, setSearchOptions] = useState([]);
  const [sort, setSort] = useState({});
  const [filters, setFilters] = useState({});
  const [columns, setColumns] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [supplierFilter, setSupplierFilter] = useState([]);
  const [titleFilter, setTitleFilter] = useState([]);
  const[isActive,setIsActive]=useState(true);
  const[isLogout,setLogout]=useState(false);
  const user = useMemo(() => auth.getUserInfo(), []);
  const [roleData,setRoleData]=useState(user.roles[0]);

  const[managerRole,setManagerRole]= useState(false);
  console.log(roleData)
  useEffect(() => {
    if (auth.hasAdminRole()) setIsAdmin(true);
  }, []);
   //const [convertDataForReport, ConvertDataForReport] = useState([]);
  
  const openEditPage = useCallback((id) => {
    history.push(`/supplier/${id}`);
  }, [history]);

  const getSupplierFilters = useCallback(async () => {
    const res = await axios.get(`${config.serverURL}/supplier?dropdownFilter=true`, { headers });
    if (res.status === 200) {
     
    } else {
      message.warning('Problem getting supplier filter data, refresh page or contact system admin')
    }
  }, [headers]);

  useEffect(() => getSupplierFilters(), [getSupplierFilters]);

  const getDesignationOptions = useCallback((headers) => {
    getDesignationDictionary(headers)
      .then(res => {
        if (res) {
          setTitleFilter(res.map((designation) => ({ text: designation.value, value: designation.value })));
        }
      })
      .catch(err => {
        console.log(err);
      })
  }, []);

  useEffect(() => {
    getDesignationOptions(headers);
  }, [headers, getDesignationOptions]);

  const getsupplierCompanyNameOptions = useCallback((headers) => {
    supplierDict(headers)
      .then(res => {
        if (res) {
          setSupplierFilter(res.map((supplierCompanyName) => ({ text: supplierCompanyName.value, value: supplierCompanyName.value })));
        }
      })
      .catch(err => {
        console.log(err);
      })
  }, []);

  useEffect(() => {
    getsupplierCompanyNameOptions(headers);
  }, [headers, getsupplierCompanyNameOptions]);


  const defaultColumns = useMemo(
    () => [
      {
        title: "Supplier",
        dataIndex: "supplierCompanyName",
        key: "supplierCompanyName",
        sorter: true,
        render: (supp, row) => (
          <TableLink label={supp} onClick={() => openEditPage(row.id)} />
        ),
        width: 170,
        filters: supplierFilter,
       
        filterSearch: true
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        sorter: true,
        width: 90,
        render: (status) => <span className={`table-record-status ${status && status.toLowerCase()}`}>{status}</span>
      },
      {
        title: "Title",
        dataIndex: "designation",
        key: "designation",
        width: 140,
        filters: titleFilter,
      
        sorter: true
      },
      {
        title: "Contact",
        dataIndex: "firstName",
        key: "firstName",
        sorter: true,
        render: (first, row) => <RecordWithDetails name={`${first} ${row.lastName}`} location={row.email} extra={row.phone_no ? formatPhoneNumberIntl(row.phone_no) : ""} />,
        width: 180
      },
      {
        title: "Location",
        dataIndex: "address",
        key: "address.city",
        sorter: true,
        render: (add) => <RecordWithDetails name={add?.city} location={`${add?.state}, ${add?.country}`} />,
        width: 200
      },
      {
        title: "Website",
        dataIndex: "website",
        key: "website",
        ellipsis: true,
        width: 120
      }
    ],
    [supplierFilter, titleFilter, openEditPage]);

  useEffect(() => {
    setColumns(defaultColumns);
  }, [defaultColumns, supplierFilter, titleFilter]);

  const loadSupplier = useCallback(async () => {
    const pages = `pageNo=${currentPage}&pageSize=-1`;
    if (!Object.keys(filters).length) {
      let params = `?${pages}`;
      for (const key in sort) {
        if (key) {
          params += `&orderBy=${key}&orderMode=${sort[key]}`;
        }
      }
      const res = await getSupplierByParams(headers, params);
      if (res) setIsLoading(false);
      if (res.statusCode === 200) {
        setSupplierList(res.tableData);
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
      const res = await getSuppliers(headers, currentPage, pageSize, sortParams ? sortParams : `&orderBy=id&orderMode=desc`  , filterBy);
      if (res) setIsLoading(false);
      if (res.status === 200) {
        setSupplierList(res.data);
        setTotalItems(res.totalItems);
      }
      if (res.status !== 200) message.error("Something's gone wrong, refresh page or contact your system admin");
  }
  
  }, [headers, currentPage, pageSize, sort, filters]);

  useEffect(() => {
    loadSupplier();
  }, [loadSupplier, filters, archiveRef?.current?.length]);


  const archiveSupplier = async () => {
    const status = await archiveSuppliers(headers, selectedRowKeys);
    if (status === 200) {
      loadSupplier();
      message.success("Supplier record archived successfully!");
      archiveRef.current.loadArchive();
      setSelectedRowKeys([]);
    } else {
      message.error("Something's gone wrong, refresh page or contact your system admin");
    }
  };

  useEffect(() => {
    loadSupplier();
  }, [loadSupplier]);

  const searchSupplier = useCallback((value) => setFilters({ ...filters, search: value }), [filters]);

  const getSearchSuggestions = useCallback((obj) => {
    let suggestions = [];
    for (let key in obj) {
      if (
        (typeof obj[key] === "string" || typeof obj[key] === "number") &&
        key !== "id" &&
        obj[key] !== ""
      ) {
        if (key === "supplierCompanyName") {
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
    if (supplierList) {
      let options = [];
      for (let obj of supplierList) {
        let results = getSearchSuggestions(obj);
        results.forEach((item) => {
          if (!options.includes(item)) options.push(item);
        });
      }
      setSearchOptions(options);
    }
  }, [supplierList, getSearchSuggestions]);

  const openForm = () => {
    history.push("/addsupplier");
  };

  const rowSelection = {
    onChange: (rowKeys, selectedRows) => {
      isAdmin || roleData.suppliersPermission ? setSelectedRowKeys(rowKeys) : setSelectedRowKeys([]);
    },
    selectedRowKeys,
  };

  const cancelArchiving = () => {
    setSelectedRowKeys([]);
  };


  return (
    <PageContainer>
      <PageHeader
        title="Suppliers"
        actions={
          
          (isAdmin || roleData.suppliersPermission ?
            <Button type="button" className="btn main" handleClick={openForm}>
              <PlusOutlined className="icon" />
              Add Supplier
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
        data={supplierList.map((supplier) => ({
          ...supplier,
          key: supplier.id,
        }))}
        columns={columns}
        setColumns={setColumns}
        defaultColumns={defaultColumns}
        rowSelection={isAdmin || roleData.suppliersPermission ? rowSelection :false}
        total={totalItems}
        setCurrentPage={setCurrentPage}
        setPageSize={setPageSize}
        setSort={setSort}
        setFilters={setFilters}
        filters={filters}
        searchOptions={searchOptions}
        searchList={supplierList}
        handleSearch={searchSupplier}
        openArchive={() => setOpenArchive(true)}
        openReports={() => setShowReportModal(true)}
        handleConfirmArchive={archiveSupplier}
        handleCancelArchiving={cancelArchiving}
        removeableColumns={defaultColumns
          .filter((col) => col.title !== "Supplier" && col.title)
          .map((col) => col.title)}
      />

      <ReportModal
        showReportModal={showReportModal}
        setShowReportModal={setShowReportModal}
        individualReportName="supplier"
        individualList={supplierList}
        list={supplierList.map((supplier) => ({
          id: supplier.id,
          name: `${supplier.firstName + " " + supplier.lastName}`,
        }))}
        listLabel="Supplier"
        filename="supplier_report"
        tableFields={reportTableFields()}
        pdfFormatter={reportFormats.supplierPdfFormat}
        csvExcelFormatter={reportFormats.supplierCSVExcel}
      />

      <SuppArchive
        open={openArchive}
        setOpen={setOpenArchive}
        ref={archiveRef}
      />
    </PageContainer>
  );
};

export default ViewSuppliers;