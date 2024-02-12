import React, { useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { response } from "msw";
import axios from "axios";
import moment from "moment";
import { config } from "../../../config";
import auth from "../../../utils/AuthService";
import { setShowModal, setSelectedNote } from "../../../Redux/noteSlice";
import { setIsAuth } from "../../../Redux/appSlice";
import EditNotes from "./EditNote";
import AddNotes from "./AddNotes";
import Button from "../../common/button/button.component";
import PopUp from "../../modal/popup/popup.component";
import { Pagination, Drawer, Checkbox, message } from "antd";
import { FormOutlined, EditFilled, DeleteOutlined } from "@ant-design/icons";
import "./viewNotes.css";

const ViewNote = () => {
  const dispatch = useDispatch();
  const [headers] = useState(auth.getHeaders());
  const [openPopUp, setOpenPopUp] = useState(false);
  const [openNotes, setOpenNotes] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [noteList, setNoteList] = useState({});
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedNotes, setSelectedNotes] = useState([]);

  const logout = useCallback(() => {
    dispatch(setIsAuth(false));
    auth.logout();
  }, [dispatch]);

  const loadNotes = useCallback(async () => {
    try {
      const user = auth.getUserInfo();
      const url = `/notes?pageNo=${currentPage - 1}&pageSize=${pageSize}&user=${user.username}`;
      const response = await axios.get(`${config.serverURL}${url}`, { headers });
      if (response.data) {
        setTotalItems(response.headers["total-elements"]);
        setNoteList(response.data);
      }
    } catch (error) {
      console.log(error);
      if (response.status === 201) {
        loadNotes();
        setShowModal(true);
        logout();
      }
    }
  }, [currentPage, pageSize, headers, logout]);


  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  const changeTablePage = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const closeDrawer = () => {
    setOpenDrawer(false);
    setOpenNotes(false);
  };

  const archiveNote = () => {
    axios
      .all(
        selectedNotes.map((noteId) =>
          axios.delete(`${config.serverURL}/notes/${noteId}`, { headers })
        )
      )
      .then((res) => {
        setSelectedNotes([]);
        loadNotes();
      })
      .catch((error) => {
        console.log(error);
        if (error.response && error.response.status === 401) {
          logout();
        }
      });
  };

  const handlePopUpSubmit = () => {
    archiveNote();
    setOpenPopUp(false);
  };

  const handlePopUpCancel = () => {
    setOpenPopUp(false);
  };

  const toggleNotes = () => setOpenNotes((prev) => !prev);

  const toggleEditModal = (noteId) => {
    window.scrollTo(0, 0);

    axios
      .get(`${config.serverURL}/notes/${noteId}`, { headers })
      .then((response) => {
        if (response.data) {
          dispatch(setSelectedNote(response.data));
          dispatch(setShowModal(true));
        }
      })
      .catch((error) => {
        console.log(error);
        if (error.response && error.response.status === 401) {
          logout();
        }
      });
  };

  const editNote = (notePatchInfo, noteId) => {
    axios
      .patch(
        `${config.serverURL}/notes/${noteId}`,
        notePatchInfo,
        {
          headers,
        }
      )
      .then((response) => {
        loadNotes();
        message.success({
          content: "Note updated!",
          duration: 5,
          style: { marginTop: "5%" },
        });
      })
      .catch((error) => {
        console.log(error);
        if (error.response && error.response.status === 401) {
          logout();
        }
        message.error({
          content: `An error occurred while saving changes (${error.response?.status})`,
          duration: 10,
        });
      });
  };

  useEffect(() => {
    if (!openNotes && !openDrawer) {
      setCurrentPage(1);
    }
  }, [openNotes, openDrawer]);

  const closeAddNotes = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setOpenNotes(false);
    }
  };

  const handleCheck = (event) => {
    const { id, checked } = event.target;
    if (checked) {
      setSelectedNotes([...selectedNotes, id])
    } else {
      setSelectedNotes(selectedNotes.filter(nID => +nID !== +id))
    }
  }

  return (
    <div className="notes-bar-container" tabIndex={0} onBlur={closeAddNotes}>
      <Button
        type="button"
        handleClick={toggleNotes}
        className="transparent w-ful"
      >
        <FormOutlined className="icon" />
        Notes
      </Button>

      {openNotes && (
        <AddNotes
          setOpenDrawer={setOpenDrawer}
          setOpen={setOpenNotes}
          setNoteList={setNoteList}
          loadNotes={loadNotes}
        />
      )}
      <Drawer
        open={openDrawer}
        onClose={closeDrawer}
        placement="right"
        title="Notes"
        size="large"
      >
        {selectedNotes.length > 0 && (
          <div className="note-delete-btn-container">
            <Button
              type="button"
              className={"btn main reset"}
              handleClick={() => setOpenPopUp(true)}
            >
              <DeleteOutlined className="icon" />
              Delete Note(s)
            </Button>
          </div>
        )}
        <div className="note-list-container">
          {noteList.length > 0 &&
            noteList.map((note) => (
              <div className="note-container" key={note.noteId}>
                <div className="note-header">
                  <Checkbox id={`${note.noteId}`} onChange={handleCheck} />
                  <div
                    className="note-title"
                    onClick={() => toggleEditModal(note.noteId)}
                  >
                    {note.title}
                    <EditFilled className="edit-note-icon" />
                  </div>
                </div>
                <div className="note-date">
                  {moment(note?.createdDate).format("MM/DD/YYYY")}
                </div>
                <div className="note-body">{note.description}</div>
              </div>
            ))}
        </div>
        <div className="notes-pagination-container">
          <Pagination
            size="small"
            current={currentPage}
            onChange={changeTablePage}
            total={totalItems}
            showSizeChanger
            defaultPageSize={pageSize}
          />
        </div>
        <EditNotes editNote={editNote} loadNotes={loadNotes}></EditNotes>
        <PopUp
          openModal={openPopUp}
          type={"confirm"}
          confirmValue="Confirm"
          cancelValue="Cancel"
          handleConfirmClose={handlePopUpSubmit}
          closePopUp={handlePopUpCancel}
          message={{
            title: "Confirm Action",
            details: `Are you sure you want to delete the note(s)?`,
          }}
        ></PopUp>
      </Drawer>
    </div>
  );
}

export default ViewNote;
