import { useMemo } from "react";
import { config } from "../../../../../config";
import auth from "../../../../../utils/AuthService";
import axios from "axios";
import reportFormats from "../../../../utils/reports/reportUtils";
import ReportModal from "../../../../utils/reports/report.modal";

export const SuppReports = ({ open, setOpen, suppliers, ...props }) => {
  const headers = useMemo(() => auth.getHeaders(), []);

  const convertDataForReport = async (
    fileformattype,
    defaultStatus,
    selectedfields,
    tableFields,
    selectedSupplier
  ) => {
    let promisesarray = [];
    let report;

    for (let i = 0; i < suppliers.length; i++) {
      promisesarray.push(
        axios.get(`${config.serverURL}/supplier/${suppliers[i].id}`, {
          headers,
        })
      );
    }

    return Promise.all(promisesarray).then((results) => {
      if (fileformattype === "pdf") {
        report = reportFormats.supplierPdfFormat(
          results,
          defaultStatus,
          selectedfields,
          tableFields,
          selectedSupplier
        );
      } else {
        report = reportFormats.supplierCSVExcel(
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
      list={suppliers.map((supplier) => ({
        id: supplier.id,
        name: `${supplier.firstName + " " + supplier.lastName}`,
      }))}
      listLabel="Supplier"
      filename="supplier_report"
      tableFields={[
        {
          label: "Supplier",
          value: "supplierCompanyName",
          key: "supplierCompanyName",
        },

        { label: "Contact ", value: "phone_no", key: "phone_no" },
        { label: "Email", value: "email", key: "email" },

        {
          label: "Status",
          value: "status",
          key: "status",
        },
        { label: "Location", value: "location", key: "location" },
        { label: "NetTerms", value: "netTerms", key: "netTerms" },
        { label: "W-8Ben", value: "w8Bene", key: "w8Bene" },
        { label: "D-590", value: "d590", key: "d590" },
        { label: "W-9", value: "w9", key: "w9" },
        { label: "A-1099", value: "a1099", key: "a1099" },
        {
          label: "Certificate Of Insurance",
          value: "certificateOfInsurance",
          key: "certificateOfInsurance",
        },
        {
          label: "Contract Start Date",
          value: "contractStartDate",
          key: "contractStartDate",
        },
        {
          label: "Contract End Date",
          value: "contractEndDate",
          key: "contractEndDate",
        },
      ]}
    />
  );
};
