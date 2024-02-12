import moment from 'moment';
import './jobcard_styles.scss';
import {  useCallback } from "react";
import { useHistory } from "react-router-dom";

export const JobCard = ({ job }) => {
  const history = useHistory();
  const openEditPage = useCallback((id) => {
    history.push(`/job/${id}`);
  }, [history]);

   return (
     <div className="job-card"   onClick={() => openEditPage(job.id)}
     >
       <h4 className="jobtitle">
         {job.jobTitle} <span>({job.jobType} - {job.workType})</span>
       </h4>
       <div className="detail-container">
         <span className="label">Created</span>
         <span className="detail">
           {moment(job.creationDate).format("MM/DD/YYYY")}
         </span>
       </div>
       <div className="detail-container">
         <span className="label">Description</span>
         <span className="detail">{job.jobDescription}</span>
       </div>
     </div>
   );
}