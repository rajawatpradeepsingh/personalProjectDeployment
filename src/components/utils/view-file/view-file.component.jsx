import React, { useCallback, useEffect, useState } from 'react';
// import FileViewer from 'react-file-viewer';
import { config } from '../../../config';
import './view-file.styles.css';
import LargeModal from '../../../components/modal/large-modal/large-modal.component';

const ViewFile = (props) => {
   const [fileUrl, setFileUrl] = useState("");
   const [fileType, setFileType] = useState("");
   // const [fileName, setFileName] = useState("");

   useEffect(() => {
      if (props.fileType.includes("xml")) {
         setFileType("xlsx");
      } else {
         setFileType(props.fileType);
      }
      // setFileName(props.fileName);
   }, [props.fileType, props.fileName]);

   const getFile = useCallback(async (id, type) => {
      let headers = JSON.parse(sessionStorage.getItem("headers"));
      // let format = "pdf-format"
      // if(type === "xlsx") format = "xlsx-format";

      try {
         const response = await fetch(`${config.serverURL}/${props.module}/${id}/${props.file}`, { headers });
         if (response) {
            let type = response.headers
               .get("Content-Disposition")
               .split("filename=")[1]
               .split(".")
            setFileType(type[type.length - 1])
         }
         const blob = await response.blob();
         if (blob) {
            let url = window.URL.createObjectURL(blob);
            setFileUrl(url);
         }
      } catch (error) {
         console.log(error);
      }

   }, [props.file, props.module]);

   // const downloadFile = (event) => {
   //    event.preventDefault();
   //    let resumeLink = document.createElement('a');
   //    resumeLink.href = fileUrl;
   //    resumeLink.download = fileName;
   //    resumeLink.click();
   // }

   useEffect(() => {
      if (props.showFile && fileType) getFile(props.fileId, fileType);
   }, [props.showFile, fileType, getFile, props.fileId]);

   const closeViewFile = () => {
      setFileType("");
      setFileUrl("");
      // setFileName("");
      props.close()
   }

   if (!props.showFile || !fileUrl) return null

   return (
      <LargeModal open={props.showFile} close={closeViewFile} header={{ text: props.header, buttons: props.downloadFile }}>
         {/* <FileViewer fileType={fileType} filePath={fileUrl}/> */}
      </LargeModal>
   )
}

export default ViewFile;