import { Modal } from "antd";

const LargeModal = (props) => {
  const bodyStyle = { maxHeight: "90vh", minHeight: props.minHeight ? props.minHeight : "15vh", overflowY: "auto", padding: "8px 20px" };

  return (
    <Modal
      id="large-modal"
      open={props.open}
      onCancel={props.close}
      title={props.header.text}
      centered
      footer={null}
      width={900}
      bodyStyle={{ ...bodyStyle, ...props.bodyStyle }}
    >
      {props.header.buttons && props.header.buttons}

      {props.children}
    </Modal>
  );
};

export default LargeModal;
