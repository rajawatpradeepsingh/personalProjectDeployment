import { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DatePicker, Drawer, Pagination, message } from "antd";
import { BarsOutlined, DeleteOutlined } from "@ant-design/icons";

import Button from "../../common/button/button.component";
import Notification from "./notification.component";
import DeleteNotifications from "./DeleteNotifications";
import PreviewDropdown from "./preview-dropdown/preview-dropdown.component";

import auth from "../../../utils/AuthService"
import * as service from "./utils/utils";
import { getCandidateAsIs } from "../../../API/candidates/candidate-apis";
import { getClientById } from "../../../API/clients/clients-apis";
import { getInterview as getInterviewById } from "../../../API/interviews/interview-apis";
import { getInterviewerById } from "../../../API/interviewers/interviewer-apis";
import { getJobById } from "../../../API/jobs/job-apis";
import { deleteNotification, getUserNotifications } from "../../../API/notifications/notification-apis";
import { readNotification, readNotifications } from "../../../API/notifications/notification-apis";
import { setCandidate, setShowBasic, setShow as setShowCandidate } from "../../../Redux/candidateSlice";
import { setShowComments, setProfessionalInfo } from "../../../Redux/candidateSlice";
import { setSelectedNotification, setShowNotification } from "../../../Redux/notificationSlice";
import { NotificationModal } from "./NotificationModal";
import { ViewNotificatedCandidate } from "./modules/ViewNotificatedCandidate";

const tabs = [
  { label: "All", name: "" },
  { label: "Candidates", name: "candidates" },
  { label: "Interviewers", name: "interviewers" },
  { label: "Clients", name: "clients" },
  { label: "Job Openings", name: "jobs" },
  { label: "Interviews", name: "interviews" },
  { label: "Onboardings", name: "onboardings" },
];

const ViewNotifications = (props) => {
  const [headers] = useState(auth.getHeaders());
  const [user] = useState(auth.getUserInfo());
  const [isAdmin] = useState(auth.hasAdminRole());

  const { open, setOpen, openDrawer, setOpenDrawer, setUnread, unreadList, setUnreadList } = props;
  const dispatch = useDispatch();
  const [shortList, setShortList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [deleteList, setDeleteList] = useState([]);
  const [mapper, setMapper] = useState(null);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [drawerTab, setDrawerTab] = useState("");
  const { show: showCandidate } = useSelector((state) => state.candidate);

  const closeDrawer = () => {
    setOpenDrawer(false);
    setOpen(false);
  };

  useEffect(() => {
    if (!open && !openDrawer) {
      setDrawerTab("");
      setPage(1);
      setDeleteList([]);
    }
  }, [open, openDrawer]);

  const handleMenuTabClick = (tab) => {
    setDrawerTab(tab);
    setPage(1);
    setDeleteList([]);
  };

  const notificationClicked = (note) => {
    if (note.entityName === "candidates") getCandidate(note);
    if (note.entityName === "interviewers") getInterviewer(note);
    if (note.entityName === "interviews") getInterview(note);
    if (note.entityName === "jobs") getJobOpening(note);
    if (note.entityName === "clients") getClient(note);
    setNotificationRead(note.id);
  };

  const getNotifications = useCallback(() => {
    getUserNotifications(headers, user.id, page, pageSize, drawerTab)
      .then((res) => {
        if (res.data) {
          const filteredByRole = isAdmin
            ? res.data
            : res.data.filter(
              (n) => !n.role || n.role?.roleName === user.roles[0]?.roleName
            );
          setFilteredList(filteredByRole);
          if (page === 1) setShortList(filteredByRole.slice(0, 5));
          setTotalItems(res.headers["total-elements"]);
        }
      })
  }, [headers, user, isAdmin, page, pageSize, drawerTab]);

  useEffect(() => {
    const timer = setInterval(() => {
      getNotifications();
    }, 300000);
    return () => clearInterval(timer);
  }, [getNotifications]);

  useEffect(() => getNotifications(), [getNotifications]);

  const setNotificationRead = (noticeId) => {
    if (unreadList.filter((n) => n.notificationId === noticeId).length) {
      readNotification(headers, noticeId, user.id)
        .then(() => {
          setUnread(unreadList.length - 1);
          const updList = filteredList.map((n) => {
            if (n.id === noticeId && n.receivers.length)
              return { ...n, receivers: [] };
            return n;
          });
          setFilteredList(updList);
          if (page === 1) setShortList(updList.slice(0, 5));
          setUnreadList(unreadList.filter((n) => n.notificationId !== noticeId));
        })
    }
  };

  const setAllNotificationsRead = () => {
    if (unreadList.length) {
      readNotifications(headers, user.id)
        .then(() => {
          setUnread(0);
          const updList = filteredList.map((n) => ({ ...n, receivers: [] }));
          setFilteredList(updList);
          if (page === 1) setShortList(updList.slice(0, 5));
          setUnreadList([]);
        })
    }
  };

  const handleClickSelectAll = () => {
    const toggled = deleteList.length ? [] : filteredList.map((f) => f.id);
    setDeleteList(toggled);
  };

  const handleClickDelete = () => {
    Promise.all(deleteList.map((i) => deleteNotification(headers, i)))
      .then(() => {
        setDeleteList([]);
        getNotifications();
      })
  };

  const getCandidate = (note) => {
    const page = note.description ? 3 : 0;
    dispatch(setShowBasic(page === 0 ? true : false));
    dispatch(setShowComments(page === 3 ? true : false));
    getCandidateAsIs(headers, note.entityId)
      .then((res) => {
        if (res.data) {
          dispatch(setCandidate(res.data));
          if (res.data.professionalInfo)
            dispatch(setProfessionalInfo(res.data.professionalInfo));
        }
        dispatch(setShowCandidate(true));
        closeDrawer();
      })
  };

  const getInterviewer = (note) => {
    getInterviewerById(headers, note.entityId)
      .then((res) => {
        if (res.data) {
          setMapper(note.entityName);
          dispatch(setSelectedNotification(res.data));
          dispatch(setShowNotification(true));
          closeDrawer();
        }
      })
  };

  const getInterview = (note) => {
    getInterviewById(headers, note.entityId)
      .then((res) => {
        console.log("res", res)
        if (res.data) {
          setMapper(note.entityName);
          dispatch(setSelectedNotification(res.data));
          dispatch(setShowNotification(true));
          closeDrawer();
        }
      })
  };

  const getJobOpening = async (note) => {
    const res = await getJobById(headers, note.entityId);
    if (res.statusCode === 200) {
      setMapper(note.entityName);
      dispatch(setSelectedNotification(res.data));
      dispatch(setShowNotification(true));
      closeDrawer();
    }
    if (res.statusCode === 404) message.error("This Job Opening has been archived and/or deleted")
  };

  const getClient = (note) => {
    getClientById(headers, note.entityId)
      .then((res) => {
        setMapper(note.entityName);
        dispatch(setSelectedNotification(res.clientdata));
        dispatch(setShowNotification(true));
        closeDrawer();
      })
  };

  const handleDateFilter = (date, dateString) => {
    if (dateString !== "") {
      setFilteredList(
        filteredList.filter(
          (i) =>
            new Date(`${i.dateTimeUTC}.000Z`).toLocaleDateString() ===
            new Date(date).toLocaleDateString()
        )
      );
    } else {
      setFilteredList(filteredList);
    }
  };

  const handlePagination = (page, size) => {
    setPage(page);
    setPageSize(size);
  };

  const closeCandidateModal = () => {
    dispatch(setShowBasic(true));
    dispatch(setShowComments(false));
    dispatch(setShowCandidate(false));
  };

  return (
    <>
      {open && (
        <PreviewDropdown
          readAll={setAllNotificationsRead}
          dataShort={shortList}
          unread={unreadList.length}
          onClick={notificationClicked}
          setOpenDrawer={setOpenDrawer}
          setOpen={setOpen}
        />
      )}
      <Drawer
        open={openDrawer}
        onClose={closeDrawer}
        placement="right"
        title="Notifications"
        size="large"
        extra={
          <div className="notification-filter-container">
            {!isAdmin && (
              <Button
                className="x-small x-wide no-border no-margin no-caps blue"
                type="button"
                handleClick={setAllNotificationsRead}
                disabled={!unreadList.length}
              >
                Mark All as Read
              </Button>
            )}
            <DatePicker onChange={handleDateFilter} size="small" />
          </div>
        }
      >
        <div className="notifications-menu">
          {tabs.map(tab => (
            <span key={tab.label}
              className={`notifcation-menu-tab ${drawerTab === tab.name ? "focus" : ""}`}
              onClick={() => handleMenuTabClick(tab.name)}
            >
              {tab.label}
            </span>
          ))}
        </div>
        <div className="notifcation-row-container notification-row-elements">
          <Button
            type="button"
            name="select-all-btn"
            handleClick={handleClickSelectAll}
            className="icon-btn warning"
            title="Select/deselect all rows on this page"
          >
            <BarsOutlined />
          </Button>
          <Button
            type="button"
            name="archive-btn"
            handleClick={handleClickDelete}
            className="icon-btn warning"
            disabled={deleteList.length === 0}
            title="Delete selected rows"
          >
            <DeleteOutlined />
          </Button>
          <div className="notification-row-elements">
            Notifications older than 14 days will be deleted
          </div>
        </div>
        <div className="notifications-large-container">
          {filteredList.length ? (
            filteredList.map((record) => (
              <div className="notifcation-row-container" key={`${record.entityName}${record.id}`}>
                <DeleteNotifications
                  id={record.id}
                  deleteList={deleteList}
                  setDeleteList={setDeleteList}
                />
                <Notification
                  record={record}
                  onClick={() => notificationClicked(record)}
                  unread={record.receivers.filter(
                    (item) => item.userId?.id === user.id
                  )}
                  message={service.getMessage(record)}
                  date={service.getMessageDate(record)}
                  author={service.getMessageAuthor(record)}
                />
              </div>
            ))) : (
            <span className="no-notifications-text">No Notifications</span>
          )}
        </div>
        {filteredList.length > 0 && (
          <div className="notification-pagination-container">
            <span className="notifications-pagination-border"></span>
            <Pagination
              size="small"
              current={page}
              onChange={handlePagination}
              total={totalItems}
              showSizeChanger
              defaultPageSize={pageSize}
            />
          </div>
        )}
      </Drawer>
      {user && (
        <>
          <NotificationModal mapper={mapper} />
          <ViewNotificatedCandidate
            onClose={closeCandidateModal}
            show={showCandidate}
            viewOnly
          />
        </>
      )}
    </>
  )
};

export default ViewNotifications;