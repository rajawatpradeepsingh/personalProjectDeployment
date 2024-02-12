import { Table } from "antd";

const TableDetails = (props) => {
  const { columns, data, id, selectedRows, onSelectChange } = props;

  const rowSelection = {
    onChange: (rowKeys, selectedRows) => {
      onSelectChange((prev) => ({ ...prev, [id]: rowKeys }));
    },
    selectedRowKeys: selectedRows[id],
  };

  return (
    <Table
      className={props.className || ""}
      dataSource={data}
      columns={columns}
      pagination={false}
      rowKey={(row) => `${row?.id}_expanded`}
      rowSelection={rowSelection}
      scroll={{ x: "100%", y: "100%" }}
    />
  );
};

export default TableDetails;