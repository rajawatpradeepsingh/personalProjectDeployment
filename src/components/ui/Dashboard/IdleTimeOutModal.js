import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from "../../../components/common/button/button.component"
import LargeModal from "../../../components/modal/large-modal/large-modal.component";
import PopUp from '../../modal/popup/popup.component';
import SessionPopUp from "../../modal/SessionPopUp/sessionpopup.component";

export const IdleTimeOutModal = ({showModal, handleContinue, handleLogout, remainingTime,closeModal}) => {

    return (
     /*   <Modal show={showModal} onHide={handleContinue}>
            <Modal.Header closeButton>
            <Modal.Title>You Have Been Idle!</Modal.Title>
            </Modal.Header>
            <Modal.Body>Your session is Timed Out. You want to stay?</Modal.Body>
            <Modal.Footer>
            <Button variant="danger" onClick={handleLogout}>
                Logout
            </Button>
            <Button variant="primary" onClick={handleContinue}>
                Continue Session
            </Button>
            </Modal.Footer>
        </Modal>  */
<SessionPopUp
        openModal={showModal}
        closePopUp={closeModal}
        handleConfirmClose={closeModal}
        message={{
          title: "You Have Been Idle!",
          details:
            "Do you want to continue?",
            
        }}
        
      ></SessionPopUp>
        /*  <LargeModal
      header={{ text: "You Have Been Idle!"}}
      open={{showModal} }
      close={{closeModal}}
    >
        <p>
            Your session is Timed Out. You want to stay?
        </p>
         <Button
          type="button"
          
          className="icon-btn large"
          handleClick={handleLogout}
        >
            Logout
        </Button>
          <Button
          type="button"
          
          className="icon-btn large"
          handleClick={handleContinue}
        >Continue Session</Button>
           
    </LargeModal>  */
    )
    
}
 