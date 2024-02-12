import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { config } from "../../../config.js";
import AuthService from "../../../utils/AuthService.js";
import auth from "../../../utils/AuthService";
import { hiringTypeFilter } from "./onboard_utils/onBoardingObjects.js";
import { getOnboardings ,getOnboardingByParams} from "../../../API/onboarding/onBoarding-apis.js";
import { reportTableFields } from "../onboarding/onboard_utils/onBoardingObjects.js";
import reportFormats from "../../utils/reports/reportUtils.js";
import ReportModal from "../../../../src/components/utils/reports/report.modal";
import { PageContainer } from "../../container/page-container/PageContainer.jsx";
import { PageHeader } from "../../container/page-header/PageHeader.jsx";
import { TableComponent } from "../../common/table/Table";
import { TableLink } from "../../common/table/TableLink";
import { RecordWithDetails } from "../../common/table/record_with_details/RecordWithDetails.jsx";
import { OnboardArchive } from "./onboard_ui_helpers/archive_modal/OnboardArchive.jsx";
import Button from "../../common/button/button.component.jsx";
import { PlusOutlined } from "@ant-design/icons";
import IdleTimeOutHandler from "../../ui/Dashboard/IdleTimeOutHandler.js";
import { message } from "antd";
import "antd/dist/antd.css";

const ViewOnboardings = () => {
  const history = useHistory();
  const headers = useMemo(() => AuthService.getHeaders(), []);
  const archiveRef = useRef(null);
  const [onboardingList, setOnboardingList] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [openArchive, setOpenArchive] = useState(false);
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState({});
  const [showReportModal, setShowReportModal] = useState(false);
  const [searchOptions, setSearchOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [columns, setColumns] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [clientFilters, setClientFilters] = useState([]);
  const[isActive,setIsActive]=useState(true)
  const[isLogout,setLogout]=useState(false)
  const user = useMemo(() => auth.getUserInfo(), []);
  const [roleData,setRoleData]=useState(user.roles[0]);
  const [isAdmin, setIsAdmin] = useState(false);
  const[managerRole,setManagerRole]= useState(false);
  console.log(roleData)
  useEffect(() => {
    if (auth.hasAdminRole()) setIsAdmin(true);
  }, []);

  const openEditPage = useCallback((id) => {
    history.push(`/onboarding/${id}`);
  }, [history]);

  const getClientFilters = useCallback(async () => {
    await axios.get(`${config.serverURL}/clients?dropdownFilter=true`, { headers })
      .then((response) => {
        if (response.data) {
          setClientFilters(response.data.map(client => ({
            text: `${client.clientName} (${client.address?.city})`,
            value: client.id
          })));
        }
      })
      .catch((err) => console.log(err));
  }, [headers]);

  useEffect(() => getClientFilters(), [getClientFilters]);
  
  const defaultColumns = useMemo(
    () => [
      {
        title: "Candidate",
        dataIndex: "candidateName",
        key: "candidate.firstName",
        sorter: true,
        fixed: "left",
        width: 170,
        render: (cand, row) => (
          <TableLink label={cand} onClick={() => openEditPage(row.id)} />
        ),
      },
      {
        title: "Client",
        dataIndex: "client",
        key: "client.clientName",
        sorter: true,
        width: 150,
        filters: clientFilters,
        render: (client) => (
          <RecordWithDetails
            name={client.clientName}
            location={client.address.city}
          />
        ),
      },
      {
        title: "Project",
        dataIndex: "project",
        key: "project",
        width: 130
      },
      {
        title: "Hiring Type",
        dataIndex: "hiringType",
        key: "hiringType",
        sorter: true,
        width: 110,
        filters: hiringTypeFilter,
        filterMultiple: false
      },
      {
        title: "Start Date",
        dataIndex: "startDate",
        key: "startDate",
        render: (start) => start ? `${moment(start).format("MM/DD/YYYY")}` : "",
        width: 110,
      },
      {
        title: "End Date",
        dataIndex: "endDate",
        key: "endDate",
        render: (end) => end ? `${moment(end).format("MM/DD/YYYY")}` : "",
        width: 110,
      },
      {
        title: "Contract",
        dataIndex: "signUpContract",
        key: "signUpContract",
        width: 110
      },
      {
        title: "Laptop Delivery",
        dataIndex: "deliveryOfLaptop",
        key: "deliveryOfLaptop",
        width: 110
      },
      {
        title: "Ease Set Up",
        dataIndex: "easePortalSetUp",
        key: "easePortalSetUp",
        width: 110
      },
      {
        title: "Workorder",
        dataIndex: "workOrder",
        key: "workOrder",
        width: 110
      },
      {
        title: "Background Check",
        dataIndex: "backgroundCheck",
        key: "backgroundCheck",
        width: 110
      },
    ],
    [clientFilters, openEditPage]
  );

  useEffect(() => {
    setColumns(defaultColumns);
  }, [defaultColumns, clientFilters]);

    const loadOnboardings = useCallback(async () => {
      const pages = `pageNo=${currentPage}&pageSize=-1`;
      if (!Object.keys(filters).length) {
        let params = `?${pages}`;
        for (const key in sort) {
          if (key) {
            params += `&orderBy=${key}&orderMode=${sort[key]}`;
          }
        }
        const res = await getOnboardingByParams(headers, params);
        if (res) setIsLoading(false);
        if (res.statusCode === 200) {
          setOnboardingList(res.tableData);
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
      const res = await getOnboardings(headers, currentPage, pageSize,  sortParams ? sortParams : `&orderBy=id&orderMode=desc` , filterBy);
      if (res) setIsLoading(false);
      if (res.status === 200) {
        setOnboardingList(res.data);
        setTotalItems(res.totalItems);
      }
      if (res.status !== 200) message.error("Something's gone wrong, refresh page or contact your system admin");
    }
  }, [filters, currentPage, pageSize, headers, sort]);
  
    useEffect(() => {
      loadOnboardings();
    }, [loadOnboardings, filters, archiveRef?.current?.length]);
  

  const archiveOnboarding = async () => {
    await axios
      .all(
        selectedRowKeys.map((id) =>
          axios.delete(`${config.serverURL}/onboarding/${id}`, { headers })
        )
      )
      .then((res) => {
        loadOnboardings();
        setSelectedRowKeys([]);
        message.success("Onboarding record archived successfully!");
        archiveRef.current.loadArchive();
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) AuthService.logout();
      });
  };

  const searchOnBoarding = useCallback(
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
        if (key === "candidateName") {
          let values = obj[key].split(" ");
          suggestions.push(values[0], values[1], values[2]);
        } else {
          suggestions.push(obj[key]);
        }
      } else if (
        typeof obj[key] === "object" &&
        key !== "candidate" &&
        key !== "resume"
      ) {
        suggestions = suggestions.concat(getSearchSuggestions(obj[key]));
      }
    }
    return suggestions;
  }, []);

  useEffect(() => {
    if (onboardingList) {
      let options = [];
      for (let obj of onboardingList) {
        let results = getSearchSuggestions(obj);
        results.forEach((item) => {
          if (!options.includes(item)) options.push(item);
        });
      }
      setSearchOptions(options);
    }
  }, [onboardingList, filters, getSearchSuggestions]);

  const openForm = () => {
    history.push("/addonboarding");
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
      <PageHeader
        title="Onboardings"
        actions={
          (isAdmin || roleData.onBoardingsPermission  ?
          <Button type="button" className="btn main" handleClick={openForm}>
            <PlusOutlined className="icon" />
            Add Onboarding
          </Button>:""
    ) }
      />
       <IdleTimeOutHandler 
    onActive={()=>{setIsActive(true)}} 
    onIdle={()=>{setIsActive(false)}}
    onLogout={()=>{setLogout(true)}}
    />
      <TableComponent
        loading={isLoading}
        data={onboardingList.map((onboard) => ({
          ...onboard,
          key: onboard.id,
        }))}
        columns={columns}
        setColumns={setColumns}
        defaultColumns={defaultColumns}
        rowSelection={isAdmin || roleData.onBoardingsPermission ? rowSelection :false}
        total={totalItems}
        setCurrentPage={setCurrentPage}
        setPageSize={setPageSize}
        setSort={setSort}
        setFilters={setFilters}
        filters={filters}
        searchOptions={searchOptions}
        searchList={onboardingList}
        handleSearch={searchOnBoarding}
        openArchive={() => setOpenArchive(true)}
        openReports={() => setShowReportModal(true)}
        handleConfirmArchive={archiveOnboarding}
        handleCancelArchiving={cancelArchiving}
        removeableColumns={defaultColumns
          .filter((col) => col.title !== "Candidate" && col.title)
          .map((col) => col.title)}
      />
      <OnboardArchive
        open={openArchive}
        setOpen={setOpenArchive}
        ref={archiveRef}
      />
      <ReportModal
        showReportModal={showReportModal}
            setShowReportModal={setShowReportModal}
        individualReportName="onboarding"
        individualList={onboardingList}
        list={onboardingList.map((onb) => ({
          id: onb.id,
          name: onb.candidateName,
        }))}
        listLabel="Onboarding"
        filename="onboarding_report"
        tableFields={reportTableFields()}
        pdfFormatter={reportFormats.onboardingPdfFormat}
        csvExcelFormatter={reportFormats.onboardingCSVExcel}
      />
    </PageContainer>
  );
};

export default ViewOnboardings;