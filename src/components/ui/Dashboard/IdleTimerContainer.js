import React, { useRef, useState } from "react";
import IdleTimer from "react-idle-timer/legacy";

import Modal from "react-modal";

Modal.setAppElement("#root");

function IdleTimerContainer() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const IdleTimerRef = useRef(null);
  // const sessionTimeoutRef = useRef(null);

  const onIdle = () => {
    setModalIsOpen(true);
    console.log("You are idle for 5 seconds");
    // sessionTimeoutRef.current = setTimeout(logOut, 5000);
  };

  const logOut = () => {
    setModalIsOpen(false);
    setIsLoggedIn(false);
    console.log("User has logged out");
    // clearTimeout(sessionTimeoutRef.current);
  };

  const stayLoggedIn = () => {
    setModalIsOpen(false);
    console.log("User is active");
    // clearTimeout(sessionTimeoutRef.current);
  };

  //Tab close event
  window.addEventListener("beforeunload", function (e) {
    // Cancel the event
    e.preventDefault(); // If you prevent default behavior in Mozilla Firefox prompt will always be shown
    // Chrome requires returnValue to be set
    e.returnValue = "";
  });

  return (
    <div>
      {isLoggedIn ? <h2> Hello Sharukh </h2> : <h2> You are logged out</h2>}
      <Modal isOpen={modalIsOpen}>
        <h2> You have been Idle for a while</h2>
        <p>You'll be logged out soon</p>
        <button onClick={logOut}>Log me out</button>
        <button onClick={stayLoggedIn}>Keep me signed in</button>
      </Modal>
      <IdleTimer ref={IdleTimerRef} timeout={10000} onIdle={onIdle}></IdleTimer>
    </div>
  );
}

export default IdleTimerContainer;
