import { formatFilters } from "../../../utils/table_utils";
import { Table } from "antd";
import { TableTitle } from "./TableTitle";
import { config } from "../../../config";
import './table.scss';

export const TableComponent = (props) => {
console.log(props)
  const handleFiltering = (filter) => {
    if (!Object.values(filter).filter((value) => value).length) {
      if (
        !Object.values(filter).filter((value) => value).length &&
        !Object.keys(props.filters).filter((value) => value).length
      ) {
        props.setFilters({});
      } else {
        let obj = { ...props.filters };
        for (const key in filter) {
          let altKey = key.includes("clientName")
            ? "clientId"
            : key === "recruiter.firstName"
            ? "recruiterId"
            : key === "candidate.firstName"
            ? "candidateId"
            : key === "supplierCompanyName"
            ? "supplierId"
            : key === "worker.firstName"
            ? "workerId"
            : key === "resourceManager.firstName"
            ? "resourceManagerId"
            : key === "project.projectName"
            ? "projectId"
            : key;
          if (!filter[key]) delete obj[altKey];
        }
        props.setFilters(obj);
      }
    } else {
      const filterObject = formatFilters(filter, props.filters);
      props.setFilters(filterObject);
    }
  }

  const handleTableChange = (pagination, filter, sort) => {
    props.setPageSize(pagination?.pageSize || config.ITEMS_PER_PAGE);
    props.setCurrentPage(pagination?.current || 1);

    if (typeof sort === 'object' && props?.setSort) {
      if (sort?.order)
        props.setSort({ [sort?.columnKey]: sort?.order === "ascend" ? "asc" : "desc" });
      else
        props.setSort({});
    }

    handleFiltering(filter);
  }
  let locale = {
    emptyText: 'Loading...',
  };
  return (
    <div className="container-table">
      <Table
        id="parent-table"
        size="small"
        locale={props.loading ? locale : false}
        //loading={props.loading}
        columns={props.columns}
        pagination={{
          position: ["bottomRight"],
          defaultPageSize: 10,
          total: props.total,
          pageSizeOptions: ["5", "10", "20", "30", "50", "100"],
          showSizeChanger: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
          style: { maxWidth: "calc(100% - 20px)", marginBottom: 0 },
        }}
        expandable={
          props.expandedRowRender && {
            expandedRowRender: props.expandedRowRender,
            defaultExpandedRowKeys: ["0"],
            rowExpandable: (record) => record.name !== "Not Expandable",
            expandedRowKeys: props.expandedRowKeys,
            onExpand: props.setExpandedRowKeys ? (expanded, record) => {
              if (!expanded)
                props.setExpandedRowKeys((prev) => prev.filter((key) => key !== record.key));
              else
                props.setExpandedRowKeys((prev) => [...prev, record.key,]);
            } : undefined,
          }
        }
        rowSelection={props.rowSelection}
        dataSource={props.data}
        scroll={{ x: "calc(500px + 50%)", y: 500 }}
        onChange={(pg, filter, sort) => {
          handleTableChange(pg, filter, sort);
        }}
        title={() => (
          <TableTitle
            rowSelection={
              props.rowSelection ? props.rowSelection : { selectedRowKeys: [] }
            }
            searchOptions={props.searchOptions}
            searchList={props.searchList}
            handleSearch={props.handleSearch}
            setFilters={props.setFilters}
            filters={props.filters}
            handleConfirmArchive={props.handleConfirmArchive}
            handleCancelArchiving={props.handleCancelArchiving}
            openArchive={props.openArchive}
            openReports={props.openReports}
            removeableColumns={props.removeableColumns}
            defaultColumns={props.defaultColumns}
            columns={props.columns}
            setColumns={props.setColumns}
            openShareModal={props.openShareModal}
          />
        )}
      />
    </div>
  );
};

