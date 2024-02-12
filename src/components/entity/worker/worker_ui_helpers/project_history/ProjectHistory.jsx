import React, { useState, useEffect, useCallback } from "react";
// import { useSelector } from "react-redux";
import axios from "axios";
import { config } from "../../../../../config";
import auth from "../../../../../utils/AuthService";
import { SmallTable } from "../../../../common/small_table/SmallTable";
import Pagination from "../../../../ui/pagination/Pagination";
import { RecordWithDetails} from "../../../../common/table/record_with_details/RecordWithDetails";
import { NoData } from "../../../../common/no-data/NoData";


const ProjectHistory = ({ id, ...props }) => {
  const [workerHistoryList, setWorkerHistoryList] = useState([]);
  const [headers] = useState(auth.getHeaders());
  const [totalItems, setTotalItems] = useState(0);
  // const [endIndex/*, setEndIndex*/] = useState(5);
  // const { basicInfo } = useSelector((state) => state.worker);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = config.ITEMS_PER_PAGE;


  const getWorkerHistory = useCallback(async () => {
    try {
      // const workerId=basicInfo.id;
      const response = await axios
     
     
      .get(`${config.serverURL}/workerhistory/workerPage?id=${id}&pageNo=${currentPage - 1}&pageSize=5`, { headers });

        // .get(`${config.serverURL}/workerhistory/worker/${id}`, { headers })
        // workerhistory/workerPage?id=1&pageNo=0&pageSize=1
        //?pageNo=${currentPage - 1}&pageSize=${ITEMS_PER_PAGE}
      if (response.status === 200) {
        const newRecords = response.data.map(WH => {
          return {
            start: WH?.contractStartDate,
            end: WH?.contractEndDate,
            client: WH?.client.clientName,
            location: WH?.client?.address?.city,
            laptopStatus: WH?.laptopProvided,
            laptopProvider: WH?.laptopProvidedBy,
            laptopReturned: WH?.laptopReturned,
            laptopReturnedDate: WH?.laptopReturnedDate,
            firstName: WH?.firstName,
            lastName: WH?.lastName,
            email: WH?.email,
          }
        })
        setWorkerHistoryList(newRecords);
        setTotalItems(newRecords.length)
      };
    } catch (error) {
      console.log(error);
    }
  }, [headers, currentPage, ITEMS_PER_PAGE]);

  useEffect(() => {
    let isCancelled = false;
    const fetchData = async () => !isCancelled ? await getWorkerHistory() : null;
    fetchData();
    return () => isCancelled = true;
  }, [getWorkerHistory]);

  const changeTablePage = (page) => {
    setCurrentPage(page);
  };

  const columns = [
    {
      title: "Client",
      key: "client",
      render: (client, row) => <RecordWithDetails name={client} location={row.location} />
    },
    {
      title: "Start Date",
      key: "start"
    },
    {
      title: "End Date",
      key: "end"
    },
    {
      title: "Laptop Status",
      key: "laptopStatus",
    },
    {
      title: "Laptop Provider",
      key: "laptopProvider"
    },
    {
      title: "Laptop Return",
      key: "laptopReturnedDate",
      // render: (status, row) => <RecordWithDetails name={status} location={row.laptopReturnedDate} />
    },
  ]

  return (
    <div style={{width: "100%"}}>
      <h3 className="disabled-form-section-header">Project History</h3>

      {workerHistoryList.length > 0 ? (
        <>
          <SmallTable data={workerHistoryList} columns={columns}/>
          <Pagination total={totalItems} itemsPerPage={10} currentPage={currentPage} onPageChange={changeTablePage} />
        </>
      ) : (
        <NoData/>
      )}
    </div>
  );
};

export default ProjectHistory;
