import { useMemo } from "react";
import { config } from "../../../../../config";
import auth from "../../../../../utils/AuthService";
import axios from "axios";
import reportFormats from "../../../../utils/reports/reportUtils";
import { reportTableFields } from "../../onboard_utils/onBoardingObjects";
import ReportModal from "../../../../utils/reports/report.modal";

export const OnboardReports = ({ open, setOpen, onboards, ...props }) => {
  const headers = useMemo(() => auth.getHeaders(), []);

  const convertDataForReport = async (
    fileFormatType,
    defaultStatus,
    selectedFields,
    tableFields,
    selectedOnboarding
  ) => {
    let promisesArray = [];
    let report;

    for (let i = 0; i < onboards.length; i++) {
      promisesArray.push(
        axios.get(`${config.serverURL}/onboarding/${onboards[i].id}`, {
          headers,
        })
      );
    }

    return Promise.all(promisesArray).then((results) => {
      if (fileFormatType === "pdf") {
        report = reportFormats.onboardingPdfFormat(
          results,
          defaultStatus,
          selectedFields,
          tableFields,
          selectedOnboarding
        );
      } else {
        report = reportFormats.onboardingCSVExcel(
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
      list={onboards.map((onb) => ({
        id: onb.id,
        name: onb.candidateName,
      }))}
      listLabel="Onboarding"
      filename="onboarding_report"
      tableFields={reportTableFields()}
    />
  );
};
