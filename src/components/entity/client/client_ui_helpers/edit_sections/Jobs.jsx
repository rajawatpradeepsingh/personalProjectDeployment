import { useState, useEffect, useMemo, useCallback } from 'react';
import { useHistory } from "react-router-dom";
import axios from 'axios';
import { config } from '../../../../../config';
import auth from '../../../../../utils/AuthService';
import { JobCard } from '../job-card/JobCard';
import { Pagination } from "antd";
import Button from '../../../../common/button/button.component';
import { EditJobopeningModal } from '../../../jobs/EditJobModal';
import { PlusOutlined } from "@ant-design/icons";
import './client_edit_styles.scss';

export const Jobs = ({ id, ...props }) => {
   const headers = useMemo(() => auth.getHeaders(), []);
   const history = useHistory();
   const [jobs, setJobs] = useState([]);
   const [totalItems, setTotalItems] = useState(0);
   const [currentPage, setCurrentPage] = useState(1);
   const [selectedJob, setSelectedJob] = useState({});
   const [openJob, setOpenJob] = useState(false);

   const getJobs = useCallback(async () => {
      try {
         const res = await axios.put(
            `${config.serverURL}/jobopenings?dropdownFilter=true&pageNo=${currentPage - 1}&pageSize=${4}`,
            { clientId: `${id}`},
            { headers }
         );
         if (res.data) {
            setTotalItems(res.headers["total-elements"]);
            setJobs(res.data);
         }
         
      } catch (error) {
         console.log(error);
      }
   }, [headers, currentPage, id]);

   useEffect(() => getJobs(), [getJobs, currentPage]);

   const showTotal = (total, range) => <span className='pagination-total'>{`${range[0]}-${range[1]} of ${total}`}</span>;

   const openSelectedJob = (job) => {
      setSelectedJob(job);
      setOpenJob(true);
   }

   const openAddJobs = () => {
     history.push("/addjob");
   };

   return (
     <div className="client-jobs-container">
       <div className="heading">
         <h3 className="client-jobs-header">Job Openings</h3>
         <Button type="button" className={"btn main"} handleClick={openAddJobs}>
           <PlusOutlined className='icon' />
           New Job Opening
         </Button>
       </div>
       {totalItems < 1 && (
         <span className="no-jobs-text">This client has no job openings</span>
       )}
       <div className="job-cards-container">
         {jobs.map((job) => (
           <JobCard job={job} key={job.id} onClick={openSelectedJob} />
         ))}
       </div>
       {totalItems > 0 && (
         <div className="pagination">
           <Pagination
             size="small"
             current={currentPage}
             total={totalItems}
             onChange={(page) => setCurrentPage(page)}
             showTotal={totalItems > 1 ? showTotal : false}
           />
         </div>
       )}
       <EditJobopeningModal
         selectedJobopening={selectedJob}
         setShowModal={setOpenJob}
         showModal={openJob}
         viewOnly={true}
       />
     </div>
   );
}