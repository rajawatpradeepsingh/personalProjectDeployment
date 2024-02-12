import React from "react";
import { Pagination } from "antd";
import "./pagination.css";

const PaginationComponent = ({
  total = 0,
  itemsPerPage = 10,
  currentPage = 1,
  onPageChange,
  ...props
}) => {
  const handlePageChange = (page) => onPageChange(page);

  return (
    <div className="pagination-container">
      <Pagination
        total={total}
        showTotal={(total, range) =>
          `${range[0]}-${range[1]} of ${total} records`
        }
        pageSize={itemsPerPage}
        current={currentPage}
        onChange={handlePageChange}
        hideOnSinglePage={total === 0 ? true : false}
        size="small"
      />
    </div>
  );
};

export default PaginationComponent;
