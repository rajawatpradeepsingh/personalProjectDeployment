import { useMemo } from "react";
import { config } from "../../../../../config";
import auth from "../../../../../utils/AuthService";
import axios from "axios";
import reportFormats from "../../../../utils/reports/reportUtils";
import { reportTableFields } from "../../job_utils/jobObjects";
import ReportModal from "../../../../utils/reports/report.modal";

export const JobReports = ({ open, setOpen, jobs, ...props }) => {
  const headers = useMemo(() => auth.getHeaders(), []);

  const convertDataForReport = async (
    fileFormatType,
    defaultStatus,
    selectedFields,
    tableFields,
    selectedJobOpening
  ) => {
    let promisesArray = [];
    let report;

    for (let i = 0; i < jobs.length; i++) {
      promisesArray.push(
        axios.get(`${config.serverURL}/jobopenings/${jobs[i].id}`, {
          headers,
        })
      );
    }

    return Promise.all(promisesArray).then((results) => {
      if (fileFormatType === "pdf") {
        report = reportFormats.jobPdfFormat(
          results,
          defaultStatus,
          selectedFields,
          tableFields,
          selectedJobOpening
        );
      } else {
        report = reportFormats.jobCSVExcel(
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
      list={jobs?.map((job) => ({ id: job.id, name: job.jobTitle }))}
      listLabel="Job Openings"
      filename="job_opening_report"
      tableFields={reportTableFields()}
    />
  );
};
