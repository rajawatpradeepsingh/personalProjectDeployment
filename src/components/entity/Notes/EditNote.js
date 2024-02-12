import React, { useEffect, useState } from "react";
import axios from "axios";
import { config } from "../../../config";
import auth from "../../../utils/AuthService";
import { useDispatch, useSelector } from "react-redux";
import { setShowModal } from "../../../Redux/noteSlice";
import LargeModal from "../../modal/large-modal/large-modal.component";
import Form from "../../common/form/form.component";
import Input from "../../common/input/inputs.component";
import { Alert } from "antd";
import TextBlock from "../../common/textareas/textareas.component";

const EditNotes = ({ editNote, ...props }) => {
  const [editedNote, setEditedNote] = useState({});
  const [message, setMessage] = useState("");
  const [headers] = useState(auth.getHeaders());
  const [inputErr, setInputErr] = useState({});
  const dispatch = useDispatch();
  const [formDisabled] = useState(false);
  const { showModal, selectedNote } = useSelector((state) => state.notes);

  const handleChange = (e) => {
    setEditedNote({
      ...editedNote,
      [e.target.name]: e.target.value,
      ...props,
    });
  };

  const closeModal = () => {
    setEditedNote({});
    setMessage("");
    setInputErr({});
    dispatch(setShowModal(false));
  };

  const handleEditNote = (e, noteId) => {
    e.preventDefault();
    if (Object.keys(inputErr).length) {
      setMessage(
        `Fix errors before submitting: ${Object.keys(inputErr).join(", ")}`
      );
      return;
    } else {
      setMessage("");
    }

    const NotePatchInfo = {
      noteId: editedNote?.noteId,
      title: editedNote?.title,
      description: editedNote?.description,
      createdDate: editedNote?.createdDate,
    };
    preSubmitCheck(NotePatchInfo, noteId);
  };

  const preSubmitCheck = (patchInfo, noteId) => {
    axios
      .post(`${config.serverURL}/notes/checks/${noteId}`, patchInfo, {
        headers,
      })
      .then(() => {
        closeModal();
        editNote(patchInfo, noteId);
        props.loadNotes();
      })
      .catch((err) => {});
  };

  useEffect(() => {
    setEditedNote(selectedNote);
  }, [showModal, selectedNote]);

  return (
    <>
      <LargeModal
        open={showModal}
        close={closeModal}
        header={{
          text: `Notes: ${editedNote?.title}`,
        }}
      >
        <Form
          onSubmit={(e) => handleEditNote(e, editedNote.noteId)}
          cancel={closeModal}
          formEnabled={!formDisabled}
        >
          {message && <Alert type="error" showIcon message={message} />}
          <Input
            type="text"
            label="Title"
            name="title"
            placeholder={"Title..."}
            value={editedNote?.title}
            onChange={(e) => handleChange(e)}
            errMssg={inputErr["title"]}
            required
          />
          <TextBlock
            type="text"
            label="Description"
            name="description"
            placeholder={"Enter Note details..."}
            value={editedNote?.description}
            onChange={(e) => handleChange(e)}
            errMssg={inputErr["description"]}
            style={{ height: "200px", resize: "vertical" }}
            required
          />
        </Form>
      </LargeModal>
    </>
  );
};

export default EditNotes;
