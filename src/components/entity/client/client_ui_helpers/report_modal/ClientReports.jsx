import { useMemo } from "react";
import { config } from "../../../../../config";
import auth from "../../../../../utils/AuthService";
import axios from "axios";
import reportFormats from "../../../../utils/reports/reportUtils";
import { reportTableFields } from "../../client_utils/clientObjects";
import ReportModal from "../../../../utils/reports/report.modal";

export const ClientReports = ({ open, setOpen, clients, ...props }) => {
  const headers = useMemo(() => auth.getHeaders(), []);

  const convertDataForReport = async (
    fileFormatType,
    defaultStatus,
    selectedFields,
    tableFields,
    selectedClient
  ) => {
    let promisesArray = [];
    let report;

    for (let i = 0; i < clients.length; i++) {
      promisesArray.push(
        axios.get(`${config.serverURL}/clients/${clients[i].id}`, {
          headers,
        })
      );
    }

    return Promise.all(promisesArray).then((results) => {
      if (fileFormatType === "pdf") {
        report = reportFormats.clientPdfFormat(
          results,
          defaultStatus,
          selectedFields,
          tableFields,
          selectedClient
        );
      } else {
        report = reportFormats.clientCSVExcel(
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
      list={clients.map((client) => ({
        id: client.id,
        name: client.clientName,
      }))}
      listLabel="Clients"
      filename="client_report"
      tableFields={reportTableFields()}
    />
  );
};