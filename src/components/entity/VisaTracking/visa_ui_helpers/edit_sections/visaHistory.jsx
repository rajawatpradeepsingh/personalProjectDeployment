import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { config } from "../../../../../config";
import auth from "../../../../../utils/AuthService";
import { VisaHistory as History } from "../../../worker/worker_ui_helpers/visa_history/VisaHistory";

const VisaHistory = (props) => {
  const [visaHistoryList,setVisaHistoryList] = useState([]);
  const [headers] = useState(auth.getHeaders());
  const { visaDetails } = useSelector((state) => state.visatracking);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const getVisaHistory = useCallback((id) => {
    if (!id) return;
    axios
      .get(
        `${config.serverURL}/visahistory/visaPage?visaId=${id}&pageNo=${currentPage - 1}&pageSize=5&orderBy=visaStatus&orderMode=asc`,
        { headers }
      )
      .then((res) => {
        if (res.data) {
          setVisaHistoryList(res.data);
          setTotalItems(res.headers['total-elements']);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [headers, currentPage]);

  useEffect(() => {
    getVisaHistory(visaDetails?.id);
  }, [visaDetails,getVisaHistory]);

  return (
    <div>
      <h3 className="disabled-form-section-header">History</h3>
      <History history={visaHistoryList} currentPage={currentPage} setCurrentPage={setCurrentPage} totalItems={totalItems}/>
    </div>
  );
};

export default VisaHistory;