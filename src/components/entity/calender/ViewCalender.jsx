import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import axios from "axios";
import { config } from "../../../config.js";
import AuthService from "../../../utils/AuthService.js";
import { PageContainer } from "../../container/page-container/PageContainer.jsx";
import { PageHeader } from "../../container/page-header/PageHeader.jsx";
import { TableComponent } from "../../common/table/Table";
import { CalenderArchive } from "./calender_ui_helpers/archive_model/CalenderArchive.jsx";
import IdleTimeOutHandler from "../../ui/Dashboard/IdleTimeOutHandler.js";
import "antd/dist/antd.css";
import { useDispatch } from "react-redux";
import { setIsAuth } from "../../../Redux/appSlice";
import ReportModal from "../../../../src/components/utils/reports/report.modal";
import reportFormats from "../../utils/reports/reportUtils.js";
import { calenderModalHeaders, calenderStatus } from "./calenderObjects.js";
import Button from "../../common/button/button.component.jsx";
import AddCalender from "./AddCalender.jsx";
import { getCalender } from "../../../API/calender/calender-aois.js";
import { PlusOutlined } from "@ant-design/icons";
import { message } from "antd";

import auth from "../../../utils/AuthService";
const ViewCalender = (props) => {
  const dispatch = useDispatch();

  const headers = useMemo(() => AuthService.getHeaders(), []);
  const archiveRef = useRef(null);
  const [calenderList, setCalenderList] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [openArchive, setOpenArchive] = useState(false);
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState({});
  const [showReportModal, setShowReportModal] = useState(false);
  const [searchOptions, setSearchOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [columns, setColumns] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isActive, setIsActive] = useState(true);
  const [isLogout, setLogout] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [checkedList, setCheckedList] = useState(false);

  const user = useMemo(() => auth.getUserInfo(), []);
  const [roleData, setRoleData] = useState(user.roles[0]);
  const [isAdmin, setIsAdmin] = useState(false);

  const logout = useCallback(() => {
    AuthService.logout();
    dispatch(setIsAuth(false));
  }, [dispatch]);

  const openModal = () => setOpenAddModal(true);
  useEffect(() => {
    if (auth.hasAdminRole()) setIsAdmin(true);
  }, []);

  const handleCheckBoxChange = (event) => {
  
    let val = event.target.checked;
    setCheckedList(val);
    setSort({});
    setFilters({})
    if (val) {
      handleCalendarData();
    } else {
      loadCalender();
    }
  };

  const defaultColumns = useMemo(
    () => [
      {
        title: "Start Date",
        dataIndex: "startDate",
        key: "startDate",
        fixed: "left",
        width: 170,
      },
      {
        title: "End Date",
        dataIndex: "endDate",
        key: "endDate",
        fixed: "left",
        width: 170,
      },
      {
        title: "Status",
        dataIndex: "calender_status",
        key: "calender_status",
        width: 170,

       

        render: (status) => (
          <span
            className={`table-record-status ${status && status.toLowerCase()}`}
          >
            {status}
          </span>
        ),
      },
    ],
    [filters]
  );

  const defaultColumnsFuture = useMemo(
    () => [
      {
        title: "Start Date",
        dataIndex: "startDate",
        key: "startDate",
        fixed: "left",
        width: 170,
        sorter: true,
      },
      {
        title: "End Date",
        dataIndex: "endDate",
        key: "endDate",
        fixed: "left",
        width: 170,
        sorter: true,
      },
      {
        title: "Status",
        dataIndex: "calender_status",
        key: "calender_status",
        width: 170,

        filters: calenderStatus.map((status) => ({
          text: status,
          value: status,
        })),
        sorter: true,

        render: (status) => (
          <span
            className={`table-record-status ${status && status.toLowerCase()}`}
          >
            {status}
          </span>
        ),
      },
    ],
    [filters]
  );

  useEffect(() => {
    const columns = checkedList ? defaultColumnsFuture : defaultColumns;
    setColumns(columns);
  }, [checkedList,defaultColumns]);
  
  const loadCalender = useCallback(async () => {
    let sortParams = "";
    for (const key in sort) {
      if (key) {
        sortParams += `&orderBy=${key}&orderMode=${sort[key]}&isFuture=${checkedList}`;
      }
    }
    const filterBy = !Object.keys(filters).length ? null : filters;

    setIsLoading(true);
    const res = await getCalender(
      headers,
      currentPage,
      pageSize,
      sortParams,
      filterBy
    );
    if (res) setIsLoading(false);
    if (res.status === 200) {
      setCalenderList(res.data);
      setTotalItems(res.totalItems);
    }
    if (res.status !== 200)
      message.error(
        "Something's gone wrong, refresh page or contact your system admin"
      );
  }, [filters, currentPage, pageSize, headers, sort]);

 
  const handleCalendarData = useCallback(
    async (cb) => {
      await axios
        .get(
          `${config.serverURL}/calender/future?pageNo=${
            currentPage - 1
          }&pageSize=-1`,
          {
            headers,
          }
        )
        .then((res) => {
          let total = parseInt(res.headers["total-items"]);
          let calList = res.data;
          if (calList.length === 0 && currentPage > 1) {
            setCurrentPage(currentPage - 1);
          }
          setTotalItems(total);
          setCalenderList(calList);
          cb(calList);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    [headers,currentPage]
  );

  useEffect(() => {

    if (checkedList && Object.keys(sort).length === 0 && Object.keys(filters).length === 0) {
      handleCalendarData();
    } else {
      loadCalender();
    }
  }, [loadCalender,openArchive]);

  const refreshCalendar = () => {
    let isCancelled = false;
    setIsLoading(true);
    loadCalender()
      .then((res) => {
        if (res.statusCode === 200) {
          setCalenderList(res.tableData);
          setTotalItems(res.totalItems);
        }
      })
      .catch((err) => {
        if (!isCancelled) console.log(err);
      })
      .finally(() => setIsLoading(false));
    return () => (isCancelled = true);
  };

  const archiveCalender = () => {
    axios
      .all(
        selectedRowKeys.map((id) =>
          axios.delete(`${config.serverURL}/calender/${id}`, { headers })
        )
      )
      .then((res) => {
        setCalenderList([]);
        setSelectedRowKeys([]);
        if (checkedList) {
          handleCalendarData();
        } else {
          loadCalender();
        }    
        })
      .catch((err) => {
        console.log(err);
        if (err.response && err.response.status === 401) logout();
      });
  };

  const getSearchSuggestions = useCallback((obj) => {
    let suggestions = [];
    for (let key in obj) {
      if (
        (typeof obj[key] === "string" || typeof obj[key] === "number") &&
        key !== "id" &&
        obj[key] !== ""
      ) {
        if (key === "ca") {
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
    if (calenderList) {
      let options = [];
      for (let obj of calenderList) {
        let results = getSearchSuggestions(obj);
        results.forEach((item) => {
          if (!options.includes(item)) options.push(item);
        });
      }
      setSearchOptions(options);
    }
  }, [calenderList, filters, getSearchSuggestions]);

  const rowSelection = {
    onChange: (rowKeys) => {
      setSelectedRowKeys(rowKeys);
    },
    selectedRowKeys,
  };

  const cancelArchiving = () => {
    setSelectedRowKeys([]);
  };
  const searchCalender = useCallback(
    (value) => {
      setFilters({ ...filters, search: value });
    },
    [filters]
  );

  return (
    <>
      <PageContainer>
        <PageHeader
          title="Calender"
          actions={
            <>
              {isAdmin || roleData.calendarPermission ? (
                <Button
                  type="button"
                  className="btn main"
                  handleClick={() => openModal(true)}
                >
                  <PlusOutlined className="icon" />
                  Add Calender
                </Button>
              ) : (
                ""
              )}
              <div
                style={{
                  fontSize: "15px",
                  position: "relative",
                  marginBottom: "-3",
                  left: "15px",
                  color: "black",
                }}
              >
                <input type="checkbox" onClick={handleCheckBoxChange} />
              </div>
              <label
                style={{
                  fontSize: "15px",
                  position: "relative",
                  marginBottom: "2",
                  left: "20px",
                  color: "var(--secondary)",
                }}
              >
                Show Feature Week
              </label>
            </>
          }
        />
        <IdleTimeOutHandler
          onActive={() => {
            setIsActive(true);
          }}
          onIdle={() => {
            setIsActive(false);
          }}
          onLogout={() => {
            setLogout(true);
          }}
        />
        <TableComponent
          loading={isLoading}
          data={calenderList.map((calender) => ({
            ...calender,
            key: calender.id,
          }))}
          columns={columns}
          setColumns={setColumns}
          defaultColumns={defaultColumns}
          rowSelection={
            isAdmin || roleData.calendarPermission ? rowSelection : false
          }
          total={totalItems}
          setCurrentPage={setCurrentPage}
          setPageSize={setPageSize}
          setSort={setSort}
          setFilters={setFilters}
          filters={filters}
          searchOptions={searchOptions}
          searchList={calenderList}
          handleSearch={searchCalender}
          openArchive={() => setOpenArchive(true)}
          openReports={() => setShowReportModal(true)}
          handleConfirmArchive={archiveCalender}
          handleCancelArchiving={cancelArchiving}
          removeableColumns={defaultColumns
            .filter((col) => col.title !== "calender" && col.title)
            .map((col) => col.title)}
        />
        <CalenderArchive
          open={openArchive}
          setOpen={setOpenArchive}
          ref={archiveRef}
        />
      </PageContainer>

      <ReportModal
        showReportModal={showReportModal}
        setShowReportModal={setShowReportModal}
        individualReportName="calender"
        individualList={calenderList}
        list={calenderList.map((cal) => ({
          id: cal.id,
          name: cal.calender_status,
        }))}
        listLabel="Calender"
        filename="calender_report"
        tableFields={calenderModalHeaders()}
        pdfFormatter={reportFormats.calenderPdfFormat}
        csvExcelFormatter={reportFormats.calenderCSVExcel}
      />
      <AddCalender
        open={openAddModal}
        setOpen={setOpenAddModal}
        refresh={refreshCalendar}
      />
    </>
  );
};

export default ViewCalender;
