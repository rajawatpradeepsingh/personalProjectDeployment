// import { BsFillChatRightTextFill } from "react-icons/bs";
import { CreditCardOutlined } from "@ant-design/icons";

export const formNavEditSteps = () => [
  
 
    {
      title: "Fees Details",
      icon: (
        <CreditCardOutlined
          style={{
            color: "var(--secondary-muted)",
            fontSize: "18px",
            marginBottom: "1px",
          }}
        />
      ),
      status: "finish",
    },
    
  ];
  
  export const reportTableFields = () =>[
    {
      label: "Worker Status",
      value: "workerStatus",
      key: "workerStatus",
    },

    { 
      label: "Client", 
      value: "client", 
      key: "client" 
    },
    { 
      label: "VMS Provider", 
      value: "customer", 
      key: "customer" 
    },
    { 
      label: "Pass Thur", 
      value: "source", 
      key: "source" 
    },
    { 
      label: "seller", 
      value: "seller", 
      key: "seller" 
    },
    { 
      label: "recruiter", 
      value: "recruiter", 
      key: "recruiter" 
    },

  ];

  
export const archiveModalHeaders = () => [
  "Worker",
  "Client",
  "Worker Status",
  "VMS Provider",
  "Pass-thur ",
  "seller",
  "recruiter"
];