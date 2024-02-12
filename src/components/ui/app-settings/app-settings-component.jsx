import { Drawer } from "antd";
import ManageDictionaries from "./manage-dictionaries/manage-dictionaries";
import "./app-settings-styles.css";

const AppSettings = ({ open, onClose }) => {
  return (
    <Drawer
      title={`Application Settings`}
      placement="right"
      onClose={onClose}
      open={open}
    >
      <div className="application-settings-content-container">
        <ManageDictionaries />
      </div>
    </Drawer>
  );
};

export default AppSettings;
