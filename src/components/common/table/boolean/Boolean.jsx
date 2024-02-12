// import { DashOutlined, CheckSquareTwoTone } from "@ant-design/icons";

export const Boolean = ({ bool, ...props }) => (
  <>
    {bool ? (
      <span style={{ width: "120px", display: "inline-block", textAlign: "center" ,color:"green"}}>
        Completed
      </span>
    ) : (
      <span style={{ width: "120px", display: "inline-block", textAlign: "center" ,color:"red"}}>
        Pending
      </span>
    )}
  </>
);
