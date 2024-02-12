import { useMemo } from "react";
import { config } from "../../../../../config";
import auth from "../../../../../utils/AuthService";
import axios from "axios";
import reportFormats from "../../../../utils/reports/reportUtils";
import{reportTableFields} from "./ParameterObjects.js";
import ReportModal from "../../../../utils/reports/report.modal";

export const ParameterReports = ({ open, setOpen, calender, ...props }) => {
  const headers = useMemo(() => auth.getHeaders(), []);

  const convertDataForReport = async (
    fileFormatType,
    defaultStatus,
    selectedFields,
    tableFields,
    selectedParameter
  ) => {
    let promisesArray = [];
    let report;

    for (let i = 0; i < param.length; i++) {
      promisesArray.push(
        axios.get(`${config.serverURL}/parameter/${param[i].id}`, {
          headers,
        })
      );
    }

    return Promise.all(promisesArray).then((results) => {
      if (fileFormatType === "pdf") {
        report = reportFormats.parameterPdfFormat(
          results,
          defaultStatus,
          selectedFields,
          tableFields,
          selectedParameter        );
      } else {
        report = reportFormats.parameterCSVExcel(
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
      list={param.map((param) => ({
        id: param.id,
        name: param.paramType,
      }))}
      listLabel="parameter"
      filename="parameter_report"
      tableFields={reportTableFields()}
    />
  );
};