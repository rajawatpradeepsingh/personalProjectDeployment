import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import axios from "axios";
import { SmallTable } from "../../../common/small_table/SmallTable";
import { config } from "../../../../config";
import auth from "../../../../utils/AuthService";
import { Pagination } from "antd";

export const UserHistory = () => {
  const { userDetails } = useSelector((state) => state.users);
  const [headers] = useState(auth.getHeaders());
  const [totalItems, setTotalItems] = useState(0);
  const [roleHistoryList, setRoleHistoryList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const formatDate = (date) => (date ? moment(date).format("MM/DD/YYYY") : "");

  const getUserHistory = useCallback((id, page, pageSize) => {
    if (!id) return;
    axios
      .get(
        `${config.serverURL}/rolehistory/historyRolePage?userId=${id}&pageNo=${page - 1}&pageSize=${pageSize}`,
        { headers }
      )
      .then((res) => {
        if (res.data) {
          const historyRolesData = res.data.map((roleHistory) => ({
            role: roleHistory?.historyRole?.[0]?.roleName
              ? roleHistory?.historyRole?.[0]?.roleName
              : "Admin",
               endDate: formatDate(roleHistory.endDate),
            updatedOn: moment(roleHistory.updatedOn).format("MM/DD/YYYY"),
            updatedBy: roleHistory.updatedBy,
          }));

          setRoleHistoryList(historyRolesData);
          setTotalItems(res.headers['total-elements']);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [headers]);

  useEffect(() => {
    getUserHistory(userDetails?.id, currentPage, itemsPerPage);
  }, [userDetails, currentPage, itemsPerPage, getUserHistory]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const futureRolesData = userDetails?.futureRoles?.map((role) => ({
    role: role.roleName,
    futureActivationDate: formatDate(userDetails?.futureActivationDate),
  })) || [];

  const futureRolesColumns = [
    {
      title: "Role",
      key: "role",
    },
    {
      title: "Activation Date",
      key: "futureActivationDate",
    },
  ];

  const historyRolesColumns = [
    {
      title: "Role",
      key: "role",
    },
    {
      title: "End Date",
      key: "endDate",
    },
    {
      title: "Updated On",
      key: "updatedOn",
    },
    {
      title: "Updated By",
      key: "updatedBy",
    },
  ];

  return (
    <div className="user-history" style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ marginTop: "15px", marginBottom: "10px" }}>
        <h3 className="disabled-form-section-header">Upcoming Role Assignment</h3>
        <SmallTable data={futureRolesData} columns={futureRolesColumns} />
      </div>

      <div style={{ maxHeight: "100%", overflowY: "auto" }}>
        <h3 className="disabled-form-section-header">Roles History</h3>
        <SmallTable data={roleHistoryList} columns={historyRolesColumns} />
        <div style={{padding: "0px 0px 0px 500px"}}>
        <Pagination
          current={currentPage}
          total={totalItems}
          pageSize={itemsPerPage}
          onChange={handlePageChange}
        />
        </div>
      </div>
    </div>
  );
};
