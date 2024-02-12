import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { config } from "../../../../../config";
import auth from "../../../../../utils/AuthService";
import { VisaCard } from "../visa_card/VisaCard";
import Button from "../../../../common/button/button.component";
import { PlusOutlined } from "@ant-design/icons";
import { VisaHistory } from "../visa_history/VisaHistory";
import AddVisatracking from "../visa_card/AddVisatracking";
import { NoData } from "../../../../common/no-data/NoData";
import { useSelector } from "react-redux";

const VisaDetails = ({ id, ...props })  => {
  const [headers] = useState(auth.getHeaders());
  const [currentVisaList,setCurrentVisaList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [canAddEdit, setCanAddEdit] = useState(false);
  const [openAddVisa, setOpenAddVisa] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyTotalItems, setHistoryTotalItems] = useState(0);
  const { basicInfo } = useSelector((state) => state.worker);

  useEffect(() => {
    if (auth.isAdminOrOperations()) setCanAddEdit(true);
  }, []);

  const getCurrentVisa = useCallback(async () => {
    try {
      const res = await axios.get(
        `${config.serverURL}/visatracking/worker/${id}`,
          { headers }
       );
       if (res.data) {
          setCurrentVisaList(res.data);
       }
       
    } catch (error) {
       console.log(error);
    }
 }, [headers, id]);

 useEffect(() => getCurrentVisa(), [getCurrentVisa]);

  const getHistory = useCallback(async () => {
    try {
      const response = await axios.get(`${config.serverURL}/visahistory/workerPage?workerId=${id}&pageNo=${currentPage - 1}&pageSize=5&orderBy=visaType&orderMode=desc`, { headers });
      if (response.status === 200) {
        setHistory(response.data);
        setHistoryTotalItems(response.headers['total-elements']);
      };
    } catch (error) {
      console.log(error)
    }
  }, [headers, id, currentPage]);

  useEffect(() => {
    getHistory();
  }, [getHistory]);

  const canAddNewVisa = useMemo(() => {
    return (currentVisaList[0]?.visaStatus === "EXPIRED" || !currentVisaList.length) && canAddEdit
      ? true
      : false;
  }, [currentVisaList, canAddEdit]);

  return (
    <>
      {canAddNewVisa && (
        <div
          style={{
            marginBottom: "16px",
            width: "100%",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Button
            type="button"
            className="btn main outlined"
            handleClick={() => setOpenAddVisa(true)}
          >
            <PlusOutlined className="icon" />
            Add New Visa
          </Button>
        </div>
      )}
      <h3 className="disabled-form-section-header">Current Visa Details </h3>
      {!currentVisaList.length ? (
        <NoData/>
      ) : (
        <VisaCard visa={currentVisaList[0]} key={currentVisaList[0].id} />
      )}
      <h3
        className="disabled-form-section-header"
        style={{ marginTop: "16px" }}
      >
        Visa History
      </h3>
      {!history.length ? (
        <NoData/>
      ) : (
        <VisaHistory
          history={history}
          totalItems={historyTotalItems}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
        />
      )}
      <AddVisatracking open={openAddVisa} setOpen={setOpenAddVisa} refresh={getCurrentVisa}
/>
    </>
  );
};


export default VisaDetails;