import "./editModal.scss";

export const EditModal = (props) => {
  return (
    <div className={props.showModal ? "edit-modal" : "hide-modal"}>
      {props.children}
    </div>
  );
};
