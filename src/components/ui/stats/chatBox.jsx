import React, { useState, useEffect, useCallback, useRef } from "react";
import "./chatbox.css";
import { CloseCircleOutlined, SendOutlined } from "@ant-design/icons";
import axios from "axios";
import auth from "../../../utils/AuthService";
import { config } from "../../../config";
import { useDispatch } from "react-redux";
import { setIsAuth } from "../../../Redux/appSlice";
import { message } from "antd";
import PopUp from "../../modal/popup/popup.component";
import InputEmoji from 'react-input-emoji';

const ChatBox = () => {
  const headers = JSON.parse(sessionStorage.getItem("headers"));
  const [messages, setMessages] = useState([]);
  const dispatch = useDispatch();
  const initialState = {
    message: "",
    isDeleted: false,
  };
  const [formState, setFormState] = useState(initialState);
  const chatboxRef = useRef(null);
  const [openPopUp, setOpenPopUp] = useState(false);
  const [selectedFeedId, setSelectedFeedId] = useState(null);
  const [editedMessage, setEditedMessage] = useState("");
  const [selectedFeedIdForPopUp, setSelectedFeedIdForPopUp] = useState(null);
  const [reactions, setReactions] = useState({});
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMessage, setContextMessage] = useState(null);
  const [contextMenuPosition, setContextMenuPosition] = useState({ top: 0, left: 0 });

  const handleAddReaction = (feedId, reaction) => {
    setReactions((prevReactions) => ({
      ...prevReactions,
      [feedId]: reaction,
    }));
    handleClearContextMenu();
  };

  const getReactionIcon = (feedId) => {
    const reaction = reactions[feedId];
    switch (reaction) {
      case 'heart':
        return '❤️';
      case 'thumbsUp':
        return '👍';
      default:
        return null;
    }
  };

  const handleClearContextMenu = () => {
    setShowContextMenu(false);
    setContextMessage(null);
  };

  const formatUpdatedOnDate = (updatedOn) => {
    const today = new Date();
    const updatedDate = new Date(updatedOn);

    if (today.toDateString() === updatedDate.toDateString()) {
      return "Today";
    }

    today.setDate(today.getDate() - 1);
    if (today.toDateString() === updatedDate.toDateString()) {
      return "Yesterday";
    }

    const options = { year: "numeric", month: "short", day: "numeric" };
    return updatedDate.toLocaleDateString(undefined, options);
  };

  const groupMessagesByUpdatedOn = (messages) => {
    const groupedMessages = {};
    for (const message of messages) {
      const updatedOn = message.updatedOn;
      if (!groupedMessages[updatedOn]) {
        groupedMessages[updatedOn] = [];
      }
      groupedMessages[updatedOn].push(message);
    }
    return groupedMessages;
  };

  const logout = useCallback(() => {
    dispatch(setIsAuth(false));
    auth.logout();
  }, [dispatch]);

  const getAllFeed = useCallback(async () => {
    try {
      const response = await axios.get(`${config.serverURL}/feed/getAll`, { headers });

      if (response.data) {
        const sortedMessages = response.data.sort((a, b) => b.timestamp - a.timestamp);
        setMessages(sortedMessages);
      }
    } catch (error) {
      console.log(error);
      if (error.response && error.response.status === 401) {
        logout();
      }
    }
  }, [headers, logout]);

  useEffect(() => {
    getAllFeed();
  }, []);

  const AddFeed = async (e) => {
    e.preventDefault();
    const newMsg = {
      message: formState.message,
      isDeleted: false,
    };

    try {
      const response = await axios.post(`${config.serverURL}/feed`, newMsg, { headers });

      if (response.status === 201) {
        message.success("Message delivered");
        setFormState({ ...formState, message: '' });
        getAllFeed();
      }
    } catch (error) {
      console.log(error);
      if (error.response && error.response.status === 409) {
        message.error(error.response);
      }
    }
  };

  const editMessage = async (feedId, updatedMessage, e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        `${config.serverURL}/feed/${feedId}`,
        { message: updatedMessage },
        { headers }
      );

      if (response.status === 200) {
        message.success("Message updated");
        const updatedMessages = messages.map((message) =>
          message.feedId === feedId ? { ...message, message: updatedMessage } : message
        );
        getAllFeed();
        setMessages(updatedMessages);
        setSelectedFeedId(null);
        setEditedMessage("");
        setFormState({ ...formState, message: '' });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (feedId) => {
    try {
      const response = await axios.delete(`${config.serverURL}/feed/${feedId}`, { headers });

      if (response.status === 200) {
        getAllFeed();
      } else {
        message.error("Message deletion failed");
      }
    } catch (error) {
      console.log(error);
      message.error("An error occurred while deleting the message");
    }
  };

  const handleDeleteMessage = async (feedId) => {
    setSelectedFeedIdForPopUp(feedId);
    setOpenPopUp(true);
  };

  const handlePopUpSubmit = () => {
    if (selectedFeedIdForPopUp) {
      setOpenPopUp(false);
      handleDelete(selectedFeedIdForPopUp);
    }
  };

  const handlePopUpCancel = () => {
    setOpenPopUp(false);
    setSelectedFeedIdForPopUp(null);
  };

  const handleEditClick = (feedId, message) => {
    setSelectedFeedId(feedId);
    setEditedMessage(message);
  };

  const handleCancelEdit = () => {
    setSelectedFeedId(null);
    setEditedMessage("");
    setFormState({ ...formState, message: '' });
  };

  const user = auth.getUserInfo();

  const getFirstChar = (str) => {
    const firstChars = str
      ?.split(" ")
      .map((word) => word[0])
      .join("");

    return firstChars;
  };

  const handleContextMenu = (e, message) => {
    e.preventDefault();
    setContextMessage(message);
    setContextMenuPosition({ top: e.clientY, left: e.clientX });
    setShowContextMenu(true);
  };

  useEffect(() => {
    const handleContextMenuClear = (e) => {
      if (showContextMenu && !e.target.closest(".context-menu")) {
        handleClearContextMenu();
      }
    };

    window.addEventListener("click", handleContextMenuClear);

    return () => {
      window.removeEventListener("click", handleContextMenuClear);
    };
  }, [showContextMenu]);

  const handleKeyPress = async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      if (!formState.message.trim()) {
        message.warning("Cannot send empty message");
        return;
      }

      if (selectedFeedId) {
        editMessage(selectedFeedId, formState.message, e);
      } else {
        AddFeed(e);
      }
    }
  };

  return (
    <div className="chatbox">
      <h2 className="title">Group Discussion</h2>
      <div className="message-container">
        <div className="chat-messages" ref={chatboxRef}>
          {Object.keys(groupMessagesByUpdatedOn(messages))
            .sort()
            .map((updatedOn) => {
              const formattedDate = formatUpdatedOnDate(updatedOn);
              const messagesForDate = groupMessagesByUpdatedOn(messages)[updatedOn];

              return (
                <div key={updatedOn}>
                  <div className="message-updated-on">{formattedDate}</div>
                  {messagesForDate.map((message) => (
                    <div key={message.feedId} className={`message-wrapper`} onContextMenu={(e) => handleContextMenu(e, message)}>
                      <div className={`updatedBy ${user.username === message.updatedBy ? "sender" : "receiver"}`}>
                        {message.updatedBy},{message.updatedTime.toUpperCase()} - {getFirstChar(message.timeZone)}
                      </div>
                      <div className="message-content">
                        {getReactionIcon(message.feedId) && (
                          <span className="reaction">{getReactionIcon(message.feedId)}</span>
                        )}
                      </div>
                      <div className={`message ${user.username === message.updatedBy ? "sender" : "receiver"}`}>
                        {selectedFeedId === message.feedId ? (
                          <div className="message-content">
                          </div>
                        ) : (
                          <div className="message-content">{message.message}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
        </div>
      </div>
      <div className="msg">
        <InputEmoji
          type="text"
          name="message"
          value={editedMessage || formState.message}
          onChange={(message) => setFormState({ ...formState, message })}
          placeholder={selectedFeedId ? "Type your edited message..." : "Type your message..."}
          onKeyDown={handleKeyPress}
          required
        />
        {/* <SendOutlined className="icon" onClick={handleKeyPress} /> */}
        {formState.message.trim() && selectedFeedId === null && <SendOutlined className="icon" onClick={AddFeed} />}
        {selectedFeedId !== null && (
          <CloseCircleOutlined className="edit-icon" onClick={handleCancelEdit} />
        )}
        {openPopUp && (
          <PopUp
            openModal={openPopUp}
            type={"warning"}
            confirmValue="Delete"
            cancelValue="CANCEL"
            handleConfirmClose={handlePopUpSubmit}
            closePopUp={handlePopUpCancel}
            message={{
              title: "Warning",
              details: `Are you sure you want to delete the message?`,
            }}
          />
        )}
      </div>
      {showContextMenu && contextMessage && (
        <div className="context-menu" style={{ top: contextMenuPosition.top, left: contextMenuPosition.left }}>
          {user.username !== contextMessage.updatedBy && (
            <>
              <div onClick={() => handleAddReaction(contextMessage.feedId, 'heart')}>❤️ </div>
              <div onClick={() => handleAddReaction(contextMessage.feedId, 'thumbsUp')}>👍 </div>
            </>
          )}
          {user.username === contextMessage.updatedBy && (
            <div onClick={() => handleEditClick(contextMessage.feedId, contextMessage.message)}>Edit</div>
          )}
          {user.username === contextMessage.updatedBy && (
            <div onClick={() => handleDeleteMessage(contextMessage.feedId)}>Delete</div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatBox;
