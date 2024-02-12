import React, { useState, useEffect, useCallback } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { config } from "../../../config.js";
import auth from "../../../utils/AuthService.js";
import PopUp from "../../modal/popup/popup.component.jsx";
import ReportModal from "../../utils/reports/report.modal.jsx";
import reportFormats from "../../utils/reports/reportUtils.js";
import { sortAscending, sortDescending } from "../../../utils/service.js";
import Button from "../../common/button/button.component.jsx";
import { BarChartOutlined, DeleteOutlined } from "@ant-design/icons";
import ArchiveModal from "../../modal/archive-modal/archiveModal";
import Filters from "../../ui/filters/filters.jsx";
import { PillContainer } from "../../ui/filter-pill-container/filter-pill-container.component.jsx";
import { useDispatch } from "react-redux";
import { setIsAuth } from "../../../Redux/appSlice.js";
import Search from "../../common/search-bar/search-bar.component.jsx";
import { PlusOutlined } from "@ant-design/icons";
import Content from "../../container/content-container/content-container.component.jsx";
import ContentActions from "../../container/content-actions-container/content-actions-container.component.jsx";
import ExpandableTable from "../../ui/expandable-table/expandable-table.component.jsx";
import Check from "../../common/checkbox/checkbox.component.jsx";
import Breadcrumbs from "../../common/breadcrumbs/breadcrumbs.component.jsx";
import { PageContainer } from "../../container/page-container/PageContainer.jsx";
import { PageHeader } from "../../container/page-header/PageHeader.jsx";
import IdleTimeOutHandler from "../../ui/Dashboard/IdleTimeOutHandler.js";

const ViewRateCards = () => {
  const [ratecardList, setRateCardList] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const ITEMS_PER_PAGE = config.ITEMS_PER_PAGE;
  const [currentPage, setCurrentPage] = useState(1);
  const [filterCurrentPage, setFilterCurrentPage] = useState(1);
  const [searchCurrentPage, setSearchCurrentPage] = useState(1);
  const [openPopUp, setOpenPopUp] = useState(false);
  const [openArchive, setOpenArchive] = useState(false);
  const [archive, setArchive] = useState([]);
  const [archiveTotalElements, setArchiveTotalElements] = useState(0);
  const [archiveCurrentPage, setArchiveCurrentPage] = useState(1);
  const [filters, setFilters] = useState({});
  const [filterTrail, setFilterTrail] = useState({});
  const [noData, setNoData] = useState(false);
  const [headers] = useState(auth.getHeaders());
  const [showReportModal, setShowReportModal] = useState(false);
  const [sort, setSort] = useState({});
  const [searchOptions, setSearchOptions] = useState([]);
  const [isSearchResults, setIsSearchResults] = useState(false);
  const [ratecardToArchive, setRateCardToArchive] = useState({});
  const history = useHistory();
  const dispatch = useDispatch();
  const [isRecruiter, setIsRecruiter] = useState(false);
  const [isHr, setIsHr] = useState(false);
  const [isBDManager, setIsBDManager] = useState(false);

   const[isActive,setIsActive]=useState(true)
  const[isLogout,setLogout]=useState(false)

  const logout = useCallback(() => {
    dispatch(setIsAuth(false));
    auth.logout();
  }, [dispatch]);

  useEffect(() => {
    if (auth.hasHRRole()) setIsHr(true);
    if (auth.hasBDManagerRole()) setIsBDManager(true);
    if (auth.hasRecruiterRole()) setIsRecruiter(true);
  }, []);

  const updateFilters = (value) => {
    setFilterCurrentPage(1);
    setFilters(value);
  };

  const loadRateCard = useCallback(() => {
    if (Object.keys(filters).length !== 0) {
      axios
        .put(
          `${config.serverURL}/ratecard?dropdownFilter=true&pageNo=${
            filterCurrentPage - 1
          }&pageSize=${ITEMS_PER_PAGE}`,
          filters,
          { headers }
        )
        .then((res) => {
          if (res.data) {
            setNoData(false);
            setTotalItems(res.headers["total-elements"]);
            setRateCardList(
              res.data.map((ratecard) => ({
                ...ratecard,
                workerName: `${ratecard?.worker?.firstName} ${ratecard?.worker?.lastName}`,
              }))
            );
          }
          if (!res.data.length) {
            setNoData(true);
          }
        })
        .catch((error) => {
          console.log(error);
          if (error.response && error.response.status === 401) {
            logout();
          }
        });
    } else {
      axios
        .get(
          `${config.serverURL}/ratecard?pageNo=${
            currentPage - 1
          }&pageSize=${ITEMS_PER_PAGE}`,
          { headers }
        )
        .then((response) => {
          if (response.data) {
            setRateCardList(
              response.data.map((ratecard) => ({
                ...ratecard,
                workerName: `${ratecard?.worker?.firstName} ${ratecard?.worker?.lastName} `,
              }))
            );
            console.log(setRateCardList);

            setIsSearchResults(false);
            setTotalItems(response.headers["total-elements"]);
            setNoData(false);
          }
        })
        .catch((err) => console.log(err));
    }
  }, [
    filters,
    currentPage,
    ITEMS_PER_PAGE,
    filterCurrentPage,
    headers,
    logout,
  ]);

  useEffect(() => {
    loadRateCard();
  }, [loadRateCard, filters, archive]);

  const loadArchive = useCallback(() => {
    axios
      .get(
        `${config.serverURL}/ratecard?archives=true&pageNo=${
          archiveCurrentPage - 1
        }&pageSize=${ITEMS_PER_PAGE}`,
        { headers }
      )
      .then((res) => {
        if (res.data) {
          setArchiveTotalElements(res.headers["total-elements"]);
          setArchive(
            res.data.map((rateCard) => ({
              id: rateCard.id,
              cellOne:
                `${rateCard.worker?.firstName} ${rateCard.worker?.lastName}` ||
                "",
              cellTwo: rateCard.workerStatus,
              cellThree: rateCard.client?.clientName || "",
              cellFour: rateCard.customer,
              cellFive: rateCard.source,
              cellSix: rateCard.seller,
              cellSeven: rateCard.recruiter,
            }))
          );
        }
      })
      .catch((error) => {
        console.log(error);
        if (error.response && error.response.status === 401) {
          logout();
        }
      });
  }, [archiveCurrentPage, ITEMS_PER_PAGE, headers, logout]);

  useEffect(() => {
    loadArchive();
  }, [loadArchive, archiveCurrentPage]);

  const archiveRateCard = () => {
    const ids = [];
    for (const id in ratecardToArchive) {
      ids.push(id);
    }
    axios
      .all(
        ids.map((id) =>
          axios.delete(`${config.serverURL}/ratecard/${id}`, { headers })
        )
      )
      .then((res) => {
        loadRateCard();
        setRateCardToArchive({});
      })
      .catch((error) => {
        console.log(error);
        if (error.response && error.response.status === 401) {
          logout();
        }
      });
  };

  useEffect(() => {
    loadRateCard();
  }, [loadRateCard]);

  const toggleEditModal = (id) => {
    history.push(`/ratecard/${id}`);
  };
  const openReportModal = () => {
    setShowReportModal(true);
  };

  const handlePopUpSubmit = () => {
    archiveRateCard();
    setRateCardToArchive({});
    setOpenPopUp(false);
  };

  const handlePopUpCancel = () => {
    setOpenPopUp(false);
    setRateCardToArchive({});
  };

  const openArchiveModal = () => {
    loadArchive();
    setOpenArchive(true);
  };
  const sortTable = (key) => {
    if (!sort[key]) {
      setSort({ [key]: "a" });
      setRateCardList(sortAscending(key, ratecardList));
    } else if (sort[key] === "a") {
      setSort({ [key]: "d" });
      setRateCardList(sortDescending(key, ratecardList));
    } else {
      setSort({});
      loadRateCard();
    }
  };

  const changeTablePage = (page) => {
    if (Object.keys(filters).length > 0) {
      setFilterCurrentPage(page);
    } else if (isSearchResults) {
      setSearchCurrentPage(page);
    } else {
      setCurrentPage(page);
    }
  };
 
  const searchRateCard = useCallback(
    (value) => {
      //after applying a search in a filter request all search endpoints could be removed
      setFilters({ ...filters, search: value });
    },
    [filters]
    );

  useEffect(() => {
    if (isSearchResults) searchRateCard(isSearchResults);
  }, [searchCurrentPage, searchRateCard, isSearchResults]);

  const getSearchSuggestions = useCallback((obj) => {
    let suggestions = [];
    for (let key in obj) {
      if (
        (typeof obj[key] === "string" || typeof obj[key] === "number") &&
        key !== "id" &&
        obj[key] !== ""
      ) {
        if (key === "workerName") {
          let values = obj[key].split(", ");
          suggestions.push(values[0], values[1], values[2]);
        } else {
          suggestions.push(obj[key]);
        }
      } else if (typeof obj[key] === "object" && key !== "worker") {
        suggestions = suggestions.concat(getSearchSuggestions(obj[key]));
      }
    }
    return suggestions;
  }, []);

  useEffect(() => {
    if (ratecardList) {
      let options = [];
      for (let obj of ratecardList) {
        let results = getSearchSuggestions(obj);
        results.forEach((item) => {
          if (!options.includes(item)) options.push(item);
        });
      }
      setSearchOptions(options);
    }
  }, [ratecardList, getSearchSuggestions]);

  const clearSearch = () => {
    loadRateCard();
  };
  const convertDataForReport = async (
    fileformattype,
    defaultStatus,
    selectedfields,
    tableFields,
    selectedRateCard
  ) => {
    let promisesarray = [];
    let report;

    for (let i = 0; i < ratecardList.length; i++) {
      promisesarray.push(
        axios.get(`${config.serverURL}/ratecard/${ratecardList[i].id}`, {
          headers,
        })
      );
    }

    return Promise.all(promisesarray).then((results) => {
      if (fileformattype === "pdf") {
        report = reportFormats.ratecardPdfFormat(
          results,
          defaultStatus,
          selectedfields,
          tableFields,
          selectedRateCard
        );
      } else {
        report = reportFormats.ratecardCSVExcel(
          results,
          defaultStatus,
          selectedfields,
          tableFields
        );
      }
      return report;
    });
  };

  const openForm = () => {
    history.push("/addratecard");
  };
  const closeForm = () => {
    history.push("/viewworkers");
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
              { id: 0, text: "Worker", onClick: () => closeForm() },
              { id: 1, text: "RateCard", lastCrumb: true },
            ]}
          />
        }
        actions={
          !isRecruiter &&
          !isBDManager &&
          !isHr && (
            <Button
              type="button"
              className="btn main margin-left"
              handleClick={openForm}
            >
              <PlusOutlined className="icon" />
              Add RateCard
            </Button>
          )
        }
      />
      <Content>
        <ContentActions>
          <Search
            options={searchOptions}
            list={ratecardList}
            handleSearch={searchRateCard}
            clearSearch={clearSearch}
          />
          <div className="content-subactions">
            <Filters
              filterOptions={[
                "RateCard Worker",
                "Client",
                "Seller",
                "Recruiter",
              ]}
              filters={filters}
              setFilters={updateFilters}
              filterTrail={filterTrail}
              setFilterTrail={setFilterTrail}
            />
            <Button
              type="button"
              name="archive"
              className="btn main outlined margin-right marginY"
              handleClick={openArchiveModal}
            >
              <DeleteOutlined /> Archive
            </Button>
            <Button
              type="button"
              handleClick={openReportModal}
              className="btn main outlined margin-right marginY"
            >
              <BarChartOutlined /> Reports
            </Button>
          </div>
        </ContentActions>
        <PillContainer
          filterTrail={filterTrail}
          filters={filters}
          setFilterTrail={setFilterTrail}
          updateFilters={updateFilters}
        />
        <ExpandableTable
          headers={[
            { label: "Archive" },
            {
              label: "Worker",
              onClick: () => sortTable("workerName"),
              sorted: sort["workerName"] ? sort["workerName"] : "u",
              className: "clickable",
            },
            { label: "ClientName" },
            { label: "Bill rate per hr" },
            { label: "VMS Bill Rate" },
            { label: "Cost To Company Per Hour" },
            { label: "Net Margin" },
          ]}
          body={
            ratecardList.length
              ? ratecardList.map((ratecard) => ({
                  id: ratecard.id,
                  cells: [
                    {
                      id: 0,
                      data: (
                        <Check
                          id={`${ratecard.id}`}
                          name={ratecard.workerName}
                          checkedList={ratecardToArchive}
                          setCheckedList={setRateCardToArchive}
                          disabled={false}
                        />
                      ),
                      className: "clickable",
                    },
                    {
                      id: 1,
                      data: ratecard.workerName,
                      onClick: () => toggleEditModal(ratecard.id),
                      className: "clickable",
                    },
                    {
                      id: 2,
                      data: ratecard.client?.clientName,
                    },

                    { id: 3, data: ratecard.billRatePerHr },
                    { id: 4, data: ratecard.vmsbillRate },

                    { id: 5, data: ratecard.costToCompanyPerHour },
                    { id: 6, data: ratecard.netMargin },
                  ],
                }))
              : []
          }
          disableArchive={!Object.keys(ratecardToArchive).length}
          handleClickArchive={() => setOpenPopUp(true)}
          totalItems={totalItems}
          perPage={ITEMS_PER_PAGE}
          currentPage={
            Object.keys(filters).length
              ? filterCurrentPage
              : isSearchResults
              ? searchCurrentPage
              : currentPage
          }
          onPageChange={(page) => changeTablePage(page)}
          items={"ratecards"}
          includePagination={true}
          filterNoMatch={noData}
        />
        <ReportModal
          showReportModal={showReportModal}
          setShowReportModal={setShowReportModal}
          convertDataForReport={convertDataForReport}
          list={ratecardList.map((rateCard) => ({
            id: rateCard.id,
            name: `${rateCard.workerName}`,
          }))}
          listLabel="Ratecard"
          filename="ratecard_report"
          tableFields={[
            {
              label: "Worker Status",
              value: "workerStatus",
              key: "workerStatus",
            },
            { label: "Client", value: "client", key: "client" },
            { label: "VMS Provider", value: "customer", key: "customer" },
            { label: "Pass Thur", value: "source", key: "source" },
            { label: "seller", value: "seller", key: "seller" },
            { label: "recruiter", value: "recruiter", key: "recruiter" },
          ]}
        />
        <PopUp
          openModal={openPopUp}
          type={"warning"}
          confirmValue="Archive"
          cancelValue="CANCEL"
          handleConfirmClose={handlePopUpSubmit}
          closePopUp={handlePopUpCancel}
          message={{
            title: "Warning",
            details: `Are you sure you want to archive the ratecard(s)?`,
          }}
        ></PopUp>
        <ArchiveModal
          openArchive={openArchive}
          setOpenArchive={setOpenArchive}
          loadArchive={loadArchive}
          archive={archive}
          archivedData="ratecard"
          headers={[
            "Worker Name",
            "Worker Status",
            "client",
            "VMS Provider",
            "PASS Thur",
            "seller",
            "recruiter",
          ]}
          totalItems={archiveTotalElements}
          setArchiveCurrentPage={setArchiveCurrentPage}
          archiveCurrentPage={archiveCurrentPage}
        />
      </Content>
    </PageContainer>
  );
};

export default ViewRateCards;
