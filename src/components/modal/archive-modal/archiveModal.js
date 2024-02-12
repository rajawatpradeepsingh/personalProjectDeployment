import React, { useState,useMemo ,useEffect} from "react";
import axios from "axios";
import { config } from "../../../config";
import Button from "../../../components/common/button/button.component";
import Pagination from "../../ui/pagination/Pagination";
import { Modal } from "antd";
import { ToTopOutlined } from "@ant-design/icons";
import "./archive.styles.scss";
import auth from "../../../utils/AuthService";

const ArchiveModal = (props) => {
  const [notification, setNotification] = useState("");
  const [isErr, setErrResponse] = useState(false);
  const ITEMS_PER_PAGE = config.ITEMS_PER_PAGE;
  const user = useMemo(() => auth.getUserInfo(), []);
  const [roleData,setRoleData]=useState(user.roles[0]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (auth.hasAdminRole()) setIsAdmin(true);
  }, []);

  const handleClick = (id) => {
    let headers = JSON.parse(sessionStorage.getItem("headers"));
    axios
      .post(`${config.serverURL}/${props.archivedData}/${id}`, null, {
        headers,
      })
      .then((res) => {
        if (res.status === 200) {
          setNotification(res.data);
          setErrResponse(false);
          setTimeout(() => setNotification(""), 3000);
          props.loadArchive();
        }
      })
      .catch((err) => {
        setNotification(err.response.data);
        setErrResponse(true);
        setTimeout(() => setNotification(""), 3000);
        console.log(err);
      });
  };

  const getCellData = (record) => {
    const cells = [];
    for(const key in record) {
      if (key !== "id") {
        cells.push(<td className="archive-cell" key={`${key}`}>{record[key]}</td>);
      }
    }
    cells.push(
      <td className="archive-cell restore-col" key={`restore_${record.id}`}>
        {isAdmin||roleData.managerPermission ||roleData.candidatesPermission||roleData.clientPermission||roleData.workerPermission||roleData.jobOpeningsPermission||roleData.timesheetPermission||roleData.projectsPermission||roleData.onboardingsPermission||roleData.workOrderPermission||roleData.calendarPermission||roleData.interviewersPermission||roleData.suppliersPermission?
        <Button
          type="button"
          name="un-archive-btn"
          className="btn main outlined"
          handleClick={() => handleClick(record.id)}
        >
          <ToTopOutlined className="icon" /> Restore
        </Button>:""}
      </td>
    );
    return cells;
  }

  return (
    <Modal
      width={'60%'}
      title={
        <span>
          Archived{" "}
          {props.archivedData.includes("job")
            ? "Job Openings"
            : props.archivedData
                .charAt(0)
                .toUpperCase()
                .concat(props.archivedData.substring(1))}
        </span>
      }
      footer={null}
      open={props.openArchive}
      onCancel={() => props.setOpenArchive(false)}
    >
      {notification && (
        <div className="notification">
          <p className={`notification-text ${isErr ? "err-response" : ""}`}>
            {notification}
          </p>
        </div>
      )}
      <div id="archive-modal-contents">
        <table className="archive-table">
          <thead>
            <tr className="archive-table-headers">
              {props.headers &&
                props.headers.map((header) => {
                  return <th key={header} className="archive-col-header">{header}</th>;
                })}
              <th className="sr-only cell-btn">Restore</th>
            </tr>
          </thead>
          <tbody>
            {props.archive &&
              props.archive.map((item) => {
                return (
                  <tr key={item.id} className="archive-table-row">
                    {getCellData(item)}
                  </tr>
                );
              })}
          </tbody>
        </table>
        <div className="pagination-row">
          <Pagination
            total={props.totalItems}
            itemsPerPage={ITEMS_PER_PAGE}
            currentPage={props.archiveCurrentPage}
            onPageChange={(page) => props.setArchiveCurrentPage(page)}
            items={
              props.archivedData.includes("job")
                ? "Job Opening"
                : props.archivedData
                    .charAt(0)
                    .toUpperCase()
                    .concat(props.archivedData.substring(1))
            }
          />
        </div>
      </div>
    </Modal>
  );
};

export default ArchiveModal;
