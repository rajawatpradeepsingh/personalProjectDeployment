import React, { useState } from 'react';
import axios from "axios";
import { config } from "../../../config";
import Button from '../../common/button/button.component';
import Input from '../../common/input/inputs.component';
import Form from '../../common/form/form.component';
import TextBlock from '../../common/textareas/textareas.component';
import { message } from "antd";
import "./addNotes.css";

const AddNotes = ({ setOpenDrawer, ...props }) => {
  const initialState = {
    title: "",
    description: "",
    isDeleted: false,
  };

  const [formState, setFormState] = useState(initialState);
  const [inputErr] = useState({});
  const headers = JSON.parse(sessionStorage.getItem("headers"));

  const handleChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const openForm = () => {
    setOpenDrawer(true);
  };

  const resetForm = () => {
    setFormState(initialState);
    props.setOpen(false);
  };

  const submitForm = (e) => {
    e.preventDefault();
    const newNote = {
      title: formState.title,
      description: formState.description,
      isDeleted: false,
    };
    axios
      .post(`${config.serverURL}/notes`, newNote, { headers })
      .then((response) => {
        if (response.status === 201) {
          message.success("Note created")
          setFormState(initialState);
          props.loadNotes();
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 409) {
          message.error(error.response)
        }
      });
  };

  return (
    <div className="add-notes-container">
      <div className="add-notes-actions">
        <h2 className="dropdown-heading">New Note</h2>
        <Button
          type="button"
          className="btn transparent blue bg-hover"
          handleClick={openForm}
        >
          View Notes
        </Button>
      </div>

      <div className='note-page'>
        <Form formEnabled={true} onSubmit={submitForm} cancel={resetForm} >

          <Input
            type="text"
            label="Title"
            name="title"
            placeholder={"Title..."}
            value={formState.title}
            onChange={(e) => handleChange(e)}
            errMssg={inputErr["title"]}
            required
          />
          <TextBlock
            type="text"
            label="Description"
            name="description"
            placeholder={"Details..."}
            value={formState.description}
            onChange={(e) => handleChange(e)}
            errMssg={inputErr["description"]}
            style={{ height: "200px", resize: "vertical" }}
            required
          />
        </Form>
      </div>
    </div>
  );
};

export default AddNotes;

