import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { config } from "../../../config";
import auth from "../../../utils/AuthService";
import { getAllRecruiters } from "../../../API/users/user-apis";
import { interviewRoundOptions } from "../../../utils/defaultData";
import { sortAscending } from "../../../utils/service";
import FilterSearch from "../filter-search/filter-search.component";
import Button from "../../common/button/button.component";
import Check from "../../common/checkbox/checkbox.component";
import RangeSlider from "../../common/range-slider/range-slider.component";
import { Collapse, DatePicker } from "antd";
import { DownOutlined, FilterOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { setClientOptions } from "../../../Redux/filterSlice";
import { setRecruiterOptions } from "../../../Redux/filterSlice";
import { setSupplierOptions } from "../../../Redux/filterSlice";
import { setWorkerOptions } from "../../../Redux/filterSlice";
import { setRateCardWorkerOption } from "../../../Redux/filterSlice";
import { setVisatrackingOptions } from "../../../Redux/filterSlice";
import { setSupplierTitleOptions } from "../../../Redux/filterSlice";
import { setSubContractorOptions } from "../../../Redux/filterSlice";
import { setVisaTypeOptions } from "../../../Redux/filterSlice";
import { setVisaCOCOptions } from "../../../Redux/filterSlice";
import { setSellerOptions } from "../../../Redux/filterSlice";
import { setRecruiterOption } from "../../../Redux/filterSlice";
import { setParamLevelOptions } from "../../../Redux/filterSlice";
import { setParamTypeOptions } from "../../../Redux/filterSlice";
import { setParamValueOptions } from "../../../Redux/filterSlice";
import "antd/dist/antd.css";
import "./filters.styles.scss";

const Filters = ({
  filterOptions,
  filters,
  setFilters,
  filterTrail,
  setFilterTrail,
}) => {
  const { Panel } = Collapse;
  const [headers] = useState(auth.getHeaders());
  const [userIsAdmin] = useState(auth.hasAdminRole());
  const [filteredRecruiterOptions, setFilteredRecruiterOptions] = useState([]);
  const [filteredWorkerOptions, setFilteredWorkerOptions] = useState([]);
  const [filteredVisatrackingOptions, setFilteredVisatrackingOptions] =
    useState([]);
  const [filteredSupplierOptions, setFilteredSupplierOptions] = useState([]);
  const [filteredRateCardWorkerOption, setFilteredRateCardWorkerOption] =
    useState([]);
  const [filteredClientOptions, setFilteredClientOptions] = useState([]);
  const [filteredSubContractorOptions, setFilteredSubContractorOptions] =
    useState([]);
  const [filteredVisaTypeOptions, setFilteredVisaTypeOptions] = useState([]);
  const [filteredSellerOptions, setFilteredSellerOptions] = useState([]);
  const [filteredVisaCOCOptions, setFilteredVisaCOCOptions] = useState([]);
  const [filteredParamValueOptions, setFilteredParamValueOptions] = useState(
    []
  );
  const [filteredParamTypeOption, setFilteredParamTypeOption] = useState([]);
  const [filteredParamLevelOptions, setFilteredParamLevelOptions] = useState(
    []
  );
  const dispatch = useDispatch();
  const { clientOptions } = useSelector((state) => state.filters);
  const { clients: uniqClientOptions } = useSelector((state) => state.iGuide);
  const { recruiterOptions } = useSelector((state) => state.filters);
  const { supplierOption } = useSelector((state) => state.filters);
  const { workerOptions } = useSelector((state) => state.filters);
  const { visatrackingOptions } = useSelector((state) => state.filters);
  const { rateCardWorkerOption } = useSelector((state) => state.filters);
  const { subContractorOptions } = useSelector((state) => state.filters);
  const { supplierTitleOptions } = useSelector((state) => state.filters);
  const { visaTypeOptions } = useSelector((state) => state.filters);
  const { visaCOCOptions } = useSelector((state) => state.filters);
  const { sellerOptions } = useSelector((state) => state.filters);
  const { recruiterOption } = useSelector((state) => state.filters);
  const { paramTypeOptions } = useSelector((state) => state.filters);
  const { paramLevelOptions } = useSelector((state) => state.filters);
  const { paramValueOptions } = useSelector((state) => state.filters);
  const [openMenu, setOpenMenu] = useState(false);

  const handleButtonClick = () => {
    setOpenMenu((prevState) => !prevState);
  };

  const getRecruiterOptions = useCallback(async () => {
    const role = userIsAdmin ? "admin" : "business_dev_manager";
    try {
      const response = await getAllRecruiters(headers, role);
      if (response.statusCode === 200) {
        const recruiters = response.recruiters.map((recruiter) => ({
          id: recruiter.id,
          name: `${recruiter?.firstName} ${recruiter?.lastName}`
        }));
        console.log(recruiters);
        dispatch(setRecruiterOptions(sortAscending("name", recruiters)));
        setFilteredRecruiterOptions(sortAscending("name", recruiters));
      }

    }
    catch (error) {
      console.log(error);
    }
  }, [dispatch, headers, userIsAdmin]);

  const getClientOptions = useCallback(async () => {
    try {
      const response = await axios.get(
        `${config.serverURL}/clients?dropdownFilter=true`,
        { headers }
      );
      if (response.status === 200) {
        const clients = response.data.map((client) => ({
          id: client.id,
          name: `${client.clientName} (${client.address?.city})`,
        }));
        const sorted = sortAscending("name", clients);
        dispatch(setClientOptions(sorted));
        setFilteredClientOptions(sorted);
      }
    } catch (error) {
      console.log(error);
      if (error.response?.status === 401) auth.logout();
    }
  }, [dispatch, headers]);

  const getSupplierOption = useCallback(async () => {
    try {
      const response = await axios.get(
        `${config.serverURL}/supplier?dropdownFilter=true`,
        { headers }
      );
      if (response.status === 200) {
        const supCompany = response.data.map((supplier) => ({
          id: supplier.id,
          name: `${supplier.supplierCompanyName}`,
        }));
        const supDesig = response.data.map((supplier) => ({
          id: supplier.id,
          name: `${supplier.designation}`,
        }));
        dispatch(setSupplierOptions(sortAscending("name", supCompany)));
        dispatch(setSupplierTitleOptions(sortAscending("name", supDesig)));
      }
    } catch (error) {
      console.log(error);
      if (error.response?.status === 401) auth.logout();
    }
  }, [dispatch, headers]);

  const getWorkerOptions = useCallback(async () => {
    try {
      const response = await axios.get(
        `${config.serverURL}/worker?dropdownFilter=true`,
        { headers }
      );
      if (response.status === 200) {
        const workerFull = response.data.map((worker) => ({
          id: worker.id,
          name: `${worker.fullName}`,
        }));
        const workerFLNames = response.data.map((worker) => ({
          id: worker.id,
          name: `${worker.firstName} ${worker.lastName}`,

        }));
        const subContractor = response.data.map((worker) => ({
          id: worker.id,
          name: `${worker.subContractorCompanyName}`,
        }));
        dispatch(setWorkerOptions(sortAscending("name", workerFull)));
        dispatch(setRateCardWorkerOption(sortAscending("name", workerFLNames)));
        dispatch(setVisatrackingOptions(sortAscending("name", workerFLNames)));
        dispatch(setSubContractorOptions(sortAscending("name", subContractor)));
        dispatch(setVisaTypeOptions(sortAscending("name", workerFLNames)));
      }
    } catch (error) {
      console.log(error);
      if (error.response?.status === 401) auth.logout();
    }
  }, [dispatch, headers]);

  const getVisaCOCOptions = useCallback(async () => {
    try {
      const response = await axios.get(
        `${config.serverURL}/visatracking?dropdownFilter=true`,
        { headers }
      );
      if (response.status === 200) {
        const visaCountry = response.data.map((visatracking) => ({
          id: visatracking.id,
          name: `${visatracking.visaCountry}`,
        }));
        dispatch(setVisaCOCOptions(sortAscending("name", visaCountry)));
      }
    } catch (error) {
      console.log(error);
      if (error.response?.status === 401) auth.logout();
    }
  }, [dispatch, headers]);

  const getRecruiterOption = useCallback(async () => {
    try {
      const response = await axios.get(
        `${config.serverURL}/ratecard?dropdownFilter=true`,
        { headers }
      );
      if (response.status === 200) {
        const rateCardRecruiters = response.data.map((ratecard) => ({
          id: ratecard.id,
          name: `${ratecard.recruiter}`,
        }));
        const rateCardSeller = response.data.map((ratecard) => ({
          id: ratecard.id,
          name: `${ratecard.seller}`,
        }));
        dispatch(setRecruiterOption(sortAscending("name", rateCardRecruiters)));
        dispatch(setSellerOptions(sortAscending("name", rateCardSeller)));
      }
    } catch (error) {
      console.log(error);
      if (error.response?.status === 401) auth.logout();
    }
  }, [dispatch, headers]);

  const getParamLevelOptions = useCallback(async () => {
    try {
      const response = await axios.get(
        `${config.serverURL}/parameter?dropdownFilter=true`,
        { headers }
      );
      if (response.status === 200) {
        const paramLevel = response.data.map((parameter) => ({
          id: parameter.id,
          name: `${parameter.paramLevel}`,
        }));
        const paramValue = response.data.map((parameter) => ({
          id: parameter.id,
          name: `${parameter.paramValue}`,
        }));
        const paramType = response.data.map((parameter) => ({
          id: parameter.id,
          name: `${parameter.paramType}`,
        }));
        dispatch(setParamLevelOptions(sortAscending("name", paramLevel)));
        dispatch(setParamValueOptions(sortAscending("name", paramValue)));
        dispatch(setParamTypeOptions(sortAscending("name", paramType)));
      }
    } catch (error) {
      console.log(error);
      if (error.response?.status === 401) auth.logout();
    }
  }, [dispatch, headers]);

  useEffect(() => {
    getClientOptions();
  }, [getClientOptions]);

  // it confuses me!!! 8-O
  useEffect(() => {
    getRecruiterOptions();
  }, [getRecruiterOptions]);
  useEffect(() => {
    getRecruiterOption();
  }, [getRecruiterOption]);

  useEffect(() => {
    getWorkerOptions();
  }, [getWorkerOptions]);

  useEffect(() => {
    getSupplierOption();
  }, [getSupplierOption]);

  useEffect(() => {
    getVisaCOCOptions();
  }, [getVisaCOCOptions]);

  useEffect(() => {
    getParamLevelOptions();
  }, [getParamLevelOptions]);

  const handleSingleCheck = (id, name, filterName, trailName) => {
    const fName = filters[filterName];
    if (!fName || fName !== id) {
      setFilters({ ...filters, [filterName]: id });
      setFilterTrail({
        ...filterTrail,
        [filterName]: { filter: trailName, value: name },
      });
    } else if (fName === id) {
      let temp = { ...filters };
      let trail = { ...filterTrail };
      delete temp[filterName];
      delete trail[filterName];
      setFilters(temp);
      setFilterTrail(trail);
    }
  };

  const applyFilterOnOptions = (options, filterStr, join = false) => {
    if (!filterStr || filterStr === "") return "";
    const res = options
      .filter(
        (o) =>
          filterStr.split(",").filter((f) => f.toString() === o.id.toString())
            .length > 0
      )
      .map((n) => n.name);
    return join ? res.join(",") : res;
  };

  const applyFilterUnCheck = (filterStr, unChckedStr, join = false) => {
    const res = filterStr.split(",").filter((f) => f !== unChckedStr);
    return join ? res.join(",") : res;
  };

  const handleMultiCheck = (id, name, filterName, trailName, options) => {
    let newFilters = "";
    let newTrails = "";
    let newTrailValue = "";

    const fName = filters[filterName];
    if (!fName || (fName && !fName.includes(id))) {
      newFilters = {
        ...filters,
        [filterName]: `${fName ? `${fName},` : ""}${id}`,
      };
      // if param `options` was passed then get real name from options using id from newFilters and put as newValue in filterTrail
      newTrailValue = options
        ? applyFilterOnOptions(options, newFilters[filterName], true)
        : `${fName ? `${fName},` : ""}${name}`;
      newTrails = {
        ...filterTrail,
        [filterName]: { filter: trailName, value: newTrailValue },
      };
    } else if (fName?.includes(id)) {
      newFilters = {
        ...filters,
        [filterName]: applyFilterUnCheck(fName, id, true),
      };
      newTrails = options
        ? applyFilterOnOptions(options, newFilters[filterName])
        : fName.split(",").filter((value) => value !== id);
      if (newTrails.length) {
        newTrailValue = options
          ? applyFilterOnOptions(options, newFilters[filterName], true)
          : newTrails.join(",");
        newTrails = {
          ...filterTrail,
          [filterName]: { filter: trailName, value: newTrailValue },
        };
      } else {
        let temp = { ...filters };
        let trail = { ...filterTrail };
        delete temp[filterName];
        delete trail[filterName];
        newFilters = temp;
        newTrails = trail;
      }
    }
    setFilters(newFilters);
    setFilterTrail(newTrails);
  };

  const handleRange = (value) => {
    setFilters({ ...filters, expFrom: value[0], expTo: value[1] });
    setFilterTrail({
      ...filterTrail,
      expFrom: {
        filter: "Experience",
        value: `${value[0]} to ${value[1]} yrs`,
      },
    });
  };

  const handleDateFilter = (date, dateString) => {
    if (dateString !== "") {
      setFilters({ ...filters, date: dateString });
      setFilterTrail({
        ...filterTrail,
        date: { filter: "Date", value: dateString },
      });
    } else {
      let temp = { ...filters };
      let trail = { ...filterTrail };
      delete temp["date"];
      delete trail["date"];
      setFilters(temp);
      setFilterTrail(trail);
    }
  };

  const clearAllFilters = () => {
    const search = filters.search;
    const newFilters = search ? { search } : {};
    setFilters(newFilters);
    setFilterTrail({});
    setOpenMenu(false);
  };

  const handleBlur = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      if (recruiterOptions.length > filteredRecruiterOptions.length)
        setFilteredRecruiterOptions(recruiterOptions);
      if (clientOptions.length > filteredClientOptions.length)
        setFilteredClientOptions(clientOptions);
      if (workerOptions.length > filteredWorkerOptions.length)
        setFilteredWorkerOptions(workerOptions);
      if (visatrackingOptions.length > filteredVisatrackingOptions.length)
        setFilteredVisatrackingOptions(visatrackingOptions);
      if (supplierOption?.length > filteredSupplierOptions.length)
        setFilteredSupplierOptions(supplierOption);
      if (rateCardWorkerOption.length > filteredRateCardWorkerOption.length)
        setFilteredRateCardWorkerOption(rateCardWorkerOption);
      if (subContractorOptions.length > filteredSubContractorOptions.length)
        setFilteredSubContractorOptions(subContractorOptions);
      if (visaTypeOptions.length > filteredVisaTypeOptions.length)
        setFilteredVisaTypeOptions(visaTypeOptions);
      if (sellerOptions.length > filteredSellerOptions.length)
        setFilteredSellerOptions(sellerOptions);
      if (visaCOCOptions.length > filteredVisaCOCOptions.length)
        setFilteredVisaCOCOptions(visaCOCOptions);
      if (paramLevelOptions.length > filteredParamLevelOptions.length)
        setFilteredParamLevelOptions(paramLevelOptions);
      if (paramTypeOptions.length > filteredParamTypeOption.length)
        setFilteredParamTypeOption(paramTypeOptions);
      if (paramValueOptions.length > filteredParamValueOptions.length)
        setFilteredParamValueOptions(paramValueOptions);

      setOpenMenu(false);
    }
  };

  const searchFilterOptions = (value, filterName) => {
    const searchValue = value.toLowerCase();
    switch (filterName) {
      case "recruiterOptions":
        let tempRecr = recruiterOptions.filter((recr) =>
          recr.name.toLowerCase().includes(searchValue)
        );
        setFilteredRecruiterOptions(tempRecr);
        break;
      case "clientOptions":
        let tempClients = clientOptions.filter((client) =>
          client.name.toLowerCase().includes(searchValue)
        );
        setFilteredClientOptions(tempClients);
        break;
      case "workerOptions":
        let tempWorker = workerOptions.filter((worker) =>
          worker.name.toLowerCase().includes(searchValue)
        );
        setFilteredWorkerOptions(tempWorker);
        break;
      case "supplierOption":
        let tempSupplier = supplierOption.filter((supplier) =>
          supplier.name.toLowerCase().includes(searchValue)
        );
        setFilteredSupplierOptions(tempSupplier);
        break;
      case "visatrackingOptions":
        let tempVisa = visatrackingOptions.filter((visa) =>
          visa.name.toLowerCase().includes(searchValue)
        );
        setFilteredVisatrackingOptions(tempVisa);
        break;
      case "rateCardWorkerOption":
        let tempRateCard = rateCardWorkerOption.filter((ratecard) =>
          ratecard.name.toLowerCase().includes(searchValue)
        );
        setFilteredRateCardWorkerOption(tempRateCard);
        break;
      case "subContractorOptions":
        let tempSubContractor = subContractorOptions.filter(
          (subContractorCompanyName) =>
            subContractorCompanyName.name.toLowerCase().includes(searchValue)
        );
        setFilteredSubContractorOptions(tempSubContractor);
        break;
      case "visaTypeOptions":
        let tempVisaType = visaTypeOptions.filter((visaType) =>
          visaType.name.toLowerCase().includes(searchValue)
        );
        setFilteredVisaTypeOptions(tempVisaType);
        break;
      case "sellerOptions":
        let tempSeller = sellerOptions.filter((seller) =>
          seller.name.toLowerCase().includes(searchValue)
        );
        setFilteredSellerOptions(tempSeller);
        break;
      case "visaCOCOptions":
        let tempCOC = visaCOCOptions.filter((visaCountry) =>
          visaCountry.name.toLowerCase().includes(searchValue)
        );
        setFilteredVisaCOCOptions(tempCOC);
        break;
      case "paramTypeOptions":
        let tempParamType = paramTypeOptions.filter((paramType) =>
          paramType.name.toLowerCase().includes(searchValue)
        );
        setFilteredParamTypeOption(tempParamType);
        break;
      case "paramLevelOptions":
        let tempParamLevel = paramLevelOptions.filter((paramLevel) =>
          paramLevel.name.toLowerCase().includes(searchValue)
        );
        setFilteredParamLevelOptions(tempParamLevel);
        break;
      case "paramValueOptions":
        let tempParamValue = paramValueOptions.filter((paramValue) =>
          paramValue.name.toLowerCase().includes(searchValue)
        );
        setFilteredParamValueOptions(tempParamValue);
        break;
      case "clientsOptions":
        setFilteredClientOptions(
          uniqClientOptions.filter((c) =>
            c.clientName.toLowerCase().includes(searchValue)
          )
        );
        break;
      default:
        return;
    }
  };

  return (
    <div className="filters-container" tabIndex={0} onBlur={handleBlur}>
      <Button
        type="button"
        name="filters"
        handleClick={handleButtonClick}
        className="btn main outlined margin-right marginY"
      >
        <FilterOutlined />
        <span>Filters</span>
        {openMenu && <DownOutlined />}
      </Button>
      {openMenu && (
        <div className="filter-menu-container">
          <div className="filter-actions">
            <span className="filter-heading">Filters</span>
            <Button
              className="x-small wide no-border no-margin no-caps blue reset"
              type="button"
              handleClick={clearAllFilters}
            >
              Clear all
            </Button>
          </div>
          <Collapse
            ghost
            accordion
            expandIconPosition="end"
            className="panels-container"
          >
            {filterOptions.includes("Recruiters") && (
              <Panel header="Recruiter" key="1" className="filter-panel">
                <FilterSearch
                  handleSearch={(searchValue) =>
                    searchFilterOptions(searchValue, "recruiterOptions")
                  }
                />
                {filteredRecruiterOptions.length > 0 &&
                  filteredRecruiterOptions.map((option) => (
                    <Check
                      filterCheckbox
                      label={option.name}
                      filterName="recruiterId"
                      trailName="Recruiter"
                      key={option.id}
                      id={`${option.id}`}
                      name={option.name}
                      checkedList={filters}
                      handleCheck={handleMultiCheck}
                      options={filteredRecruiterOptions}
                    />
                  ))}
              </Panel>
            )}
            {filterOptions.includes("Experience") && (
              <Panel header="Experience" key="6" className="filter-panel">
                <RangeSlider onChange={handleRange} />
              </Panel>
            )}
            {filterOptions.includes("Client") && (
              <Panel header="Client" key="7" className="filter-panel">
                <FilterSearch
                  handleSearch={(searchValue) =>
                    searchFilterOptions(searchValue, "clientOptions")
                  }
                />
                {filteredClientOptions.length > 0 &&
                  filteredClientOptions.map((option) => (
                    <Check
                      filterCheckbox
                      label={option.name}
                      filterName="clientId"
                      trailName="Client"
                      key={option.id}
                      id={`${option.id}`}
                      name={option.name}
                      checkedList={filters}
                      handleCheck={handleMultiCheck}
                      options={filteredClientOptions}
                    />
                  ))}
              </Panel>
            )}
            {filterOptions.includes("Worker Status") && (
              <Panel header="Status" key="8" className="filter-panel">
                {["Active", "Terminated", "LeaveWithoutPay", "Re-Hire"].map(
                  (status) => (
                    <Check
                      filterCheckbox
                      label={status}
                      filterName="status"
                      trailName="Status"
                      key={status}
                      id={status}
                      name={status}
                      checkedList={filters}
                      handleCheck={handleSingleCheck}
                    />
                  )
                )}
              </Panel>
            )}
            {filterOptions.includes("Priority") && (
              <Panel header="Priority" key="10" className="filter-panel">
                {["Low", "Medium", "High"].map((priority) => (
                  <Check
                    filterCheckbox
                    label={priority}
                    filterName="priority"
                    trailName="Priority"
                    key={priority}
                    id={priority}
                    name={priority}
                    checkedList={filters}
                    handleCheck={handleSingleCheck}
                  />
                ))}
              </Panel>
            )}
            {filterOptions.includes("Round") && (
              <Panel header="Round" key="15" className="filter-panel">
                {interviewRoundOptions
                  .map((r) => ({ value: r.id, name: r.name }))
                  .map((round) => (
                    <Check
                      filterCheckbox
                      label={round.name}
                      filterName="roundType"
                      trailName="Round"
                      key={round.value}
                      id={`${round.value}`}
                      name={round.name}
                      checkedList={filters}
                      handleCheck={handleSingleCheck}
                    />
                  ))}
              </Panel>
            )}
            {filterOptions.includes("Date") && (
              <Panel header="Date" key="16" className="filter-panel">
                <DatePicker
                  className="filter-date-picker"
                  onChange={handleDateFilter}
                  size="small"
                  style={{ width: "100%" }}
                />
              </Panel>
            )}
            {filterOptions.includes("Hiring Type") && (
              <Panel header="Hiring Type" key="17" className="filter-panel">
                {["Direct Hire", "Internal Hire", "Corp To Corp Hire"].map(
                  (type) => (
                    <Check
                      filterCheckbox
                      label={type}
                      filterName="hiringType"
                      trailName="Hiring Type"
                      key={type}
                      id={type}
                      name={type}
                      checkedList={filters}
                      handleCheck={handleSingleCheck}
                    />
                  )
                )}
              </Panel>
            )}
            {filterOptions.includes("Supplier") && (
              <Panel header="Supplier" key="18" className="filter-panel">
                {supplierOption.length > 0 &&
                  supplierOption.map((option) => (
                    <Check
                      filterCheckbox
                      label={option.name}
                      filterName="supplierId"
                      trailName="Supplier"
                      key={option.id}
                      id={`${option.id}`}
                      name={option.name}
                      checkedList={filters}
                      handleCheck={handleMultiCheck}
                    />
                  ))}
              </Panel>
            )}
            {filterOptions.includes("Title") && (
              <Panel header="Title" key="19" className="filter-panel">
                {supplierTitleOptions.length > 0 &&
                  supplierTitleOptions.map((option) => (
                    <Check
                      filterCheckbox
                      label={option.name}
                      filterName="designation"
                      trailName="Title"
                      key={option.id}
                      id={`${option.id}`}
                      name={option.name}
                      checkedList={filters}
                      handleCheck={handleMultiCheck}
                    />
                  ))}
              </Panel>
            )}
            {filterOptions.includes("RateCard Worker") && (
              <Panel header="Worker" key="20" className="filter-panel">
                {rateCardWorkerOption.length > 0 &&
                  rateCardWorkerOption.map((option) => (
                    <Check
                      filterCheckbox
                      label={option.name}
                      filterName="workerId"
                      trailName="Worker"
                      key={option.id}
                      id={`${option.id}`}
                      name={option.name}
                      checkedList={filters}
                      handleCheck={handleMultiCheck}
                    />
                  ))}
              </Panel>
            )}
            {filterOptions.includes("Visatracking Worker") && (
              <Panel header="Worker" key="21" className="filter-panel">
                {visatrackingOptions.length > 0 &&
                  visatrackingOptions.map((option) => (
                    <Check
                      filterCheckbox
                      label={option.name}
                      filterName="workerId"
                      trailName="Worker"
                      key={option.id}
                      id={`${option.id}`}
                      name={option.name}
                      checkedList={filters}
                      handleCheck={handleMultiCheck}
                    />
                  ))}
              </Panel>
            )}
            {filterOptions.includes("SubContractor") && (
              <Panel header="SubContractor" key="22" className="filter-panel">
                {subContractorOptions.length > 0 &&
                  subContractorOptions.map((option) => (
                    <Check
                      filterCheckbox
                      label={option.name}
                      filterName="subContractorCompanyName"
                      trailName="SubContractor"
                      key={option.id}
                      id={`${option.id}`}
                      name={option.name}
                      checkedList={filters}
                      handleCheck={handleMultiCheck}
                    />
                  ))}
              </Panel>
            )}
            {filterOptions.includes("Type") && (
              <Panel header="Type" key="23" className="filter-panel">
                {["H1B", "L1", "O1", "E1", "E3", "Citizen", "Green"].map(
                  (visaType) => (
                    <Check
                      filterCheckbox
                      label={visaType}
                      filterName="visaType"
                      trailName="Type"
                      key={visaType}
                      id={visaType}
                      name={visaType}
                      checkedList={filters}
                      handleCheck={handleSingleCheck}
                    />
                  )
                )}
              </Panel>
            )}
            {filterOptions.includes("Seller") && (
              <Panel header="Seller" key="24" className="filter-panel">
                {sellerOptions.length > 0 &&
                  sellerOptions.map((option) => (
                    <Check
                      filterCheckbox
                      label={option.name}
                      filterName="seller"
                      trailName="Seller"
                      key={option.id}
                      id={`${option.id}`}
                      name={option.name}
                      checkedList={filters}
                      handleCheck={handleMultiCheck}
                    />
                  ))}
              </Panel>
            )}
            {filterOptions.includes("Recruiter") && (
              <Panel header="Recruiter" key="25" className="filter-panel">
                {recruiterOption.length > 0 &&
                  recruiterOption.map((option) => (
                    <Check
                      filterCheckbox
                      label={option.name}
                      filterName="recruiter"
                      trailName="Recruiter"
                      key={option.id}
                      id={`${option.id}`}
                      name={option.name}
                      checkedList={filters}
                      handleCheck={handleMultiCheck}
                    />
                  ))}
              </Panel>
            )}
            {filterOptions.includes("COC") && (
              <Panel
                header="Country Of Citizen"
                key="26"
                className="filter-panel"
              >
                {visaCOCOptions.length > 0 &&
                  visaCOCOptions.map((option) => (
                    <Check
                      filterCheckbox
                      label={option.name}
                      filterName="visaCountry"
                      trailName="visaCountry"
                      key={option.id}
                      id={`${option.id}`}
                      name={option.name}
                      checkedList={filters}
                      handleCheck={handleMultiCheck}
                    />
                  ))}
              </Panel>
            )}
            {filterOptions.includes("Param Type") && (
              <Panel header="Param Type" key="27" className="filter-panel">
                {[
                  "Admin fee",
                  "Sick fee",
                  "PTO fee",
                ].map((paramType) => (
                  <Check
                    filterCheckbox
                    label={paramType}
                    filterName="paramType"
                    trailName="Param Type"
                    key={paramType}
                    id={paramType}
                    name={paramType}
                    checkedList={filters}
                    handleCheck={handleMultiCheck}
                  />
                ))}
              </Panel>
            )}
            {filterOptions.includes("Param Level") && (
              <Panel header="Param Level" key="28" className="filter-panel">
                {["level 0", "level 1", "level 2", "level 3"].map(
                  (paramLevel) => (
                    <Check
                      filterCheckbox
                      label={paramLevel}
                      filterName="paramLevel"
                      trailName="Param Level"
                      key={paramLevel}
                      id={paramLevel}
                      name={paramLevel}
                      checkedList={filters}
                      handleCheck={handleMultiCheck}
                    />
                  )
                )}
              </Panel>
            )}
            {filterOptions.includes("Param Value") && (
              <Panel header="Param Value" key="29" className="filter-panel">
                {paramValueOptions.length > 0 &&
                  paramValueOptions.map((option) => (
                    <Check
                      filterCheckbox
                      label={option.name}
                      filterName="paramValue"
                      trailName="Param Value"
                      key={option.id}
                      id={`${option.id}`}
                      name={option.name}
                      checkedList={filters}
                      handleCheck={handleMultiCheck}
                    />
                  ))}
              </Panel>
            )}
            {filterOptions.includes("Clients") && (
              <Panel header="Clients" key="30" className="filter-panel">
                <FilterSearch
                  handleSearch={(searchValue) =>
                    searchFilterOptions(searchValue, "clientsOptions")
                  }
                />
                {Array.isArray(uniqClientOptions) &&
                  uniqClientOptions.map((o) => (
                    <Check
                      filterCheckbox
                      label={o.clientName}
                      filterName="clientIds"
                      //trailName="Clients"
                      key={o.id}
                      id={`${o.id}`}
                      name={o.clientName}
                      checkedList={filters}
                      handleCheck={handleMultiCheck}
                      options={uniqClientOptions}
                    />
                  ))}
              </Panel>
            )}
          </Collapse>
        </div>
      )}
    </div>
  );
};

export default Filters;
