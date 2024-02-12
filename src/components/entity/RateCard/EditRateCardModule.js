import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { config } from "../../../config";
import auth from "../../../utils/AuthService";
import { useDispatch, useSelector } from "react-redux";
import { runValidation } from "../../../utils/validation";
import LargeModal from "../../modal/large-modal/large-modal.component";
import Form from "../../common/form/form.component";
import Input from "../../common/input/inputs.component";
import SingleSelect from "../../common/select/selects.component";
import { Alert } from "antd";
import moment from "moment";
import ms from "ms";
import { InputCurrencyRate } from "../../common/input/input-currency-rate/input-currency-rate.component";
import { setShowModal } from "../../../Redux/rateCardSlice";

const EditRateCardModule = ({ editRateCard, viewOnly }) => {
  const [editedRateCard, setEditedRateCard] = useState({});
  const [message, setMessage] = useState("");
  const [headers] = useState(auth.getHeaders());
  const [inputErr, setInputErr] = useState({});
  const dispatch = useDispatch();
  const { showModal, selectedRateCard } = useSelector(
    (state) => state.ratecard
  );
  const [formDisabled, setFormDisabled] = useState(false);
  const [minDate, setMinDate] = useState(null);
  const [clientOptions, setclientOptions] = useState([]);
  const [workerOptions, setWorkerOptions] = useState([]);
  const [parameterOptions, setParameterOptions] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const user = useMemo(() => auth.getUserInfo(), []);
  const [roleData,setRoleData]=useState(user.roles[0]);
  useEffect(() => {
    if (auth.hasAdminRole()) setIsAdmin(true);
  }, []);
  useEffect(() => {
    if (
      auth.hasHRRole() ||
      auth.hasBDManagerRole() ||
      auth.hasRecruiterRole() ||
      viewOnly
    )
      setFormDisabled(true);
  }, [viewOnly]);

  useEffect(() => {
    const day = ms("1d");
    const min_date = new Date(
      +new Date(editedRateCard.contractStartDate) + day
    );
    setMinDate(moment(min_date).format("YYYY-MM-DD"));
  }, [editedRateCard.contractStartDate]);

  useEffect(() => {
    setEditedRateCard(selectedRateCard);
    console.log(selectedRateCard);
  }, [showModal, selectedRateCard]);

  const handleChange = (e, validProc = null) => {
    const limit = e.target.max ? +e.target.max : null;
    const isValid = runValidation(validProc, e.target.value, limit);
    const isDeleted = e.target.value === "";
    setEditedRateCard({
      ...editedRateCard,
      [e.target.name]: e.target.value,
    });
    if (!isValid) {
      setInputErr({ ...inputErr, [e.target.name]: "Invalid characters" });
    } else if (isValid || isDeleted) {
      let temp = { ...inputErr };
      delete temp[e.target.name];
      setInputErr(temp);
    }
  };

  const handleChangeClient = (e) => {
    let client = clientOptions.filter(
      (item) => +item.id === +e.target.value
    )[0];

    setEditedRateCard({
      ...editedRateCard,
      client: { clientName: client.clientName, id: client.id },
    });
  };
  const handleChangeWorker = (e) => {
    let worker = workerOptions.filter(
      (item) => +item.id === +e.target.value
    )[0];

    setEditedRateCard({
      ...editedRateCard,
      worker: { id: worker.id },
    });
  };
  const handleChangeParameter = (e) => {
    let parameter = parameterOptions.filter(
      (item) => +item.id === +e.target.value
    )[0];

    setEditedRateCard({
      ...editedRateCard,
      parameter: { id: parameter.id },
    });
  };
  const closeModal = () => {
    setEditedRateCard({});
    setMessage("");
    setInputErr({});
    dispatch(setShowModal(false));
  };

  const currencyChange = (e, validProc = "validateNum") => {
    e.target.value = e.target.value === "" ? "USD, $" : e.target.value;
    handleChange(
      e,
      e.target.name === "billRatePerHr",
      "vmsFees" ? validProc : ""
    );
  };

  const getClients = useCallback(() => {
    axios
      .get(config.serverURL + "/clients?dropdownFilter=true", { headers })
      .then((res) => {
        if (res.data) setclientOptions(res.data);
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) auth.logout();
      });
  }, [headers]);

  const getWorkers = useCallback(() => {
    if (auth.hasAdminRole() || auth.hasRecruiterRole()) {
      axios
        .get(config.serverURL + "/worker/latestrecord?dropdownFilter=true", {
          headers,
        })
        .then((res) => {
          const workop = res.data;
          if (res.data) {
            setWorkerOptions(workop);
          }
        })
        .catch((error) => {
          if (error.response && error.response.status === 401) auth.logout();
        });
    }
  }, [headers]);

  const getParameters = useCallback(() => {
    axios
      .get(config.serverURL + "/parameter?dropdownFilter=true", { headers })
      .then((res) => {
        const param = res.data;
        if (res.data) {
          setParameterOptions(param);
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) auth.logout();
      });
  }, [headers]);

  useEffect(() => {
    getClients();
    getWorkers();
    getParameters();
  }, [getClients, getWorkers, getParameters]);

  const handleEditRateCard = (e, RateCardId) => {
    e.preventDefault();

    if (Object.keys(inputErr).length) {
      setMessage(
        `Fix errors before submitting: ${Object.keys(inputErr).join(", ")}`
      );
      return;
    } else {
      setMessage("");
    }

    const RateCardPatchInfo = {
      contractStartDate: editedRateCard.contractStartDate,
      contractEndDate: editedRateCard.contractEndDate,
      workerStatus: editedRateCard.workerStatus,
      currency: editedRateCard.currency,
      billRatePerHr: editedRateCard.billRatePerHr,
      vmsPercentage: editedRateCard.vmsPercentage,
      vmsFees:
        editedRateCard.billRatePerHr * (editedRateCard.vmsPercentage / 100),
      vmsbillRate:
        editedRateCard.billRatePerHr -
        (editedRateCard.billRatePerHr * editedRateCard.vmsPercentage) / 100,
      costToCompanyPerHour: editedRateCard.costToCompanyPerHour,
      grossMargin:
        editedRateCard.billRatePerHr -
        (editedRateCard.billRatePerHr * editedRateCard.vmsPercentage) / 100 -
        editedRateCard.costToCompanyPerHour,
      parameter: editedRateCard.parameter,
      netMargin: editedRateCard.netMargin,
      slHours: editedRateCard.slHours,
      slCost: editedRateCard.slCost,
      slCostPerHr: editedRateCard.slCostPerHr,
      seller: editedRateCard.seller,
      sellerCommissionRate: editedRateCard.sellerCommissionRate,
      recruiter: editedRateCard.recruiter,
      recruiterCommissionRate: editedRateCard.recruiterCommissionRate,
      source: editedRateCard.source,
      empSubContractor1099: editedRateCard.empSubContractor1099,
      subContractor: editedRateCard.subContractor,
      customer: editedRateCard.customer,
      maxPTOHrPayPerAnnum: editedRateCard.maxPTOHrPayPerAnnum,
      totCostPTOLeavePerAnnum: editedRateCard.totCostPTOLeavePerAnnum,
      hrCostPTOLeavePerHr: editedRateCard.hrCostPTOLeavePerHr,
      covidLeaveEligible: editedRateCard.covidLeaveEligible,
      ptoEligible: editedRateCard.ptoEligible,
      ptoLevel: editedRateCard.ptoLevel,
      sickLeaveEligible: editedRateCard.sickLeaveEligible,
      maxSickHrPayPerAnnum: editedRateCard.maxSickHrPayPerAnnum,
      totCostSickLeavePerAnnum: editedRateCard.totCostSickLeavePerAnnum,
      hrCostSickLeavePerHr: editedRateCard.hrCostSickLeavePerHr,
      effectiveHrMargin: editedRateCard.effectiveHrMargin,
      costRatePayPerHr: editedRateCard.costRatePayPerHr,
      totalCostAfterPTO: editedRateCard.totalCostAfterPTO,
      client: editedRateCard.client,
      worker: editedRateCard.worker,
      slPolicy: editedRateCard.slPolicy,
      workBaseCalculation: editedRateCard.workBaseCalculation,
      sourcer: editedRateCard.sourcer,
      sourcerCommissionRate: editedRateCard.sourcerCommissionRate,
    };
    preSubmitCheck(RateCardPatchInfo, RateCardId);
  };

  const preSubmitCheck = (patchInfo, id) => {
    axios
      .post(`${config.serverURL}/ratecard/checks/${id}`, patchInfo, {
        headers,
      })
      .then(() => {
        closeModal();
        editRateCard(patchInfo, id);
      })
      .catch((err) => {});
  };

  return (
    <>
      <LargeModal
        open={showModal}
        close={closeModal}
        header={{
          text: `Edit RateCard ${editedRateCard?.worker?.firstName} ${editedRateCard?.worker?.lastName}`,
        }}
      >
        <Form
          onSubmit={(e) => handleEditRateCard(e, editedRateCard.id)}
          cancel={closeModal}
          formEnabled={!formDisabled}
        >
          {message && <Alert type="error" showIcon message={message} />}
          <SingleSelect
            label="Worker Name"
            name="workerId"
            data-testid="worker-options"
            value={editedRateCard.worker?.id || ""}
            required
            onChange={handleChangeWorker}
            options={workerOptions.map((worker) => {
              let id = worker.id;
              return {
                id: id,
                name: `${worker.firstName} ${worker.lastName}`,
              };
            })}
            disabled={formDisabled}
          />

          <Input
            type="date"
            label="Contract Start Date"
            name="contractStartDate"
            id="contractStartDate"
            max="2999-12-31"
            onChange={(e) => handleChange(e)}
            value={editedRateCard.contractStartDate}
            errMssg={inputErr["contractStartDate"]}
            disabled={formDisabled}
          />
          <Input
            name="contractEndDate"
            label="Contract End Date"
            id="contractEndDate"
            type="date"
            min={minDate}
            max="2999-12-31"
            onChange={(e) => handleChange(e)}
            value={editedRateCard.contractEndDate}
            errMssg={inputErr["contractEndDate"]}
            disabled={formDisabled}
          />
          <Input
            type="text"
            label="Worker Status"
            name="workerStatus"
            value={editedRateCard.workerStatus || ""}
            onChange={(e) => handleChange(e, "validateName")}
            maxLength="20"
            errMssg={inputErr["workerStatus"]}
            disabled={formDisabled}
          />
          <SingleSelect
            label="Client"
            name="clientId"
            data-testid="client-options"
            onChange={handleChangeClient}
            value={editedRateCard.client?.id || ""}
            options={clientOptions.map((client) => {
              let id = client.id;
              let name = client.clientName;
              return { id: id, name: name };
            })}
            required
            disabled={formDisabled}
          />

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
            valueCurrency={editedRateCard.currency}
            valueRate={Number(editedRateCard.billRatePerHr).toFixed(2)}
            required
            disabled={formDisabled}
          />
          <Input
            type="number"
            name="vmsPercentage"
            label="VMS Fees %"
            pattern="[0-9]*"
            onChange={(e) => {
              handleChange(e, "validateHasDecimal");
            }}
            value={Number(editedRateCard.vmsPercentage).toFixed(2)}
            errMssg={inputErr["vmsPercentage"]}
            disabled={formDisabled}
          />
          <InputCurrencyRate
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
            valueCurrency={editedRateCard.currency}
            valueRate={Number(editedRateCard.vmsFees).toFixed(2)}
            required
            disabled
          />

          <InputCurrencyRate
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
            valueCurrency={editedRateCard.currency}
            valueRate={Number(editedRateCard.vmsbillRate).toFixed(2)}
            required
            disabled
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
            valueCurrency={editedRateCard.currency}
            valueRate={Number(editedRateCard.costToCompanyPerHour).toFixed(2)}
            required
            disabled={formDisabled}
          />
          <Input
            type="number"
            name="grossMargin"
            label="Gross Margin"
            pattern="[0-9]*"
            onChange={(e) => {
              handleChange(e, "validateHasDecimal");
            }}
            value={Number(editedRateCard.grossMargin).toFixed(2)}
            disabled
          />

          <SingleSelect
            label="Admin Fees"
            name="id"
            data-testid="parameter-options"
            value={editedRateCard.parameter?.id || ""}
            required
            onChange={handleChangeParameter}
            options={parameterOptions.map((parameter) => {
              let id = parameter.id;
              return {
                id: id,
                name: `${parameter.paramLevel}  ${parameter.paramValue}`,
              };
            })}
            disabled={formDisabled}
          />
          <Input
            type="number"
            name="netMargin"
            label="Net Margin"
            pattern="[0-9]*"
            onChange={(e) => handleChange(e, "validateHasDecimal")}
            value={Number(editedRateCard.netMargin).toFixed(2)}
            errMssg={inputErr["netMargin"]}
            disabled={formDisabled}
          />
          <Input
            type="text"
            name="seller"
            label="Seller"
            onChange={(e) => handleChange(e, "validateName")}
            value={editedRateCard.seller || ""}
            disabled={formDisabled}
            errMssg={inputErr["seller"]}
          />
          <Input
            type="number"
            name="sellerCommissionRate"
            label="Seller Commission Rate "
            pattern="[0-9]*"
            onChange={(e) => handleChange(e, "validateHasDecimal")}
            value={Number(editedRateCard.sellerCommissionRate).toFixed(2)}
            errMssg={inputErr["sellerCommissionRate"]}
            disabled={formDisabled}
          />
          <Input
            type="text"
            name="recruiter"
            label="Recruiter"
            onChange={(e) => handleChange(e, "validateName")}
            value={editedRateCard.recruiter || ""}
            errMssg={inputErr["recruiter"]}
            disabled={formDisabled}
          />
          <Input
            type="number"
            name="recruiterCommissionRate"
            label="Recruiter Commission Rate "
            pattern="[0-9]*"
            onChange={(e) => handleChange(e, "validateHasDecimal")}
            value={Number(editedRateCard.recruiterCommissionRate).toFixed(2)}
            errMssg={inputErr["recruiterCommissionRate"]}
            disabled={formDisabled}
          />
          <Input
            type="text"
            name="empSubContractor1099"
            label="EmployeeSubCOntractor1099"
            onChange={(e) => handleChange(e, "validateName")}
            value={editedRateCard.empSubContractor1099 || ""}
            errMssg={inputErr["empSubContractor1099"]}
            disabled={formDisabled}
          />

          <SingleSelect
            label="Pass Thur"
            name="source"
            value={editedRateCard.source || ""}
            onChange={(e) => handleChange(e)}
            options={[
              { id: "Yes", value: "Yes", name: "Yes" },
              { id: "No", value: "No", name: "No" },
            ]}
            disabled={formDisabled}
          />

          <SingleSelect
            label="SubContractor"
            name="subContractor"
            value={editedRateCard.subContractor || ""}
            onChange={(e) => handleChange(e)}
            options={[
              { id: "Yes", value: "Yes", name: "Yes" },
              { id: "No", value: "No", name: "No" },
            ]}
            disabled={formDisabled}
          />

          <Input
            type="text"
            name="sourcer"
            label="Sourcer"
            onChange={(e) => handleChange(e, "validateName")}
            value={editedRateCard.sourcer || ""}
            errMssg={inputErr["sourcer"]}
            disabled={formDisabled}
          />
          <Input
            type="number"
            name="sourcerCommissionRate"
            label="Sourcer Commission Rate "
            pattern="[0-9]*"
            onChange={(e) => handleChange(e, "validateHasDecimal")}
            value={Number(editedRateCard.sourcerCommissionRate).toFixed(2)}
            errMssg={inputErr["sourcerCommissionRate"]}
            disabled={formDisabled}
          />
          <Input
            type="text"
            name="customer"
            label="VMS Provider"
            onChange={(e) => handleChange(e)}
            value={editedRateCard.customer || ""}
            errMssg={inputErr["customer"]}
            disabled={formDisabled}
          />

          <Input
            type="number"
            name="slHours"
            label="Sick Leave Hours"
            pattern="[0-9]*"
            onChange={(e) => handleChange(e, "validateHasDecimal")}
            value={Number(editedRateCard.slHours).toFixed(2)}
            errMssg={inputErr["slHours"]}
            disabled={formDisabled}
          />
          <Input
            type="number"
            name="slCost"
            label="Sick Leave Cost"
            pattern="[0-9]*"
            onChange={(e) => handleChange(e, "validateHasDecimal")}
            value={Number(editedRateCard.slCost).toFixed(2)}
            errMssg={inputErr["slCost"]}
            disabled={formDisabled}
          />
          <Input
            type="number"
            name="slCostPerHr"
            label="Sick Leave Cost Per Hr"
            pattern="[0-9]*"
            onChange={(e) => handleChange(e, "validateHasDecimal")}
            value={Number(editedRateCard.slCostPerHr).toFixed(2)}
            errMssg={inputErr["slCostPerHr"]}
            disabled={formDisabled}
          />

          <Input
            type="number"
            name="maxSickHrPayPerAnnum"
            label="Max Sick Hr Pay Per Annum"
            pattern="[0-9]*"
            onChange={(e) => handleChange(e, "validateHasDecimal")}
            value={Number(editedRateCard.maxSickHrPayPerAnnum).toFixed(2)}
            errMssg={inputErr["maxSickHrPayPerAnnum"]}
            disabled={formDisabled}
          />
          <Input
            type="number"
            name="totCostSickLeavePerAnnum"
            label="Total Cost Sick Leave Per Annum"
            pattern="[0-9]*"
            onChange={(e) => handleChange(e, "validateHasDecimal")}
            value={Number(editedRateCard.totCostSickLeavePerAnnum).toFixed(2)}
            errMssg={inputErr["totCostSickLeavePerAnnum"]}
            disabled={formDisabled}
          />
          <Input
            type="number"
            name="hrCostSickLeavePerHr"
            label="Hr Cost Sick Leave Per Hr"
            pattern="[0-9]*"
            onChange={(e) => handleChange(e, "validateHasDecimal")}
            value={Number(editedRateCard.hrCostSickLeavePerHr).toFixed(2)}
            errMssg={inputErr["hrCostSickLeavePerHr"]}
            disabled={formDisabled}
          />

          <SingleSelect
            label="Sick Leave Eligible"
            name="sickLeaveEligible"
            value={editedRateCard.sickLeaveEligible || ""}
            onChange={(e) => handleChange(e)}
            options={[
              { id: "Yes", value: "Yes", name: "Yes" },
              { id: "No", value: "No", name: "No" },
            ]}
            disabled={formDisabled}
          />

          <SingleSelect
            label="Sick Leave Policy"
            name="slPolicy"
            value={editedRateCard.slPolicy || ""}
            onChange={(e) => handleChange(e)}
            options={[
              { id: "Yes", value: "Yes", name: "Yes" },
              { id: "No", value: "No", name: "No" },
            ]}
            disabled={formDisabled}
          />

          <SingleSelect
            label="PTO Level"
            name="ptoLevel"
            value={editedRateCard.ptoLevel || ""}
            onChange={(e) => handleChange(e)}
            options={[
              { id: "0", value: "Level 0", name: "Level 0" },
              { id: "1", value: "Level 1", name: "Level 1" },
              { id: "2", value: "Level 2", name: "Level 2" },
              { id: "3", value: "Level 3", name: "Level 3" },
              { id: "4", value: "Level 4", name: "Level 4" },
            ]}
            disabled={formDisabled}
          />
          <Input
            type="number"
            name="maxPTOHrPayPerAnnum"
            label="Max PTO Hr Pay Per Annum"
            pattern="[0-9]*"
            onChange={(e) => handleChange(e, "validateHasDecimal")}
            value={Number(editedRateCard.maxPTOHrPayPerAnnum).toFixed(2)}
            errMssg={inputErr["maxPTOHrPayPerAnnum"]}
            disabled={formDisabled}
          />
          <Input
            type="number"
            name="totCostPTOLeavePerAnnum"
            label="Total Cost PTO Leave Per Annum"
            pattern="[0-9]*"
            onChange={(e) => handleChange(e, "validateHasDecimal")}
            value={Number(editedRateCard.totCostPTOLeavePerAnnum).toFixed(2)}
            errMssg={inputErr["totCostPTOLeavePerAnnum"]}
            disabled={formDisabled}
          />
          <Input
            type="number"
            name="hrCostPTOLeavePerHr"
            label="Hr Cost PTO Leave Per Annum"
            pattern="[0-9]*"
            onChange={(e) => handleChange(e, "validateHasDecimal")}
            value={Number(editedRateCard.hrCostPTOLeavePerHr).toFixed(2)}
            errMssg={inputErr["hrCostPTOLeavePerHr"]}
            disabled={formDisabled}
          />
          <Input
            type="number"
            name="totalCostAfterPTO"
            label="Total Cost After PTO"
            pattern="[0-9]*"
            onChange={(e) => handleChange(e, "validateHasDecimal")}
            value={Number(editedRateCard.totalCostAfterPTO).toFixed(2)}
            errMssg={inputErr["totalCostAfterPTO"]}
            disabled={formDisabled}
          />

          <SingleSelect
            label="PTO Eligible"
            name="ptoEligible"
            value={editedRateCard.ptoEligible || ""}
            onChange={(e) => handleChange(e)}
            options={[
              { id: "Yes", value: "Yes", name: "Yes" },
              { id: "No", value: "No", name: "No" },
            ]}
            disabled={formDisabled}
          />
          <Input
            type="number"
            name="effectiveHrMargin"
            label="Effective Hr Margin"
            pattern="[0-9]*"
            onChange={(e) => handleChange(e, "validateHasDecimal")}
            value={Number(editedRateCard.effectiveHrMargin).toFixed(2)}
            errMssg={inputErr["effectiveHrMargin"]}
            disabled={formDisabled}
          />
          <Input
            type="number"
            name="costRatePayPerHr"
            label="Cost Rate Pay Per Hr"
            pattern="[0-9]*"
            onChange={(e) => handleChange(e, "validateHasDecimal")}
            value={Number(editedRateCard.costRatePayPerHr).toFixed(2)}
            errMssg={inputErr["costRatePayPerHr"]}
            disabled={formDisabled}
          />

          <SingleSelect
            label="Covid Leave Eligible"
            name="covidLeaveEligible"
            value={editedRateCard.covidLeaveEligible || ""}
            onChange={(e) => handleChange(e)}
            options={[
              { id: "Yes", value: "Yes", name: "Yes" },
              { id: "No", value: "No", name: "No" },
            ]}
            disabled={formDisabled}
          />
          <Input
            type="text"
            name="workBaseCalculation"
            label="Work Base Calculation"
            onChange={(e) => handleChange(e, "validateName")}
            value={editedRateCard.workBaseCalculation || ""}
            errMssg={inputErr["workBaseCalculation"]}
            disabled={formDisabled}
          />
        </Form>
      </LargeModal>
    </>
  );
};
export default EditRateCardModule;
