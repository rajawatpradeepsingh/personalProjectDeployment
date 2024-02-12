import "./table.scss";

export const TableRecordStatus = ({ status }) => (
   <span className={`table-record-status ${status && status.toLowerCase()}`}>{status}</span>
)