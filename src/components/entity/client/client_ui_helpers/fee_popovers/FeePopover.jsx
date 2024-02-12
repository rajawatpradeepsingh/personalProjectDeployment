import { PopoverTable } from '../../../../common/popovers/popovers';

export const VmsPopover = ({ record, ...props }) => {
  const prevFees = record?.preVmsFees.split(",");
  const prevUsers = record?.preUser.split(",");
  const prevDates = record?.preDate.split(",");
  return (
    <PopoverTable
      title="VMS Fee History"
      content={
        <table style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>VMS Fee(%)</th>
              <th>Updated By</th>
              <th>Updated On</th>
            </tr>
          </thead>
          <tbody>
            {prevFees.map((fee, i) => (
              <tr key={i}>
                <td>{fee}%</td>
                <td>{prevUsers[i]}</td>
                <td>{prevDates[i]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      }
    >
      {props.children}%
    </PopoverTable>
  );
}

export const AdminPopover = ({ record, ...props }) => {
  const prevFees = record?.preAdminFees.split(",");
  const prevUsers = record?.preAdminUser.split(",");
  const prevDates = record?.preAdminDate.split(",");
  return (
    <PopoverTable
      title="Admin Fee History"
      content={
        <table style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>Admin Fee(%)</th>
              <th>Updated By</th>
              <th>Updated On</th>
            </tr>
          </thead>
          <tbody>
            {prevFees.map((fee, i) => (
              <tr key={i}>
                <td>{fee}%</td>
                <td>{prevUsers[i]}</td>
                <td>{prevDates[i]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      }
    >
      {props.children}%
    </PopoverTable>
  );
}

export const RebatePopover = ({ record, ...props }) => {
  const prevFees = record?.preRebateFees.split(",");
  const prevUsers = record?.preRebateUser.split(",");
  const prevDates = record?.preRebateDate.split(",");
  return (
    <PopoverTable
      title="Rebate Fee History"
      content={
        <table style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>Rebate Fee(%)</th>
              <th>Updated By</th>
              <th>Updated On</th>
            </tr>
          </thead>
          <tbody>
            {prevFees.map((fee, i) => (
              <tr key={i}>
                <td>{fee}%</td>
                <td>{prevUsers[i]}</td>
                <td>{prevDates[i]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      }
    >
      {props.children}%
    </PopoverTable>
  );
}