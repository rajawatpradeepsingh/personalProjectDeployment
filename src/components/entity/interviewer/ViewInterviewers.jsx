import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useHistory } from "react-router-dom";
import { formatPhoneNumberIntl } from "react-phone-number-input";
import auth from "../../../utils/AuthService";
import AuthService from "../../../utils/AuthService";
import { getInterviewers, archiveSelectedInterviewers, getInterviewerByParams } from "../../../API/interviewers/interviewer-apis";
import { getAllClients } from "../../../API/clients/clients-apis";
import { getDict } from "../../../API/dictionaries/dictionary-apis";
import ReportModal from "../../../../src/components/utils/reports/report.modal";
import { reportTableFields } from "../../entity/interviewer/intvwr_utils/interviewerObjects";
import reportFormats from "../../utils/reports/reportUtils";
import Button from "../../common/button/button.component";
import { PageContainer } from "../../container/page-container/PageContainer";
import { PageHeader } from "../../container/page-header/PageHeader";
import { TableComponent } from "../../common/table/Table";
import { TableLink } from "../../common/table/TableLink";
import { RecordWithDetails } from "../../common/table/record_with_details/RecordWithDetails";
import { IntrvwrArchive } from "./intvwr_ui_helpers/archive_modal/IntrvwrArchive";
import { message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import IdleTimeOutHandler from "../../ui/Dashboard/IdleTimeOutHandler";




const ViewInterviewers = () => {
  const history = useHistory();
  const headers = useMemo(() => AuthService.getHeaders(), []);
  const archiveRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [openArchive, setOpenArchive] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [interviewerList, setInterviewerList] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [columns, setColumns] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [sort, setSort] = useState({});
  const [filters, setFilters] = useState({});
  const [searchOptions, setSearchOptions] = useState([]);
  const [clientFilters, setClientFilters] = useState([]);
  const [skillsFilter, setSkillsFilter] = useState([]);
  const [isActive, setIsActive] = useState(true);
  const [isLogout, setLogout] = useState(false);
  const user = useMemo(() => auth.getUserInfo(), []);
  const [roleData,setRoleData]=useState(user.roles[0]);
  const [isAdmin, setIsAdmin] = useState(false);
  const[managerRole,setManagerRole]= useState(false);
  console.log(roleData)
  useEffect(() => {
    if (auth.hasAdminRole()) setIsAdmin(true);
  }, []);
  const openEditPage = useCallback((id) => {
    history.push(`/interviewer/${id}`);
  }, [history]);

  const getClientFilters = useCallback(async () => {
    const res = await getAllClients(headers);
    if (res.statusCode === 200) {
      setClientFilters(res.tableData.map(client => ({
        text: `${client.clientName} (${client.address?.city})`,
        value: client.id
      })));
    } else {
      message.warning('Problem getting client filter data, refresh page or contact system admin')
    }
  }, [headers]);

  const getSkillOptions = useCallback(async () => {
    const response = await getDict("primeSkills", headers);
    if (response.length) {
      const primes = response.map((skill) => skill.value).sort();
      setSkillsFilter(primes.map((skill) => ({ text: skill, value: skill })));
    }
  }, [headers]);

  useEffect(() => getClientFilters(), [getClientFilters]);
  useEffect(() => getSkillOptions(), [getSkillOptions]);

  const defaultColumns = useMemo(
    () => [
      {
        title: "Name",
        dataIndex: "firstName",
        key: "firstName",
        sorter: true,
        fixed: "left",
        width: 170,
        render: (int, row) => (
          <TableLink
            onClick={() => openEditPage(row.id)}
            label={`${int} ${row.lastName}`}
          />
        ),
      },
      {
        title: "Contact",
        dataIndex: "email",
        key: "email",
        width: 120,
        render: (email, row) => (
          <RecordWithDetails
            name={email}
            location={row.phone_no ? formatPhoneNumberIntl(row.phone_no) : ""}
          />
        ),
      },
      {
        title: "Location",
        dataIndex: "address",
        key: "address.city",
        sorter: true,
        ellipsis: true,
        render: (add) => (
          <RecordWithDetails
            name={add.city || ""}
            location={`${add.state && `${add.state}, `}${add.country && `${add.country}`
              }`}
          />
        ),
        width: 180,
      },
      {
        title: "Skills",
        dataIndex: "interview_skills",
        key: "interview_skills",
        sorter: true,
        ellipsis: true,
        width: 170,
        filters: skillsFilter,
        filterSearch: true,
        render: (skills) => skills.split(",").join(", ")
      },
      {
        title: "Experience",
        dataIndex: "total_experience",
        key: "total_experience",
        render: (exp) => (
          <div style={{ textAlign: 'right', paddingRight: '10px' }}>{exp ? `${exp} year(s)` : ""}</div>
        ),
        width: 110,
        sorter: true,
      },
    
      {
        title: "Client",
        dataIndex: "client",
        key: "client.clientName",
        width: 150,
        sorter: true,
        render: (client) => (
          <RecordWithDetails
            name={client.clientName}
            location={client.address?.city}
          />
        ),
        filters: clientFilters,
        filterSearch: true,
      },
    ],
    [openEditPage, clientFilters, skillsFilter]
  );

  useEffect(() => {
    setColumns(defaultColumns);
  }, [defaultColumns, clientFilters, skillsFilter]);

  const loadInterviewers = useCallback(async () => {
  const pages = `pageNo=${currentPage}&pageSize=-1`;
    if (!Object.keys(filters).length) {
      let params = `?${pages}`;
      for (const key in sort) {
        if (key) {
          params += `&orderBy=${key}&orderMode=${sort[key]}`;
        }
      }
      const res = await getInterviewerByParams(headers, params);
      if (res) setIsLoading(false);
      if (res.statusCode === 200) {
        setInterviewerList(res.tableData);
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
      const res = await getInterviewers(headers, currentPage, pageSize, sortParams ? sortParams : `&orderBy=id&orderMode=desc`  , filterBy);
      if (res) setIsLoading(false);
      if (res.status === 200) {
        setInterviewerList(res.data);
        setTotalItems(res.totalItems);
      }
      if (res.status !== 200) message.error("Something's gone wrong, refresh page or contact your system admin");
  }
  
  }, [headers, currentPage, pageSize, sort, filters]);

  useEffect(() => {
    loadInterviewers();
  }, [loadInterviewers, filters, archiveRef?.current?.length]);

  const archiveInterviewer = async () => {
    const res = await archiveSelectedInterviewers(headers, selectedRowKeys);
    if (!res.status.filter(s => s !== 200).length) {
      loadInterviewers();
      setSelectedRowKeys([]);
      archiveRef.current.loadArchive();
      message.success("Interviewer record archived successfully!");
    } else {
      message.error("Something's gone wrong, refresh page or contact your system admin");
    }
  };

  useEffect(() => {
    loadInterviewers();
  }, [loadInterviewers]);

  const searchInterviewer = useCallback((value) => setFilters({ ...filters, search: value }), [filters]);

  const getSearchSuggestions = useCallback((obj) => {
    let suggestions = [];
    for (let key in obj) {
      if (
        (typeof obj[key] === "string" || typeof obj[key] === "number") &&
        key !== "id" &&
        obj[key] !== ""
      ) {
        if (key === "interview_skills") {
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
    if (interviewerList) {
      let options = [];
      for (let obj of interviewerList) {
        let results = getSearchSuggestions(obj);
        results.forEach((item) => {
          if (!options.includes(item)) options.push(item);
        });
      }
      setSearchOptions(options);
    }
  }, [interviewerList, filters, getSearchSuggestions]);

  const openForm = () => {
    history.push("/addinterviewer");
  };

  const rowSelection = {
    onChange: (rowKeys, selectedRows) => {
      setSelectedRowKeys(rowKeys);
    },
    selectedRowKeys,
  };

  const cancelArchiving = () => {
    setSelectedRowKeys([]);
  };


  return (
    <PageContainer>
      <IdleTimeOutHandler
        onActive={() => { setIsActive(true) }}
        onIdle={() => { setIsActive(false) }}
        onLogout={() => { setLogout(true) }}
      />
      <PageHeader
        title="Interviewers"
        actions={
          (isAdmin || roleData.interviewsPermission ?
          <Button type="button" className="btn main" handleClick={openForm}>
            <PlusOutlined className="icon" />
            Add Interviewer
          </Button>:""
   ) }
      />
      <TableComponent
        loading={isLoading}
        data={interviewerList.map((int) => ({ ...int, key: int.id }))}
        columns={columns}
        setColumns={setColumns}
        defaultColumns={defaultColumns}
        rowSelection={isAdmin || roleData.interviewsPermission ? rowSelection :false}
        total={totalItems}
        setCurrentPage={setCurrentPage}
        setPageSize={setPageSize}
        setSort={setSort}
        setFilters={setFilters}
        filters={filters}
        searchOptions={searchOptions}
        searchList={interviewerList}
        handleSearch={searchInterviewer}
        openArchive={() => setOpenArchive(true)}
        openReports={() => setShowReportModal(true)}
        handleConfirmArchive={archiveInterviewer}
        handleCancelArchiving={cancelArchiving}
        removeableColumns={defaultColumns
          .filter((col) => col.title !== "Name" && col.title)
          .map((col) => col.title)}
      />

      <ReportModal
        showReportModal={showReportModal}
        setShowReportModal={setShowReportModal}
        individualReportName="interviewer"
        individualList={interviewerList}
        list={interviewerList.map((int) => ({
          id: int.id,
          name: `${int.firstName} ${int.lastName}`,
        }))}
        listLabel="Interviewers"
        filename="interviewer_report"
        tableFields={reportTableFields()}
        pdfFormatter={reportFormats.interviewerPdfFormat}
        csvExcelFormatter={reportFormats.interviewerCSVExcel}
      />

      <IntrvwrArchive
        open={openArchive}
        setOpen={setOpenArchive}
        ref={archiveRef}
      />
    </PageContainer>
  );
};

export default ViewInterviewers;