import { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { config } from "../../../../../config";
import AuthService from "../../../../../utils/AuthService";
import { EditZoomMeeting } from "./EditZoomMeeting";
import { setIsAuth } from "../../../../../Redux/appSlice";
import { useDispatch, useSelector } from "react-redux";
import PopUp from "../../../../modal/popup/popup.component";
import Content from "../../../../container/content-container/content-container.component";
import ExpandableTable from "../../../../ui/expandable-table/expandable-table.component";
import { DeleteOutlined } from "@ant-design/icons";
import Button from "../../../../common/button/button.component";
import Breadcrumbs from "../../../../common/breadcrumbs/breadcrumbs.component";

const ViewZoomMeetings = () => {
  const [meetings, setMeetings] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState({});
  const [openPopUp, setOpenPopUp] = useState(false);
  const [deleteID, setDeleteID] = useState();
  const [headers] = useState(AuthService.getHeaders());
  const history = useHistory();
  const dispatch = useDispatch();
  const { navMenuOpen } = useSelector((state) => state.nav);

  const logout = useCallback(() => {
    AuthService.logout();
    dispatch(setIsAuth(false));
  }, [dispatch]);

  const loadMeetingsList = useCallback(() => {
    axios
      .get(`${config.serverURL}/zoom/meetings/list`, { headers })
      .then((res) => {
        if (res.data) {
          setMeetings(res.data.meetings);
        }
      })
      .catch((err) => {
        setMeetings([]);
        if (err.response && err.response.status === 401) {
          logout();
        }
      });
  }, [headers, logout]);

  useEffect(() => {
    loadMeetingsList();
  }, [loadMeetingsList, headers]);

  const handleEditForm = (id) => {
    axios
      .get(`${config.serverURL}/zoom/meeting/${id}`, { headers })
      .then((response) => {
        if (response.data) {
          setSelectedMeeting(response.data);
          setShowModal(true);
        }
      })
      .catch((err) => {
        console.log(err);
        if (err.response && err.response.status === 401) {
          logout();
        }
        setShowModal(true);
      });
  };

  const handleSubmitForm = (id, requestBody) => {
    axios
      .patch(
        `${config.serverURL}/zoom/meeting/${id}`,
        { ...requestBody },
        { headers }
      )
      .then(() => {
        const updList = meetings.map((meeting) =>
          meeting.id === id ? { ...meeting, ...requestBody } : meeting
        );
        setMeetings(updList);
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          logout();
        }
      });
  };

  const handleDelete = (e, id) => {
    setDeleteID(id);
    setOpenPopUp(true);
  };

  const handlePopUpSubmit = () => {
    axios
      .delete(`${config.serverURL}/zoom/meeting/delete/${deleteID}`, {
        headers,
      })
      .then(() => setMeetings(meetings.filter((item) => item.id !== deleteID)))
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          logout();
        }
      });
    setOpenPopUp(false);
  };

  const handlePopUpCancel = () => {
    setDeleteID(null);
    setOpenPopUp(false);
  };

  const closeForm = () => {
    history.push("/viewinterviews");
  };

  return (
    <div
      className={navMenuOpen ? "page-container" : "page-container full-width"}
    >
      <div className="page-actions-container">
        <Breadcrumbs
          className="header"
          crumbs={[
            { id: 0, text: "Interviews", onClick: () => closeForm() },
            {
              id: 1,
              text: "Manage Auto-Generated Zoom Meetings",
              lastCrumb: true,
            },
          ]}
        />
      </div>
      <Content>
        <p className="records-count">
          Total records: <span>{meetings.length}</span>
        </p>
        <ExpandableTable
          headers={[
            {
              label: (
                <DeleteOutlined
                  style={{ fontSize: "20px", marginLeft: "5px" }}
                />
              ),
            },
            { label: "Client" },
            { label: "Agenda" },
            { label: "Start Time" },
            { label: "Time Zone" },
          ]}
          body={
            meetings.length
              ? meetings.map((meeting) => ({
                  id: meeting.id,
                  cells: [
                    {
                      id: 0,
                      data: (
                        <Button
                          type="button"
                          handleClick={() => handleDelete(meeting.id)}
                          className="icon-btn delete"
                        >
                          <DeleteOutlined
                            style={{ fontSize: "20px", marginLeft: "2px" }}
                          />
                        </Button>
                      ),
                    },
                    {
                      id: 1,
                      data: meeting.topic,
                      onClick: () => handleEditForm(meeting.id),
                      className: "clickable",
                    },
                    { id: 2, data: meeting.agenda },
                    { id: 3, data: meeting.start_time },
                    { id: 4, data: meeting.timezone },
                  ],
                }))
              : []
          }
        />

        <EditZoomMeeting
          showModal={showModal}
          setShowModal={setShowModal}
          meeting={selectedMeeting}
          handleSubmitForm={handleSubmitForm}
        ></EditZoomMeeting>
        <PopUp
          openModal={openPopUp}
          type={"warning"}
          confirmValue="DELETE"
          cancelValue="CANCEL"
          handleConfirmClose={handlePopUpSubmit}
          closePopUp={handlePopUpCancel}
          message={{
            title: "Warning",
            details: `Are you sure you want to delete the entry?`,
          }}
        ></PopUp>
      </Content>
    </div>
  );
};

export default ViewZoomMeetings;
