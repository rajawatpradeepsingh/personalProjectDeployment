import React from "react";
import { config } from "../../../config";
import AuthService from "../../../utils/AuthService";
import { DownloadOutlined } from "@ant-design/icons";
import Button from "../button/button.component";
import "./file-download.css";

function DownloadFile(props) {
  //currently this component is mostly used for candidate resume files,
  //but is being imported into Onboardings as well
  //--- can be refactored to be a generic file download component
  const downloadResumeHandler = (event) => {
    event.preventDefault();
    let headers = JSON.parse(sessionStorage.getItem("headers"));
    fetch(config.serverURL + "/candidates/" + props.candidateId + "/resume", {
      headers,
    })
      .then((res) => {
        if (res.status === 200) {
          const filename = res.headers
            .get("Content-Disposition")
            .split("filename=")[1];
          console.log("resume", res);
          res.blob().then((b) => {
            let url = window.URL.createObjectURL(b);
            let alink = document.createElement("a");
            alink.href = url;
            alink.download = filename;
            alink.click();
          });
        } else if (res.status === 401) {
          AuthService.logout();
        }
      })
      .catch((err) => {
        console.log("Error:", err);
      });
  };

  return (
    <span>
      {props.displayType === "button" && (
        <Button
          type="button"
          name="download-resume-btn"
          className="icon-btn large"
          handleClick={downloadResumeHandler}
        >
          <DownloadOutlined />
        </Button>
      )}

      {props.displayType === "link" && (
        <div className={`download-resume-link-container ${props.className}`}>
          {!props.noLabel && (
            <label className="resume-label">
              {props.required && !props.disabled && (
                <span className="required">*</span>
              )}{" "}
              {props.label ? props.label : "Resume"}
            </label>
          )}
          {props.resume ? (
            <Button
              type="button"
              name="download-resume-btn"
              className="icon-btn small"
              handleClick={downloadResumeHandler}
            >
              <DownloadOutlined /> {props.resume.resumeName}{" "}
            </Button>
          ) : (
            <span className="no-file-text">[no file uploaded]</span>
          )}
        </div>
      )}
    </span>
  );
}

export default DownloadFile;
