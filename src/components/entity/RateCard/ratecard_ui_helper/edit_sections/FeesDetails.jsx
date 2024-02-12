
import { useSelector,useDispatch } from "react-redux";
import { setInputErr, setRequiredErr,setChangesMade,setRateCardDetails } from "../../../../../Redux/rateCardSlice";
import { runValidation } from "../../../../../utils/validation";
import { InputCurrencyRate } from "../../../../common/input/input-currency-rate/input-currency-rate.component";
import Input from "../../../../common/input/inputs.component";
import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { config } from "../../../../../config";
import auth from "../../../../../utils/AuthService";
import SingleSelect from "../../../../common/select/selects.component";
import TextBlock from "../../../../common/textareas/textareas.component";
import { Collapse } from "antd";
import { PlusSquareTwoTone, MinusSquareTwoTone } from "@ant-design/icons";
import "../../ratecard.scss";
const FeeDetails = () => {
  const dispatch = useDispatch();
    const { editEnabled } = useSelector((state) => state.ratecard);
    const { rateCardDetails } = useSelector((state) => state.ratecard);
    const { inputErr, requiredErr } = useSelector((state) => state.ratecard);
    const dispatchErr = (object) => dispatch(setInputErr(object));
    const dispatchReqErr = (object) => dispatch(setRequiredErr(object));
    const dispatchChange = (object) => dispatch(setChangesMade(object));
    const dispatchRateCard = (object) => dispatch(setRateCardDetails(object));
    const [parameterAdminOptions, setParameterAdminOptions] = useState([]);
    const [parameterPtoOptions, setParameterPtoOptions] = useState([]);
    const [parameterSickOptions, setParameterSickOptions] = useState([]);
    const [headers] = useState(auth.getHeaders());

    const handleChange = (event, validProc = null) => {
      dispatchChange(true);
      const isValid = runValidation(validProc, event.target.value);
      let temp;
      if (event.target.value !== "") {
        temp = { ...requiredErr };
        delete temp[event.target.name];
        dispatchReqErr(temp);
      }
      dispatchRateCard({ ...rateCardDetails, [event.target.name]: event.target.value });
  
      if (!isValid) {
        dispatchErr({
          ...inputErr,
          [event.target.name]: `Invalid format or characters`,
        });
      } else {
        temp = { ...inputErr };
        delete temp[event.target.name];
        dispatchErr(temp);
      }

    };

    const currencyChange = (e, validProc = "validateNum") => {
      e.target.value = e.target.value === "" ? "USD, $" : e.target.value;
      handleChange(
        e,
        e.target.name === "billRatePerHr",
        "vmsFees" ? validProc : ""
      );
    };

    const handleChangeAdminParameter = (e) => {
      let parameter = parameterAdminOptions.filter(
        (item) => +item.id === +e.target.value
      )[0];
  
      dispatchRateCard({
        ...rateCardDetails,
        adminFeeId: { id: parameter.id },
      });
    };

    const handleChangePtoParameter = (e) => {
      let parameter = parameterPtoOptions.filter(
        (item) => +item.id === +e.target.value
      )[0];
  
      dispatchRateCard({
        ...rateCardDetails,
        ptoFeeId: { id: parameter.id },
      });
    };

    const handleChangeSickParameter = (e) => {
      let parameter = parameterSickOptions.filter(
        (item) => +item.id === +e.target.value
      )[0];
  
      dispatchRateCard({
        ...rateCardDetails,
        sickFeeId: { id: parameter.id },
      });
    };
    const getAdminParameters = useCallback(() => {
      axios
      .get(config.serverURL + "/parameter/adminfee", { headers })
        .then((res) => {
          const param = res.data;
          if (res.data) {
            setParameterAdminOptions(param);
          }
        })
        .catch((error) => {
          if (error.response && error.response.status === 401) auth.logout();
        });
    }, [headers])

    useEffect(() => {
      getAdminParameters();
    }, [ getAdminParameters]);

    const getPtoParameters = useCallback(() => {
      axios
      .get(config.serverURL + "/parameter/ptofee", { headers })
        .then((res) => {
          const param = res.data;
          if (res.data) {
            setParameterPtoOptions(param);
          }
        })
        .catch((error) => {
          if (error.response && error.response.status === 401) auth.logout();
        });
    }, [headers])

    useEffect(() => {
      getPtoParameters();
    }, [ getPtoParameters]);

    const getSickParameters = useCallback(() => {
      axios
      .get(config.serverURL + "/parameter/sickfee", { headers })
        .then((res) => {
          const param = res.data;
          if (res.data) {
            setParameterSickOptions(param);
          }
        })
        .catch((error) => {
          if (error.response && error.response.status === 401) auth.logout();
        });
    }, [headers])

    useEffect(() => {
      getSickParameters();
    }, [ getSickParameters]);

    const panelStyle = {
      marginBottom: 0,
      background: "#fff",
    };

    return !editEnabled ? (
      <>
  <div className="disabled-form-section small">
  <Collapse
      defaultActiveKey={["1", "2"]}
      size="small"
      id="cand-details-collapse"
      bordered={false}
      expandIcon={({ isActive }) =>
        isActive ? (
          <MinusSquareTwoTone
            twoToneColor={"#758bfd"}
            style={{ fontSize: "14px", marginTop: "5px" }}
          />
        ) : (
          <PlusSquareTwoTone
            twoToneColor={"#758bfd"}
            style={{ fontSize: "14px", marginTop: "5px" }}
          />
        )
      }
    >
          <Collapse.Panel
        style={panelStyle}
        header={<span className="long-form-subsection-header">Bill Details</span>}
        key="1"
      > 
        <div className="disabled-form-section-content wide">
      <div className="disabled-form-section-content wide">
      <span className="disabled-form-align wide">
          <span className="disabled-form-bold-text">Bill Rate Per Hr :</span>
          {rateCardDetails?.currency} {Number(rateCardDetails?.billRatePerHr).toFixed(2)}
        </span>
        <span className="disabled-form-align wide">
          <span className="disabled-form-bold-text"> VMS Fees %:</span>
          {Number(rateCardDetails?.vmsPercentage).toFixed(2)}
        </span>
        <span className="disabled-form-align wide">
          <span className="disabled-form-bold-text"> VMS Fees:</span>
          {rateCardDetails?.currency}  {Number(rateCardDetails?.vmsFees).toFixed(2)}
        </span>
        </div>
        <div className="disabled-form-section-content wide">
        <span className="disabled-form-align wide">
          <span className="disabled-form-bold-text">VMS Bill Rate:</span>
          {rateCardDetails?.currency} {Number(rateCardDetails?.vmsbillRate).toFixed(2)}
        </span>
        <span className="disabled-form-align wide">
          <span className="disabled-form-bold-text">Cost To Company Per Hour:</span>
          {rateCardDetails?.currency} {Number(rateCardDetails?.costToCompanyPerHour).toFixed(2)}
        </span>
        <span className="disabled-form-align wide">
          <span className="disabled-form-bold-text">Gross Margin:</span>
          {Number(rateCardDetails?.grossMargin).toFixed(2)}
        </span>
        </div>
        <div className="disabled-form-section-content wide">
        <span className="disabled-form-text wide">
          <span className="disabled-form-bold-text">Admin Fees Type:</span>
          {rateCardDetails?.adminFeeId?.paramLevel}   {rateCardDetails?.adminFeeId?.paramValue}
        </span>
        <span className="disabled-form-align wide">
          <span className="disabled-form-bold-text">Net Margin:</span>
          {Number(rateCardDetails?.netMargin).toFixed(2)}
        </span>
        
        </div>
      </div>
      </Collapse.Panel>
      
      <Collapse.Panel
        style={panelStyle}
        header={<span className="long-form-subsection-header">Commission Details</span>}
        key="2"
      > 
        <div className="disabled-form-section-content wide">
      <div className="disabled-form-section-content wide">
      <span className="disabled-form-text wide">
          <span className="disabled-form-bold-text">Seller:</span>
          {rateCardDetails?.seller}
        </span>
        <span className="disabled-form-align wide">
          <span className="disabled-form-bold-text"> Seller Commission Rate:</span>
          {Number(rateCardDetails?.sellerCommissionRate).toFixed(2)}
        </span>
        </div>
        <div className="disabled-form-section-content wide">
      <span className="disabled-form-text wide">
          <span className="disabled-form-bold-text">Recruiter:</span>
          {rateCardDetails?.recruiter}
        </span>
        <span className="disabled-form-align wide">
          <span className="disabled-form-bold-text">Recruiter Commission Rate:</span>
          {Number(rateCardDetails?.recruiterCommissionRate).toFixed(2)}
        </span>
        </div>
        <div className="disabled-form-section-content wide">
        <span className="disabled-form-text wide">
          <span className="disabled-form-bold-text">Sourcer:</span>
          {rateCardDetails?.sourcer}
        </span>
        <span className="disabled-form-align wide">
          <span className="disabled-form-bold-text">Sourcer Commission Rate:</span>
          {Number(rateCardDetails?.sourcerCommissionRate).toFixed(2)}
        </span>
        </div>
      </div>
</Collapse.Panel>
<Collapse.Panel
        style={panelStyle}
        header={<span className="long-form-subsection-header">Leave Details</span>}
        key="3"
      > 
     
      <div className="disabled-form-section-content wide">
          <span className="disabled-form-align wide">
          <span className="disabled-form-bold-text">Sick Leave Hrs:</span>
          {Number(rateCardDetails?.slHours).toFixed(2)}
        </span>
        <span className="disabled-form-align wide">
         <span className="disabled-form-bold-text"> Sick Leave Cost:</span>
          {Number(rateCardDetails?.slCost).toFixed(2)}
        </span>
        <span className="disabled-form-align wide">
          <span className="disabled-form-bold-text"> Sick Leave Cost Per Hr:</span>
          {Number(rateCardDetails?.slCostPerHr).toFixed(2)}
        </span>
      </div>

        <div className="disabled-form-section-content wide">
        <span className="disabled-form-align wide">
          <span className="disabled-form-bold-text"> Max Sick Hr Pay Per Annum:</span>
          {Number(rateCardDetails?.maxSickHrPayPerAnnum).toFixed(2)}
        </span>
        <span className="disabled-form-align wide">
          <span className="disabled-form-bold-text"> Total Cost Sick Leave Per Annum:</span>
          {Number(rateCardDetails?.totCostSickLeavePerAnnum).toFixed(2)}
        </span>
        <span className="disabled-form-align wide">
          <span className="disabled-form-bold-text">Hr Cost Sick Leave Per Hr:</span>
          {Number(rateCardDetails?.hrCostSickLeavePerHr).toFixed(2)}
        </span>
        </div>
        
        <div className="disabled-form-section-content wide">
        <span className="disabled-form-text wide">
          <span className="disabled-form-bold-text">Sick Fees Type:</span>
          {rateCardDetails?.sickFeeId?.paramLevel}   {rateCardDetails?.sickFeeId?.paramValue}
        </span>
        <span className="disabled-form-text wide">
          <span className="disabled-form-bold-text">Sick Leave Eligible:</span>
          {rateCardDetails?.sickLeaveEligible}
        </span>
        <span className="disabled-form-text wide">
          <span className="disabled-form-bold-text">Sick Leave Policy:</span>
          {rateCardDetails?.slPolicy}
        </span>
        </div>

        <div className="disabled-form-section-content wide">

        <span className="disabled-form-text wide">
          <span className="disabled-form-bold-text">PTO Fees Type:</span>
          {rateCardDetails?.ptoFeeId?.paramLevel}   {rateCardDetails?.ptoFeeId?.paramValue}
        </span>

        <span className="disabled-form-text wide">
          <span className="disabled-form-bold-text">PTO Level:</span>
          {rateCardDetails?.ptoLevel}
        </span>
        <span className="disabled-form-text wide">
          <span className="disabled-form-bold-text">PTO Eligible:</span>
          {rateCardDetails?.ptoEligible}
        </span>
        </div>

        <div className="disabled-form-section-content wide">
        <span className="disabled-form-align wide">
          <span className="disabled-form-bold-text">Max PTO Hr Pay Per Annum:</span>
          {Number(rateCardDetails?.maxPTOHrPayPerAnnum).toFixed(2)}
        </span>
        <span className="disabled-form-align wide">
          <span className="disabled-form-bold-text">Total Cost PTO Leave Per Annum:</span>
          {Number(rateCardDetails?.totCostPTOLeavePerAnnum).toFixed(2)}
        </span>
        <span className="disabled-form-align wide">
          <span className="disabled-form-bold-text">Hr Cost PTO Leave Per Annum:</span>
          {Number(rateCardDetails?.hrCostPTOLeavePerHr).toFixed(2)}
        </span>
        <span className="disabled-form-align wide">
          <span className="disabled-form-bold-text">Total Cost After PTO:</span>
          {Number(rateCardDetails?.totalCostAfterPTO).toFixed(2)}
        </span>
        </div>
     
      <div className="disabled-form-section-content wide">
        <span className="disabled-form-align wide">
          <span className="disabled-form-bold-text">Effective Hr Margin:</span>
          {Number(rateCardDetails?.effectiveHrMargin).toFixed(2)}
        </span>
        <span className="disabled-form-align wide">
          <span className="disabled-form-bold-text">Cost Rate Pay Per Hr:</span>
          {Number(rateCardDetails?.costRatePayPerHr).toFixed(2)}
        </span>
        <span className="disabled-form-text wide">
          <span className="disabled-form-bold-text">Covid Leave Eligible:</span>
          {rateCardDetails?.covidLeaveEligible}
        </span>
        </div>
        
        </Collapse.Panel>
        <Collapse.Panel
        style={panelStyle}
        header={<span className="long-form-subsection-header">Comments</span>}
        key="4"
      > 
      <div className="disabled-form-section-content wide">
     
      <div className="disabled-form-section-content wide">
          <span className="disabled-form-text wide">
          <span className="disabled-form-bold-text">Comments:</span>
          {/* {rateCardDetails?.comments} */}
          <TextBlock
      type="text"
      label="Comments"
      name="comments"
      value={rateCardDetails?.comments || ""}
        disabled
    />
        </span>
      </div>
      </div>
      </Collapse.Panel>
      </Collapse>
      </div>

      </>
    ) : (
          <div className="disabled-form-section small"  >

      <Collapse
      defaultActiveKey={["1", "2"]}
      size="small"
      id="cand-details-collapse"
      bordered={false}
      expandIcon={({ isActive }) =>
        isActive ? (
          <MinusSquareTwoTone
            twoToneColor={"#758bfd"}
            style={{ fontSize: "14px", marginTop: "5px" }}
          />
        ) : (
          <PlusSquareTwoTone
            twoToneColor={"#758bfd"}
            style={{ fontSize: "14px", marginTop: "5px" }}
          />
        )
      }
    >
  
      <Collapse.Panel
        style={panelStyle}
        header={<span className="long-form-subsection-header">Bill Details</span>}
        key="1"
      > 
      <div className="disabled-form-section-content wide">
      <InputCurrencyRate
            label="Bill Rate Per Hr "
            id="currency"
            type="number"
            pattern="[0-9]*"
            nameCurrency="currency"
            nameRate="billRatePerHr"
            handleChange={currencyChange}
            onChange={(e) => {
              handleChange(e, "validateHasDecimal");
              
            }}
            valueCurrency={rateCardDetails.currency}
            valueRate={Number(rateCardDetails.billRatePerHr).toFixed(2)}
            required
          />

<Input
            type="number"
            name="vmsPercentage"
            className="numAlign"
            label="VMS Fees %"
            pattern="[0-9]*"
            onChange={(e) => {
              handleChange(e, "validateHasDecimal");
            }}
            value={Number(rateCardDetails.vmsPercentage).toFixed(2)}
            errMssg={inputErr["vmsPercentage"]}
            
          />
             <InputCurrencyRate
            id="currency"
            type="number"
            pattern="[0-9]*"
            nameCurrency="currency"
            nameRate="costToCompanyPerHour"
            label="Cost To Company Per Hour"
            handleChange={currencyChange}
            onChange={(e) => {
              handleChange(e, "validateHasDecimal");
            }}
            valueCurrency={rateCardDetails.currency}
            valueRate={Number(rateCardDetails.costToCompanyPerHour).toFixed(2)}
            required
          
          />
          {/* <InputCurrencyRate
            id="currency"
            type="number"
            pattern="[0-9]*"
            nameCurrency="currency"
            nameRate="vmsFees"
            label="VMS Fees"
            onChange={(e) => {
              handleChange(e, "validateHasDecimal");
            }}
            handleChange={currencyChange}
            valueCurrency={rateCardDetails.currency}
            valueRate={Number(rateCardDetails.vmsFees).toFixed(2)}
            required
            disabled
          /> */}
          </div>
          {/* <div className="disabled-form-section-content wide"> */}

           {/* <InputCurrencyRate
            id="currency"
            type="number"
            pattern="[0-9]*"
            nameCurrency="currency"
            nameRate="vmsbillRate"
            label="VMS Bill Rate"
            handleChange={currencyChange}
            onChange={(e) => {
              handleChange(e, "validateHasDecimal");
            }}
            valueCurrency={rateCardDetails.currency}
            valueRate={Number(rateCardDetails.vmsbillRate).toFixed(2)}
            required
            disabled
          /> */}
                 
          {/* <Input
            type="number"
            name="grossMargin"
            label="Gross Margin"
            pattern="[0-9]*"
            onChange={(e) => {
              handleChange(e, "validateHasDecimal");
            }}
            value={Number(rateCardDetails.grossMargin).toFixed(2)}
            disabled
          /> */}
      {/* </div> */}

      <div className="disabled-form-section-content wide">
     


<SingleSelect
            label="Admin Fees Type"
            name="id"
            data-testid="parameter-options"
            value={rateCardDetails.adminFeeId?.id || ""}
            required
            onChange={handleChangeAdminParameter}
            options={parameterAdminOptions.map((parameter) => {
              let id = parameter.id;
              return {
                id: id,
                name: `${parameter.paramLevel}  ${parameter.paramValue}`,
              };
            })}
           
          />
          
          <Input
            type="number"
            name="netMargin"
            label="Net Margin"
            className="numAlign"
            pattern="[0-9]*"
            onChange={(e) => handleChange(e, "validateHasDecimal")}
            value={Number(rateCardDetails.netMargin).toFixed(2)}
            errMssg={inputErr["netMargin"]}
        
          />
        </div>
        </Collapse.Panel>
        <Collapse.Panel
        style={panelStyle}
        header={<span className="long-form-subsection-header">Commission Details</span>}
        key="2"
      > 
    
      <div className="disabled-form-section-content wide">
      <Input
            type="text"
            name="seller"
            label="Seller"
            onChange={(e) => handleChange(e, "validateName")}
            value={rateCardDetails.seller || ""}
            errMssg={inputErr["seller"]}
          />
          <Input
            type="number"
            name="sellerCommissionRate"
            label="Seller Commission Rate "
            className="numAlign"
            pattern="[0-9]*"
            onChange={(e) => handleChange(e, "validateHasDecimal")}
            value={Number(rateCardDetails.sellerCommissionRate).toFixed(2)}
            errMssg={inputErr["sellerCommissionRate"]}
           
          />
          </div>
        
          <div className="disabled-form-section-content wide">
      <Input
            type="text"
            name="recruiter"
            label="Recruiter"
            onChange={(e) => handleChange(e, "validateName")}
            value={rateCardDetails.recruiter || ""}
            errMssg={inputErr["recruiter"]}
          />
          <Input
            type="number"
            name="recruiterCommissionRate"
            label="Recruiter Commission Rate "
            className="numAlign"
            pattern="[0-9]*"
            onChange={(e) => handleChange(e, "validateHasDecimal")}
            value={Number(rateCardDetails.recruiterCommissionRate).toFixed(2)}
            errMssg={inputErr["recruiterCommissionRate"]}
          />
          </div>
          <div className="disabled-form-section-content wide">
       <Input
            type="text"
            name="sourcer"
            label="Sourcer"
            onChange={(e) => handleChange(e, "validateName")}
            value={rateCardDetails.sourcer || ""}
            errMssg={inputErr["sourcer"]}
          />
          <Input
            type="number"
            name="sourcerCommissionRate"
            className="numAlign"
            label="Sourcer Commission Rate "
            pattern="[0-9]*"
            onChange={(e) => handleChange(e, "validateHasDecimal")}
            value={Number(rateCardDetails.sourcerCommissionRate).toFixed(2)}
            errMssg={inputErr["sourcerCommissionRate"]}
          
          />
      </div>
      </Collapse.Panel>
      <Collapse.Panel
        style={panelStyle}
        header={<span className="long-form-subsection-header">Leave Details</span>}
        key="3"
      > 
      <div className="disabled-form-section-content wide">
      <Input
            type="number"
            name="slHours"
            label="Sick Leave Hrs"
            className="numAlign"
            pattern="[0-9]*"
            onChange={(e) => handleChange(e, "validateHasDecimal")}
            value={Number(rateCardDetails.slHours).toFixed(2)}
            errMssg={inputErr["slHours"]}
           
          />
           <Input
            type="number"
            name="slCost"
            label="Sick Leave Cost"
            className="numAlign"
            pattern="[0-9]*"
            onChange={(e) => handleChange(e, "validateHasDecimal")}
            value={Number(rateCardDetails.slCost).toFixed(2)}
            errMssg={inputErr["slCost"]}
          />
          <Input
            type="number"
            name="slCostPerHr"
            label="Sick Leave Cost Per Hr"
            pattern="[0-9]*"
            className="numAlign"
            onChange={(e) => handleChange(e, "validateHasDecimal")}
            value={Number(rateCardDetails.slCostPerHr).toFixed(2)}
            errMssg={inputErr["slCostPerHr"]}
          />
</div>
<div className="disabled-form-section-content wide">
          <Input
            type="number"
            name="maxSickHrPayPerAnnum"
            label="Max Sick Hr Pay Per Annum"
            className="numAlign"
            pattern="[0-9]*"
            onChange={(e) => handleChange(e, "validateHasDecimal")}
            value={Number(rateCardDetails.maxSickHrPayPerAnnum).toFixed(2)}
            errMssg={inputErr["maxSickHrPayPerAnnum"]}
          />
      <Input
            type="number"
            name="totCostSickLeavePerAnnum"
            label="Total Cost Sick Leave Per Annum"
            pattern="[0-9]*"
            className="numAlign"
            onChange={(e) => handleChange(e, "validateHasDecimal")}
            value={Number(rateCardDetails.totCostSickLeavePerAnnum).toFixed(2)}
            errMssg={inputErr["totCostSickLeavePerAnnum"]}
          />
          <Input
            type="number"
            name="hrCostSickLeavePerHr"
            label="Hr Cost Sick Leave Per Hr"
            pattern="[0-9]*"
            className="numAlign"
            onChange={(e) => handleChange(e, "validateHasDecimal")}
            value={Number(rateCardDetails.hrCostSickLeavePerHr).toFixed(2)}
            errMssg={inputErr["hrCostSickLeavePerHr"]}
          />
          </div>
 <div className="disabled-form-section-content wide">

      <SingleSelect
           label="Sick Level Type"
           name="id"
            data-testid="parameter-options"
            value={rateCardDetails.sickFeeId?.id || ""}
            required
            onChange={handleChangeSickParameter}
            options={parameterSickOptions.map((parameter) => {
              let id = parameter.id;
              return {
                id: id,
                name: `${parameter.paramLevel}  ${parameter.paramValue}`,
              };
            })}
           
          />
          <SingleSelect
            label="Sick Leave Eligible"
            name="sickLeaveEligible"
            value={rateCardDetails.sickLeaveEligible || ""}
            onChange={(e) => handleChange(e)}
            options={[
              { id: "Yes", value: "Yes", name: "Yes" },
              { id: "No", value: "No", name: "No" },
            ]}
          />

          <SingleSelect
            label="Sick Leave Policy"
            name="slPolicy"
            value={rateCardDetails.slPolicy || ""}
            onChange={(e) => handleChange(e)}
            options={[
              { id: "Yes", value: "Yes", name: "Yes" },
              { id: "No", value: "No", name: "No" },
            ]}
          />
     </div>
     <div className="disabled-form-section-content wide">
     {/* <SingleSelect
            label="PTO Level"
            name="ptoLevel"
            value={rateCardDetails.ptoLevel || ""}
            onChange={(e) => handleChange(e)}
            options={[
              { id: "0", value: "Level 0", name: "Level 0" },
              { id: "1", value: "Level 1", name: "Level 1" },
              { id: "2", value: "Level 2", name: "Level 2" },
              { id: "3", value: "Level 3", name: "Level 3" },
              { id: "4", value: "Level 4", name: "Level 4" },
            ]}

          /> */}
          <SingleSelect
             label="PTO Level Type"
             name="id"
            data-testid="parameter-options"
            value={rateCardDetails.ptoFeeId?.id || ""}
            required
            onChange={handleChangePtoParameter}
            options={parameterPtoOptions.map((parameter) => {
              let id = parameter.id;
              return {
                id: id,
                name: `${parameter.paramLevel}  ${parameter.paramValue}`,
              };
            })}
           
          />

                    <SingleSelect
            label="PTO Eligible"
            name="ptoEligible"
            value={rateCardDetails.ptoEligible || ""}
            onChange={(e) => handleChange(e)}
            options={[
              { id: "Yes", value: "Yes", name: "Yes" },
              { id: "No", value: "No", name: "No" },
            ]}
          />
          </div>
          <div className="disabled-form-section-content wide">
          <Input
            type="number"
            name="maxPTOHrPayPerAnnum"
            label="Max PTO Hr Pay Per Annum"
            className="numAlign"
            pattern="[0-9]*"
            onChange={(e) => handleChange(e, "validateHasDecimal")}
            value={Number(rateCardDetails.maxPTOHrPayPerAnnum).toFixed(2)}
            errMssg={inputErr["maxPTOHrPayPerAnnum"]}
          />
          <Input
            type="number"
            name="totCostPTOLeavePerAnnum"
            label="Total Cost PTO Leave Per Annum"
            className="numAlign"
            pattern="[0-9]*"
            onChange={(e) => handleChange(e, "validateHasDecimal")}
            value={Number(rateCardDetails.totCostPTOLeavePerAnnum).toFixed(2)}
            errMssg={inputErr["totCostPTOLeavePerAnnum"]}
          />
          <Input
            type="number"
            name="hrCostPTOLeavePerHr"
            label="Hr Cost PTO Leave Per Annum"
            className="numAlign"
            pattern="[0-9]*"
            onChange={(e) => handleChange(e, "validateHasDecimal")}
            value={Number(rateCardDetails.hrCostPTOLeavePerHr).toFixed(2)}
            errMssg={inputErr["hrCostPTOLeavePerHr"]}
          />
              <Input
            type="number"
            name="totalCostAfterPTO"
            label="Total Cost After PTO"
            pattern="[0-9]*"
            className="numAlign"
            onChange={(e) => handleChange(e, "validateHasDecimal")}
            value={Number(rateCardDetails.totalCostAfterPTO).toFixed(2)}
            errMssg={inputErr["totalCostAfterPTO"]}
          />
    </div>
    <div className="disabled-form-section-content wide">



          <Input
            type="number"
            name="effectiveHrMargin"
            label="Effective Hr Margin"
            pattern="[0-9]*"
            className="numAlign"
            onChange={(e) => handleChange(e, "validateHasDecimal")}
            value={Number(rateCardDetails.effectiveHrMargin).toFixed(2)}
            errMssg={inputErr["effectiveHrMargin"]}
          />
           <Input
            type="number"
            name="costRatePayPerHr"
            label="Cost Rate Pay Per Hr"
            className="numAlign"
            pattern="[0-9]*"
            onChange={(e) => handleChange(e, "validateHasDecimal")}
            value={Number(rateCardDetails.costRatePayPerHr).toFixed(2)}
            errMssg={inputErr["costRatePayPerHr"]}
          />
                    <SingleSelect
            label="Covid Leave Eligible"
            name="covidLeaveEligible"
            value={rateCardDetails.covidLeaveEligible || ""}
            onChange={(e) => handleChange(e)}
            options={[
              { id: "Yes", value: "Yes", name: "Yes" },
              { id: "No", value: "No", name: "No" },
            ]}
          />
   </div>
   </Collapse.Panel>
   <Collapse.Panel
        header={<span className="long-form-subsection-header">Comments</span>}
        key="4"
      > 
      <div className="disabled-form-section-content wide">
     
      <TextBlock
      type="text"
      label="Comments"
      name="comments"
      value={rateCardDetails?.comments || ""}
      onChange={(e) => handleChange(e)}
      maxLength="3000"
      charCount={`${rateCardDetails?.comments ? 3000 - rateCardDetails?.comments.length : 3000
        } of 3000`}
    />
          </div>
          </Collapse.Panel>
          </Collapse>
     </div>
     
  
    );
  };
  export default FeeDetails;