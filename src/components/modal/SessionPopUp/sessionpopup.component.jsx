import React from "react";
import Button from "../../../components/common/button/button.component";
import { Modal } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import "../SessionPopUp/sessionpopup.style.scss"

const SessionPopUp = ({ handleContinue,handleLogout, ...props}) => {

  return (
    <Modal
      open={props.openModal}
      onCancel={props.closePopUp}
      footer={null}
      className="popup"
      destroyOnClose={true}
      closable={false}
    >
      <div
        className={`popup-title ${props.type === "warning" || props.type === "error"
          ? "popup-color-warning"
          : props.type === "confirm-change" || props.type?.includes("confirm")
            ? "popup-color-change"
            : "popup-color-success"
          }`}
      >
        <span>{props.message?.title}</span>
        <Button
          type="text"
          name="close-large-modal"
          className="icon-btn large error"
          handleClick={props.closePopUp}
        >
          <CloseOutlined />
        </Button>
      </div>
      <div className="popup-details">
        <span className="popup-text">
          {props.message?.details} {props.link && props.link}
        </span>
        <table>
          <tbody>
          <tr>
            <td>
 <Button
            handleClick={handleContinue}
            type="button"
            className="btn main marginX submit"
          >Continue</Button>
            </td>
            <td>
 <Button
            handleClick={handleLogout}
            type="button"
            className="btn main marginX submit"
            
          >
           Logout
          </Button>
            </td>
          </tr>
          </tbody>
        </table>
         
         
      </div>
     
         
       
    </Modal>
  );
};

export default SessionPopUp;
