import { useSelector,useDispatch } from "react-redux";
import { setRateCardDetails } from "../../../../../Redux/rateCardSlice";
import { config } from "../../../../../config";
import AuthService from "../../../../../utils/AuthService";
import { Fragment, useState, useEffect,useCallback } from "react";
import SingleSelect from "../../../../common/select/selects.component";
import axios from "axios";
import { setInputErr, setRequiredErr,setChangesMade } from "../../../../../Redux/rateCardSlice";
import { runValidation } from "../../../../../utils/validation";
import Input from "../../../../common/input/inputs.component";
import ms from "ms";
import moment from "moment";

const RateCardDetails = () => {
    const { editEnabled } = useSelector((state) => state.ratecard);
    const { rateCardDetails } = useSelector((state) => state.ratecard);
    const dispatchRateCard = (object) => dispatch(setRateCardDetails(object));
    const dispatch = useDispatch();
    const [workerOptions, setWorkerOptions] = useState([]);
    const [clientOptions, setClientOptions] = useState([]);
    const [headers] = useState(AuthService.getHeaders());
    const { inputErr, requiredErr } = useSelector((state) => state.ratecard);
    const dispatchErr = (object) => dispatch(setInputErr(object));
    const dispatchReqErr = (object) => dispatch(setRequiredErr(object));
    const dispatchChange = (object) => dispatch(setChangesMade(object));

    const [minDate, setMinDate] = useState(null);

    
  const getWorkers = () => {
    if (AuthService.hasAdminRole() || AuthService.hasRecruiterRole()) {
      let headers = JSON.parse(sessionStorage.getItem("headers"));
      axios
        .get(config.serverURL + "/worker?dropdownFilter=true", { headers })
        .then((res) => {
          const workop = res.data;
          if (res.data) {
            setWorkerOptions(workop);
          }
        })
        .catch((error) => {
          console.log(error);
          if (error.response && error.response.status === 401) {
            AuthService.logout();
          }
        });
    }
  };

  useEffect(() => {
    getWorkers();
  }, []);

  const handleChangeWorker = (e) => {
    let worker = workerOptions.filter(
      (item) => +item.id === +e.target.value
    )[0];

    dispatchRateCard({
      ...rateCardDetails,
      worker: { id: worker.id },
    });
  };

  const getClients = useCallback(async () => {
    try {
      return await axios.get(
        config.serverURL + "/clients?dropdownFilter=true",
        { headers }
      );
    } catch (error) {
      console.log(error);
    }
  }, [headers]);

  useEffect(() => {
    let isCancelled = false;
    const fetchData = async () => {
      try {
        if (!isCancelled) {
          const response = await getClients();
          if (response.status === 200) {
            setClientOptions(response.data);
          }
        }
      } catch (error) {
        if (!isCancelled && error.response?.status === 401)
          AuthService.logout();
      }
    };
    fetchData();
    //cleanup function:
    return () => (isCancelled = true);
  }, [getClients]);


  const handleChangeClient = (e) => {
    const client = clientOptions.filter(
      (item) => +item.id === +e.target.value
    )[0];

    dispatchRateCard({
      ...rateCardDetails,
      client: { clientName: client.clientName, id: client.id },
    });
  };

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

  useEffect(() => {
    const day = ms("1d");
    const min_date = new Date(
      +new Date(rateCardDetails?.contractStartDate) + day
    );
    setMinDate(moment(min_date).format("YYYY-MM-DD"));
  }, [rateCardDetails?.contractStartDate]);

  return !editEnabled ? (
    <>
      <div className="disabled-form-section small">
        <h3 className="disabled-form-section-header">Basic Information</h3>
        <div className="disabled-form-section-content">
          <span className="disabled-form-text">
            <span className="disabled-form-bold-text">Worker:</span>
            {`${rateCardDetails?.worker?.firstName} ${rateCardDetails?.worker?.lastName}`},
          </span>

          <span className="disabled-form-text">
            <span className="disabled-form-bold-text">Client:</span>
            {rateCardDetails?.client?.clientName}    
                  </span>

          <span className="disabled-form-text">
            <span className="disabled-form-bold-text">
            Project Start Date:</span>
            {rateCardDetails?.contractStartDate}
          </span>

          <span className="disabled-form-text">
            <span className="disabled-form-bold-text">
            Project End Date:</span>
            {rateCardDetails?.contractEndDate}
          </span>

          <span className="disabled-form-text">
            <span className="disabled-form-bold-text">Worker Status:</span>
            {rateCardDetails?.workerStatus}
          </span>

          <span className="disabled-form-text">
            <span className="disabled-form-bold-text">
            EmployeeSubCOntractor1099: </span>
            {rateCardDetails?.empSubContractor1099}
          </span>

          <span className="disabled-form-text">
            <span className="disabled-form-bold-text">
            Pass Thur:</span>
            {rateCardDetails?.source}
          </span>

          <span className="disabled-form-text">
            <span className="disabled-form-bold-text">Sub Contractor:</span>
            {rateCardDetails?.subContractor}
          </span>
          <span className="disabled-form-text">
            <span className="disabled-form-bold-text">VMS Provider:</span>
            {rateCardDetails?.customer}
          </span>

          <span className="disabled-form-text">
            <span className="disabled-form-bold-text">Work Base Calculation:</span>
            {rateCardDetails?.workBaseCalculation}
          </span>
        </div>
    
      </div>
    </>
  ) : (
    <Fragment> 
      <h3 className="disabled-form-section-header">Basic Information</h3>

      <SingleSelect
            label="Worker Name"
            name="workerId"
            data-testid="worker-options"
            value={rateCardDetails?.worker?.id || ""}
            required
            onChange={handleChangeWorker}
            options={workerOptions.map((worker) => {
              let id = worker.id;
              return {
                id: id,
                name: `${worker.firstName} ${worker.lastName}`,
              };
            })}
          />

      <SingleSelect
            label="Client"
            name="clientId"
            data-testid="client-options"
            onChange={handleChangeClient}
            value={rateCardDetails?.client?.id || ""}
            options={clientOptions.map((client) => {
              let id = client.id;
              let name = client.clientName;
              return { id: id, name: name };
            })}
            required
          />
       <Input
            type="date"
            label="Project Start Date"
            name="contractStartDate"
            id="contractStartDate"
            max="2999-12-31"
            onChange={(e) => handleChange(e)}
            value={rateCardDetails?.contractStartDate || ""}
            errMssg={inputErr["contractStartDate"]}
          />
          <Input
            name="contractEndDate"
            label="Project End Date"
            id="contractEndDate"
            type="date"
            min={minDate}
            max="2999-12-31"
            onChange={(e) => handleChange(e)}
            value={rateCardDetails?.contractEndDate || ""}
            errMssg={inputErr["contractEndDate"]}
          /> 
       <Input
            type="text"
            label="Worker Status"
            name="workerStatus"
            value={rateCardDetails?.workerStatus || ""}
            onChange={(e) => handleChange(e, "validateName")}
            maxLength="20"
            errMssg={inputErr["workerStatus"]}
          />
           <Input
            type="text"
            name="empSubContractor1099"
            label="EmployeeSubCOntractor1099"
            onChange={(e) => handleChange(e, "validateName")}
            value={rateCardDetails?.empSubContractor1099 || ""}
            errMssg={inputErr["empSubContractor1099"]}
            
          />
            <SingleSelect
            label="Pass Thur"
            name="source"
            value={rateCardDetails?.source || ""}
            onChange={(e) => handleChange(e)}
            options={[
              { id: "Yes", value: "Yes", name: "Yes" },
              { id: "No", value: "No", name: "No" },
            ]}
        
          />
           <SingleSelect
            label="SubContractor"
            name="subContractor"
            value={rateCardDetails?.subContractor || ""}
            onChange={(e) => handleChange(e)}
            options={[
              { id: "Yes", value: "Yes", name: "Yes" },
              { id: "No", value: "No", name: "No" },
            ]}
          
          />
                 <Input
            type="text"
            name="customer"
            label="VMS Provider"
            onChange={(e) => handleChange(e)}
            value={rateCardDetails?.customer || ""}
            errMssg={inputErr["customer"]}
           
          />
 <Input
            type="text"
            name="workBaseCalculation"
            label="Work Base Calculation"
            onChange={(e) => handleChange(e, "validateName")}
            value={rateCardDetails?.workBaseCalculation || ""}
            errMssg={inputErr["workBaseCalculation"]}
      
          />
    </Fragment>

  );
};
export default RateCardDetails;