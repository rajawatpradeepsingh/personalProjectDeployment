import {  useCallback } from "react";
import { useHistory } from "react-router-dom";
import "./ratecard.scss";

export const RateCard = ({ rate, onClick }) => {

  const history = useHistory();
  const openEditPage = useCallback((id) => {
    history.push(`/ratecard/${id}`);
  }, [history]);


   return (
     <div className="rate-card" onClick={() => openEditPage(rate.id)}>

      <div className="rate-card-basic">
     <h4 className="ratecardtitle">
      Basic Information
     </h4>
    <div className="disabled-form-section-content wide">
      <div className="disabled-form-section-content wide">
      <span className="disabled-form-text wide">
      <span className="disabled-form-bold-text">Client:</span>
            {rate?.client?.clientName}    
                  </span>
        <span className="disabled-form-text wide">
        <span className="disabled-form-bold-text">
            Contract Start Date:</span>
            {rate?.contractStartDate}
          </span>
        <span className="disabled-form-text wide">
        <span className="disabled-form-bold-text">
            Contract End Date:</span>
            {rate?.contractEndDate}
          </span>
        </div>
        <div className="disabled-form-section-content wide">
        <span className="disabled-form-text wide">
        <span className="disabled-form-bold-text">Worker Status:</span>
            {rate?.workerStatus}
          </span>
        <span className="disabled-form-text wide">
        <span className="disabled-form-bold-text">
            EmployeeSubCOntractor1099: </span>
            {rate?.empSubContractor1099}
          </span>
        </div>
        <div className="disabled-form-section-content wide">
        <span className="disabled-form-text wide">
        <span className="disabled-form-bold-text">
            Pass Thur:</span>
            {rate?.source}
          </span>
        <span className="disabled-form-text wide">
        <span className="disabled-form-bold-text">Sub Contractor:</span>
            {rate?.subContractor}
          </span>
        <span className="disabled-form-text wide">
        <span className="disabled-form-bold-text">VMS Provider:</span>
            {rate?.customer}
          </span>
          <span className="disabled-form-text wide">
          <span className="disabled-form-bold-text">Work Base Calculation:</span>
            {rate?.workBaseCalculation}
          </span>
        </div>
      </div>
      </div>

      <div className="rate-card-basic">
     <h4 className="ratecardtitle">
      Bill Details
     </h4>
     <div className="disabled-form-section-content wide">
      <div className="disabled-form-section-content wide">
      <span className="disabled-form-text wide">
          <span className="disabled-form-bold-text">Bill Rate Per Hr :</span>
          {rate?.billRatePerHr}
        </span>
        <span className="disabled-form-text wide">
          <span className="disabled-form-bold-text"> VMS Fees %:</span>
          {rate?.vmsPercentage}
        </span>
        <span className="disabled-form-text wide">
          <span className="disabled-form-bold-text"> VMS Fees:</span>
          {rate?.vmsFees}
        </span>
        </div>
        <div className="disabled-form-section-content wide">
        <span className="disabled-form-text wide">
          <span className="disabled-form-bold-text">VMS Bill Rate:</span>
          {rate?.vmsbillRate}
        </span>
        <span className="disabled-form-text wide">
          <span className="disabled-form-bold-text">Cost To Company Per Hour:</span>
          {rate?.costToCompanyPerHour}
        </span>
        <span className="disabled-form-text wide">
          <span className="disabled-form-bold-text">Gross Margin:</span>
          {rate?.grossMargin}
        </span>
        </div>
        <div className="disabled-form-section-content wide">
        <span className="disabled-form-text wide">
          <span className="disabled-form-bold-text">Admin Fees:</span>
          {rate?.adminFeeId?.paramLevel}   {rate?.adminFeeId?.paramValue}
        </span>
        <span className="disabled-form-text wide">
          <span className="disabled-form-bold-text">Net Margin:</span>
          {rate?.netMargin}
        </span>
        </div>
      </div>
      </div>

      <div className="rate-card-basic">
     <h4 className="ratecardtitle">
     Commission Details
     </h4>
     <div className="disabled-form-section-content wide">
      <div className="disabled-form-section-content wide">
      <span className="disabled-form-text wide">
          <span className="disabled-form-bold-text">Seller:</span>
          {rate?.seller}
        </span>
        <span className="disabled-form-text wide">
          <span className="disabled-form-bold-text"> Seller Commission Rate:</span>
          {rate?.sellerCommissionRate}
        </span>
      <span className="disabled-form-text wide">
          <span className="disabled-form-bold-text">Recruiter:</span>
          {rate?.recruiter}
        </span>
        <span className="disabled-form-text wide">
          <span className="disabled-form-bold-text">Recruiter Commission Rate:</span>
          {rate?.recruiterCommissionRate}
        </span>
        <span className="disabled-form-text wide">
          <span className="disabled-form-bold-text">Sourcer:</span>
          {rate?.sourcer}
        </span>
        <span className="disabled-form-text wide">
          <span className="disabled-form-bold-text">Sourcer Commission Rate:</span>
          {rate?.sourcerCommissionRate}
        </span>
        </div>
      </div>
      </div>

      <div className="rate-card-basic">
     <h4 className="ratecardtitle">
      Leave Details
     </h4>
     <div className="disabled-form-section-content wide">
      <div className="disabled-form-section-content wide">
      <span className="disabled-form-text wide">
          <span className="disabled-form-bold-text">Sick Leave Hrs:</span>
          {rate?.slHours}
        </span>
        <span className="disabled-form-text wide">
         <span className="disabled-form-bold-text"> Sick Leave Cost:</span>
          {rate?.slCost}
        </span>
        <span className="disabled-form-text wide">
          <span className="disabled-form-bold-text"> Sick Leave Cost Per Hr:</span>
          {rate?.slCostPerHr}
        </span>
      </div>

        <div className="disabled-form-section-content wide">
        <span className="disabled-form-text wide">
          <span className="disabled-form-bold-text"> Max Sick Hr Pay Per Annum:</span>
          {rate?.maxSickHrPayPerAnnum}
        </span>
        <span className="disabled-form-text wide">
          <span className="disabled-form-bold-text"> Total Cost Sick Leave Per Annum:</span>
          {rate?.totCostSickLeavePerAnnum}
        </span>
        <span className="disabled-form-text wide">
          <span className="disabled-form-bold-text">Hr Cost Sick Leave Per Hr:</span>
          {rate?.hrCostSickLeavePerHr}
        </span>
        </div>
        
        <div className="disabled-form-section-content wide">

        <span className="disabled-form-text wide">
          <span className="disabled-form-bold-text">Sick Fees Type:</span>
          {rate?.sickFeeId?.paramLevel}   {rate?.sickFeeId?.paramValue}
        </span>
        <span className="disabled-form-text wide">
          <span className="disabled-form-bold-text">Sick Leave Eligible:</span>
          {rate?.sickLeaveEligible}
        </span>
        <span className="disabled-form-text wide">
          <span className="disabled-form-bold-text">Sick Leave Policy:</span>
          {rate?.slPolicy}
        </span>
        </div>

        <div className="disabled-form-section-content wide">
        <span className="disabled-form-text wide">
          <span className="disabled-form-bold-text">PTO Fees Type:</span>
          {rate?.ptoFeeId?.paramLevel}   {rate?.ptoFeeId?.paramValue}
        </span>
        <span className="disabled-form-text wide">
          <span className="disabled-form-bold-text">PTO Eligible:</span>
          {rate?.ptoEligible}
        </span>
        </div>

        <div className="disabled-form-section-content wide">
        <span className="disabled-form-text wide">
          <span className="disabled-form-bold-text">Max PTO Hr Pay Per Annum:</span>
          {rate?.maxPTOHrPayPerAnnum}
        </span>
        <span className="disabled-form-text wide">
          <span className="disabled-form-bold-text">Total Cost PTO Leave Per Annum:</span>
          {rate?.totCostPTOLeavePerAnnum}
        </span>
        <span className="disabled-form-text wide">
          <span className="disabled-form-bold-text">Hr Cost PTO Leave Per Annum:</span>
          {rate?.hrCostPTOLeavePerHr}
        </span>
        <span className="disabled-form-text wide">
          <span className="disabled-form-bold-text">Total Cost After PTO:</span>
          {rate?.totalCostAfterPTO}
        </span>
        </div>

      <div className="disabled-form-section-content wide">
        <span className="disabled-form-text wide">
          <span className="disabled-form-bold-text">Effective Hr Margin:</span>
          {rate?.effectiveHrMargin}
        </span>
        <span className="disabled-form-text wide">
          <span className="disabled-form-bold-text">Cost Rate Pay Per Hr:</span>
          {rate?.costRatePayPerHr}
        </span>
        <span className="disabled-form-text wide">
          <span className="disabled-form-bold-text">Covid Leave Eligible:</span>
          {rate?.covidLeaveEligible}
        </span>
        </div>
      </div>
      </div>

      <div className="rate-card-basic">
     <h4 className="ratecardtitle">
     Comments
     </h4>
     <div className="disabled-form-section-content wide">
        <span className="disabled-form-text wide">
          <span className="disabled-form-bold-text">Comments:</span>
          {rate?.comments}
        </span>
        
      </div>
      </div>

     </div>
   );
}