import { PageContainer } from "../../container/page-container/PageContainer";
import { PageHeader } from "../../container/page-header/PageHeader";
import "antd/dist/antd.css";
import Breadcrumbs from "../../common/breadcrumbs/breadcrumbs.component";
import { useHistory } from "react-router-dom";
import React, { useState, useEffect, useCallback,useMemo,useRef } from "react";
import { PlusOutlined } from "@ant-design/icons";
import Button from "../../common/button/button.component";
import auth from "../../../utils/AuthService";
import { TableLink } from "../../common/table/TableLink";
import { RecordWithDetails } from "../../common/table/record_with_details/RecordWithDetails";
import { TableComponent } from "../../common/table/Table";
import axios from "axios";
import { config } from "../../../config";
import { getRateCard,archiveRateCard, getRatecardByParams } from "../../../API/rateCard/rateCard-apis";
import { message } from "antd";
import { generateOptions } from "./utils/rateCard_utils";
import { getWorkerForDropdown } from "../../../API/workers/worker-apis";
import reportFormats from "../../utils/reports/reportUtils";
import ReportModal from "../../utils/reports/report.modal";
import { reportTableFields } from "./utils/RateCardObjects";
import { RateCardArchive } from "./ratecard_ui_helper/archive_modal/RateCardsArchive";
import "./ratecard.scss";
import IdleTimeOutHandler from "../../ui/Dashboard/IdleTimeOutHandler";


const ViewRateCard = () => {

    const history = useHistory();
    const [isRecruiter, setIsRecruiter] = useState(false);
    const [isHr, setIsHr] = useState(false);
    const [isBDManager, setIsBDManager] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [rateCardList, setRateCardList] = useState([]);
    const [columns, setColumns] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [pageSize, setPageSize]= useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [isAdmin, setIsAdmin] = useState(false);
    const [sort, setSort] = useState({});
    const [filters, setFilters] = useState({});
    const [searchOptions, setSearchOptions] = useState([]);
    const [openArchive, setOpenArchive] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [clientFilters, setClientFilters] = useState([]);
    const [workerFilters, setWorkerFilters] = useState([]);
    const headers = useMemo(() => auth.getHeaders(), []);
    const archiveRef = useRef(null);

   const[isActive,setIsActive]=useState(true)
  const[isLogout,setLogout]=useState(false)
  const user = useMemo(() => auth.getUserInfo(), []);
  const [roleData,setRoleData]=useState(user.roles[0]);
 
  console.log(roleData)
  useEffect(() => {
    if (auth.hasAdminRole()) setIsAdmin(true);
  }, []);

  useEffect(() => {
    if (auth.hasAdminRole()) setIsAdmin(true);
    if (auth.hasHRRole()) setIsHr(true);
    if (auth.hasBDManagerRole()) setIsBDManager(true);
    if (auth.hasRecruiterRole()) setIsRecruiter(true);
  }, []);


  const openForm = () => {
    history.push("/addratecard");
  };
  const closeForm = () => {
    history.push("/viewworkers");
  };  
  const openEditPage = useCallback((id) => {
    history.push(`/ratecard/${id}`);
  }, [history]);

  const getClientFilters = useCallback(async () => {
    await axios
      .get(`${config.serverURL}/clients?dropdownFilter=true`, { headers })
      .then((response) => {
        if (response.data) {
          setClientFilters(
            response.data.map((client) => ({
              text: `${client.clientName} (${client.address?.city})`,
              value: client.id,
            }))
          );
        }
      })
      .catch((err) => console.log(err));
  }, [headers]);
  useEffect(() => getClientFilters(), [getClientFilters]);

  const getWorkerFilters = useCallback(async () => {
    const res = await getWorkerForDropdown(headers);
    if (res.tableData.length) {
      setWorkerFilters(res.tableData.map(worker => ({ text: `${worker.firstName} ${worker.lastName}`, value: worker.id })));
    }
  }, [headers]);
  useEffect(() => getWorkerFilters(), [getWorkerFilters]);

  const defaultColumns = useMemo(
    () => [
      {
        title: "Worker",
        dataIndex: "worker",
        key: "worker.firstName",
       filters: workerFilters,
        sorter: true,
        fixed: "left",
        width: 170,
        render: (worker, row) => (
          <TableLink
            label={`${worker.firstName} ${worker.lastName}`}
            onClick={() => openEditPage(row.id)}
          />
        ),
      },
      {
        title: "Client",
        dataIndex: "client",
        key: "client.clientName",
        width: 120,
        sorter: true,
        filters: clientFilters,
        render: (client) => (
          <RecordWithDetails name={client.clientName} location={`${client.address?.city}`}/>
        )
      },
      {
        title: "Worker Status",
        dataIndex: "workerStatus",
        key: "workerStatus",
        sorter: true,
        width: 120,
      },
      {
        title: "Bill Rate Per Hr",
        dataIndex: "billRatePerHr",
        key: "billRatePerHr",
        width: 140,
        render: (billRatePerHr, row) => (
          
          <div className="bill"> 
            <span>{row.currency}</span> 
            <span >{Number(billRatePerHr).toFixed(2)}</span>
            </div>

        ),
      },
      {
        title: "cost To Company Per Hr",
        dataIndex: "costToCompanyPerHour",
        key: "costToCompanyPerHour",
        width: 120,
        render: (costToCompanyPerHour, row) => (
          
          <div className="bill"> 
            <span>{row.currency}</span> 
            <span >{Number(costToCompanyPerHour).toFixed(2)}</span>
            </div>

        ),
      },
      {
        title: "Gross Margin",
        dataIndex: "grossMargin",
        key: "grossMargin",
        width: 120,
        render: (grossMargin, row) => (
          
          <div className="bill"> 
            <span>{row.currency}</span> 
            <span >{Number(grossMargin).toFixed(2)}</span>
            </div>

        ),
      },
      {
        title: "Net Margin",
        dataIndex: "netMargin",
        key: "netMargin",
        width: 120,
        render: (netMargin, row) => (
          
          <div className="bill"> 
            <span>{row.currency}</span> 
            <span >{Number(netMargin).toFixed(2)}</span>
            </div>

        ),
      },
    ],
    [openEditPage,workerFilters,clientFilters]
  );


  useEffect(() => {
    setColumns(defaultColumns);
  }, [defaultColumns]);

  const loadRateCard = useCallback(async () => {
    const pages = `pageNo=${currentPage}&pageSize=-1`;
    if (!Object.keys(filters).length) {
      let params = `?${pages}`;
      for (const key in sort) {
        if (key) {
          params += `&orderBy=${key}&orderMode=${sort[key]}`;
        }
      }
      const res = await getRatecardByParams(headers, params);
      if (res) setIsLoading(false);
      if (res.statusCode === 200) {
        setRateCardList(res.tableData);
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
    const res = await getRateCard(headers, currentPage, pageSize,  sortParams ? sortParams : `&orderBy=id&orderMode=desc` , filterBy);
    if (res) setIsLoading(false);
    if (res.status === 200) {
      setRateCardList(res.data);
      setTotalItems(res.totalItems);
    }
    if (res.status !== 200) message.error("Something's gone wrong, refresh page or contact your system admin");
  }
}, [filters, currentPage, pageSize, headers, sort]);

  useEffect(() => {
    loadRateCard();
  }, [loadRateCard, filters, archiveRef?.current?.length]);

  
  const archivedRateCard = async () => {
    const res = await archiveRateCard(headers, selectedRowKeys);
    if (res.status === 200) {
        loadRateCard();
      message.success("RateCard record archived successfully!");
      archiveRef.current.loadArchive();
      setSelectedRowKeys([]);
    } else {
      message.error("Something's gone wrong, refresh page or contact your system admin");
    }
  };

  const searchRateCard = useCallback((value) => setFilters({ ...filters, search: value }), [filters]);

  useEffect(() => {
    if (rateCardList.length) setSearchOptions(generateOptions(rateCardList));
  }, [rateCardList]);

  const rowSelection = {
    onChange: (rowKeys, selectedRows) => {
      isAdmin || roleData.workerPermission ? setSelectedRowKeys(rowKeys) : setSelectedRowKeys([]);
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
                { id: 0, text: "Worker", onClick: () => closeForm() },
                { id: 1, text: "RateCard", lastCrumb: true },
              ]}
            />
          }
        actions={
            !isRecruiter &&
            !isBDManager &&
            !isHr && 
              (isAdmin || roleData.workerPermission ?
              <Button
                type="button"
                className="btn main margin-left"
                handleClick={openForm}
              >
                <PlusOutlined className="icon" />
                Add RateCard
              </Button>:""
            )
          }
      />
  
  <TableComponent
        loading={isLoading}
        data={rateCardList.map((rateCard) => ({ 
            ...rateCard, 
            key: rateCard.id 
        }))}
        columns={columns}
        setColumns={setColumns}
        defaultColumns={defaultColumns}
        rowSelection={isAdmin || roleData.workerPermission ? rowSelection :false}
        total={totalItems}
        setCurrentPage={setCurrentPage}
        setPageSize={setPageSize}
        setSort={setSort}
        setFilters={setFilters}
        filters={filters}
        searchOptions={searchOptions}
        searchList={rateCardList}
        handleSearch={searchRateCard}
        openArchive={() => setOpenArchive(true)}
        openReports={() => setShowReportModal(true)}
        handleConfirmArchive={archivedRateCard}
        handleCancelArchiving={cancelArchiving}
        removeableColumns={defaultColumns
          .filter((col) => col.title !== "Worker" && col.title)
          .map((col) => col.title)}
      />

   <ReportModal
        showReportModal={showReportModal}
        setShowReportModal={setShowReportModal}
        individualReportName="ratecard"
        individualList={rateCardList}
        list={rateCardList.map((rateCard) => ({
          id: rateCard.id,
          name: `${rateCard.worker.firstName + " " + rateCard.worker.lastName}`,
        }))}
        listLabel="RateCard"
        filename="ratecard_report"
        tableFields={reportTableFields()}
        pdfFormatter={reportFormats.ratecardPdfFormat}
        csvExcelFormatter={reportFormats.ratecardCSVExcel}
      />
    <RateCardArchive
        open={openArchive}
        setOpen={setOpenArchive}
        ref={archiveRef}
      />

    </PageContainer>
  );
};

export default ViewRateCard;
