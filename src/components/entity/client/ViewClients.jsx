import { useCallback, useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { config } from "../../../config";
import auth from "../../../utils/AuthService";
import * as api from "../../../API/clients/clients-apis";
import { setIsAuth } from "../../../Redux/appSlice";
import { setClientOptions } from '../../../Redux/filterSlice';
import { reportTableFields } from "../client/client_utils/clientObjects";
import reportFormats from "../../utils/reports/reportUtils";
import ReportModal from "../../../../src/components/utils/reports/report.modal";
import Button from "../../common/button/button.component";
import { ClientArchive } from "./client_ui_helpers/archive_modal/ClientArchive";
import { TableComponent } from "../../common/table/Table";
import { TableLink } from "../../common/table/TableLink";
import { VmsPopover, AdminPopover, RebatePopover } from "./client_ui_helpers/fee_popovers/FeePopover";
import { PageContainer } from "../../container/page-container/PageContainer";
import { PageHeader } from "../../container/page-header/PageHeader";
import { message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import IdleTimeOutHandler from "../../ui/Dashboard/IdleTimeOutHandler";
import "antd/dist/antd.css";
import "./client.scss";

const ViewClients = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const headers = useMemo(() => auth.getHeaders(), []);
  const { clientOptions } = useSelector((state) => state.filters);
  const [clientList, setClientsList] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [filters, setFilters] = useState({});
  const [openArchive, setOpenArchive] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [sort, setSort] = useState({});
  const [searchOptions, setSearchOptions] = useState([]);
  const [isRecruiter, setIsRecruiter] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [columns, setColumns] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
 const[isActive,setIsActive]=useState(true)
  const[isLogout,setLogout]=useState(false)
  const logout = useCallback(() => {
    dispatch(setIsAuth(false));
    auth.logout();
  }, [dispatch]);
 
  const user = useMemo(() => auth.getUserInfo(), []);
  const [roleData,setRoleData]=useState(user.roles[0]);
  const [isAdmin, setIsAdmin] = useState(false);
  const[managerRole,setManagerRole]= useState(false);
  console.log(roleData)
  useEffect(() => {
    if (auth.hasAdminRole()) setIsAdmin(true);
  }, []);
  useEffect(() => {
    if (auth.hasRecruiterRole()) setIsRecruiter(true);
  }, []);

  const openForm = () => {
    history.push("/addclient");
  };

  const openEditPage = useCallback((id) => {
   
    history.push(`/clients/${id}`);
  }, [history]);

  const defaultColumns = useMemo(() => [
    {
      title: "Client",
      dataIndex: "clientName",
      key: "clientName",
      sorter: true,
      filters: clientOptions.map(cl => ({ text: `${cl.clientName} (${cl.city})`, value: cl.id })),
      fixed: 'left',
      width: 170,
      render: (client, row) => (
        <TableLink
          onClick={() => openEditPage(row.id)}
          label={client}
        />
      )
    },
    {
      title: "Website",
      dataIndex: "website",
      key: "website",
      render: (link) => (
        <TableLink
          label={link}
          className={'small ellipses'}
          onClick={() => window.open(`${link}`, "_blank")}
        />
      )
    },
    {
      title: "Phone No.",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "VMS Fee (%)",
      dataIndex: "vmsFees",
      key: "vmsFees",
      render: (fee, row) => {
        return row.preVmsFees ? (
          <div className="fees">
          <VmsPopover record={row}>{Number(fee).toFixed(2)}</VmsPopover>
          </div>
        ) :
        <div className="fees">
        <span>{fee}%</span>
        </div>
      }
    },
    {
      title: "Admin Fee (%)",
      dataIndex: "adminFees",
      key: "adminFees",
      render: (fee, row) => {
        return row.preAdminFees ? (
          <div className="fees">
          <AdminPopover record={row}>{Number(fee).toFixed(2)}</AdminPopover>
          </div>
        ) :
        <div className="fees">
        <span>{fee}%</span>
        </div>
      }
    },
    {
      title: "Rebate Fee (%)",
      dataIndex: "rebateFees",
      key: "rebateFees",
      render: (fee, row) => {
        return row.preRebateFees ? (
          <div className="fees">
          <RebatePopover record={row}>{Number(fee).toFixed(2)}</RebatePopover>
          </div>
        ) :
        <div className="fees">
        <span>{fee}%</span>
        </div>
      }
    },
    {
      title: "Location",
      dataIndex: "city",
      key: "address.city",
      render: (city, row) => (
        <span>{city}, {row.address.state}, {row.address.country}</span>
      ),
      sorter: true
    },
    {
      title: "Zip Code",
      dataIndex: "postalCode",
      key: "postalCode"
    }
  ], [clientOptions, openEditPage]);

  useEffect(() => {
    setColumns(defaultColumns);
  }, [defaultColumns, clientOptions]);

  const loadClients = useCallback(async () => {
    const pages = `pageNo=${currentPage - 1}&pageSize=-1`;

    if (!Object.keys(filters).length) {
      let params = `?${pages}`;
      for (const key in sort) {
        if (key) {
          params += `&orderBy=${key}&orderMode=${sort[key]}`;
        }
      }
      return await api.getClientsByParams(headers, params);
    } else {
      const sortKey = Object.keys(sort)[0] ? Object.keys(sort)[0] : "";
      const sortOrder = sortKey ? sort[sortKey] : "";
      const filteredRes = await api.getFilteredClients(headers, currentPage, pageSize, filters,sortKey ? sortKey : "id",sortOrder ? sortOrder : "desc");
      if (filteredRes.statusCode === 200) {
        setClientsList(filteredRes.data);
        setTotalItems(filteredRes.totalItems);
        setIsLoading(false);
      };
    }
  }, [headers, currentPage, pageSize, sort, filters]);

  useEffect(() => {
    let isCancelled = false;
    // setIsLoading(true);
    loadClients()
      .then((res) => {
        if (res.statusCode === 200) {
          setClientsList(res.tableData);
          setTotalItems(res.totalItems);
        }
      })
      .catch((err) => {
        if (!isCancelled) console.log(err);
      })
      .finally(() => setIsLoading(false));
    return () => (isCancelled = true);
  }, [loadClients, openArchive]);

  const archiveClients = async () => {
    try {
      const res = await axios.all(
        selectedRowKeys.map((id) =>
          axios.delete(`${config.serverURL}/clients/${id}`, { headers })
        )
      );
      if (res) {
        const clients = await loadClients();
        if (clients) {
          setClientsList(clients.tableData);
          setTotalItems(clients.totalItems);
          message.success("Clients archived successfully!");
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

  const searchClient = useCallback(
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
    if (clientList) {
      let options = [];
      for (let obj of clientList) {
        let results = getSearchSuggestions(obj);
        results.forEach((item) => {
          if (!options.includes(item)) options.push(item);
        });
      }
      setSearchOptions(options);
    }
  }, [clientList, filters, getSearchSuggestions]);

  const rowSelection = {
    onChange: (rowKeys, selectedRows) => {
      !isRecruiter ? setSelectedRowKeys(rowKeys) : setSelectedRowKeys([])
    },
    selectedRowKeys,
  };

  const cancelArchiving = () => {
    setSelectedRowKeys([]);
  };

  const getClientOptions = useCallback(async () => {
    try {
      const res = await api.getAllClients(headers);
      if (res.tableData) {
        dispatch(setClientOptions(res.tableData));
      }
    } catch (err) {
      console.log(err)
    }
  }, [headers, dispatch]);

  useEffect(() => getClientOptions(), [getClientOptions]);


  return (
    <PageContainer>
      <PageHeader
        title="Clients"
        actions={
          !isRecruiter && 
            (isAdmin || roleData.clientPermission  ?
            <Button
              type="button"
              className="btn main margin-left"
              handleClick={openForm}
            >
              <PlusOutlined className="icon" />
              Add Client
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
        data={clientList.map((client) => ({ ...client, key: client.id }))}
        columns={columns}
        setColumns={setColumns}
        defaultColumns={defaultColumns}
        rowSelection={!isRecruiter &&  (isAdmin || roleData.managerPermission ) ? rowSelection :false}
        total={totalItems}
        setCurrentPage={setCurrentPage}
        setPageSize={setPageSize}
        setSort={setSort}
        setFilters={setFilters}
        filters={filters}
        searchOptions={searchOptions}
        searchList={clientList}
        handleSearch={searchClient}
        openArchive={() => setOpenArchive(true)}
        openReports={() => setShowReportModal(true)}
        handleConfirmArchive={archiveClients}
        handleCancelArchiving={cancelArchiving}
        removeableColumns={defaultColumns
          .filter((col) => col.title !== "Client" && col.title)
          .map((col) => col.title)}
      />
      <ReportModal
        showReportModal={showReportModal}
        setShowReportModal={setShowReportModal}
        individualReportName="clients"
        individualList={clientList}
        list={clientList.map((client) => ({
          id: client.id,
          name: client.clientName,
        }))}
        listLabel="Clients"
        filename="client_report"
        tableFields={reportTableFields()}
        pdfFormatter={reportFormats.clientPdfFormat}
        csvExcelFormatter={reportFormats.clientCSVExcel}
      />
      

      <ClientArchive open={openArchive} setOpen={setOpenArchive} />
    </PageContainer>
  );
};

export default ViewClients;
