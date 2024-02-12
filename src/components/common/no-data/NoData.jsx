import { FolderOpenOutlined } from "@ant-design/icons";

export const NoData = () => (
  <div
    style={{
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      color: "var(--tertiary)",
    }}
  >
    <FolderOpenOutlined style={{ fontSize: "40px" }} />
    No Data
  </div>
);
