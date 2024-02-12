import { Fragment } from "react";
import React, { useState, useEffect, useCallback ,useMemo} from "react";
import axios from "axios";
import { config } from "../../../../../config";
import auth from "../../../../../utils/AuthService";
import { RateCard } from "../rate_card/ratecard";
import { NoData } from "../../../../common/no-data/NoData";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { PlusOutlined } from "@ant-design/icons";
import Button from "../../../../common/button/button.component";
import { setIsAuth } from "../../../../../Redux/appSlice";
const RateCardWorker = ({ id, ...props })  => {
  const [headers] = useState(auth.getHeaders());
  const [currentRateCardList,setCurrentRateCardList] = useState([]);
  const [currentPage] = useState(1);
  const [isRecruiter, setIsRecruiter] = useState(false);
  const [isHr, setIsHr] = useState(false);
  const [isBDManager, setIsBDManager] = useState(false);
  const history = useHistory();
  const dispatch = useDispatch();
  const [isAdmin, setIsAdmin] = useState(false);
  const user = useMemo(() => auth.getUserInfo(), []);
  const [roleData,setRoleData]=useState(user.roles[0]);
  useEffect(() => {
    if (auth.hasAdminRole()) setIsAdmin(true);
  }, []);
  
  const logout = useCallback(() => {
    dispatch(setIsAuth(false));
    auth.logout();
  }, [dispatch]);

  useEffect(() => {
    if (auth.hasHRRole()) setIsHr(true);
    if (auth.hasBDManagerRole()) setIsBDManager(true);
    if (auth.hasRecruiterRole()) setIsRecruiter(true);
  }, []);
  const getCurrentRateCard = useCallback(async () => {
    try {
       const res = await axios.put(
          `${config.serverURL}/ratecard?dropdownFilter=true&pageNo=${currentPage - 1}&pageSize=${4}`,
          { workerId: `${id}`},
          { headers }
       );
       if (res.data) {
          setCurrentRateCardList(res.data);
       }
       
    } catch (error) {
       console.log(error);
       if (error.response && error.response.status === 401) {
        logout();
      }
    }
 }, [headers, currentPage, id,logout]);

 useEffect(() => getCurrentRateCard(), [getCurrentRateCard, currentPage]);


const openForm = () => {
  history.push("/addratecard");
};

  return (
    <Fragment>
    <>
      <div className="disabled-form-section small">
        <div className="disabled-form-section">
          <h4 className="disabled-form-section-header">Rate Card Details</h4>
          <div   style={{
            marginBottom: "16px",
            width: "100%",
            display: "flex",
            direction:"row",
            marginLeft:"400px"
          }}>

        {currentRateCardList.length < 1 &&(
        <NoData/>
        )}

        {currentRateCardList.length < 1 &&(
          <div
          style={{
            marginBottom: "16px",
            width: "100%",
            display: "flex",
            direction:"row",
            marginLeft:"400px"
          }}>
            
         {
          !isRecruiter &&
          !isBDManager &&
          !isHr && 
          (isAdmin || roleData.managerPermission || roleData.candidatesPermission  ||roleData.clientPermission  ||roleData.interviewsPermission  ||roleData.jobOpeningsPermission  ||roleData.onBoardingsPermission ||roleData.settingsPermission  ||roleData.suppliersPermission ?
            <Button style={{marginLeft : "-100px"}}
              type="button"
              className="btn main margin-left"
              handleClick={openForm}
            >
              <PlusOutlined className="icon" />
              Add RateCard
            </Button>:""
         )
        }
        </div>
        )}
</div>
          {currentRateCardList.map((rate) => (
        <RateCard rate={rate} key={rate.id} />
      ))}
      </div>
     </div>
   
    </>


</Fragment>
);
};


export default RateCardWorker;