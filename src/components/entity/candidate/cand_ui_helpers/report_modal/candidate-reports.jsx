import { useMemo } from "react";
import { config } from "../../../../../config";
import auth from "../../../../../utils/AuthService";
import axios from "axios";
import reportFormats from "../../../../utils/reports/reportUtils";
import { reportTableFields } from "../../utils/candidateObjects";
import ReportModal from "../../../../utils/reports/report.modal";

export const CandidateReports = ({ open, setOpen, candidates, ...props }) => 
{
   const url = useMemo(() => `${config.serverURL}/candidates`, []);
   const headers = useMemo(() => auth.getHeaders(), []);

   const convertDataForReport = async (
      fileFormatType,
      defaultStatus,
      selectedFields,
      tableFields,
      candidate
   ) => {
      let promisesArray = [];
      let report;

      for (let i = 0; i < candidates.length; i++) {
         promisesArray.push(
            axios.get(`${url}/${candidates[i].id}`, { headers })
         );
      }

      return Promise.all(promisesArray).then((results) => {
         if (fileFormatType === "pdf") {
            report = reportFormats.candidatePDF(
               results,
               defaultStatus,
               selectedFields,
               tableFields,
               candidate
            );
         } else {
            report = reportFormats.candidateCSVExcel(
               results,
               defaultStatus,
               selectedFields,
               tableFields
            );
         }
         return report;
      });
   };

   return (
      <ReportModal
         showReportModal={open}
         setShowReportModal={setOpen}
         convertDataForReport={convertDataForReport}
         list={candidates.map((cand) => ({
            id: cand.id,
            name: `${cand.fullName}`,
         }))}
         listLabel="Candidates"
         filename="candidate_report"
         tableFields={reportTableFields()}
      />
   )
}