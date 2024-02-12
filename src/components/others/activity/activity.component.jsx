import { useEffect, useState, useCallback, useRef } from "react";
import { useSelector } from "react-redux";
import { config } from "../../../config";
import auth from "../../../utils/AuthService";
import axios from "axios";
import SingleSelect from "../../common/select/selects.component";
import ExpandableTable from "../../ui/expandable-table/expandable-table.component";
import { EditJobopeningModal } from "../../entity/jobs/EditJobModal";
import MiniPagination from "../../ui/mini-pagination/mini-pagination.component";
import Button from "../../common/button/button.component";
import { activityTableRows } from "./sub-components/activity-table-row";
import { UpdateActivity } from "./sub-components/update-activity.component";
import { AddNewActivity } from "./sub-components/add-activity-component";
import { EditActivity } from "./sub-components/edit-activity-component";
import { message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import "./activity.styles.scss";

const Activity = (props) => {
  const [headers] = useState(auth.getHeaders());
  const [user] = useState(auth.getUserInfo());
  const [activity, setActivity] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [clientName, setClientName] = useState("");
  const clientsList = useSelector((state) => state.client.clientsList);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [endIndex, setEndIndex] = useState(5);
  const [clientOptions, setClientOptions] = useState([]);
  const [addActivity, setAddActivity] = useState(false);
  const [updateActivity, setUpdateActivity] = useState(null);
  const [editLastUpdate, setEditLastUpdate] = useState(null);
  const [recruiter, setRecruiter] = useState(null);
  const [jobsAlreadySubmitted, setJobsAlreadySubmitted] = useState([]);
  const [clients, setClients] = useState([]);
  const activityRef = useRef(activity);
  useEffect(() => activityRef.current = activity, [activity]);

  useEffect(() => {
    if (user.roles[0].roleName === "RECRUITER") setRecruiter(user.id);
  }, [user]);

  const getAcivity = useCallback(async () => {
    try {
      const response = await axios.get(`${config.serverURL}/activities/candidate/${props.candidateId}`, { headers });
      if (response.status === 200) {
        setJobsAlreadySubmitted(response.data.map(tracker => tracker.jobOpening?.id));
        const newRecords = response.data.map(tracker => {
          return {
            id: tracker.id,
            user: tracker.updatedBy,
            job: {
              id: tracker.jobOpening?.id,
              title: !tracker.jobOpening?.id ? "Internal Activity" : tracker.jobOpening?.jobTitle,
              client: !tracker.jobOpening?.id ? null : `${tracker.jobOpening?.client?.clientName} (${tracker.jobOpening?.client?.address?.city})`
            },
            currentStatus: tracker.trackingStatus,
            created: tracker.createdDate,
            history: tracker.histories,
            submission: tracker.histories.filter(record => record.trackingStatus === "SUBMISSION").reverse()[0],
            interviews: tracker.histories.filter(record => record.trackingStatus === "INTERVIEW").reverse(),
            pending: tracker.histories.filter(record => record.trackingStatus === "PENDING").reverse()[0],
            confirmed: tracker.histories.filter(record => record.trackingStatus === "CONFIRMED").reverse()[0],
            onboarded: tracker.histories.filter(record => record.trackingStatus === "ON_BOARDING").reverse()[0],
            rejected: tracker.histories.filter(record => record.trackingStatus === "REJECTED").reverse()[0],
            newFormat: true,
            submittedOn: tracker.submittedOn,
            pendingOn: tracker.pendingOn,
            confirmedOn: tracker.confirmedOn,
            onboardedOn: tracker.onboardedOn,
            rejectedOn: tracker.rejectedOn,
            project: tracker.project,
            hiringType: tracker.hiringType,
            startDate: tracker.startDate,
            endDate: tracker.endDate,
            signUpContract: tracker.signUpContract,
            deliveryOfLaptop: tracker.deliveryOfLaptop,
            easePortalSetup: tracker.easePortalSetup,
            workOrder: tracker.workOrder,
            backgroundCheck: tracker.backgroundCheck
          }
        }).reverse();
        const oldRecords = props.data.filter((record) => record.status.includes("-") || record.status.includes("Onboarded")).map((activity, index) => ({
          id: activity.id,
          newFormat: false,
          job: {
            title:
              activity.manager && activity.clientName
                ? activity.manager
                : "Internal Interview",
            client: activity.clientName,
          },
          status: activity.status.split(" - ")[1],
          created: activity.date,
          comment: activity.comment,
          user: activity.sign,
        }));
        const combinedRecords = oldRecords.length ? newRecords.concat(oldRecords) : newRecords;
        setActivity(combinedRecords);
        setFilteredList(combinedRecords.slice(endIndex - 5, endIndex));
        setTotalRecords(combinedRecords.length)
      };
    } catch (error) {
      console.log(error);
    }
  }, [headers, endIndex, props.candidateId, props.data]);

  useEffect(() => {
    let isCancelled = false;
    const fetchData = async () => !isCancelled ? await getAcivity() : null;
    fetchData();
    return () => isCancelled = true;
  }, [getAcivity, endIndex]);

  //need to implement useMemo
  useEffect(() => {
    if (clients.length) {
      const options = clients.map((client) => {
        return {
          id: client.id,
          value: `${client.clientName} (${client.address?.city})`,
          name: `${client.clientName} (${client.address?.city})`,
        };
      });
      options.push({ id: "Internal", name: "Internal" });
      setClientOptions(options);
    }
  }, [clients]);

  const handleChange = (event) => {
    setClientName(event.target.value);
  };

  const getJobs = useCallback(async () => {
    try {
      return await axios.get(`${config.serverURL}/jobopenings`, { headers });
    } catch (error) {
      console.log(error);
    }
  }, [headers]);

  useEffect(() => {
    let isCancelled = false;
    const fetchData = async () => {
      try {
        const response = await getJobs();
        if (response.status === 200) {
          if (!isCancelled) {
            setJobs(response.data);
          }
        }
      } catch (e) {
        if (!isCancelled) {
          console.log(e);
        }
      }
    };
    fetchData();
    //cleanup function:
    return () => (isCancelled = true);
  }, [getJobs]);

  const handleJobClick = (id, title, client) => {
    const job = id
      ? jobs.filter((job) => job.id === id)[0]
      : jobs.filter((job) => job.jobTitle === title && `${job.client?.clientName} (${job.client?.address?.city})` === client)[0];
    if (job) {
      setSelectedJob(job);
      setShowModal(true);
    }
  };

  const loadClients = useCallback(() => {
    axios
      .get(`${config.serverURL}/clients`, { headers })
      .then((response) => {
        if (response.data) {
          setClients(response.data);
        }
      })
      .catch((err) => console.log(err));
  }, [headers]);

  useEffect(() => {
    loadClients();
  }, [loadClients]);

  const handlePagination = (page) => {
    setEndIndex(page * 5);
  };

  useEffect(() => {
    if (clientName) {
      const filtered =
        clientName !== "Internal"
          ? activityRef.current.filter(record => record.job.client === clientName).slice(endIndex - 5, endIndex)
          : activityRef.current.filter(record => record.job.title === "Internal Interview").slice(endIndex - 5, endIndex);

      setFilteredList(filtered);
      setTotalRecords(filtered.length);
    } else {
      getAcivity();
    }
  }, [clientName, endIndex, props.data, getAcivity]);

  const clearFilter = () => setClientName("");

  const enableAddActivity = () => setAddActivity(!addActivity);

  const cancelAddActivity = () => setAddActivity(false);

  const enableUpdateActivity = (record) => setUpdateActivity(record);

  const cancelUpdateActivity = () => setUpdateActivity(null);

  const activityMessage = () => {
    
    message.success( (addActivity ? "Activity added successfully!" : updateActivity ? "Activity updated successfully!" : "Activity edited successfully!"),
    );
    getAcivity();
    setUpdateActivity(null);
    setAddActivity(false);
    setEditLastUpdate(null);
  }

    const submitSuccessCleanup = () => {
  
    getAcivity();
    setUpdateActivity(null);
    setAddActivity(false);
    setEditLastUpdate(null);
  };

  const enableEditLastUpdate = (record) => setEditLastUpdate(record);

  const cancelEditActivity = () => setEditLastUpdate(null);

  const deleteLastUpdate = async (id, interviewId) => {
    try {
      if (interviewId) await axios.delete(`${config.serverURL}/interviews/${interviewId}`, { headers });
      const response = await axios.delete(`${config.serverURL}/activities/history/${id}`, { headers });
      if (response.status === 200) {
        getAcivity();
        message.success(`Activity deleted successfully!`)
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="activity-container">
      {updateActivity && (
        <UpdateActivity
          record={updateActivity}
          activity={activity}
          jobs={jobs}
          setUpdateActivity={setUpdateActivity}
          candidate={props.candidateId}
          cancel={cancelUpdateActivity}
          success={activityMessage}
          successWithoutMessage={submitSuccessCleanup}        />
      )}
      {addActivity && (
        <AddNewActivity
          candidateId={props.candidateId}
          clientsList={clientsList}
          jobs={jobs}
          cancelAddActivity={cancelAddActivity}
          submitSuccess={activityMessage}
          jobsAlreadySubmitted={jobsAlreadySubmitted}
        />
      )}
      {editLastUpdate && <EditActivity jobs={jobs} clients={clientOptions} record={editLastUpdate} candidate={props.candidateId} success={activityMessage} cancel={cancelEditActivity} />}
      <div className="activity-actions-container">
        <div className="action-filter-container">
          {(!updateActivity && !addActivity && !editLastUpdate) && (props.status === "Active" || props.status === "Onboarded" || props.status === "Ready to be Marketed") && (
            <Button
              type="button"
              className={"btn main margin-right outlined"}
              handleClick={enableAddActivity}
            >
              <PlusOutlined className="icon" />
              New Activity
            </Button>
          )}
          <SingleSelect
            name="client-activity-filter"
            value={clientName}
            onChange={handleChange}
            placeholder="Filter by Client"
            options={clientOptions}
            className="small"
          />
          {clientName && (
            <Button
              type="button"
              className="btn main reset"
              handleClick={clearFilter}
            >
              CLEAR
            </Button>
          )}
        </div>
        <MiniPagination
          defaultPageSize={5}
          total={totalRecords}
          setCurrentPage={handlePagination}
        />
      </div>
      <ExpandableTable
        className={"wide"}
        headers={[
          { label: "Details", className: "sticky" },
          { label: " " },
          { label: "Submission" },
          { label: "Interview(s)" },
          { label: "Pending" },
          { label: "Confirmed" },
          { label: "Onboarded" },
          { label: "Rejected" },
        ]}
        body={activityTableRows(
          filteredList,
          handleJobClick,
          enableUpdateActivity,
          enableEditLastUpdate,
          deleteLastUpdate,
          recruiter
        )}
      />
      <EditJobopeningModal
        selectedJobopening={selectedJob}
        setShowModal={setShowModal}
        showModal={showModal}
        viewOnly={true}
      />
    </div>
  );
};

export default Activity;
