import Checkbox from "antd/lib/checkbox/Checkbox";

export const DeleteNotifications = (props) => {
  const toggleCheck = (value) => {
    return props.deleteList.filter((d) => d === value).length > 0
      ? props.deleteList.filter((d) => d !== value)
      : [...props.deleteList, value];
  };

  const handleCheckBoxChange = (e) => {
    props.setDeleteList(toggleCheck(+e.target.id));
  };

  return (
    <>
      <Checkbox
        style={{ padding: 0, marginTop: "1px", marginRight: "4px" }}
        id={`${props.id}`}
        onChange={handleCheckBoxChange}
        checked={props.deleteList.filter((i) => i === +props.id).length > 0}
      />
    </>
  );
};

export default DeleteNotifications;
