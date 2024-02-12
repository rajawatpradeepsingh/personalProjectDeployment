import { useMemo } from "react";
import { config } from "../../../../../config";
import auth from "../../../../../utils/AuthService";
import axios from "axios";
import reportFormats from "../../../../utils/reports/reportUtils";
import { calenderModalHeaders } from "./calenderObjects.js";
import ReportModal from "../../../../utils/reports/report.modal";

export const CalenderReports = ({ open, setOpen, calender, ...props }) => {
  const headers = useMemo(() => auth.getHeaders(), []);

  const convertDataForReport = async (
    fileFormatType,
    defaultStatus,
    selectedFields,
    tableFields,
    selectedCalender
  ) => {
    let promisesArray = [];
    let report;

    for (let i = 0; i < calender.length; i++) {
      promisesArray.push(
        axios.get(`${config.serverURL}/calender/${calender[i].id}`, {
          headers,
        })
      );
    }

    return Promise.all(promisesArray).then((results) => {
      if (fileFormatType === "pdf") {
        report = reportFormats.calenderPdfFormat(
          results,
          defaultStatus,
          selectedFields,
          tableFields,
         selectedCalender        );
      } else {
        report = reportFormats.calenderCSVExcel(
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
      list={cal.map((cal) => ({
        id: cal.id,
        name: cal.calender_status,
      }))}
      listLabel="Calender"
      filename="calender_report"
      tableFields={calenderModalHeaders()}
    />
  );
};