import { useMemo } from "react";
import { config } from "../../../../../config";
import auth from "../../../../../utils/AuthService";
import axios from "axios";
import reportFormats from "../../../../utils/reports/reportUtils";
import { reportTableFields } from "../ProjectsObjects";
import ReportModal from "../../../../utils/reports/report.modal";

export const ProjectsReports = ({ open, setOpen, projects, ...props }) => {
  const headers = useMemo(() => auth.getHeaders(), []);

  const convertDataForReport = async (
    fileformattype,
    defaultStatus,
    selectedfields,
    tableFields,
    selectedWorker
  ) => {
    let promisesarray = [];
    let report;

    projects.forEach(project => {
      promisesarray.push(axios.get(`${config.serverURL}/projects/${project.id}`, { headers }));
    })

    return Promise.all(promisesarray).then((results) => {
      if (fileformattype === "pdf") {
        report = reportFormats.workerPdfFormat(
          results,
          defaultStatus,
          selectedfields,
          tableFields,
          selectedWorker
        );
      } else {
        report = reportFormats.projectCSVExcel(
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
      list={projects.map((project) => ({
        id: project.id,
        name: `${project.projectName}`,
      }))}
      listLabel="projects"
      filename="worker_report"
      tableFields={reportTableFields()}
    />
  );
};
