import imageCodes from './ImagesBase64Code';
import moment from "moment";
const reportFormats = {
  candidateCSVExcel: (results, defaultStatus, selectedFields, tableFields) => {
    const reportData = [];
    let csvExcelHeaders = [{ label: "Name", key: "name", value: "name" }];

    if (defaultStatus) {
      csvExcelHeaders = csvExcelHeaders.concat(tableFields);
    } else {
      for (let obj of tableFields) {
         if(selectedFields.includes(obj.key)) {
            csvExcelHeaders.push(obj);
         }
      }
    }

    for (let i = 0; i < results.length; i++) {
      const resultData = results[i].data;
      let candidateData = {};

      // let reportComments = [];
      // for(let comment of resultData.professionalInfo.commentList) {
      //   reportComments.push(`${comment.date} --> Status: ${comment.status}\n ${comment.clientName ? `${comment.clientName}, ${comment.manager}\n` : ""} ${comment.comment ? `${comment.comment}\n` : ""}\n`)
      // }

      let data = {
        status: resultData.status,
        recruiter: resultData.recruiter === null ? "Unassigned" : `${resultData.recruiter.firstName} ${resultData.recruiter.lastName}`,
        name: `${resultData.firstName} ${resultData.lastName}`,
        gender: resultData.gender,
        currentJobTitle: resultData.professionalInfo?.currentJobTitle || "",
        currentEmployer: resultData.professionalInfo?.currentEmployer || "",
        currentCtc: resultData.professionalInfo?.currentCtcCurrency ? `${resultData.professionalInfo?.currentCtcCurrency}${resultData.professionalInfo?.currentCtcValue}, ${resultData.professionalInfo?.currentCtcType} - ${resultData.professionalInfo?.currentCtcTax}`: "",
        totalExperience: resultData.professionalInfo?.totalExperience ? `${resultData.professionalInfo.totalExperience} ${resultData.professionalInfo.totalExpPeriod}` : "",
        expectedCtc:  `${ resultData.professionalInfo?.expectedCtcCurrency || ""}${resultData.professionalInfo?.startExpCTC &&
        resultData.professionalInfo?.endExpCTC
            ? `${resultData.professionalInfo?.startExpCTC} - ${resultData.professionalInfo?.endExpCTC}`
            : resultData.professionalInfo?.startExpCTC &&
              !resultData.professionalInfo?.endExpCTC
            ? resultData.professionalInfo?.startExpCTC
            : !resultData.professionalInfo?.startExpCTC &&
            resultData.professionalInfo?.endExpCTC
            ? resultData.professionalInfo?.endExpCTC
            : resultData.professionalInfo?.expectedCtcValue
            ? resultData.professionalInfo?.expectedCtcValue
            : ""}${ resultData.professionalInfo?.expectedCtcType
              ? `${
                resultData.professionalInfo?.expectedCtcType.includes("Annual")
                    ? "/yr"
                    : "/hr"
                }`
              : ""}${resultData.professionalInfo?.expectedCtcTax
                ? `, ${resultData.professionalInfo?.expectedCtcTax}`
                : ""}`,
        noticePeriod: `${resultData.professionalInfo?.noticePeriodCount} ${resultData.professionalInfo?.noticePeriodType}` || "",
        workAuthStatus: resultData.workAuthStatus,
        location: `${resultData.address?.country}, ${resultData.address?.state}, ${resultData.address?.city}` || "",
relocate:resultData.relocate,
        email: resultData.email,
        phoneNumber: resultData.phoneNumber,
        linkedinProfile: resultData.linkedinProfile,
        reasonForJobChange: resultData.professionalInfo?.reasonForJobChange || "",
        primarySkill: resultData.professionalInfo?.primarySoftwareSkill ? resultData.professionalInfo.primarySoftwareSkill : "",
        secondarySkill: resultData.professionalInfo?.secondarySkill ? resultData.professionalInfo?.secondarySkill : "",
        availableIn: resultData.professionalInfo?.noticePeriodCount ? `${resultData.professionalInfo.noticePeriodCount} ${resultData.professionalInfo.noticePeriodType}` : "",
       // comments: reportComments
      };

      if (defaultStatus) {
         for(let key in data) {
            candidateData[key] = data[key];
         }
      } else {
        candidateData.name = data.name;
        for(let selected of selectedFields) {
           candidateData[selected] = data[selected]
        } 
      }

      reportData.push(candidateData);
    }
    return [reportData, csvExcelHeaders];
  },
  candidatePDF: ( results, defaultStatus, selectedFields, tableFields, selectedCandidate ) => {
    let fullReport = [];
    let individualReport = [];
    const defaultPDFHeaders = [ "Name", "Status", "Location", "Email", "Phone No.", "Recruiter", "Primary Skills", "Total Exp.", "Expected CTC", "Work Auth Status"].map(item => {return { text: item, bold: true, fontSize: 11, alignment: "center", fillColor: "#3432b8", fillOpacity: .1}});
    const basicInfoHeaders = ["Recruiter", "E-mail", "Phone No.", "LinkedIn", "Work Auth Status", "Gender", "Location"].map(item => {return { text: item, bold: true, fontSize: 11, alignment: "center", fillColor: "#3432b8", fillOpacity: .1}});
    const professionalInfoHeaders = ["Total Experience", "Primary Skills", "Secndary Skills", "Current Position", "Current Employer", "Current CTC", "Reason For Change", "Expected CTC", "Available In"].map(item => {return { text: item, bold: true, fontSize: 11, alignment: "center", fillColor: "#3432b8", fillOpacity: .1}});
    let customPDFHeaders = ["Name"];
    let currentDate = new Date();

    if (defaultStatus) {
      fullReport.push(defaultPDFHeaders);
    } else {
      for (let obj of tableFields) {
        if (selectedFields.includes(obj.key)) {
          customPDFHeaders.push(obj.label)
        }
      }
      customPDFHeaders = customPDFHeaders.map(item => {return { text: item, bold: true, fontSize: 11, alignment: "center", fillColor: "#3432b8", fillOpacity: .1}});
      fullReport.push(customPDFHeaders);
    }

    for (let i = 0; i < results.length; i++) {
      const resultData = results[i].data;

     // let reportComments = [];
      // for(let comment of resultData.professionalInfo.commentList) {
      //   reportComments.push(`${comment.date} --> Status: ${comment.status}\n ${comment.clientName ? `${comment.clientName}, ${comment.manager}\n` : ""} ${comment.comment ? `${comment.comment}\n` : ""}\n`)
      // }

      let fields = {
        id: resultData.id,
        status: resultData.status,
        recruiter: resultData.recruiter === null ? "Unassigned" : `${resultData.recruiter.firstName} ${resultData.recruiter.lastName}`,
        name: `${resultData.firstName} ${resultData.lastName}`,
        gender: resultData.gender,
        currentJobTitle: resultData.professionalInfo?.currentJobTitle || "",
        currentEmployer: resultData.professionalInfo?.currentEmployer || "",
        currentCtc: resultData.professionalInfo?.currentCtcCurrency ? `${resultData.professionalInfo?.currentCtcCurrency}${resultData.professionalInfo?.currentCtcValue}, ${resultData.professionalInfo?.currentCtcType} - ${resultData.professionalInfo?.currentCtcTax}`: "",
        totalExperience: resultData.professionalInfo?.totalExperience ? `${resultData.professionalInfo.totalExperience} ${resultData.professionalInfo.totalExpPeriod}` : "",
        expectedCtc:  `${ resultData.professionalInfo?.expectedCtcCurrency || ""}${resultData.professionalInfo?.startExpCTC &&
          resultData.professionalInfo?.endExpCTC
            ? `${resultData.professionalInfo?.startExpCTC} - ${resultData.professionalInfo?.endExpCTC}`
            : resultData.professionalInfo?.startExpCTC &&
              !resultData.professionalInfo?.endExpCTC
            ? resultData.professionalInfo?.startExpCTC
            : !resultData.professionalInfo?.startExpCTC &&
            resultData.professionalInfo?.endExpCTC
            ? resultData.professionalInfo?.endExpCTC
            : resultData.professionalInfo?.expectedCtcValue
            ? resultData.professionalInfo?.expectedCtcValue
            : ""}${ resultData.professionalInfo?.expectedCtcType
              ? `${
                resultData.professionalInfo?.expectedCtcType.includes("Annual")
                    ? "/yr"
                    : "/hr"
                }`
              : ""}${resultData.professionalInfo?.expectedCtcTax
                ? `, ${resultData.professionalInfo?.expectedCtcTax}`
                : ""}`,        noticePeriod: `${resultData.professionalInfo?.noticePeriodCount} ${resultData.professionalInfo?.noticePeriodType}` || "",
        workAuthStatus: resultData.workAuthStatus,
        location: `${resultData.address?.country}, ${resultData.address?.state}, ${resultData.address?.city}` || "",
        email: resultData.email,
        phoneNumber: resultData.phoneNumber,
        linkedinProfile: resultData.linkedinProfile,
        reasonForJobChange: resultData.professionalInfo?.reasonForJobChange || "",
        primarySkill: resultData.professionalInfo?.primarySoftwareSkill ? resultData.professionalInfo.primarySoftwareSkill : "",
        secondarySkill: resultData.professionalInfo?.secondarySkill ? resultData.professionalInfo?.secondarySkill : "",
        availableIn: resultData.professionalInfo?.noticePeriodCount ? `${resultData.professionalInfo.noticePeriodCount} ${resultData.professionalInfo.noticePeriodType}` : "",
        //comments: reportComments
      };

      if (defaultStatus) {
        fullReport.push([  fields.name, fields.status, fields.location, fields.email, fields.phoneNumber, fields.recruiter, fields.primarySkill, fields.totalExperience, fields.expectedCtc, fields.workAuthStatus])
      } else {
        let customData = [ fields.name ]
        for (let obj of tableFields) {
          if (selectedFields.includes(obj.key)) {
            customData.push(fields[obj.value])
          }

        }
        fullReport.push(customData)
      }
      
      if (selectedCandidate) {
        if (resultData.id === parseInt(selectedCandidate.id)) {
          individualReport = [
            { text: fields.name, style: "header" },
            { text: `Status: ${fields.status}`, style: "subheader"},
            "\n",
            { text: "Basic Information:", style: "subheader"},
            { table: {
                headerRows: 1,
                heights: [10,20],
                body: [
                  basicInfoHeaders,
                  [ fields.recruiter, fields.email, fields.phoneNumber, fields.linkedinProfile, fields.workAuthStatus, fields.gender, fields.location ]
                ]
              }
            },
            "\n",
            { text: "Professional Information:", style: "subheader"},
            { table: {
                headerRows: 1,
                heights: [10, 20],
                body: [
                  professionalInfoHeaders,
                  [ fields.totalExperience, fields.primarySkill, fields.secondarySkill, fields.currentJobTitle, fields.currentEmployer, fields.currentCtc, fields.reasonForJobChange, fields.expectedCtc, fields.availableIn ]
                ]
              }
            },
            "\n",
            //{ text: "Comments & Activity", style: "subheader"},
            //{ ol: fields.comments},
            "\n"
          ];

        }
      } 
    }
    let widths = Array(fullReport[0].length).fill("auto");
    let pdfReport = {
      pageSize: "LETTER",
      content: selectedCandidate
        ? [
            { image: "companyLogo", fit: [120, 120] },
            "\n\n",
            individualReport,
            { text: `Date generated: ${currentDate}`, italics: true },
          ]
        : [
            { image: "companyLogo", fit: [120, 120] },
            "\n\n",
            { text: `Candidates Summary Report`, style: "header" },
            "\n",
            {
              table: {
                headerRows: 1,
                widths: widths,
                body: fullReport,
              },
            },
            "\n",
            { text: `Date generated: ${currentDate}`, italics: true },
          ],
      images: {
        companyLogo: `data:image/png;base64, ${imageCodes.companyLogo}`,
      },
      defaultStyle: { fontSize: 10, bold: false },
      styles: {
        header: { fontSize: 22, bold: true },
        subheader: {
          fontSize: 15,
          bold: true,
          margin: [0, 0, 0, 5],
          color: "#3432b8",
          opacity: 0.5,
        },
      },
      pageOrientation: "landscape",
      pageMargins: [20, 25, 20, 20],
    };

    return pdfReport;
  },
  clientCSVExcel: (results, defaultStatus, selectedFields, tableFields) => {
    const reportData = [];
    let csvExcelHeaders = [{ label: "Client", key: "clientName", value: "clientName" }];

    if (defaultStatus) {
      csvExcelHeaders = csvExcelHeaders.concat(tableFields);
    } else {
      for (let obj of tableFields) {
        if(selectedFields.includes(obj.key)) {
          csvExcelHeaders.push(obj);
        }
      }
    }

    for (let i = 0; i < results.length; i++) {
      const resultData = results[i].data;
      let clientData = {};

      let data = {
        clientName: resultData.clientName,
        phoneNumber: resultData.phoneNumber,
        website: resultData.website,
        vmsFees: resultData.vmsFees,
        adminFees: resultData.adminFees,
        rebateFees: resultData.rebateFees,
        addressLine1: resultData.address.addressLine1,
        addressLine2:resultData.address.addressLine2,
        addressLine3:resultData.address.addressLine3,
        city:resultData.address.city,
        state:resultData.address.state,
        country:resultData.address.country,
        postalCode: resultData.address.postalCode,
      }

      if (defaultStatus) {
        for(let key in data) {
          clientData[key] = data[key]
        }
      } else {
          clientData.clientName = data.clientName;
          for(let selected of selectedFields) {
            clientData[selected] = data[selected]
          }
      }

      reportData.push(clientData);
    }
    return [reportData, csvExcelHeaders];
  },
  clientPdfFormat: (results, defaultStatus, selectedFields, tableFields, selectedClient) => {
    let fullReport = [];
    let individualReport = [];
    let defaultPDFHeaders = ["Client","Phone Number","Website","VMS Fee (%)","Admin Fee (%)","Rebate Fee (%)", "Address Line 1", "Address Line 2","Address Line 3", "City", "State", "Country", "Postal Code"].map(item => {return { text: item, bold: true, fontSize: 11, alignment: "center", fillColor: "#3432b8", fillOpacity: .1}});
    let customPDFHeaders = ["Client"];
    let currentDate = new Date();

    if (defaultStatus) {
      fullReport.push(defaultPDFHeaders);
    } else {
      for(let obj of tableFields) {
        if (selectedFields.includes(obj.key)) {
          customPDFHeaders.push(obj.label)
        }
      }
      customPDFHeaders = customPDFHeaders.map(item => {return { text: item, bold: true, fontSize: 11, alignment: "center", fillColor: "#3432b8", fillOpacity: .1}});
      fullReport.push(customPDFHeaders);
    }

    for (let i = 0; i < results.length; i++) {
      const resultData = results[i].data;

      let fields = {
        clientName: resultData.clientName,
        phoneNumber: resultData.phoneNumber,
        website: resultData.website,
        vmsFees:resultData.vmsFees,
        adminFees:resultData.adminFees,
        rebateFees:resultData.rebateFees,
        addressLine1: resultData.address.addressLine1,
        addressLine2:resultData.address.addressLine2,
        addressLine3:resultData.address.addressLine3,
        city:resultData.address.city,
        state:resultData.address.state,
        country:resultData.address.country,
        postalCode: resultData.address.postalCode,
      }

      if (defaultStatus) {
        fullReport.push([fields.clientName,fields.phoneNumber,fields.website,fields.vmsFees,fields.adminFees,fields.rebateFees, fields.addressLine1, fields.addressLine2, fields.addressLine3,fields.city, fields.state, fields.country, fields.postalCode])
      } else {
        let customData = [fields.clientName];
        for (let obj of tableFields) {
          if (selectedFields.includes(obj.key)) {
            customData.push(fields[obj.value])
          }

        }
        fullReport.push(customData);
      }

    
      if (selectedClient) {
        if (resultData.id === parseInt((selectedClient.id)) ){
          individualReport = [
            { text: fields.clientName, style: "header" },
            "\n",
            { table: {
              headerRows: 1,
              heights: [10,20],
              body: [
                defaultPDFHeaders.slice(1),
                [ fields.phoneNumber,fields.website,fields.vmsFees,fields.adminFees,fields.rebateFees,fields.addressLine1, fields.addressLine2,fields.addressLine3, fields.city, fields.state, fields.country, fields.postalCode]
              ]
            }},
            "\n"
          ];
        }
      } 
    }
    let widths = Array(fullReport[0].length).fill("auto");
    let pdfReport = {
      pageSize: "LETTER",
			content: selectedClient
        ? [
            { image: "companyLogo", fit: [120, 120] },
            "\n\n",
            individualReport,
            { text: `Date generated: ${currentDate}`, italics: true },
          ]
        : [
            { image: "companyLogo", fit: [120, 120] },
            "\n\n",
            { text: `Client Summary Report`, style: "header" },
            "\n",
            {
            table: {
              headerRows: 1,
              widths: widths,
              body: fullReport,
            },
            },
            "\n",
            { text: `Date generated: ${currentDate}`, italics: true },
          ],
        images: {
        companyLogo: `data:image/png;base64, ${imageCodes.companyLogo}`,
        },
        defaultStyle: { fontSize: 10, bold: false },
        styles: { 
          header: { fontSize: 22, bold: true },
          subheader: { fontSize: 15, bold: true, margin: [0, 0, 0, 5], color: "#3432b8", opacity: .5 },
        },
        pageOrientation: "landscape",
        pageMargins: [20, 25, 20, 20],
    }

    return pdfReport;
  },
  workerCSVExcel: (results, defaultStatus, selectedFields, tableFields) => {
    const reportData = [];
    let csvExcelHeaders = [{ label: "FullName", key: "fullName", value: "fullName" }];

    if (defaultStatus) {
      csvExcelHeaders = csvExcelHeaders.concat(tableFields);
    } else {
      for (let obj of tableFields) {
        if (selectedFields.includes(obj.key)) {
          csvExcelHeaders.push(obj);
        }
      }
    }

    for (let i = 0; i < results.length; i++) {
      const resultData = results[i].data;
      let workerData = {};

      let data = {
        fullName: `${resultData.firstName} ${resultData.lastName}`,
         phoneNumber: resultData.phoneNumber,
        email: resultData.email,
        location: `${resultData.address?.city}, ${resultData.address?.state}, ${resultData.address?.country}`,
        status: resultData.status,
        subContractorCompanyName: resultData.subContractorCompanyName,
        client: resultData.client?.clientName || "",
      };

      if (defaultStatus) {
        for (let key in data) {
          workerData[key] = data[key];
        }
      } else {
        workerData.fullName = data.fullName;
        for (let selected of selectedFields) {
          workerData[selected] = data[selected];
        }
      }

      reportData.push(workerData);
    }
    return [reportData, csvExcelHeaders];
  },


  workerPdfFormat: (results, defaultStatus, selectedFields, tableFields, selectedworker) => {
    let fullReport = [];
    let individualReport = [];
    let defaultPDFHeaders = ["Name", "Contact #", "Email", "Location","Status", "SubContractorCompanyName", "Client"].map(item => {return { text: item, bold: true, fontSize: 11, alignment: "center", fillColor: "#3432b8", fillOpacity: .1}});
    let customPDFHeaders = ["Name"];
    let currentDate = new Date();

    if (defaultStatus) {
      fullReport.push(defaultPDFHeaders);
    } else {
      for(let obj of tableFields) {
        if (selectedFields.includes(obj.key)) {
          customPDFHeaders.push(obj.label)
        }
      }
      customPDFHeaders = customPDFHeaders.map(item => {return { text: item, bold: true, fontSize: 11, alignment: "center", fillColor: "#3432b8", fillOpacity: .1}});
      fullReport.push(customPDFHeaders);
    }

    for (let i = 0; i < results.length; i++) {
      const resultData = results[i].data;

      let fields = {
        fullName: `${resultData.firstName} ${resultData.lastName}`,
         phoneNumber: resultData.phoneNumber,
        email: resultData.email,
        location: `${resultData.address?.city}, ${resultData.address?.state}, ${resultData.address?.country}`,
        status: resultData.status,
        subContractorCompanyName: resultData.subContractorCompanyName,
        client: resultData.client?.clientName || "",
        skills: resultData.skills,
     designation: resultData.designation,
       dateOfBirth: resultData.dateOfBirth,
    gender: resultData.gender,
  comments: resultData.comments,
      contractStartDate: resultData.contractStartDate,
 contractEndDate: resultData.contractEndDate,
 entryDateOfF1: resultData.entryDateOfF1,
 laptopProvided: resultData.laptopProvided,
isSubContractor: resultData.isSubContractor,
    signedEquipmentForm: resultData.signedEquipmentForm,
      }

      if (defaultStatus) {
        fullReport.push([fields.fullName, fields.phoneNumber, fields.email, fields.location,fields.status, fields.subContractorCompanyName, fields.client])
      } else {
        let customData = [fields.fullName];
        for (let obj of tableFields) {
          if (selectedFields.includes(obj.key)) {
            customData.push(fields[obj.value])
          }

        }
        fullReport.push(customData);
      }

    
      if (selectedworker) {
        if (resultData.id === parseInt((selectedworker.id)) ){
          individualReport = [
            { text: fields.Name, style: "header" },
            "\n",
            { table: {
              headerRows: 1,
              heights: [10,20],
              body: [
                defaultPDFHeaders.slice(1),
                [ fields.phoneNumber, fields.email, fields.location,fields.status, fields.subContractorCompanyName, fields.client]
              ]
            }},
            "\n"
          ];
        }
      } 
    }
    let widths = Array(fullReport[0].length).fill("auto");
    let pdfReport = {
      pageSize: "LETTER",
			content: selectedworker
        ? [
            { image: "companyLogo", fit: [120, 120] },
            "\n\n",
            individualReport,
            { text: `Date generated: ${currentDate}`, italics: true },
          ]
        : [
            { image: "companyLogo", fit: [120, 120] },
            "\n\n",
            { text: `Worker Summary Report`, style: "header" },
            "\n",
            {
            table: {
              headerRows: 1,
              widths: widths,
              body: fullReport,
            },
            },
            "\n",
            { text: `Date generated: ${currentDate}`, italics: true },
          ],
        images: {
        companyLogo: `data:image/png;base64, ${imageCodes.companyLogo}`,
        },
        defaultStyle: { fontSize: 10, bold: false },
        styles: { 
          header: { fontSize: 22, bold: true },
          subheader: { fontSize: 15, bold: true, margin: [0, 0, 0, 5], color: "#3432b8", opacity: .5 },
        },
        pageOrientation: "landscape",
        pageMargins: [20, 25, 20, 20],
    }

    return pdfReport;
  },
  interviewCSVExcel: (results, defaultStatus, selectedFields, tableFields) => {
      const reportData = [];
      let csvExcelHeaders = [{ label: "Candidate", value: "candidate", key: "candidate"}]

      if (defaultStatus) {
         csvExcelHeaders = csvExcelHeaders.concat(tableFields);
      } else {
        for (let obj of tableFields) {
          if (selectedFields.includes(obj.key)) {
             csvExcelHeaders.push(obj);
          }
        }
      }

      for (let i = 0; i < results.length; i++) {
        const resultData = results[i].data;
        let interviewData = {};
  
        let data = {
          candidate: `${resultData.candidate.firstName} ${resultData.candidate.lastName}`,
          interviewers: resultData.interviewers.map(item=>`${item.firstName} ${item.lastName}`).join(", "),
          jobTitle:resultData.jobOpening?.jobTitle || "",
          client: resultData.jobOpening ? resultData.jobOpening?.client?.clientName : "Internal",
          jobType: resultData.jobOpening?.jobType || "",
          roundType:resultData.roundType,
          date: resultData.schedule.date,
          time:`${moment(resultData.schedule.startTimeZ).format("hh:mm a")} - ${moment(resultData.schedule.endTimeZ).format("hh:mm a")}`,
          feedback: resultData.schedule.feedback,
          decision: resultData.schedule.decision,
        }
       
      if (defaultStatus) {
        for (let key in data) {
          interviewData[key] = data[key];
        }
      } else {
        interviewData.candidate = data.candidate; 
        for (let selected of selectedFields) {
          interviewData[selected] = data[selected];
        }
      }
  
        reportData.push(interviewData);
      }
      return [reportData, csvExcelHeaders];
  },
  interviewPdfFormat: (results, defaultStatus, selectedFields, tableFields, selectedInterview) => {
      let fullReport = [];
      let individualReport = [];
      let defaultPDFHeaders = ["Candidate", "Interviewer(s)", "Jobopening", "Client",  "Job Type","Round Type", "Date", "Time", "Feedback", "Decision"].map(item => {return { text: item, bold: true, fontSize: 11, alignment: "center", fillColor: "#3432b8", fillOpacity: .1}});
      let customPDFHeaders = ["Candidate"];
      let currentDate = new Date();

      if (defaultStatus) {
        fullReport.push(defaultPDFHeaders);
      } else {
        for(let obj of tableFields) {
          if (selectedFields.includes(obj.key)) {
            customPDFHeaders.push(obj.label)
          }
        }
        customPDFHeaders = customPDFHeaders.map(item => {return { text: item, bold: true, fontSize: 11, alignment: "center", fillColor: "#3432b8", fillOpacity: .1}});
        fullReport.push(customPDFHeaders);
      }
  
      for (let i = 0; i < results.length; i++) {
        const resultData = results[i].data;
  
        let fields = {
          candidate: `${resultData.candidate.firstName} ${resultData.candidate.lastName}`,
          interviewers: resultData.interviewers.map(item=>`${item.firstName} ${item.lastName}`).join(", "),
          jobTitle:resultData.jobOpening?.jobTitle || "",
          client: resultData.jobOpening ? resultData.jobOpening?.client?.clientName : "Internal",
          jobType: resultData.jobOpening?.jobType || "",
          roundType:resultData.roundType,
          date: resultData.schedule.date,
          time:`${moment(resultData.schedule.startTimeZ).format("hh:mm a")} - ${moment(resultData.schedule.endTimeZ).format("hh:mm a")}`,
          feedback: resultData.schedule.feedback,
          decision: resultData.schedule.decision,
        }
       
  
        if (defaultStatus) {
          fullReport.push([fields.candidate, fields.interviewers, fields.jobTitle, fields.client, fields.jobType, fields.roundType, fields.date, fields.time, fields.feedback, fields.decision])
        } else {
          let customData = [fields.candidate];
          for (let obj of tableFields) {
            if (selectedFields.includes(obj.key)) {
              customData.push(fields[obj.value])
            }
  
          }
          fullReport.push(customData);
        }

        if (selectedInterview) {
          if (resultData.id === parseInt((selectedInterview.id)) ){
            individualReport = [
              { text: fields.candidate, style: "header" },
              "\n",
              { table: {
                headerRows: 1,
                heights: [10,20],
                body: [
                  defaultPDFHeaders.slice(1),
                  [fields.interviewers, fields.jobTitle, fields.client, fields.jobType, fields.roundType, fields.date, fields.time, fields.feedback, fields.decision]
                ]
              }},
              "\n"
            ];
          }
        } 
  
      }
      let widths = Array(fullReport[0].length).fill("auto");
      let pdfReport = {
        pageSize: "LETTER",
        content: selectedInterview
          ? [
              { image: "companyLogo", fit: [120, 120] },
              "\n\n",
              individualReport,
              { text: `Date generated: ${currentDate}`, italics: true },
            ]
          : [
              { image: "companyLogo", fit: [120, 120] },
              "\n\n",
              { text: `Interview Summary Report`, style: "header" },
              "\n",
              {
              table: {
                headerRows: 1,
                widths: widths,
                body: fullReport,
              },
              },
              "\n",
              { text: `Date generated: ${currentDate}`, italics: true },
            ],
          images: {
          companyLogo: `data:image/png;base64, ${imageCodes.companyLogo}`,
          },
          defaultStyle: { fontSize: 10, bold: false },
          styles: { 
            header: { fontSize: 22, bold: true },
            subheader: { fontSize: 15, bold: true, margin: [0, 0, 0, 5], color: "#3432b8", opacity: .5 },
          },
          pageOrientation: "landscape",
          pageMargins: [20, 25, 20, 20],
      }
      
      return pdfReport;
   },
  interviewerCSVExcel: (results, defaultStatus, selectedFields, tableFields) => {
    const reportData = [];
    let csvExcelHeaders = [{ label: "Name", key: "fullName", value: "fullName" }];

    if (defaultStatus) {
      csvExcelHeaders = csvExcelHeaders.concat(tableFields);
    } else {
      for (let obj of tableFields) {
        if (selectedFields.includes(obj.key)) {
          csvExcelHeaders.push(obj);
        }
      }
    }

    for (let i = 0; i < results.length; i++) {
      const resultData = results[i].data;
      let interviewerData = {};

      let data = {
        fullName: `${resultData.firstName} ${resultData.lastName}`,
        email: resultData.email,
        phone_no: resultData.phone_no,
        location: `${resultData.address?.country}, ${resultData.address?.state}, ${resultData.address?.city}` || "",
        total_experience: resultData.total_experience ? `${resultData.total_experience} year(s)` : "",
        client: resultData.client.clientName,
        interview_skills: resultData.interview_skills,
      };

      if (defaultStatus) {
        for (let key in data) {
          interviewerData[key] = data[key];
        }
      } else {
        interviewerData.fullName = data.fullName;
        for (let selected of selectedFields) {
          interviewerData[selected] = data[selected];
        }
      }

      reportData.push(interviewerData);
    }
    return [reportData, csvExcelHeaders];
  },
  interviewerPdfFormat: (results, defaultStatus, selectedFields, tableFields, selectedInterviewer) => {
    let fullReport = [];
    let individualReport = [];
    let defaultPDFHeaders = ["Name", "Contact ", "Email",  "Location","Experience", "Client", "Interview Skills"].map(item => {return { text: item, bold: true, fontSize: 11, alignment: "center", fillColor: "#3432b8", fillOpacity: .1}});
    let customPDFHeaders = ["Name"];
    let currentDate = new Date();

    if (defaultStatus) {
      fullReport.push(defaultPDFHeaders);
    } else {
      for(let obj of tableFields) {
        if (selectedFields.includes(obj.key)) {
          customPDFHeaders.push(obj.label)
        }
      }
      customPDFHeaders = customPDFHeaders.map(item => {return { text: item, bold: true, fontSize: 11, alignment: "center", fillColor: "#3432b8", fillOpacity: .1}});
      fullReport.push(customPDFHeaders);
    }

    for (let i = 0; i < results.length; i++) {
      const resultData = results[i].data;

      let fields = {
        fullName: `${resultData.firstName} ${resultData.lastName}`,
        phone_no: resultData.phone_no,
        email: resultData.email,
        location: `${resultData.address?.country}, ${resultData.address?.state}, ${resultData.address?.city}` || "",
        total_experience: resultData.total_experience ? `${resultData.total_experience} year(s)` : "",
        client: resultData.client?.clientName || "",
        interview_skills: resultData.interview_skills,
      };

      if (defaultStatus) {
        fullReport.push([fields.fullName, fields.phone_no, fields.email, fields.location, fields.total_experience, fields.client, fields.interview_skills])
      } else {
        let customData = [fields.fullName];
        for (let obj of tableFields) {
          if (selectedFields.includes(obj.key)) {
            customData.push(fields[obj.value])
          }

        }
        fullReport.push(customData);
      }

      if (selectedInterviewer) {
        if (resultData.id === parseInt((selectedInterviewer.id)) ){
          individualReport = [
            { text: fields.fullName, style: "header" },
            "\n",
            { table: {
              headerRows: 1,
              heights: [10,20],
              body: [
                defaultPDFHeaders.slice(1),
                [fields.phone_no, fields.email, fields.location, fields.total_experience, fields.client, fields.interview_skills]
              ]
            }},
            "\n"
          ];
        }
      } 
    }
    let widths = Array(fullReport[0].length).fill("auto");
    let pdfReport = {
      pageSize: "LETTER",
			content: selectedInterviewer
        ? [
            { image: "companyLogo", fit: [120, 120] },
            "\n\n",
            individualReport,
            { text: `Date generated: ${currentDate}`, italics: true },
          ]
        : [
            { image: "companyLogo", fit: [120, 120] },
            "\n\n",
            { text: `Interviewer Summary Report`, style: "header" },
            "\n",
            {
            table: {
              headerRows: 1,
              widths: widths,
              body: fullReport,
            },
            },
            "\n",
            { text: `Date generated: ${currentDate}`, italics: true },
          ],
        images: {
        companyLogo: `data:image/png;base64, ${imageCodes.companyLogo}`,
        },
        defaultStyle: { fontSize: 10, bold: false },
        styles: { 
          header: { fontSize: 22, bold: true },
          subheader: { fontSize: 15, bold: true, margin: [0, 0, 0, 5], color: "#3432b8", opacity: .5 },
        },
        pageOrientation: "landscape",
        pageMargins: [20, 25, 20, 20],
    }

    return pdfReport;
  },
  jobCSVExcel: (results, defaultStatus, selectedFields, tableFields) => {
    const reportData = [];
    let csvExcelHeaders = [{ label: "Job Title", value: "jobTitle", key: "jobTitle" }];

    if (defaultStatus) {
      csvExcelHeaders = csvExcelHeaders.concat(tableFields);
    } else {
      for (let obj of tableFields) {
        if (selectedFields.includes(obj.key)) {
          csvExcelHeaders.push(obj);
        }
      }
    }

    for (let i = 0; i < results.length; i++) {
      const resultData = results[i].data;
      let jobData = {};

      let data = {
        jobTitle: resultData.jobTitle,
        client: resultData.client.clientName,
        noOfJobopenings: resultData.noOfJobopenings,
        hiringManager: resultData.hiringManager,
        priority: resultData.priority,
        status: resultData.status,
        location: `${resultData.client.address?.country}, ${resultData.client.address?.state}, ${resultData.client.address?.city}` || "",
        clientBillRate: `${resultData.currency} ${resultData.clientBillRate}`,
        jobDescription: resultData.jobDescription,
        jobType: resultData.jobType,
        workType: resultData.workType,
        flsaType: resultData.flsaType,
        taxType: resultData.taxType,
        creationDate: resultData.creationDate,
      };

      if (defaultStatus) {
        for (let key in data) {
          jobData[key] = data[key];
        }
      } else {
        jobData.jobTitle = data.jobTitle;
        for (let selected of selectedFields) {
          jobData[selected] = data[selected];
        }
      }

      reportData.push(jobData);
    }
    
    return [reportData, csvExcelHeaders];
  },
  jobPdfFormat: (results, defaultStatus, selectedFields, tableFields, selectedJobOpening) => {
    let fullReport = [];
    let individualReport = [];
    let defaultPDFHeaders = ["Job Title", "Client", "No Of JobOpenings", "Hiring Manager", "Priority", "Status", "Location", "Client Bill Rate", "Job Description", "Job Type", "Work Type", "FLSA Type", "Tax Type", "Job Creation Date"].map(item => {return { text: item, bold: true, fontSize: 11, alignment: "center", fillColor: "#3432b8", fillOpacity: .1}});
    let customPDFHeaders = ["Job Title"];
    let currentDate = new Date();

    if (defaultStatus) {
      fullReport.push(defaultPDFHeaders);
    } else {
      for(let obj of tableFields) {
        if (selectedFields.includes(obj.key)) {
          customPDFHeaders.push(obj.label)
        }
      }
      customPDFHeaders = customPDFHeaders.map(item => {return { text: item, bold: true, fontSize: 11, alignment: "center", fillColor: "#3432b8", fillOpacity: .1}});
      fullReport.push(customPDFHeaders);
    }

    for (let i = 0; i < results.length; i++) {
      const resultData = results[i].data;

      let fields = {
        jobTitle: resultData.jobTitle,
        client: resultData.client.clientName,
        noOfJobopenings: resultData.noOfJobopenings,
        hiringManager: resultData.hiringManager,
        priority: resultData.priority,
        status: resultData.status,
        location: `${resultData.client.address?.country}, ${resultData.client.address?.state}, ${resultData.client.address?.city}` || "",
        clientBillRate: `${resultData.currency} ${resultData.clientBillRate}`,
        jobDescription: resultData.jobDescription,
        jobType: resultData.jobType,
        workType: resultData.workType,
        flsaType: resultData.flsaType,
        taxType: resultData.taxType,
        creationDate: resultData.creationDate,
      };

      if (defaultStatus) {
        fullReport.push([fields.jobTitle, fields.client, fields.noOfJobopenings, fields.hiringManager, fields.priority, fields.status, fields.location, fields.clientBillRate, fields.jobDescription, fields.jobType, fields.workType, fields.flsaType, fields.taxType, fields.creationDate]);
      } else {
        let customData = [fields.jobTitle];
        for (let obj of tableFields) {
          if (selectedFields.includes(obj.key)) {
            customData.push(fields[obj.value])
          }

        }
        fullReport.push(customData);
      }

      if (selectedJobOpening) {
        if (resultData.id === parseInt(selectedJobOpening.id)) {
          individualReport = [
            { text: fields.jobTitle, style: "header" },
            "\n",
            { table: {
              headerRows: 1,
              heights: [10,20],
              body: [
                defaultPDFHeaders.slice(1),
                [ fields.client, fields.noOfJobopenings, fields.hiringManager, fields.priority, fields.status, fields.location, fields.clientBillRate, fields.jobDescription, fields.jobType, fields.workType, fields.flsaType, fields.taxType, fields.creationDate]
              ]
            }},
            "\n"
          ];
        }
      } 
    }
    let widths = Array(fullReport[0].length).fill("auto");
    let pdfReport = {
      pageSize: "LETTER",
			content: selectedJobOpening
        ? [
            { image: "companyLogo", fit: [120, 120] },
            "\n\n",
            individualReport,
            { text: `Date generated: ${currentDate}`, italics: true },
          ]
        : [
            { image: "companyLogo", fit: [120, 120] },
            "\n\n",
            { text: `Job Openings Summary Report`, style: "header" },
            "\n",
            {
            table: {
              headerRows: 1,
              widths: widths,
              body: fullReport,
            },
            },
            "\n",
            { text: `Date generated: ${currentDate}`, italics: true },
          ],
        images: {
        companyLogo: `data:image/png;base64, ${imageCodes.companyLogo}`,
        },
        defaultStyle: { fontSize: 10, bold: false },
        styles: { 
          header: { fontSize: 22, bold: true },
          subheader: { fontSize: 15, bold: true, margin: [0, 0, 0, 5], color: "#3432b8", opacity: .5 },
        },
        pageOrientation: "landscape",
        pageMargins: [20, 25, 20, 20],
    }

    return pdfReport;
  },
  onboardingCSVExcel: (results, defaultStatus, selectedFields, tableFields) => {
      const reportData = [];
      let csvExcelHeaders = [{ label: "Candidate Name", value: "candidateName", key: "candidateName" }];

      if (defaultStatus) {
        csvExcelHeaders = csvExcelHeaders.concat(tableFields);
      } else {
        for (let obj of tableFields) {
          if (selectedFields.includes(obj.key)) {
            csvExcelHeaders.push(obj);
          }
        }
      }

      for (let i = 0; i < results.length; i++) {
        const resultData = results[i].data;
        let onBoardingData = {};
  
        let data = {
          candidateName: `${resultData.candidate.firstName} ${resultData.candidate.lastName}`,
          hiringType: resultData.hiringType,
          startDate: resultData.startDate,
          endDate: resultData.endDate,
          signUpContract: resultData.signUpContract ,
          client: resultData.client.clientName,
          easePortalSetUp: resultData.easePortalSetUp,
          deliveryOfLaptop: resultData.deliveryOfLaptop,
          workOrder: resultData.workOrder,
          backgroundCheck: resultData.backgroundCheck,
        };
  
        if (defaultStatus) {
          for (let key in data) {
            onBoardingData[key] = data[key];
          }        
        } 
          else {
          onBoardingData.candidateName = data.candidateName;
          for (let selected of selectedFields) {
            onBoardingData[selected] = data[selected];
          }
        }
  
        reportData.push(onBoardingData);
      }
      return [reportData, csvExcelHeaders];
  },
  onboardingPdfFormat: (results, defaultStatus, selectedFields, tableFields, selectedOnboarding) => {
    let fullReport = [];
    let individualReport = [];
    let defaultPDFHeaders = ["Candidate Name", "Client Name", "Hiring Type", "Start Date", "End Date", "Sign Up Contract", "Delivery of Laptop", "Ease Portal Setup", "Work Order", "Background Check"].map(item => {return { text: item, bold: true, fontSize: 11, alignment: "center", fillColor: "#3432b8", fillOpacity: .1}});
    let customPDFHeaders = ["Candidate Name"];
    let currentDate = new Date();

    if (defaultStatus) {
        fullReport.push(defaultPDFHeaders);
    } else {
        for(let obj of tableFields) {
        if (selectedFields.includes(obj.key)) {
          customPDFHeaders.push(obj.label)
        }
        }
        customPDFHeaders = customPDFHeaders.map(item => {return { text: item, bold: true, fontSize: 11, alignment: "center", fillColor: "#3432b8", fillOpacity: .1}});
        fullReport.push(customPDFHeaders);
    }

    for (let i = 0; i < results.length; i++) {
        const resultData = results[i].data;

        let fields = {
        candidateName: `${resultData.candidate.firstName} ${resultData.candidate.lastName}`,
          client: resultData.client?.clientName || "",
          hiringType: resultData.hiringType,
          startDate: resultData.startDate,
          endDate: resultData.endDate,
          signUpContract: resultData.signUpContract,
          deliveryOfLaptop: resultData.deliveryOfLaptop,
          easePortalSetUp: resultData.easePortalSetUp,
          workOrder: resultData.workOrder,
          backgroundCheck: resultData.backgroundCheck,
        };

        if (defaultStatus) {
        fullReport.push([fields.candidateName, fields.client, fields.hiringType, fields.startDate, fields.endDate, fields.signUpContract, fields.deliveryOfLaptop, fields.easePortalSetUp, fields.workOrder, fields.backgroundCheck])
        }
        else {
        let customData = [fields.candidateName];
        for (let obj of tableFields) {
          if (selectedFields.includes(obj.key)) {
            customData.push(fields[obj.value])
          }

        }
        fullReport.push(customData);
        }

        if (selectedOnboarding) {
        if (resultData.id === parseInt(selectedOnboarding.id)) {
          individualReport = [
              { text: fields.candidateName, style: "header" },
              "\n",
              { table: {
              headerRows: 1,
              heights: [10,20],
              body: [
                defaultPDFHeaders.slice(1),
                [fields.client, fields.hiringType, fields.startDate, fields.endDate, fields.signUpContract, fields.deliveryOfLaptop, fields.easePortalSetUp, fields.workOrder, fields.backgroundCheck]
              ]
              }},
              "\n"
          ];
        }
        } 
    }
    let widths = Array(fullReport[0].length).fill("auto");
    let pdfReport = { 
        pageSize: "LETTER",
          content: selectedOnboarding
        ? [
              { image: "companyLogo", fit: [120, 120] },
              "\n\n",
              individualReport,
              { text: `Date generated: ${currentDate}`, italics: true },
          ]
        : [
              { image: "companyLogo", fit: [120, 120] },
              "\n\n",
              { text: `Onboarding Summary Report`, style: "header" },
              "\n",
              {
              table: {
              headerRows: 1,
              widths: widths,
              body: fullReport,
              },
              },
              "\n",
              { text: `Date generated: ${currentDate}`, italics: true },
          ],
        images: {
        companyLogo: `data:image/png;base64, ${imageCodes.companyLogo}`,
        },
        defaultStyle: { fontSize: 10, bold: false },
        styles: { 
          header: { fontSize: 22, bold: true },
          subheader: { fontSize: 15, bold: true, margin: [0, 0, 0, 5], color: "#3432b8", opacity: .5 },
        },
        pageOrientation: "landscape",
        pageMargins: [20, 25, 20, 20],
    }

    return pdfReport;
  },
      userCSVExcel: (results, defaultStatus, selectedFields, tableFields) => {
    const reportData = [];
    let csvExcelHeaders = [{ label: "Username", value: "username", key: "username" }];

    if (defaultStatus) {
      csvExcelHeaders = csvExcelHeaders.concat(tableFields);
    } else {
      for (let obj of tableFields) {
        if (selectedFields.includes(obj.key)) {
          csvExcelHeaders.push(obj);
        }
      }
    }
  for (let i = 0; i < results.length; i++) {
      const resultData = results[i].data;
      let userData = {};

      let data = {
        username: resultData.username,
        fullName: `${resultData.firstName} ${resultData.lastName}`,
        email: resultData.email,
        roles: resultData.roles[0].roleName,
        phoneNumber: resultData.phoneNumber,
        activationDate: resultData.activationDate,
        futureRoles: resultData.futureRoles.map((futureRoles) => futureRoles.roleName).join(", "),

        futureActivationDate: resultData.futureActivationDate,
      };

      if (defaultStatus) {
        for (let key in data) {
          userData[key] = data[key];
        }    
      } else {
        userData.username = data.username;
        for (let selected of selectedFields) {
          userData[selected] = data[selected];
        }
      }

      reportData.push(userData);
    }
    return [reportData, csvExcelHeaders];
  },
  
  userPdfFormat: (results, defaultStatus, selectedFields, tableFields, selectedUser) => {
    let fullReport = [];
    let individualReport = [];
    let defaultPDFHeaders = ["Username", "Full Name", "Email","Phone Number", "Role","Activation Date", "Future Role","Future Activation Date",].map(item => {return { text: item, bold: true, fontSize: 11, alignment: "center", fillColor: "#3432b8", fillOpacity: .1}});
    let customPDFHeaders = ["Username"];
    let currentDate = new Date();

    if (defaultStatus) {
        fullReport.push(defaultPDFHeaders);
    } else {
        for(let obj of tableFields) {
        if (selectedFields.includes(obj.key)) {
          customPDFHeaders.push(obj.label)
        }
        }
        customPDFHeaders = customPDFHeaders.map(item => {return { text: item, bold: true, fontSize: 11, alignment: "center", fillColor: "#3432b8", fillOpacity: .1}});
        fullReport.push(customPDFHeaders);
    }

    for (let i = 0; i < results.length; i++) {
      const resultData = results[i].data;

      let fields = {
        name: resultData.username,
        fullName: `${resultData.firstName} ${resultData.lastName}`,

        email: resultData.email,
        phoneNumber: resultData.phoneNumber,
        roles: resultData.roles.map((roles) => roles.roleName).join(", "),
        activationDate:resultData.activationDate,
        futureRoles: resultData.futureRoles.map((futureRoles) => futureRoles.roleName).join(", "),
        futureActivationDate:resultData.futureActivationDate
      };

      if (defaultStatus) {
        fullReport.push([fields.name, fields.fullName, fields.email, fields.phoneNumber,fields.roles,fields.activationDate,fields.futureRoles,fields.futureActivationDate])
      } else {
        let customData = [fields.name];
        for (let obj of tableFields) {
          if (selectedFields.includes(obj.key)) {
            customData.push(fields[obj.value])
          }

        }
        fullReport.push(customData);
        }
      
      if (selectedUser) {
          if (resultData.id === parseInt(selectedUser.id)) {
            individualReport = [
                { text: fields.name, style: "header" },
                "\n",
                { table: {
                headerRows: 1,
                heights: [10,20],
                body: [
                  defaultPDFHeaders.slice(1),
                  [ fields.fullName, fields.email,fields.phoneNumber, fields.roles,fields.activationDate, fields.futureRoles,fields.futureActivationDate]
                ]
                }},
                "\n"
            ];
          }
      } 
    }
    let widths = Array(fullReport[0].length).fill("auto");
    let pdfReport = {
      pageSize: "LETTER",
        content: selectedUser
      ? [
            { image: "companyLogo", fit: [120, 120] },
            "\n\n",
            individualReport,
            { text: `Date generated: ${currentDate}`, italics: true },
        ]
      : [
            { image: "companyLogo", fit: [120, 120] },
            "\n\n",
            { text: `User Summary Report`, style: "header" },
            "\n",
            {
            table: {
            headerRows: 1,
            widths: widths,
            body: fullReport,
            },
            },
            "\n",
            { text: `Date generated: ${currentDate}`, italics: true },
        ],
      images: {
      companyLogo: `data:image/png;base64, ${imageCodes.companyLogo}`,
      },
      defaultStyle: { fontSize: 10, bold: false },
      styles: { 
        header: { fontSize: 22, bold: true },
        subheader: { fontSize: 15, bold: true, margin: [0, 0, 0, 5], color: "#3432b8", opacity: .5 },
      },
      pageOrientation: "landscape",
      pageMargins: [20, 25, 20, 20],
    }

    return pdfReport;
  },


  vendorCSVExcel: (results, defaultStatus, selectedFields, tableFields) => {
    const reportData = [];
    let csvExcelHeaders = [{ label: "Company", key: "company", value: "company" }];

    if (defaultStatus) {
      csvExcelHeaders = csvExcelHeaders.concat(tableFields);
    } else {
      for (let obj of tableFields) {
        if (selectedFields.includes(obj.key)) {
          csvExcelHeaders.push(obj);
        }
      }
    }

    for (let i = 0; i < results.length; i++) {
      const resultData = results[i].data;
      let vendorData = {};

      let data = {
        company: resultData.company,
        pointOfContact: resultData.pointOfContact,
        email: resultData.email,
        phoneNo: resultData.phoneNo,
        location: resultData.address.city,
      };

      if (defaultStatus) {
        for (let key in data) {
          vendorData[key] = data[key];
        }
      } else {
        vendorData.company = data.company;
        for (let selected of selectedFields) {
          vendorData[selected] = data[selected];
        }
      }

      reportData.push(vendorData);
    }
    return [reportData, csvExcelHeaders];
  },
  vendorPdfFormat: (results, defaultStatus, selectedFields, tableFields, selectedVendor) => {
    let fullReport = [];
    let individualReport = [];
    let defaultPDFHeaders = ["Company","Point Of Contact", "Contact #", "Email", "Location", ].map(item => {return { text: item, bold: true, fontSize: 11, alignment: "center", fillColor: "#3432b8", fillOpacity: .1}});
    let customPDFHeaders = ["Company"];
    let currentDate = new Date();

    if (defaultStatus) {
      fullReport.push(defaultPDFHeaders);
    } else {
      for(let obj of tableFields) {
        if (selectedFields.includes(obj.key)) {
          customPDFHeaders.push(obj.label)
        }
      }
      customPDFHeaders = customPDFHeaders.map(item => {return { text: item, bold: true, fontSize: 11, alignment: "center", fillColor: "#3432b8", fillOpacity: .1}});
      fullReport.push(customPDFHeaders);
    }

    for (let i = 0; i < results.length; i++) {
      const resultData = results[i].data;

      let fields = {
        company: resultData.company,
        pointOfContact: resultData.pointOfContact,
        phoneNo: resultData.phoneNo,
        email: resultData.email,
        location: resultData.address?.city || "",
      };

      if (defaultStatus) {
        fullReport.push([fields.company,fields.pointOfContact, fields.phoneNo, fields.email, fields.location])
      } else {
        let customData = [fields.company];
        for (let selected of selectedFields) {
          customData.push(fields[selected]);
        }
        fullReport.push(customData);
      }

      if (selectedVendor) {
        if (resultData.id === parseInt((selectedVendor.id)) ){
          individualReport = [
            { text: fields.company, style: "header" },
            "\n",
            { table: {
              headerRows: 1,
              heights: [10,20],
              body: [
                defaultPDFHeaders.slice(1),
                [fields.company,
                  fields.pointOfContact,
                  fields.email,
                  fields.phoneNo,
                  fields.location]
              ]
            }},
            "\n"
          ];
        }
      } 
    }
    let widths = Array(fullReport[0].length).fill("auto");
    let pdfReport = {
      pageSize: "LETTER",
      content: selectedVendor
        ? [
            { image: "companyLogo", fit: [120, 120] },
            "\n\n",
            individualReport,
            { text: `Date generated: ${currentDate}`, italics: true },
          ]
        : [
            { image: "companyLogo", fit: [120, 120] },
            "\n\n",
            { text: `Vendor Summary Report`, style: "header" },
            "\n",
            {
            table: {
              headerRows: 1,
              widths: widths,
              body: fullReport,
            },
            },
            "\n",
            { text: `Date generated: ${currentDate}`, italics: true },
          ],
        images: {
        companyLogo: `data:image/png;base64, ${imageCodes.companyLogo}`,
        },
        defaultStyle: { fontSize: 10, bold: false },
        styles: { 
          header: { fontSize: 22, bold: true },
          subheader: { fontSize: 15, bold: true, margin: [0, 0, 0, 5], color: "#3432b8", opacity: .5 },
        },
        pageOrientation: "landscape",
        pageMargins: [20, 25, 20, 20],
    }

    return pdfReport;
  },
  supplierPdfFormat: (results, defaultStatus, selectedFields, tableFields, selectedSupplier) => {
    let fullReport = [];
    let individualReport = [];
    let defaultPDFHeaders = ["Name","Supplier","Email","PhoneNumber","status","Location","netTerms","w8Bene","d590","w9","a1099"].map(item => {return { text: item, bold: true, fontSize: 11, alignment: "center", fillColor: "#3432b8", fillOpacity: .1}});
    let customPDFHeaders = ["Name"];
    let currentDate = new Date();

    if (defaultStatus) {
      fullReport.push(defaultPDFHeaders);
    } else {
      for(let obj of tableFields) {
        if (selectedFields.includes(obj.key)) {
          customPDFHeaders.push(obj.label)
        }
      }
      customPDFHeaders = customPDFHeaders.map(item => {return { text: item, bold: true, fontSize: 11, alignment: "center", fillColor: "#3432b8", fillOpacity: .1}});
      fullReport.push(customPDFHeaders);
    }

    for (let i = 0; i < results.length; i++) {
      const resultData = results[i].data;

      let fields = {
        fullName: `${resultData.firstName} ${resultData.lastName}`,
        supplierCompanyName:resultData.supplierCompanyName,
        email: resultData.email,
        phone_no: resultData.phone_no,
        location: `${resultData.address?.city}, ${resultData.address?.state}, ${resultData.address?.country}`,
        status:resultData.status,
        netTerms:resultData.netTerms,
        w8Bene:resultData.w8Bene,
        d590:resultData.d590,
        w9:resultData.w9,
        a1099:resultData.a1099,
        certificateOfInsurance:resultData.certificateOfInsurance,
        contractStartDate:resultData.contractStartDate,
        contractEndDate:resultData.contractEndDate
       
      }

      if (defaultStatus) {
        fullReport.push([fields.fullName,fields.supplierCompanyName, fields.email, fields.phone_no, fields.status, fields.location,fields.netTerms,fields.w8Bene, fields.d590,fields.w9, fields.a1099])
      } else {
        let customData = [fields.fullName];
         for (let obj of tableFields) {
          if (selectedFields.includes(obj.key)) {
            customData.push(fields[obj.value])
          }

        }
        fullReport.push(customData);
      }

    
      
      if (selectedSupplier) {
        if (resultData.id === parseInt(selectedSupplier.id)) {
          individualReport = [
            { text: fields.fullName, style: "header" },
            "\n",
            { table: {
              headerRows: 1,
              heights: [10,20],
              body: [
                defaultPDFHeaders.slice(1),
                [fields.supplierCompanyName,fields.email,fields.phone_no,fields.status,fields.location,fields.netTerms,fields.w8Bene,fields.d590,fields.w9,fields.a1099]
              ]
            }},
            "\n"
          ];
        }
      } 
    }
    let widths = Array(fullReport[0].length).fill("auto");
    let pdfReport = {
      pageSize: "LETTER",
	 content: selectedSupplier
 
        ? [
            { image: "companyLogo", fit: [120, 120] },
            "\n\n",
            individualReport,
            { text: `Date generated: ${currentDate}`, italics: true },
          ]
        : [
            { image: "companyLogo", fit: [120, 120] },
            "\n\n",
            { text: `Supplier Summary Report`, style: "header" },
            "\n",
            {
            table: {
              headerRows: 1,
              widths: widths,
              body: fullReport,
            },
            },
            "\n",
            { text: `Date generated: ${currentDate}`, italics: true },
          ],
        images: {
        companyLogo: `data:image/png;base64, ${imageCodes.companyLogo}`,
        },
        defaultStyle: { fontSize: 10, bold: false },
        styles: { 
          header: { fontSize: 22, bold: true },
          subheader: { fontSize: 15, bold: true, margin: [0, 0, 0, 5], color: "#3432b8", opacity: .5 },
        },
        pageOrientation: "landscape",
        pageMargins: [20, 25, 20, 20],
    }

    return pdfReport;
  },
  supplierCSVExcel: (results, defaultStatus, selectedFields, tableFields) => {
    const reportData = [];
    let csvExcelHeaders = [{ label: "Name", key: "fullName", value: "fullName" }];

    if (defaultStatus) {
      csvExcelHeaders = csvExcelHeaders.concat(tableFields);
    } else {
      for (let obj of tableFields) {
        if (selectedFields.includes(obj.key)) {
          csvExcelHeaders.push(obj);
        }
      }
    }

    for (let i = 0; i < results.length; i++) {
      const resultData = results[i].data;
      let supplierData = {};

      let data = {
        fullName: `${resultData.firstName} ${resultData.lastName}`,
        email: resultData.email,
        phone_no: resultData.phone_no,
        location: `${resultData.address?.city}, ${resultData.address?.state}, ${resultData.address?.country}`,
        status:resultData.status,
        supplierCompanyName:resultData.supplierCompanyName,
        netTerms:resultData.netTerms,
        w8Bene:resultData.w8Bene,
        d590:resultData.d590,
        w9:resultData.w9,
        a1099:resultData.a1099,
        certificateOfInsurance:resultData.certificateOfInsurance,
       contractStartDate:resultData.contractStartDate,
       contractEndDate:resultData.contractEndDate
            };

      if (defaultStatus) {
        for (let key in data) {
          supplierData[key] = data[key];
        }
      } else {
        supplierData.fullName = data.fullName;
        for (let selected of selectedFields) {
          supplierData[selected] = data[selected];
        }
      }

      reportData.push(supplierData);
    }
    return [reportData, csvExcelHeaders];
  },
  ratecardPdfFormat: (results, defaultStatus, selectedFields, tableFields, selectedRateCard) => {
    let fullReport = [];
   let individualReport = [];
    let defaultPDFHeaders = ["Worker Name","Worker Status","Client","VMS Provider","pass Thur","Seller","Recruiter"].map(item => {return { text: item, bold: true, fontSize: 11, alignment: "center", fillColor: "#3432b8", fillOpacity: .1}});
    let customPDFHeaders = ["Worker Name"];
    let currentDate = new Date();
  
    if (defaultStatus) {
      fullReport.push(defaultPDFHeaders);
    } else {
      for(let obj of tableFields) {
        if (selectedFields.includes(obj.key)) {
          customPDFHeaders.push(obj.label)
        }
      }
      customPDFHeaders = customPDFHeaders.map(item => {return { text: item, bold: true, fontSize: 11, alignment: "center", fillColor: "#3432b8", fillOpacity: .1}});
      fullReport.push(customPDFHeaders);
    }
  
    for (let i = 0; i < results.length; i++) {
      const resultData = results[i].data;
  
      let fields = {
         worker:`${resultData?.worker.firstName} ${resultData?.worker.lastName}`,
        workerStatus: resultData.workerStatus,
        client: resultData.client.clientName,
        customer: resultData.customer,
        source: resultData.source,
        seller:resultData.seller,
        recruiter:resultData.recruiter     }
  
      if (defaultStatus) {
        fullReport.push([fields.worker,fields.workerStatus, fields.client, fields.customer, fields.source, fields.seller,fields.recruiter])
      } else {
        let customData = [fields.worker];
        for (let obj of tableFields) {
          if (selectedFields.includes(obj.key)) {
            customData.push(fields[obj.value])
          }}
        fullReport.push(customData);
      }
  
    
      if (selectedRateCard) {
        if (resultData.id === parseInt((selectedRateCard.id)) ){
          individualReport = [
            { text: fields.worker, style: "header" },
            "\n",
            { table: {
              headerRows: 1,
              heights: [10,20],
              body: [
                defaultPDFHeaders.slice(1),
                [fields.workerStatus, fields.client, fields.customer, fields.source, fields.seller,fields.recruiter]
              ]
            }},
            "\n"
          ];
        }
      } 
    }
    let widths = Array(fullReport[0].length).fill("auto");
    let pdfReport = {
      pageSize: "LETTER",
       content: selectedRateCard
     

        ? [
            { image: "companyLogo", fit: [120, 120] },
            "\n\n",
            individualReport,
            { text: `Date generated: ${currentDate}`, italics: true },
          ]
        : [
            { image: "companyLogo", fit: [120, 120] },
            "\n\n",
            { text: `RateCard Summary Report`, style: "header" },
            "\n",
            {
            table: {
              headerRows: 1,
              widths: widths,
              body: fullReport,
            },
            },
            "\n",
            { text: `Date generated: ${currentDate}`, italics: true },
          ],
        images: {
        companyLogo: `data:image/png;base64, ${imageCodes.companyLogo}`,
        },
        defaultStyle: { fontSize: 10, bold: false },
        styles: { 
          header: { fontSize: 22, bold: true },
          subheader: { fontSize: 15, bold: true, margin: [0, 0, 0, 5], color: "#3432b8", opacity: .5 },
        },
        pageOrientation: "landscape",
        pageMargins: [20, 25, 20, 20],
    }
  
    return pdfReport;
  },
  ratecardCSVExcel: (results, defaultStatus, selectedFields, tableFields) => {
    const reportData = [];
    let csvExcelHeaders = [{ label: "worker Name", key: "worker", value: "worker" }];
  
    if (defaultStatus) {
      csvExcelHeaders = csvExcelHeaders.concat(tableFields);
    } else {
      for (let obj of tableFields) {
        if (selectedFields.includes(obj.key)) {
          csvExcelHeaders.push(obj);
        }
      }
    }
  
    for (let i = 0; i < results.length; i++) {
      const resultData = results[i].data;
      let rateCardData = {};
  
      let data = {
        worker:`${resultData.worker.firstName} ${resultData.worker.lastName}`,
        workerStatus: resultData.workerStatus,
        client: resultData.client.clientName,
        customer: resultData.customer,
        source: resultData.source,
        seller:resultData.seller,
        recruiter:resultData.recruiter
            };
  
      if (defaultStatus) {
        for (let key in data) {
          rateCardData[key] = data[key];
        }
      } else {
        rateCardData.worker = data.worker;
        for (let selected of selectedFields) {
          rateCardData[selected] = data[selected];
        }
      }
  
      reportData.push(rateCardData);
    }
    return [reportData, csvExcelHeaders];
  },
  visatrackingCSVExcel: (results, defaultStatus, selectedFields, tableFields) => {
    const reportData = [];
    let csvExcelHeaders = [{ label: "Worker Name", key: "worker", value: "worker" }];

    if (defaultStatus) {
      csvExcelHeaders = csvExcelHeaders.concat(tableFields);
    } else {
      for (let obj of tableFields) {
        if (selectedFields.includes(obj.key)) {
          csvExcelHeaders.push(obj);
        }
      }
    }

    for (let i = 0; i < results.length; i++) {
      const resultData = results[i].data;
      let visatrackingData = {};
      let data = {
      worker:`${resultData?.worker.firstName} ${resultData?.worker.lastName}`,
      countryOfBirth:resultData.countryOfBirth,
      visaCountry: resultData.visaCountry,
      visaCountryOfResidence: resultData.visaCountryOfResidence,
      visaType: resultData.visaType,
      visaStatus: resultData.visaStatus,
      visaStartDate: resultData.visaStartDate,
      visaAppliedDate: resultData.visaAppliedDate,
      visaExpiryDate: resultData.visaExpiryDate,
      };

      if (defaultStatus) {
        for (let key in data) {
          visatrackingData[key] = data[key];
        }
      } else {
        visatrackingData.worker = data.worker;
        for (let selected of selectedFields) {
          visatrackingData[selected] = data[selected];
        }
      }

      reportData.push(visatrackingData);
    }
    return [reportData, csvExcelHeaders];
  },
  visatrackingPdfFormat: (results, defaultStatus, selectedFields, tableFields, selectedVisatracking) => {
    let fullReport = [];
    let individualReport = [];
    let defaultPDFHeaders = ["Worker Name","Type", "Status", "Applied On", "Start Date","Expires On", "Citizen Of", "Birth Country","Resides In"].map(item => {return { text: item, bold: true, fontSize: 11, alignment: "center", fillColor: "#3432b8", fillOpacity: .1}});
    let customPDFHeaders = ["Worker Name"];
    let currentDate = new Date();

    if (defaultStatus) {
      fullReport.push(defaultPDFHeaders);
    } else {
      for(let obj of tableFields) {
        if (selectedFields.includes(obj.key)) {
          customPDFHeaders.push(obj.label)
        }
      }
      customPDFHeaders = customPDFHeaders.map(item => {return { text: item, bold: true, fontSize: 11, alignment: "center", fillColor: "#3432b8", fillOpacity: .1}});
      fullReport.push(customPDFHeaders);
    }

    for (let i = 0; i < results.length; i++) {
      const resultData = results[i].data;

      let fields = {
        worker:`${resultData?.worker.firstName} ${resultData?.worker.lastName}`,
        countryOfBirth:resultData.countryOfBirth,
        visaCountry: resultData.visaCountry,
        visaCountryOfResidence: resultData.visaCountryOfResidence,
        visaType: resultData.visaType,
        visaStatus: resultData.visaStatus,
        visaStartDate: resultData.visaStartDate,
        visaAppliedDate: resultData.visaAppliedDate,
        visaExpiryDate: resultData.visaExpiryDate,
      }

      if (defaultStatus) {
        fullReport.push([
          fields.worker,
          fields.visaType,
          fields.visaStatus,
          fields.visaAppliedDate,
          fields.visaStartDate,
          fields.visaExpiryDate,
          fields.visaCountry,
          fields.countryOfBirth,
          fields.visaCountryOfResidence,
        ]);
      } else {
        let customData = [fields.worker];
        for (let obj of tableFields) {
          if (selectedFields.includes(obj.key)) {
            customData.push(fields[obj.value])
          }}
        fullReport.push(customData);
      }

    
      if (selectedVisatracking) {
        if (resultData.id === parseInt((selectedVisatracking.id)) ){
          individualReport = [
            { text: fields.worker, style: "header" },
            "\n",
            {
              table: {
                headerRows: 1,
                heights: [10, 20],
                body: [
                  defaultPDFHeaders.slice(1),
                  [
                    fields.visaType,
                    fields.visaStatus,
                    fields.visaAppliedDate,
                    fields.visaStartDate,
                    fields.visaExpiryDate,
                    fields.visaCountry,
                    fields.countryOfBirth,
                    fields.visaCountryOfResidence,
                  ],
                ],
              },
            },
            "\n",
          ];
        }
      } 
    }
    let widths = Array(fullReport[0].length).fill("auto");
    let pdfReport = {
      pageSize: "LETTER",
			content: selectedVisatracking
        ? [
            { image: "companyLogo", fit: [120, 120] },
            "\n\n",
            individualReport,
            { text: `Date generated: ${currentDate}`, italics: true },
          ]
        : [
            { image: "companyLogo", fit: [120, 120] },
            "\n\n",
            { text: `Visa Details Summary Report`, style: "header" },
            "\n",
            {
            table: {
              headerRows: 1,
              widths: widths,
              body: fullReport,
            },
            },
            "\n",
            { text: `Date generated: ${currentDate}`, italics: true },
          ],
        images: {
        companyLogo: `data:image/png;base64, ${imageCodes.companyLogo}`,
        },
        defaultStyle: { fontSize: 10, bold: false },
        styles: { 
          header: { fontSize: 22, bold: true },
          subheader: { fontSize: 15, bold: true, margin: [0, 0, 0, 5], color: "#3432b8", opacity: .5 },
        },
        pageOrientation: "landscape",
        pageMargins: [20, 25, 20, 20],
    }

    return pdfReport;
  },


  projectCSVExcel: (results, defaultStatus, selectedFields, tableFields) => {
    const reportData = [];
    let csvExcelHeaders = [{ label: "Project", key: "projectName", value: "projectName" }];

    if (defaultStatus) {
      csvExcelHeaders = csvExcelHeaders.concat(tableFields);
    } else {
      for (let obj of tableFields) {
        if(selectedFields.includes(obj.key)) {
          csvExcelHeaders.push(obj);
        }
      }
    }

    for (let i = 0; i < results.length; i++) {
      const resultData = results[i].data;
      let projectData = {};

      let data = {
        projectName: resultData.projectName,
        // Client: resultData?.client.clientName,
        client: resultData.client?.clientName || "",

        worker:`${resultData?.worker.firstName} ${resultData?.worker.lastName}`,
        startDate: resultData.startDate,
        endDate:resultData.endDate,
        resourceManager: `${resultData?.resourceManager.firstName} ${resultData?.resourceManager.lastName}`,
        clientRate: resultData.clientRate,
        billRate: resultData.billRate,
        netBillRate: resultData.netBillRate,
        
      }

      if (defaultStatus) {
        for(let key in data) {
          projectData[key] = data[key]
        }
      } else {
        projectData.project = data.project;
          for(let selected of selectedFields) {
            projectData[selected] = data[selected]
          }
      }

      reportData.push(projectData);
    }
    return [reportData, csvExcelHeaders];
  },

  projectPdfFormat: (results, defaultStatus, selectedFields, tableFields, selectedProject) => {
    let fullReport = [];
    let individualReport = [];
    let defaultPDFHeaders = ["Project","Client","Worker","Start Date","End Date","Resource Manager", "Client Rate", "VMS Adjusted bill Rate","Rebate Adjusted bill Rate"].map(item => {return { text: item, bold: true, fontSize: 11, alignment: "center", fillColor: "#3432b8", fillOpacity: .1}});
    let customPDFHeaders = ["Project"];
    let currentDate = new Date();

    if (defaultStatus) {
      fullReport.push(defaultPDFHeaders);
    } else {
      for(let obj of tableFields) {
        if (selectedFields.includes(obj.key)) {
          customPDFHeaders.push(obj.label)
        }
      }
      customPDFHeaders = customPDFHeaders.map(item => {return { text: item, bold: true, fontSize: 11, alignment: "center", fillColor: "#3432b8", fillOpacity: .1}});
      fullReport.push(customPDFHeaders);
    }

    for (let i = 0; i < results.length; i++) {
      const resultData = results[i].data;

      let fields = {
        project: resultData.projectName,
        // Client: resultData?.client.clientName,
        client: resultData.client?.clientName || "",
        worker:`${resultData?.worker.firstName} ${resultData?.worker.lastName}`,
        startDate: resultData.startDate,
        endDate:resultData.endDate,
        resourceManager: `${resultData?.resourceManager.firstName} ${resultData?.resourceManager.lastName}`,
        clientRate: resultData.clientRate,
        billRate: resultData.billRate,
        netBillRate: resultData.netBillRate,
      }

      if (defaultStatus) {
        fullReport.push([fields.project,fields.client,fields.worker,fields.startDate,fields.endDate,fields.resourceManager,fields.clientRate, fields.billRate, fields.netBillRate])
      } else {
        let customData = [fields.project];
        for (let obj of tableFields) {
          if (selectedFields.includes(obj.key)) {
            customData.push(fields[obj.value])
          }

        }
        fullReport.push(customData);
      }

    
      if (selectedProject) {
        if (resultData.id === parseInt((selectedProject.id)) ){
          individualReport = [
            { text: fields.project, style: "header" },
            "\n",
            { table: {
              headerRows: 1,
              heights: [10,20],
              body: [
                defaultPDFHeaders.slice(1),
                [ fields.client,fields.worker,fields.startDate,fields.endDate,fields.resourceManager,fields.clientRate, fields.billRate,fields.netBillRate]
              ]
            }},
            "\n"
          ];
        }
      } 
    }
    let widths = Array(fullReport[0].length).fill("auto");
    let pdfReport = {
      pageSize: "LETTER",
			content: selectedProject
        ? [
            { image: "companyLogo", fit: [120, 120] },
            "\n\n",
            individualReport,
            { text: `Date generated: ${currentDate}`, italics: true },
          ]
        : [
            { image: "companyLogo", fit: [120, 120] },
            "\n\n",
            { text: `Project Summary Report`, style: "header" },
            "\n",
            {
            table: {
              headerRows: 1,
              widths: widths,
              body: fullReport,
            },
            },
            "\n",
            { text: `Date generated: ${currentDate}`, italics: true },
          ],
        images: {
        companyLogo: `data:image/png;base64, ${imageCodes.companyLogo}`,
        },
        defaultStyle: { fontSize: 10, bold: false },
        styles: { 
          header: { fontSize: 22, bold: true },
          subheader: { fontSize: 15, bold: true, margin: [0, 0, 0, 5], color: "#3432b8", opacity: .5 },
        },
        pageOrientation: "landscape",
        pageMargins: [20, 25, 20, 20],
    }

    return pdfReport;
  },
  
  workOrderCSVExcel: (results, defaultStatus, selectedFields, tableFields) => {
    const reportData = [];
    let csvExcelHeaders = [{ label: "Project", key: "project", value: "project" }];

    if (defaultStatus) {
      csvExcelHeaders = csvExcelHeaders.concat(tableFields);
    } else {
      for (let obj of tableFields) {
        if(selectedFields.includes(obj.key)) {
          csvExcelHeaders.push(obj);
        }
      }
    }

    for (let i = 0; i < results.length; i++) {
      const resultData = results[i].data;
      let workOrderData = {};

      let data = {
        project: `${resultData.project.projectName}`,
        
        worker:`${resultData?.worker.firstName} ${resultData?.worker.lastName}`,
        startDate: resultData.startDate,
        endDate:resultData.endDate,
        resourceManager: `${resultData?.project?.resourceManager.firstName} ${resultData?.project?.resourceManager.lastName}`,
        activeDate: resultData.activeDate,
        status: resultData.status,
        payRate: resultData.payRate,
        billRate: resultData.billRate,
        margin: resultData.margin,
       
        
      }

      if (defaultStatus) {
        for(let key in data) {
          workOrderData[key] = data[key]
        }
      } else {
        workOrderData.project = data.project;
          for(let selected of selectedFields) {
            workOrderData[selected] = data[selected]
          }
      }

      reportData.push(workOrderData);
    }
    return [reportData, csvExcelHeaders];
  },
  
  workOrderPdfFormat: (results, defaultStatus, selectedFields, tableFields, selectedWorkOrder) => {
    let fullReport = [];
    let individualReport = [];
    let defaultPDFHeaders = ["Project","Worker","Start Date","End Date","Resource Manager", "Active Date", "Status","Rebate Adjusted Bill Rate/hr ","C2C Pay Rate/hr","Margin/hr "].map(item => {return { text: item, bold: true, fontSize: 11, alignment: "center", fillColor: "#3432b8", fillOpacity: .1}});
    let customPDFHeaders = ["Project"];
    let currentDate = new Date();

    if (defaultStatus) {
      fullReport.push(defaultPDFHeaders);
    } else {
      for(let obj of tableFields) {
        if (selectedFields.includes(obj.key)) {
          customPDFHeaders.push(obj.label)
        }
      }
      customPDFHeaders = customPDFHeaders.map(item => {return { text: item, bold: true, fontSize: 11, alignment: "center", fillColor: "#3432b8", fillOpacity: .1}});
      fullReport.push(customPDFHeaders);
    }

    for (let i = 0; i < results.length; i++) {
      const resultData = results[i].data;

      let fields = {
        project: `${resultData.project.projectName}`,
        
        worker:`${resultData?.worker.firstName} ${resultData?.worker.lastName}`,
        startDate: resultData.startDate,
        endDate:resultData.endDate,
        resourceManager: `${resultData?.project?.resourceManager.firstName} ${resultData?.project?.resourceManager.lastName}`,
        activeDate: resultData.activeDate,
        status: resultData.status,
        payRate: resultData.payRate,
        billRate: resultData.billRate,
        margin: resultData.margin,
      }

      if (defaultStatus) {
        fullReport.push([fields.project,fields.worker,fields.startDate,fields.endDate,fields.resourceManager,fields.activeDate, fields.status, fields.payRate,fields.billRate,fields.margin])
      } else {
        let customData = [fields.project];
        for (let obj of tableFields) {
          if (selectedFields.includes(obj.key)) {
            customData.push(fields[obj.value])
          }

        }
        fullReport.push(customData);
      }

    
      if (selectedWorkOrder) {
        if (resultData.id === parseInt((selectedWorkOrder.id)) ){
          individualReport = [
            { text: fields.project, style: "header" },
            "\n",
            { table: {
              headerRows: 1,
              heights: [10,20],
              body: [
                defaultPDFHeaders.slice(1),
                [ fields.worker,fields.startDate,fields.endDate,fields.resourceManager,fields.activeDate, fields.status,fields.payRate,fields.billRate,fields.margin]
              ]
            }},
            "\n"
          ];
        }
      } 
    }
    let widths = Array(fullReport[0].length).fill("auto");
    let pdfReport = {
      pageSize: "LETTER",
			content: selectedWorkOrder
        ? [
            { image: "companyLogo", fit: [120, 120] },
            "\n\n",
            individualReport,
            { text: `Date generated: ${currentDate}`, italics: true },
          ]
        : [
            { image: "companyLogo", fit: [120, 120] },
            "\n\n",
            { text: `WorkOrder Summary Report`, style: "header" },
            "\n",
            {
            table: {
              headerRows: 1,
              widths: widths,
              body: fullReport,
            },
            },
            "\n",
            { text: `Date generated: ${currentDate}`, italics: true },
          ],
        images: {
        companyLogo: `data:image/png;base64, ${imageCodes.companyLogo}`,
        },
        defaultStyle: { fontSize: 10, bold: false },
        styles: { 
          header: { fontSize: 22, bold: true },
          subheader: { fontSize: 15, bold: true, margin: [0, 0, 0, 5], color: "#3432b8", opacity: .5 },
        },
        pageOrientation: "landscape",
        pageMargins: [20, 25, 20, 20],
    }

    return pdfReport;
  },
  commissionTypeCSVExcel: (results, defaultStatus, selectedFields, tableFields) => {
    const reportData = [];
    let csvExcelHeaders = [{ label: "Commission Type", key: "name", value: "name" }];

    if (defaultStatus) {
      csvExcelHeaders = csvExcelHeaders.concat(tableFields);
    } else {
      for (let obj of tableFields) {
        if(selectedFields.includes(obj.key)) {
          csvExcelHeaders.push(obj);
        }
      }
    }

    for (let i = 0; i < results.length; i++) {
      const resultData = results[i].data;
      let commissionTypeData = {};

      let data = {
        name: resultData.name,
        commRate: resultData.commRate,
        commMargin:resultData.commMargin,
        
      }

      if (defaultStatus) {
        for(let key in data) {
          commissionTypeData[key] = data[key]
        }
      } else {
        commissionTypeData.name = data.name;
          for(let selected of selectedFields) {
            commissionTypeData[selected] = data[selected]
          }
      }

      reportData.push(commissionTypeData);
    }
    return [reportData, csvExcelHeaders];
  },

  commissionTypePdfFormat: (results, defaultStatus, selectedFields, tableFields, selectedcommissionType) => {
    let fullReport = [];
    let individualReport = [];
    let defaultPDFHeaders = ["Commission Type","Commission Rate","Margin Bracket ($)"].map(item => {return { text: item, bold: true, fontSize: 11, alignment: "center", fillColor: "#3432b8", fillOpacity: .1}});
    let customPDFHeaders = ["Commission Type"];
    let currentDate = new Date();

    if (defaultStatus) {
      fullReport.push(defaultPDFHeaders);
    } else {
      for(let obj of tableFields) {
        if (selectedFields.includes(obj.key)) {
          customPDFHeaders.push(obj.label)
        }
      }
      customPDFHeaders = customPDFHeaders.map(item => {return { text: item, bold: true, fontSize: 11, alignment: "center", fillColor: "#3432b8", fillOpacity: .1}});
      fullReport.push(customPDFHeaders);
    }

    for (let i = 0; i < results.length; i++) {
      const resultData = results[i].data;

      let fields = {
        name: resultData.name,
        commRate: resultData.commRate,
        commMargin:resultData.commMargin,
        
      }

      if (defaultStatus) {
        fullReport.push([fields.name,fields.commRate,fields.commMargin])
      } else {
        let customData = [fields.name];
        for (let obj of tableFields) {
          if (selectedFields.includes(obj.key)) {
            customData.push(fields[obj.value])
          }

        }
        fullReport.push(customData);
      }

    
      if (selectedcommissionType) {
        if (resultData.id === parseInt((selectedcommissionType.id)) ){
          individualReport = [
            { text: fields.name, style: "header" },
            "\n",
            { table: {
              headerRows: 1,
              heights: [10,20],
              body: [
                defaultPDFHeaders.slice(1),
                [ fields.commRate,fields.commMargin]
              ]
            }},
            "\n"
          ];
        }
      } 
    }
    let widths = Array(fullReport[0].length).fill("auto");
    let pdfReport = {
      pageSize: "LETTER",
			content: selectedcommissionType
        ? [
            { image: "companyLogo", fit: [120, 120] },
            "\n\n",
            individualReport,
            { text: `Date generated: ${currentDate}`, italics: true },
          ]
        : [
            { image: "companyLogo", fit: [120, 120] },
            "\n\n",
            { text: `Commission Type Summary Report`, style: "header" },
            "\n",
            {
            table: {
              headerRows: 1,
              widths: widths,
              body: fullReport,
            },
            },
            "\n",
            { text: `Date generated: ${currentDate}`, italics: true },
          ],
        images: {
        companyLogo: `data:image/png;base64, ${imageCodes.companyLogo}`,
        },
        defaultStyle: { fontSize: 10, bold: false },
        styles: { 
          header: { fontSize: 22, bold: true },
          subheader: { fontSize: 15, bold: true, margin: [0, 0, 0, 5], color: "#3432b8", opacity: .5 },
        },
        pageOrientation: "landscape",
        pageMargins: [20, 25, 20, 20],
    }

    return pdfReport;
  },

  commissionCSVExcel: (results, defaultStatus, selectedFields, tableFields) => {
    const reportData = [];
    let csvExcelHeaders = [{ label: "Resource Manager", key: "resourceManager", value: "resourceManager" }];

    if (defaultStatus) {
      csvExcelHeaders = csvExcelHeaders.concat(tableFields);
    } else {
      for (let obj of tableFields) {
        if(selectedFields.includes(obj.key)) {
          csvExcelHeaders.push(obj);
        }
      }
    }

    for (let i = 0; i < results.length; i++) {
      const resultData = results[i].data;
      let commissioneData = {};

      let data = {
        resourceManager: `${resultData.resourceManager?.firstName} ${resultData.resourceManager?.lastName}`,
        role: `${resultData.resourceManager?.role}`,
        startDate:resultData.startDate,
        endDate:resultData.endDate,
        commissionAmount:resultData.commissionAmount
        
      }

      if (defaultStatus) {
        for(let key in data) {
          commissioneData[key] = data[key]
        }
      } else {
        commissioneData.resourceManager = data.resourceManager;
          for(let selected of selectedFields) {
            commissioneData[selected] = data[selected]
          }
      }

      reportData.push(commissioneData);
    }
    return [reportData, csvExcelHeaders];
  },

  commissionPdfFormat: (results, defaultStatus, selectedFields, tableFields, selectedcommission) => {
    let fullReport = [];
    let individualReport = [];
    let defaultPDFHeaders = ["Resource Manager","Role","Start Date","End Date","Commission Amount"].map(item => {return { text: item, bold: true, fontSize: 11, alignment: "center", fillColor: "#3432b8", fillOpacity: .1}});
    let customPDFHeaders = ["Resource Manager"];
    let currentDate = new Date();

    if (defaultStatus) {
      fullReport.push(defaultPDFHeaders);
    } else {
      for(let obj of tableFields) {
        if (selectedFields.includes(obj.key)) {
          customPDFHeaders.push(obj.label)
        }
      }
      customPDFHeaders = customPDFHeaders.map(item => {return { text: item, bold: true, fontSize: 11, alignment: "center", fillColor: "#3432b8", fillOpacity: .1}});
      fullReport.push(customPDFHeaders);
    }

    for (let i = 0; i < results.length; i++) {
      const resultData = results[i].data;

      let fields = {
        resourceManager: `${resultData.resourceManager?.firstName} ${resultData.resourceManager?.lastName}`,
        role: `${resultData.resourceManager?.role}`,
        startDate:resultData.startDate,
        endDate:resultData.endDate,
        commissionAmount:resultData.commissionAmount
        
      }

      if (defaultStatus) {
        fullReport.push([fields.resourceManager,fields.role,fields.startDate,fields.endDate,fields.commissionAmount])
      } else {
        let customData = [fields.resourceManager];
        for (let obj of tableFields) {
          if (selectedFields.includes(obj.key)) {
            customData.push(fields[obj.value])
          }

        }
        fullReport.push(customData);
      }

    
      if (selectedcommission) {
        if (resultData.id === parseInt((selectedcommission.id)) ){
          individualReport = [
            { text: fields.resourceManager, style: "header" },
            "\n",
            { table: {
              headerRows: 1,
              heights: [10,20],
              body: [
                defaultPDFHeaders.slice(1),
                [ fields.role,fields.startDate,fields.endDate,fields.commissionAmount]
              ]
            }},
            "\n"
          ];
        }
      } 
    }
    let widths = Array(fullReport[0].length).fill("auto");
    let pdfReport = {
      pageSize: "LETTER",
			content: selectedcommission
        ? [
            { image: "companyLogo", fit: [120, 120] },
            "\n\n",
            individualReport,
            { text: `Date generated: ${currentDate}`, italics: true },
          ]
        : [
            { image: "companyLogo", fit: [120, 120] },
            "\n\n",
            { text: `Commission Summary Report`, style: "header" },
            "\n",
            {
            table: {
              headerRows: 1,
              widths: widths,
              body: fullReport,
            },
            },
            "\n",
            { text: `Date generated: ${currentDate}`, italics: true },
          ],
        images: {
        companyLogo: `data:image/png;base64, ${imageCodes.companyLogo}`,
        },
        defaultStyle: { fontSize: 10, bold: false },
        styles: { 
          header: { fontSize: 22, bold: true },
          subheader: { fontSize: 15, bold: true, margin: [0, 0, 0, 5], color: "#3432b8", opacity: .5 },
        },
        pageOrientation: "landscape",
        pageMargins: [20, 25, 20, 20],
    }

    return pdfReport;
  },
  timesheetCSVExcel: (results, defaultStatus, selectedFields, tableFields) => {
    const reportData = [];
    let csvExcelHeaders = [{ label: "Worker Name", key: "worker", value: "worker" }];
  
    if (defaultStatus) {
      csvExcelHeaders = csvExcelHeaders.concat(tableFields);
    } else {
      for (let obj of tableFields) {
        if (selectedFields.includes(obj.key)) {
          csvExcelHeaders.push(obj);
        }
      }
    }

    
    for (let i = 0; i < results.length; i++) {
      const resultData = results[i].data;
      let timesheetData = {};
  
      let data = {
        worker:`${resultData.worker.firstName} ${resultData.worker.lastName}`,
        client: resultData.workOrder.project.client.clientName,
        timeSheetStatus: resultData.timeSheetStatus,
        updatedOn: resultData.updatedOn,
        billableHours: resultData.billableHours,
        timesheetWeekDays: resultData.timesheetWeekDays?.saturdayDate,
        resume: resultData.resume?.resumeName,
      comments: resultData.comments,
            };
  
      if (defaultStatus) {
        for (let key in data) {
          timesheetData[key] = data[key];
        }
      } else {
        timesheetData.worker = data.worker;
        for (let selected of selectedFields) {
          timesheetData[selected] = data[selected];
        }
      }
  
      reportData.push(timesheetData);
    }
    return [reportData, csvExcelHeaders];
  },

  timesheetPdfFormat: (results, defaultStatus, selectedFields, tableFields, selectedTimesheet) => {
    let fullReport = [];
    let individualReport = [];
    let defaultPDFHeaders = ["Worker Name","Client","Timesheet Status","Updated On","Bill Able Hours","Timesheet Weekdays","Resume","Comments"].map(item => {return { text: item, bold: true, fontSize: 11, alignment: "center", fillColor: "#3432b8", fillOpacity: .1}});
    let customPDFHeaders = ["Worker Name"];
    let currentDate = new Date();
  
    if (defaultStatus) {
      fullReport.push(defaultPDFHeaders);
    } else {
      for(let obj of tableFields) {
        if (selectedFields.includes(obj.key)) {
          customPDFHeaders.push(obj.label)
        }
      }
      customPDFHeaders = customPDFHeaders.map(item => {return { text: item, bold: true, fontSize: 11, alignment: "center", fillColor: "#3432b8", fillOpacity: .1}});
      fullReport.push(customPDFHeaders);
    }
  
    for (let i = 0; i < results.length; i++) {
      const resultData = results[i].data;
  
      let fields = {
        worker:`${resultData.worker.firstName} ${resultData.worker.lastName}`,
        client: resultData.workOrder.project.client.clientName,
        timeSheetStatus: resultData.timeSheetStatus,
        updatedOn: resultData.updatedOn,
        billableHours: resultData.billableHours,
        timesheetWeekDays: resultData.timesheetWeekDays?.saturdayDate,
        resume: resultData.resume?.resumeName,
      comments: resultData.comments,
      }
  
      if (defaultStatus) {
        fullReport.push([fields.worker,fields.client,fields.timeSheetStatus,fields.updatedOn,fields.billableHours,fields.timesheetWeekDays,fields.resume,fields.comments])
      } else {
        let customData = [fields.worker];
        for (let obj of tableFields) {
          if (selectedFields.includes(obj.key)) {
            customData.push(fields[obj.value])
          }
  
        }
        fullReport.push(customData);
      }
  
    
      if (selectedTimesheet) {
        if (resultData.id === parseInt((selectedTimesheet.id)) ){
          individualReport = [
            { text: fields.worker, style: "header" },
            "\n",
            { table: {
              headerRows: 1,
              heights: [10,20],
              body: [
                defaultPDFHeaders.slice(1),
                [ fields.client,fields.timeSheetStatus,fields.updatedOn,fields.billableHours,fields.timesheetWeekDays,fields.resume,fields.comments]
              ]
            }},
            "\n"
          ];
        }
      } 
    }
    let widths = Array(fullReport[0].length).fill("auto");
    let pdfReport = {
      pageSize: "LETTER",
      content: selectedTimesheet
        ? [
            { image: "companyLogo", fit: [120, 120] },
            "\n\n",
            individualReport,
            { text: `Date generated: ${currentDate}`, italics: true },
          ]
        : [
            { image: "companyLogo", fit: [120, 120] },
            "\n\n",
            { text: `Timesheet Summary Report`, style: "header" },
            "\n",
            {
            table: {
              headerRows: 1,
              widths: widths,
              body: fullReport,
            },
            },
            "\n",
            { text: `Date generated: ${currentDate}`, italics: true },
          ],
        images: {
        companyLogo: `data:image/png;base64, ${imageCodes.companyLogo}`,
        },
        defaultStyle: { fontSize: 10, bold: false },
        styles: { 
          header: { fontSize: 22, bold: true },
          subheader: { fontSize: 15, bold: true, margin: [0, 0, 0, 5], color: "#3432b8", opacity: .5 },
        },
        pageOrientation: "landscape",
        pageMargins: [20, 25, 20, 20],
    }

    return pdfReport;
  },
  calenderPdfFormat: (results, defaultStatus, selectedFields, tableFields, selectedCalender) => {
    let fullReport = [];
    let individualReport = [];
    let defaultPDFHeaders = ["Status", "Start Date",  "End Date", ].map(item => {return { text: item, bold: true, fontSize: 11, alignment: "center", fillColor: "#3432b8", fillOpacity: .1}});
    let customPDFHeaders = ["Status"];
    let currentDate = new Date();

    if (defaultStatus) {
        fullReport.push(defaultPDFHeaders);
    } else {
        for(let obj of tableFields) {
        if (selectedFields.includes(obj.key)) {
          customPDFHeaders.push(obj.label)
        }
        }
        customPDFHeaders = customPDFHeaders.map(item => {return { text: item, bold: true, fontSize: 11, alignment: "center", fillColor: "#3432b8", fillOpacity: .1}});
        fullReport.push(customPDFHeaders);
    }

    for (let i = 0; i < results.length; i++) {
        const resultData = results[i].data;

        let fields = {
          calender_status: resultData.calender_status,
          startDate: resultData.startDate,
          endDate: resultData.endDate,
        };

        if (defaultStatus) {
        fullReport.push([fields.calender_status, fields.startDate, fields.endDate])
        }
        else {
        let customData = [fields.calender_status];
        for (let obj of tableFields) {
          if (selectedFields.includes(obj.key)) {
            customData.push(fields[obj.value])
          }

        }
        fullReport.push(customData);
        }

        if (selectedCalender) {
        if (resultData.id === parseInt(selectedCalender.id)) {
          individualReport = [
              { text: fields.calender_status, style: "header" },
              "\n",
              { table: {
              headerRows: 1,
              heights: [10,20],
              body: [
                defaultPDFHeaders.slice(1),
                [fields.calender_status, fields.startDate, fields.endDate]
              ]
              }},
              "\n"
          ];
        }
        } 
    }
    let widths = Array(fullReport[0].length).fill("auto");
    let pdfReport = { 
        pageSize: "LETTER",
          content: selectedCalender
        ? [
              { image: "companyLogo", fit: [120, 120] },
              "\n\n",
              individualReport,
              { text: `Date generated: ${currentDate}`, italics: true },
          ]
        : [
              { image: "companyLogo", fit: [120, 120] },
              "\n\n",
              { text: `Calender Summary Report`, style: "header" },
              "\n",
              {
              table: {
              headerRows: 1,
              widths: widths,
              body: fullReport,
              },
              },
              "\n",
              { text: `Date generated: ${currentDate}`, italics: true },
          ],
        images: {
        companyLogo: `data:image/png;base64, ${imageCodes.companyLogo}`,
        },
        defaultStyle: { fontSize: 10, bold: false },
        styles: { 
          header: { fontSize: 22, bold: true },
          subheader: { fontSize: 15, bold: true, margin: [0, 0, 0, 5], color: "#3432b8", opacity: .5 },
        },
        pageOrientation: "landscape",
        pageMargins: [20, 25, 20, 20],
    }

    return pdfReport;
  },
  calenderCSVExcel: (results, defaultStatus, selectedFields, tableFields) => {
    const reportData = [];
    let csvExcelHeaders = [{ label: "Status", value: "calender_status", key: "calender_status" }];

    if (defaultStatus) {
      csvExcelHeaders = csvExcelHeaders.concat(tableFields);
    } else {
      for (let obj of tableFields) {
        if (selectedFields.includes(obj.key)) {
          csvExcelHeaders.push(obj);
        }
      }
    }

    for (let i = 0; i < results.length; i++) {
      const resultData = results[i].data;
      let calenderData = {};

      let data = {
        calender_status: resultData.calender_status,
        startDate: resultData.startDate,
        endDate: resultData.endDate
      };

      if (defaultStatus) {
        for (let key in data) {
          calenderData[key] = data[key];
        }        
      } 
        else {
          calenderData.calender_status = data.calender_status;
        for (let selected of selectedFields) {
          calenderData[selected] = data[selected];
        }
      }

      reportData.push(calenderData);
    }
    return [reportData, csvExcelHeaders];
},
parameterPdfFormat: (results, defaultStatus, selectedFields, tableFields, selectedParameter) => {
  let fullReport = [];
  let individualReport = [];
  let defaultPDFHeaders = ["Param Type","Param Value","Param Level","Comments"].map(item => {return { text: item, bold: true, fontSize: 11, alignment: "center", fillColor: "#3432b8", fillOpacity: .1}});
  let customPDFHeaders = ["Param Type"];
  let currentDate = new Date();

  if (defaultStatus) {
    fullReport.push(defaultPDFHeaders);
  } else {
    for(let obj of tableFields) {
      if (selectedFields.includes(obj.key)) {
        customPDFHeaders.push(obj.label)
      }
    }
    customPDFHeaders = customPDFHeaders.map(item => {return { text: item, bold: true, fontSize: 11, alignment: "center", fillColor: "#3432b8", fillOpacity: .1}});
    fullReport.push(customPDFHeaders);
  }

  for (let i = 0; i < results.length; i++) {
    const resultData = results[i].data;

    let fields = {
paramType: resultData.paramType,
paramValue: resultData.paramValue,
paramLevel: resultData.paramLevel      ,
comments: resultData.comments
     
    }

    if (defaultStatus) {
      fullReport.push([fields.paramType,fields.paramValue,fields.paramLevel,fields.comments])
    } else {
      let customData = [fields.paramType];
      for (let obj of tableFields) {
        if (selectedFields.includes(obj.key)) {
          customData.push(fields[obj.value])
        }

      }
      fullReport.push(customData);
    }

  
    if (selectedParameter) {
      if (resultData.id === parseInt((selectedParameter.id)) ){
        individualReport = [
          { text: fields.paramType, style: "header" },
          "\n",
          { table: {
            headerRows: 1,
            heights: [10,20],
            body: [
              defaultPDFHeaders.slice(1),
              [ fields.paramValue,fields.paramLevel,fields.comments]
            ]
          }},
          "\n"
        ];
      }
    } 
  }
  let widths = Array(fullReport[0].length).fill("auto");
  let pdfReport = {
    pageSize: "LETTER",
    content: selectedParameter
      ? [
          { image: "companyLogo", fit: [120, 120] },
          "\n\n",
          individualReport,
          { text: `Date generated: ${currentDate}`, italics: true },
        ]
      : [
          { image: "companyLogo", fit: [120, 120] },
          "\n\n",
          { text: `Parameter Summary Report`, style: "header" },
          "\n",
          {
          table: {
            headerRows: 1,
            widths: widths,
            body: fullReport,
          },
          },
          "\n",
          { text: `Date generated: ${currentDate}`, italics: true },
        ],
      images: {
      companyLogo: `data:image/png;base64, ${imageCodes.companyLogo}`,
      },
      defaultStyle: { fontSize: 10, bold: false },
      styles: { 
        header: { fontSize: 22, bold: true },
        subheader: { fontSize: 15, bold: true, margin: [0, 0, 0, 5], color: "#3432b8", opacity: .5 },
      },
      pageOrientation: "landscape",
      pageMargins: [20, 25, 20, 20],
  }

  return pdfReport;
},
parameterCSVExcel: (results, defaultStatus, selectedFields, tableFields) => {
  const reportData = [];
  let csvExcelHeaders = [{ label: "paramType", value: "paramType", key: "paramType" }];

  if (defaultStatus) {
    csvExcelHeaders = csvExcelHeaders.concat(tableFields);
  } else {
    for (let obj of tableFields) {
      if(selectedFields.includes(obj.key)) {
        csvExcelHeaders.push(obj);
      }
    }
  }

  for (let i = 0; i < results.length; i++) {
    const resultData = results[i].data;
    let parameterData = {};

    let data = {
      paramType: resultData.paramType,
      paramLevel: resultData.paramLevel,
      paramValue: resultData.paramValue,
      comments: resultData.comments
    }

    if (defaultStatus) {
      for(let key in data) {
        parameterData[key] = data[key]
      }
    } else {
      parameterData.paramType = data.paramType;
        for(let selected of selectedFields) {
          parameterData[selected] = data[selected]
        }
    }

    reportData.push(parameterData);
  }
  return [reportData, csvExcelHeaders];
},
managerCSVExcel: (results, defaultStatus, selectedFields, tableFields) => {
  const reportData = [];
  let csvExcelHeaders = [{label: "Full Name", value: "fullName", key: "fullName"}];

  if (defaultStatus) {
      csvExcelHeaders = csvExcelHeaders.concat(tableFields);
  } else {
      for (let obj of tableFields) {
          if (selectedFields.includes(obj.key)) {
              csvExcelHeaders.push(obj);
          }
      }
  }

  for (let i = 0; i < results.length; i++) {
      const resultData = results[i].data;
      let managerData = {};

      let data = {
          fullName: `${resultData.firstName} ${resultData.lastName}`,
          role: resultData.role,
          state: resultData.state,
          email: resultData.email,
          phoneNumber: resultData.phoneNumber,
          startDate: resultData.startDate,
          endDate: resultData.endDate
      };

      if (defaultStatus) {
          for (let key in data) {
              managerData[key] = data[key];
          }
      } else {
          managerData.fullName = data.fullName;
          for (let selected of selectedFields) {
              managerData[selected] = data[selected];
          }
      }

      reportData.push(managerData);
  }
  return [reportData, csvExcelHeaders];
},
managerPdfFormat: (results, defaultStatus, selectedFields, tableFields, selectedManagers) => {
    let fullReport = [];
    let individualReport = [];
    let defaultPDFHeaders = ["Full Name", "Status", "Email", "Role","Phone No.", "Start Date", "End Date"].map(item => {return { text: item, bold: true, fontSize: 11, alignment: "center", fillColor: "#3432b8", fillOpacity: .1}});
    let customPDFHeaders = ["Full Name"];
    let currentDate = new Date();

    if (defaultStatus) {
        fullReport.push(defaultPDFHeaders);
    } else {
        for(let obj of tableFields) {
        if (selectedFields.includes(obj.key)) {
          customPDFHeaders.push(obj.label)
        }
        }
        customPDFHeaders = customPDFHeaders.map(item => {return { text: item, bold: true, fontSize: 11, alignment: "center", fillColor: "#3432b8", fillOpacity: .1}});
        fullReport.push(customPDFHeaders);
    }

    for (let i = 0; i < results.length; i++) {
        const resultData = results[i].data;

        let fields = {
        fullName: `${resultData.firstName} ${resultData.lastName}`,
        role: resultData.role,
        state: resultData.state,
        email: resultData.email,
        phoneNumber: resultData.phoneNumber ,
        startDate: resultData.startDate,
        endDate: resultData.endDate
        };

        if (defaultStatus) {
        fullReport.push([fields.fullName, fields.state, fields.email, fields.role, fields.phoneNumber, fields.startDate, fields.endDate])
        }
        else {
        let customData = [fields.fullName];
        for (let obj of tableFields) {
          if (selectedFields.includes(obj.key)) {
            customData.push(fields[obj.value])
          }

        }
        fullReport.push(customData);
        }

        if (selectedManagers) {
          if (resultData.resourceManagerId === parseInt((selectedManagers.resourceManagerId)) ){
            individualReport = [
              { text: fields.fullName, style: "header" },
              "\n",
              { table: {
                headerRows: 1,
                heights: [10,20],
                body: [
                  defaultPDFHeaders.slice(1),
                  [ fields.phoneNumber, fields.email, fields.state, fields.role, fields.startDate, fields.endDate]
                ]
              }},
              "\n"
            ];
          }
        } 
      }
    let widths = Array(fullReport[0].length).fill("auto");
    let pdfReport = { 
        pageSize: "LETTER",
          content: selectedManagers
        ? [
              { image: "companyLogo", fit: [120, 120] },
              "\n\n",
              individualReport,
              { text: `Date generated: ${currentDate}`, italics: true },
          ]
        : [
              { image: "companyLogo", fit: [120, 120] },
              "\n\n",
              { text: `Managers Summary Report`, style: "header" },
              "\n",
              {
              table: {
              headerRows: 1,
              widths: widths,
              body: fullReport,
              },
              },
              "\n",
              { text: `Date generated: ${currentDate}`, italics: true },
          ],
        images: {
        companyLogo: `data:image/png;base64, ${imageCodes.companyLogo}`,
        },
        defaultStyle: { fontSize: 10, bold: false },
        styles: { 
          header: { fontSize: 22, bold: true },
          subheader: { fontSize: 15, bold: true, margin: [0, 0, 0, 5], color: "#3432b8", opacity: .5 },
        },
        pageOrientation: "landscape",
        pageMargins: [20, 25, 20, 20],
    }

    return pdfReport;
  },

};

export default reportFormats;