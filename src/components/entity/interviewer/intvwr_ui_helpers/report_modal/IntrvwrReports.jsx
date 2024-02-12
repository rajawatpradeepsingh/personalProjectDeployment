import { useMemo } from "react";
import { config } from "../../../../../config";
import auth from "../../../../../utils/AuthService";
import axios from "axios";
import reportFormats from "../../../../utils/reports/reportUtils";
import { reportTableFields } from "../../intvwr_utils/interviewerObjects";
import ReportModal from "../../../../utils/reports/report.modal";

export const IntrvwrReports = ({ open, setOpen, interviewers, ...props }) => {
  const headers = useMemo(() => auth.getHeaders(), []);

  const convertDataForReport = async (
    fileformattype,
    defaultStatus,
    selectedfields,
    tableFields,
    selectedinterviewer
  ) => {
    let promisesarray = [];
    let report;

    for (let i = 0; i < interviewers.length; i++) {
      promisesarray.push(
        axios.get(`${config.serverURL}/interviewer/${interviewers[i].id}`, {
          headers,
        })
      );
    }

    return Promise.all(promisesarray).then((results) => {
      if (fileformattype === "pdf") {
        report = reportFormats.interviewerPdfFormat(
          results,
          defaultStatus,
          selectedfields,
          tableFields,
          selectedinterviewer
        );
      } else {
        report = reportFormats.interviewerCSVExcel(
          results,
          defaultStatus,
          selectedfields,
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
      list={interviewers.map((int) => ({
         id: int.id,
         name: `${int.firstName} ${int.lastName}`,
      }))}
      listLabel="Interviewers"
      filename="interviewer_report"
      tableFields={reportTableFields()}
    />
  );
};
