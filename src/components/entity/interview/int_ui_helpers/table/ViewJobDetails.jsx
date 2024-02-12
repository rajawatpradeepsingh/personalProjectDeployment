import { useState, useMemo } from 'react';
import auth from '../../../../../utils/AuthService';
import { config } from '../../../../../config';
import axios from 'axios';
import { TableLink } from "../../../../common/table/TableLink";
import { EditJobopeningModal } from '../../../jobs/EditJobModal';

export const ViewJobDetails = ({ title, client, type, ...props }) => {
  const headers = useMemo(() => auth.getHeaders(), []);
  const [job, setJob] = useState({});
  const [showModal, setShowModal] = useState(false);

  const handleClick = async (id) => {
    try {
      const res = await axios.get(`${config.serverURL}/jobopenings/${id}`, { headers });
      if (res.data) {
        setJob(res.data);
        setShowModal(true);
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="table-job-details">
      {props.id ? (
        <TableLink label={title} onClick={() => handleClick(props.id)} className={'small'} />
      ) : (
        <span className="job-title">{title}</span>
      )}
      {client && <span className="client">{client}</span>}
      {type && <span className="job-type">{type}</span>}
      <EditJobopeningModal
        selectedJobopening={job}
        setShowModal={setShowModal}
        showModal={showModal}
        viewOnly={true}
      />
    </div>
  );
}