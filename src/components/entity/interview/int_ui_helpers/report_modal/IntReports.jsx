import { useMemo } from "react";
import { config } from "../../../../../config";
import auth from "../../../../../utils/AuthService";
import axios from "axios";
import reportFormats from "../../../../utils/reports/reportUtils";
import { reportTableFields } from "../../utils/interviewObjects";
import ReportModal from "../../../../utils/reports/report.modal";

export const IntReports = ({ open, setOpen, interviews, ...props }) => {
  const url = useMemo(() => `${config.serverURL}/interviews`, []);
  const headers = useMemo(() => auth.getHeaders(), []);

  const convertDataForReport = async (
    fileFormatType,
    defaultStatus,
    selectedFields,
    tableFields,
    selectedInterview
  ) => {
    let promisesArray = [];
    let report;

    for (let i = 0; i < interviews.length; i++) {
      promisesArray.push(
        axios.get(`${url}/${interviews[i].id}`, {
          headers,
        })
      );
    }

    return Promise.all(promisesArray).then((results) => {
      if (fileFormatType === "pdf") {
        report = reportFormats.interviewPdfFormat(
          results,
          defaultStatus,
          selectedFields,
          tableFields,
          selectedInterview
        );
      } else {
        report = reportFormats.interviewCSVExcel(
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
      list={interviews.map((int) => ({
        id: int.id,
        name: int.candidate?.fullName,
      }))}
      listLabel="Interviews"
      filename="interview_report"
      tableFields={reportTableFields()}
    />
  );
};
