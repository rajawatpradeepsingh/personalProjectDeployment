import React, { useState, useEffect } from "react";
import LargeModal from "../../modal/large-modal/large-modal.component";
import SingleSelect from "../../common/select/selects.component";
import { Select } from "antd";
import Button from "../../common/button/button.component";
import xlsx from 'json-as-xlsx';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import "./reports.css";
import { useMemo } from "react";
import { config } from "../../../../src/config";
import auth from "../../../../src/utils/AuthService";
import axios from "axios";


pdfMake.vfs = pdfFonts.pdfMake.vfs;

const ReportModal = ({ open, setOpen,individualReportName,individualList, listLabel, tableFields, ...props }) => {

	const [selectedFormat, setSelectedFormat] = useState("");
	const [pdfReportType, setPdfReportType] = useState("Full");
	const [individualReport, setIndividualReport] = useState(null);
	const [reportDetailsType, setReportDetailsType] = useState("Default");
	const [filteredCustomReportOptions, setFilteredCustomReportOptions] = useState([]);
	const [selectedReportFields, setSelectedReportFields] = useState([]);
	const [reportData, setReportData] = useState([]);
	const [pdfReportData, setPdfReportData] = useState(null);
	const [reportHeaders, setReportHeaders] = useState([]);
	
	
const headers = useMemo(() => auth.getHeaders(), []);

	const closeReportModal = () => {
		resetDownload();
		setSelectedFormat("");
		setPdfReportType("Full");

		props.setShowReportModal(false);
	};

	const resetDownload = () => {
		setIndividualReport(null);
		setReportDetailsType("Default");
		setSelectedReportFields([]);
		setReportData([]);
		setPdfReportData(null);
		setReportHeaders([]);
	};

	const handleSelectFormat = (event) => {
		setSelectedFormat(event.target.value);
		if (event.target.value !== "PDF") setPdfReportType("Full");
		resetDownload();
	};

	const handleSelectPdfType = (event) => {
		setPdfReportType(event.target.value);
		resetDownload();
	};

	const handleSelectIndividualReportId = (e) => {
		const selectedValue = e.target.value;
		setIndividualReport(
			selectedValue ? { id: selectedValue, resourceManagerId: selectedValue } : null
		);
	};	
	
	const handleSelectReportDetailsType = (event) => {
		setReportDetailsType(event.target.value);
	};

	const handleSelectCustomReportFields = (value) => {
		setSelectedReportFields(value);
	};

	useEffect(() => {
		if (selectedReportFields.length && selectedReportFields.length < 9) {
			setFilteredCustomReportOptions(tableFields.filter(field => !selectedReportFields.includes(field.value)));
		} else if (selectedReportFields.length && selectedReportFields.length === 9) {
			setFilteredCustomReportOptions([]);
		} else {
			setFilteredCustomReportOptions(tableFields);
		}
	}, [selectedReportFields, tableFields]);
      
	const convertDataForReport = async (selectedFormat, defaultStatus, selectedReportFields, tableFields, selectedIndividual) => {
				let promisesarray = [];
    	let report;

    	for (let i = 0; i < individualList.length; i++) {
			(individualList[i].resourceManagerId ? 
			promisesarray.push(
			axios.get(`${config.serverURL}/${individualReportName}/${individualList[i].resourceManagerId}`, {headers,})) :
			promisesarray.push(
				axios.get(`${config.serverURL}/${individualReportName}/${individualList[i].id}`, {headers,})) 
	
			)
		}

		return Promise.all(promisesarray).then((results) => {
			if (selectedFormat === "pdf") {
				report = props.pdfFormatter(
					results,
					defaultStatus,
					selectedReportFields,
					tableFields,
					selectedIndividual
				);
				} else {
				report = props.csvExcelFormatter(
					results,
					defaultStatus,
					selectedReportFields,
					tableFields
				);
			}
			return report;
		});
  }; 

	const generateReport = async () => {
		if (selectedFormat === "PDF") {
			try {
				if (individualReport) {
										const report = await convertDataForReport('pdf', true, selectedReportFields, tableFields, individualReport);
										setPdfReportData(report);
									} else {
																				const type = reportDetailsType === "Default" ? true : false;
					const report = await convertDataForReport('pdf', type, selectedReportFields, tableFields, individualReport);
					setPdfReportData(report);
				}
			} catch (error) {
				console.log(error);
			}
		} else {
			try {
				const type = reportDetailsType === "Default" ? true : false;
				const report = await convertDataForReport('csvExcel', type, selectedReportFields, tableFields);
				setReportData(report[0]);
				setReportHeaders(report[1]);
			} catch (error) {
				console.log(error);
			}
		}
	};

	const downloadReport = () => {
		if (selectedFormat === "PDF") {
			pdfMake.createPdf(pdfReportData).download(props.filename)
		} else {
			let data = [
				{
					sheet: listLabel,
					columns: reportHeaders,
					content: reportData
				}
			];

			let settings = {
				fileName: props.filename, // Name of the resulting spreadsheet
				extraLength: 3, // A bigger number means that columns will be wider
				writeOptions: {} // Style options from https://github.com/SheetJS/sheetjs#writing-options
			};

			xlsx(data, settings);
		};
		resetDownload();
	};

	return (
		<LargeModal open={props.showReportModal} close={closeReportModal} header={{ text: `${listLabel} Reports` }}>
			<div className="report-modal-dropdown-container">
				<SingleSelect
					label="File Type"
					name="report-file-type"
					value={selectedFormat}
					onChange={handleSelectFormat}
					options={[
						{ id: 0, value: "PDF", name: "PDF" },
						{ id: 1, value: "Excel", name: "Excel" },
						{ id: 1, value: "CSV", name: "CSV" },
					]}
					required
				/>
				{selectedFormat === "PDF" && (
					<SingleSelect
						label="Report Type"
						name="pdf-report-type"
						required
						value={pdfReportType}
						onChange={handleSelectPdfType}
						options={[
							{ id: 0, value: "Full", name: "Full Report" },
							{ id: 1, value: "Individual", name: "Individual Report" }
						]}
					/>
				)}
				{selectedFormat === "PDF" && pdfReportType === "Individual" && (
				 <SingleSelect
     	            label={listLabel}
       	            name="individual-report-content"
       			    value={individualReport?.id || ""}
       			    onChange={handleSelectIndividualReportId}
      			    options={props.list}
       			    required
    />
)}
				{selectedFormat && pdfReportType !== "Individual" && (
					<SingleSelect
						label="Report Details"
						name="report-details-select"
						value={reportDetailsType}
						onChange={handleSelectReportDetailsType}
						required
						options={[
							{ id: 0, value: "Default", name: "Default" },
							{ id: 1, value: "Custom", name: "Custom" },
						]}
					/>
				)}
			</div>
			{reportDetailsType === "Custom" && (
				<div className="report-detail-select-container">
					<span className="select-fields-label">Report Fields <span style={{ fontSize: '12px', color: 'var(--tertiary)' }}>(Max: 9)</span></span>
					<Select
						mode="multiple"
						placeholder="Select Details to Include"
						value={selectedReportFields}
						style={{ width: "95%" }}
						options={filteredCustomReportOptions}
						onChange={handleSelectCustomReportFields}
					/>
				</div>
			)}
			<div className="report-btns-container">
				{selectedFormat && (!reportData.length && !pdfReportData) && (
					<Button handleClick={generateReport} className="btn main outlined marginY">Generate Report</Button>
				)}
				{selectedFormat && (reportData.length || pdfReportData) && (
					<Button handleClick={downloadReport} className="btn main marginY">Download</Button>
				)}
			</div>
		</LargeModal>
	)
}

export default ReportModal;