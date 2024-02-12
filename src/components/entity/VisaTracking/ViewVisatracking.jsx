import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useHistory } from "react-router-dom";
import auth from "../../../utils/AuthService";
import { getCountries } from "../../../utils/serviceAddress"; 
import { archiveVisas, getAllVisas, getVisaByParams } from "../../../API/visaTrackings/visaTracking-apis";
import { getWorkerForDropdown } from "../../../API/workers/worker-apis";
import { generateOptions } from "./utils/visa_utils";
import { reportTableFields, visaTypes } from "./utils/VisaTrackingObjects";
import ReportModal from "../../utils/reports/report.modal";
import Button from "../../common/button/button.component";
import { PlusOutlined } from "@ant-design/icons";
import Breadcrumbs from "../../common/breadcrumbs/breadcrumbs.component";
import { PageContainer } from "../../container/page-container/PageContainer";
import { PageHeader } from "../../container/page-header/PageHeader";
import { TableComponent } from "../../common/table/Table";
import { TableLink } from "../../common/table/TableLink";
import AddVisatracking from "./AddVisatracking";
import { VisaArchive } from "./visa_ui_helpers/edit_sections/archive_modal/VisaArchive";
import { message } from "antd";
import "antd/dist/antd.css";
import reportFormats from "../../utils/reports/reportUtils";
import IdleTimeOutHandler from "../../ui/Dashboard/IdleTimeOutHandler";

const ViewVisatrackings = () => {
  const history = useHistory();
  const archiveRef = useRef(null);
  const [visas, setVisas] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [columns, setColumns] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openArchive, setOpenArchive] = useState(false);
  const [filters, setFilters] = useState({});
  const [headers] = useState(auth.getHeaders());
  const [showReportModal, setShowReportModal] = useState(false);
  const [sort, setSort] = useState({});
  const [searchOptions, setSearchOptions] = useState([]);
  const [canAddEdit, setCanAddEdit] = useState(false);
  const [openAddVisa, setOpenAddVisa] = useState(false);
  const [workerFilters, setWorkerFilters] = useState([]);
  const [citizenshipFilters, setCitizenshipFilters] = useState([]);
  const [isActive, setIsActive] = useState(true);
  const [isLogout, setLogout] = useState(false);
  const user = useMemo(() => auth.getUserInfo(), []);
  const [roleData,setRoleData]=useState(user.roles[0]);
  const [isAdmin, setIsAdmin] = useState(false);
  

  useEffect(() => {
    if (auth.hasAdminRole()) setIsAdmin(true);
  }, []);
  useEffect(() => {
    if (auth.isAdminOrOperations()) setCanAddEdit(true);
  }, []);

  const openEditPage = useCallback((id) => history.push(`/visatracking/${id}`), [history]);

  const getWorkerFilters = useCallback(async () => {
    const res = await getWorkerForDropdown(headers);
    if (res.tableData.length) {
      setWorkerFilters(res.tableData.map(worker => ({ text: `${worker.firstName} ${worker.lastName}`, value: worker.id })));
    }
  }, [headers]);

  useEffect(() => getWorkerFilters(), [getWorkerFilters]);

  useEffect(() => {
    const countries = getCountries();
    setCitizenshipFilters(countries.map(c => ({ text: c.name, value: c.name })));
  }, []);

  const defaultColumns = useMemo(
    () => [
      {
        title: "Worker",
        dataIndex: "worker",
        key: "worker.firstName",
        fixed: "left",
        filters: workerFilters,
        sorter: true,
        width: 170,
        render: (worker, row) => (
          <TableLink
            label={`${worker.firstName} ${worker.lastName}`}
            onClick={() => openEditPage(row.id)}
          />
        ),
      },
      {
        title: "Status",
        dataIndex: "visaStatus",
        key: "visaStatus",
        sorter: true,
        width: 120,
        render: (status) => (
          <span
            className={`table-record-status ${
              status && `v_${status.toLowerCase()}`
            }`}
          >
            {status}
          </span>
        ),
      },
      {
        title: "Type",
        dataIndex: "visaType",
        key: "visaType",
        sorter: true,
        filters: visaTypes.map(v => ({ text: v.name, value: v.value })),
        width: 140,
      },
      {
        title: "Applied In",
        dataIndex: "visaAppliedDate",
        key: "visaAppliedDate",
        width: 120,
      },
      {
        title: "Active From",
        dataIndex: "visaStartDate",
        key: "visaStartDate",
        width: 120,
      },
      {
        title: "Expires On",
        dataIndex: "visaExpiryDate",
        key: "visaExpiryDate",
        width: 120,
      },
      {
        title: "Citizen Of",
        dataIndex: "visaCountry",
        key: "visaCountry",
        filters: citizenshipFilters,
        filterSearch: true,
        width: 120,
      },
      {
        title: "Resides In",
        dataIndex: "visaCountryOfResidence",
        key: "visaCountryOfResidence",
        width: 120,
      },
      {
        title: "Birth Country",
        dataIndex: "countryOfBirth",
        key: "countryOfBirth",
        width: 120,
      },
      {
        title: "EntryDateOfF1",
        dataIndex: "entryDateOfF1",
        key: "entryDateOfF1",
        width: 120,
      },
      {
        title: "US Entry Date",
        dataIndex: "usEntryDate",
        key: "usEntryDate",
        width: 120,
      },
      {
        title: "Passport Number",
        dataIndex: "passportNumber",
        key: "passportNumber",
        width: 120,
      },
      {
        title: "Visa Number",
        dataIndex: "visaNumber",
        key: "visaNumber",
        width: 120,
      },
    ],
    [openEditPage, workerFilters, citizenshipFilters]
  );

  useEffect(() => {
    setColumns(defaultColumns);
  }, [defaultColumns]);

  const loadVisas = useCallback(async () => {
    const pages = `pageNo=${currentPage}&pageSize=-1`;
    if (!Object.keys(filters).length) {
      let params = `?${pages}`;
      for (const key in sort) {
        if (key) {
          params += `&orderBy=${key}&orderMode=${sort[key]}`;
        }
      }
      const res = await getVisaByParams(headers, params);
      if (res) setIsLoading(false);
      if (res.statusCode === 200) {
        // Update each visa item with the resume information
        const visasWithResume = res.tableData.map((visa) => ({
          ...visa,
          key: visa.id,
          resume: visa.worker?.resume, // Adjust this based on your data structure
        }));

        setVisas(visasWithResume);
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
      const res = await getAllVisas(headers, currentPage, pageSize, sortParams ? sortParams : `&orderBy=id&orderMode=desc`  , filterBy);
      if (res) setIsLoading(false);
      if (res.status === 200) {
        // Update each visa item with the resume information
        const visasWithResume = res.data.map((visa) => ({
          ...visa,
          key: visa.id,
          resume: visa.worker?.resume, // Adjust this based on your data structure
        }));

        setVisas(visasWithResume);
        setTotalItems(res.totalItems);
      }
      if (res.status !== 200) message.error("Something's gone wrong, refresh page or contact your system admin");
    }
  }, [headers, currentPage, pageSize, sort, filters]);

  useEffect(() => {
    loadVisas();
  }, [loadVisas, filters, archiveRef?.current?.length]);

  const archiveSelection = async () => {
    const res = await archiveVisas(headers, selectedRowKeys);
    if (!res.status.filter(s => s !== 200).length) {
      loadVisas();
      message.success("Visa record(s) archived successfully!");
      archiveRef.current.loadArchive();
      setSelectedRowKeys([]);
    } else {
      message.error(
        "Something's gone wrong, refresh page or contact your system admin"
      );
    }
  };

  const searchVisatracking = useCallback((value) => setFilters({ ...filters, search: value }), [filters]);

  useEffect(() => {
    if (visas.length) setSearchOptions(generateOptions(visas));
  }, [visas]);

  const closeForm = () => {
    history.push("/viewworkers");
  };

  const rowSelection = {
    onChange: (rowKeys, selectedRows) => {
      canAddEdit || isAdmin || roleData.workerPermission ? setSelectedRowKeys(rowKeys) : setSelectedRowKeys([]);
    },
    selectedRowKeys,
  };

  const cancelArchiving = () => {
    setSelectedRowKeys([]);
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
              { id: 0, text: "Workers", onClick: () => closeForm() },
              { id: 1, text: "All Visa Details", lastCrumb: true },
            ]}
          />
        }
        actions={
          canAddEdit && (isAdmin || roleData.workerPermission ?
            <Button
              type="button"
              className="btn main"
              handleClick={() => setOpenAddVisa(true)}
            >
              <PlusOutlined className="icon" />
              Add Visa Details
            </Button>:""
          )
        }
      />
      <TableComponent
        loading={isLoading}
        data={visas.map((visa) => ({
          ...visa,
          key: visa.id,
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
        searchList={visas}
        handleSearch={searchVisatracking}
        openArchive={() => setOpenArchive(true)}
        openReports={() => setShowReportModal(true)}
        handleConfirmArchive={archiveSelection}
        handleCancelArchiving={cancelArchiving}
        removeableColumns={defaultColumns
          .filter((col) => col.title !== "Worker" && col.title)
          .map((col) => col.title)}
      />
      <ReportModal
        showReportModal={showReportModal}
        setShowReportModal={setShowReportModal}
        individualReportName="visatracking"
        individualList={visas}
        list={visas.map((visa) => ({
          id: visa.id,
          name: `${visa.worker.firstName} ${visa.worker.lastName}`,
        }))}
        listLabel="Visatrackings"
        filename="visatracking_report"
        tableFields={reportTableFields()}
        pdfFormatter={reportFormats.visatrackingPdfFormat}
        csvExcelFormatter={reportFormats.visatrackingCSVExcel}
      />
      <VisaArchive
        open={openArchive}
        setOpen={setOpenArchive}
        ref={archiveRef}
      />
      <AddVisatracking
        open={openAddVisa}
        setOpen={setOpenAddVisa}
        refresh={loadVisas}
      />

    </PageContainer>
    
  );
};

export default ViewVisatrackings;
