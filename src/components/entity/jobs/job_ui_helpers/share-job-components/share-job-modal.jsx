import { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { config } from "../../../../../config";
import auth from "../../../../../utils/AuthService";
import TextBlock from "../../../../common/textareas/textareas.component";
import { Modal, Select, message } from "antd";
import './share-job-styles.scss';

export const ShareJobs = (props) => {
  const [headers] = useState(auth.getHeaders());
  const user = JSON.parse(sessionStorage.getItem("userInfo"));
  const defaultFields = useMemo(() => {
    return [
      { value: "id", label: "Job Id", disabled: false },
      { value: "title", label: "Job Title", disabled: false },
      { value: "description", label: "Description", disabled: false },
      { value: "clientName", label: "Client", disabled: false },
      { value: "location", label: "Location", disabled: false },
      { value: "openings", label: "Num. of Openings", disabled: false },
      { value: "rate", label: "Bill Rate", disabled: false },
      { value: "workType", label: "Work Type", disabled: false },
    ];
  }, []);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [candidateEmailIds, setCandidateEmailIds] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSuppliers, setSelectedSuppliers] = useState([]);
  const [supplierEmailIds, setSupplierEmailIds] = useState([]);
  const [emailBody, setEmailBody] = useState("");
  const [selectedJobFields, setSelectedJobFields] = useState([]);
  const [jobFieldOptions, setJobFieldOptions] = useState(defaultFields);
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [jobOptions, setJobOptions] = useState([]);
  const [jobs, setJobs] = useState([]);

  //set array of job options from selected jobs (props) && set selected job options (initially all from props)
  useEffect(() => {
    if (props.jobs.length > 0) {
      setJobOptions(
        props.jobs.map((job) => {
          return { value: `${job.id} / ${job.jobTitle}`, label: `${job.jobTitle}` };
        })
      );
      setSelectedJobs(
        props.jobs.map((job) => {
          return { value: `${job.id} / ${job.jobTitle}`, label: `${job.jobTitle}` };
        })
      );
      setJobs(props.jobs);
    }
  }, [props.jobs]);

  //set what job info options are disabled based on recipient and qty of selected jobs
  useEffect(() => {
    let fields;
    if (selectedJobs.length > 2) {
      fields = selectedCandidates.length ?
        defaultFields.map(field => (field.value === "description" || field.value === "openings" ? { ...field, disabled: true } : field))
        : defaultFields.map(field => (field.value === "description" ? { ...field, disabled: true } : field))
    } else {
      fields = selectedCandidates.length ?
        defaultFields.map(field => (field.value === "openings" ? { ...field, disabled: true } : field))
        : defaultFields
    }
    setJobFieldOptions(fields);

  }, [selectedCandidates, selectedJobs, defaultFields]);

  //set default selected job info fields
  useEffect(() => {
    if (jobFieldOptions.length) {
      const selected = [];
      for (const obj of jobFieldOptions) {
        if (
          !obj.disabled &&
          (obj.value === "id" ||
            obj.value === "title" ||
            obj.value === "location" ||
            obj.value === "workType")
        )
          selected.push(obj.value);
      }
      setSelectedJobFields(selected)
    } else {
      setSelectedJobFields([]);
    }
  }, [jobFieldOptions])

  //get supplier recipient options
  const getSuppliers = useCallback(async () => {
    try {
      const response = await axios.get(
        `${config.serverURL}/supplier?dropdownFilter=true`,
        { headers }
      );
      if (response.data) {
        setSuppliers(
          response.data.map((supplier) => {
            return {
              value: `${supplier.id} / ${supplier.supplierCompanyName}`,
              label: `${supplier.supplierCompanyName} ${supplier.address?.city ? `(${supplier.address?.city && supplier.address?.city}, ${supplier.address?.stateCode ? supplier.address?.stateCode : ""})` : ''}`,
            };
          })
        );
      }
    } catch (error) {
      console.log(error);
    }
  }, [headers]);

  //get candidate recipient options
  const getCandidates = useCallback(async () => {
    try {
      const response = await axios.get(
        `${config.serverURL}/candidates?dropdownFilter=true`,
        { headers }
      );
      if (response.data) {
        setCandidates(
          response.data.map((option) => {
            return {
              value: `${option.id} / ${option.firstName} ${option.lastName}`,
              label: `${option.firstName} ${option.lastName}`,
            };
          })
        );
      }
    } catch (error) {
      console.log(error);
    }
  }, [headers]);

  useEffect(() => {
    let isCancelled = false;
    const fetchData = async () => {
      try {
        await getSuppliers();
        await getCandidates();
      } catch (error) {
        if (!isCancelled) console.log(error);
      }
    }
    fetchData();
    //cleanup function:
    return () => (isCancelled = true);
  }, [getSuppliers, getCandidates])

  //select which candidate or vendor ids to send email to
  const handleEmailSelection = (values, recipients) => {
    const ids = [];
    for (let obj of values) {
      ids.push(parseInt(obj.value.split(" / ")[0]));
    }
    if (recipients === "candidates") {
      setSelectedCandidates(values);
      setCandidateEmailIds(ids);
      if (selectedSuppliers.length) setSelectedSuppliers([]);
    } else {
      setSelectedSuppliers(values);
      setSupplierEmailIds(ids);
      if (selectedCandidates.length) setSelectedCandidates([]);
    }
  };

  //change which jobs to send email to (only jobs initially selected available)
  const handleJobSelection = (values) => {
    setSelectedJobs(values);
  };

  //change what job information to include in email
  const handleJobFieldSelection = (values) => {
    setSelectedJobFields(values);
  };

  //change default greeting text
  const handleBodyChange = (event) => {
    setEmailBody(event.target.value);
  };

  //cancel share hobs
  const handleCancel = (status = null) => {
    setSelectedCandidates([]);
    setSelectedSuppliers([]);
    setSelectedJobFields([]);
    setEmailBody("");
    setConfirmLoading(false);
    props.close(status);
  };

  const sendEmails = async () => {
    setConfirmLoading(true);
    const jobIds = [];
    for (let obj of selectedJobs) {
      jobIds.push(parseInt(obj.value.split(" / ")[0]));
    }
    const jobFullObjects = jobs.filter((job) => jobIds.includes(job.id));
    const jobObjectsForEmail = [];
    for (const obj of jobFullObjects) {
      jobObjectsForEmail.push(handleFormatJobObject(obj));
    }

    const emailData = {
      jobOpening: jobObjectsForEmail,
      candidates: candidateEmailIds,
      suppliers: supplierEmailIds,
      greeting: emailBody
        ? emailBody
        : `Hope you are doing well. This is ${user?.firstName} from Drishticon. Kindly find below the new job listings information.`,
    };

    try {
      const response = await axios.post(`${config.serverURL}/email`, emailData, { headers });
      if (response.status === 200) {
        setConfirmLoading(false);
        handleCancel(response.status);
      }
    } catch (err) {
      console.log(err)
      message.error(`${err.response}`);
    }
  };

  const handleFormatJobObject = (obj) => {
    const job = {};
    for (const value of selectedJobFields) {
      switch (value) {
        case "description":
          job["jobDescription"] = obj[value];
          break;
        case "title":
          job["jobTitle"] = obj[value];
          break;
        case "location":
          job["address"] = { city: obj.client.address.city, state: obj.client.address.state, countryCode: obj.client.address.countryCode };
          break;
        case "clientName":
          job["client"] = { clientName: obj.client.clientName };
          break;
        case "openings":
          job["noOfJobopenings"] = obj[value];
          break;
        case "rate":
          job["clientBillRate"] = obj[value];
          break;
        default:
          job[value] = obj[value];
      }
    }
    return job;
  };

  return (
    <Modal
      title="Share Job Openings"
      open={props.open}
      onOk={sendEmails}
      confirmLoading={confirmLoading}
      onCancel={() => handleCancel(null)}
      okText="Send"
      width={900}
    >
      <div className="email-details-container">
        <div className="email-section-container">
          <p className="email-section-header">Jobs:</p>
          <div className="selections-container">
            <Select
              mode="multiple"
              labelInValue
              allowClear
              style={{ width: "100%" }}
              placeholder="Select Jobs"
              value={selectedJobs}
              onChange={handleJobSelection}
              options={jobOptions}
            />
          </div>
        </div>
        <div className="email-section-container">
          <p className="email-section-header">To:</p>
          <div className="selections-container">
            <Select
              mode="multiple"
              labelInValue
              allowClear
              style={{ width: "100%", marginBottom: "8px" }}
              placeholder="Select Candidates"
              value={selectedCandidates}
              onChange={(values) => handleEmailSelection(values, "candidates")}
              options={candidates}
              disabled={selectedSuppliers.length}
            />
            <Select
              mode="multiple"
              labelInValue
              allowClear
              style={{ width: "100%" }}
              placeholder="Select Suppliers"
              value={selectedSuppliers}
              onChange={(values) => handleEmailSelection(values, "suppliers")}
              options={suppliers}
              disabled={selectedCandidates.length}
            />
          </div>
        </div>
        <div className="email-section-container">
          <p className="email-section-header">Email Body:</p>
          <TextBlock
            name="email-body"
            value={
              emailBody
                ? emailBody
                : `Hope you are doing well. This is ${user?.firstName} from Drishticon. Kindly find below the new job listings information.`
            }
            onChange={handleBodyChange}
            placeholder=""
            className="email"
            charCount={`Email already includes greeting with recipients name and signature with your information.`}
          />
        </div>
        <div className="email-section-container">
          <p className="email-section-header">Job Information:</p>
          <div className="selections-container">
            <Select
              mode="multiple"
              style={{ width: "100%" }}
              placeholder="Job Information"
              value={selectedJobFields}
              onChange={handleJobFieldSelection}
              options={jobFieldOptions}
            />
            <p className="email-section-info-text">
              Description can only be included in emails with 1-2 job openings.
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
};
