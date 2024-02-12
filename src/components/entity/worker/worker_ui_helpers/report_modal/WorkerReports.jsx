import { useMemo } from "react";
import { config } from "../../../../../config";
import auth from "../../../../../utils/AuthService";
import axios from "axios";
import reportFormats from "../../../../utils/reports/reportUtils";
import { reportTableFields } from "../../worker_utils/workerObjects";
import ReportModal from "../../../../utils/reports/report.modal";

export const WorkerReports = ({ open, setOpen, workers, ...props }) => {
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

    workers.forEach(worker => {
      promisesarray.push(axios.get(`${config.serverURL}/worker/${worker.id}`, { headers }));
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
        report = reportFormats.workerCSVExcel(
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
      list={workers.map((worker) => ({
        id: worker.id,
        name: `${worker.firstName + " " + worker.lastName}`,
      }))}
      listLabel="Workers"
      filename="worker_report"
      tableFields={reportTableFields()}
    />
  );
};
