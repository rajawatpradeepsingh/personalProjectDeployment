import { useState, useEffect } from 'react';
import ViewFile from "../../../../utils/view-file/view-file.component";
import DownloadFile from "../../../../common/file-download/DownloadFile";

export const CandidateResume = ({show, ...props}) => {
   const [fileId, setFileId] = useState("");
   const [fileType, setFileType] = useState("");
   const [fileName, setFileName] = useState("");

   useEffect(() => {
      if (show) {
         setFileId(show.id);
         setFileType(show.resume.resumeType.split("/")[1]);
         setFileName(show.resume.resumeName);
      }
   }, [show]);

   const handleClose = () => {
      props.setShow(null);
      setFileId("");
      setFileType("");
      setFileName("");
   }

   return (
     <ViewFile
       showFile={show ? true : false}
       module={"candidates"}
       file="resume"
       fileId={fileId}
       fileType={fileType}
       fileName={fileName}
       header={"Resume"}
       close={handleClose}
       downloadFile={
         <DownloadFile
           candidateId={fileId}
           resume={null}
           displayType="button"
         />
       }
     />
   );
}