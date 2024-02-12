import { useState, useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import auth from "../../../../utils/AuthService";
import { config } from "../../../../config";
import { sortAscending } from "../../../../utils/service";
import { setClientOptions, setJobOptions } from "../../../../Redux/filterSlice";
import { Input, Checkbox, Collapse } from "antd";
import { SearchOutlined } from "@ant-design/icons";

export const JobDetailsFilter = (props) => {
  const headers = useMemo(() => auth.getHeaders(), []);
  const dispatch = useDispatch();
  const [jobId, setJobId] = useState("");
  const [clientId, setClientId] = useState([]);
  const { jobOptions } = useSelector((state) => state.filters);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const { clientOptions } = useSelector((state) => state.filters);
  const [filteredClients, setFilteredClients] = useState([]);

  const getJobOptions = useCallback(async () => {
    if (jobOptions.length) {
      setFilteredJobs(jobOptions);
      return;
    }
    try {
      const response = await axios.get(`${config.serverURL}/jobopenings?dropdownFilter=true`, { headers });
      if (response.status === 200) {
        const jobs = response.data.map((job) => ({
          value: job.id,
          label: job.jobTitle,
        }));
        const sorted = sortAscending("name", jobs);
        dispatch(setJobOptions(sorted));
        setFilteredJobs(sorted);
      }
    } catch (error) {
      if (error.response?.status === 401) auth.logout();
    }
  }, [headers, dispatch, jobOptions]);

  const getClientOptions = useCallback(async () => {
    if (clientOptions.length) {
      setFilteredClients(clientOptions);
      return;
    }
    try {
      const response = await axios.get(`${config.serverURL}/clients?dropdownFilter=true`, { headers });
      if (response.status === 200) {
        const clients = response.data.map((client) => ({
          value: client.id,
          label: `${client.clientName} (${client.address?.city})`,
        }));
        const sorted = sortAscending("name", clients);
        dispatch(setClientOptions(sorted));
        setFilteredClients(sorted);
      }
    } catch (error) {
      if (error.response?.status === 401) auth.logout();
    }
  }, [headers, dispatch, clientOptions]);

  useEffect(() => {
    getJobOptions();
    getClientOptions();
  }, [getJobOptions, getClientOptions]);

  const handleReset = () => {
    setJobId("");
    setClientId([]);
  };

  const confirmReset = () => {
    let temp = { ...props.filters };
    delete temp["jobId"];
    delete temp["clientId"];
    props.setFilters(temp);
  }

  const handleChange = (value, name, checked) => {
    switch (name) {
      case "jobId":
        checked ? setJobId(value) : setJobId("");
        break;
      case "clientId":
        let values;
        if (checked) {
          values = [...clientId];
          values.push(value);
          setClientId(values);
        } else {
          values = clientId.filter(id => id !== value)
          if (values.length) {
            setClientId(values);
          } else {
            setClientId([]);
          }
        }
        break;
      default:
        break;
    }
  };

  const handleSearch = (value, name) => {
    switch (name) {
      case "job":
        value ? setFilteredJobs(jobOptions.filter(j => j.label.toLowerCase().includes(value.toLowerCase()))) : setFilteredJobs(jobOptions);
        break;
      case "client":
        value ? setFilteredClients(clientOptions.filter(c => c.label.toLowerCase().includes(value.toLowerCase()))) : setFilteredClients(clientOptions);
        break;
      default:
        break;
    }
  }

  const CheckList = ({ list, name }) => (
    <div className="filter-checklist-container">
      {list.map((item) => (
        <Checkbox
          className="checklist-item"
          key={item.value}
          id={item.value}
          onChange={(e) => handleChange(e.target.id, name, e.target.checked)}
          checked={name === "jobId" ? jobId === item.value : clientId.includes(item.value)}
        >
          {item.label}
        </Checkbox>
      ))}
    </div>
  );

  const handleFilter = () => {
    if (jobId && clientId.length) {
      props.setFilters({
        ...props.filters,
        jobId: jobId,
        clientId: clientId.join(","),
      });
    } else if ((!jobId && clientId.length) || (jobId && !clientId.length)) {
      !jobId
        ? props.setFilters({ ...props.filters, clientId: clientId.join(",") })
        : props.setFilters({ ...props.filters, jobId: jobId });
    } else {
      confirmReset();
    }


  }

  return (
    <div className="custom-filter-container large">
      <Collapse accordion ghost id="custom-filter-panels">
        <Collapse.Panel
          header={<span className={`panel-label ${Object.keys(props.filters).includes("jobId") && "active"}`}>Job Opening</span>}
          key="1"
        >
          <Input size="small" placeholder="Filter" onChange={(e) => handleSearch(e.target.value, "job")} prefix={<SearchOutlined />} />
          <CheckList list={filteredJobs} name="jobId" />
        </Collapse.Panel>
        <hr className="divider" />
        <Collapse.Panel
          header={<span className={`panel-label ${Object.keys(props.filters).includes("clientId") && "active"}`}>Client</span>}
          key="2"
        >
          <Input size="small" placeholder="Filter" onChange={(e) => handleSearch(e.target.value, "client")} prefix={<SearchOutlined />} />
          <CheckList list={filteredClients} name="clientId" />
        </Collapse.Panel>
      </Collapse>
      <hr className="divider" />
      <div className="custom-filter-btns">
        <button
          type="button"
          className="custom-filter-clear"
          onClick={handleReset}
        >
          Reset
        </button>
        <button
          type="button"
          className="custom-filter-ok"
          onClick={handleFilter}
        >
          OK
        </button>
      </div>
    </div>
  );
};
