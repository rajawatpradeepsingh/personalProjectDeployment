import './style.scss';

export const RecordWithDetails = ({ name, location, ...props }) => (
  <div className='client-details-container'>
    <span>{name}</span>
    <span>{location}</span>
    {props.extra && <span>{props.extra}</span>}
  </div>
);