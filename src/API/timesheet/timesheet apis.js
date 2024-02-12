import { config } from "../../config";
import auth from "../../utils/AuthService";
import axios from "axios";
import moment from "moment";

const baseUrl = `${config.serverURL}/timesheet`; 
const catchHandle = (err) => {
    if (!err.response) throw new Error();
    if (err.response?.status === 401) auth.logout();
    return { status: err.response?.status, err };
  };

const formatMainTableData = (data) => {
    return data.map((timesheet) => {
      return {
        ...timesheet,
        // workOrder: `PRJ-${timesheet?.workOrder?.project?.client?.clientName.toUpperCase().substr(0, 3)}-${("00" + timesheet?.id).slice(-5)}`,
      };
    });
  };
  export const getTimeSheetByParams = async (headers, path = "", params = "") => {
   
    const fullPath = `${path}${params}`;
    return await getTimesheetDrop(headers, fullPath);
  };
  const getTimesheetDrop = async (headers, path, params = "") => {
    try {
      const res = await axios.get(`${baseUrl}${path}${params}`, { headers });
      let data = {};
      if (res.status === 200) { 
        data.tableData = formatMainTableData(res.data);
        data.totalItems = res.headers["total-elements"];
        data.statusCode = res.status;
      }
      return data;
    } catch (err) {
      if (err.response.status === 401) auth.logout();
      return { statusCode: err.response?.status };
    }
  };
  export const getFilteredTimeSheet = async (headers, currentPage,pageSize, filters,sortKey,sortOrder) => {
    const sort = !sortKey ? "" : `&orderBy=${sortKey}&orderMode=${sortOrder}`;
    const pages = `pageNo=${currentPage - 1}&pageSize=${pageSize}`;
    let url = `${baseUrl}?dropdownFilter=true&${pages}`;
    if (Object.keys(sort).length) {
      url += `${sort}`;
    }
    try {
      const res = await axios.put(url, filters, { headers });
      if (res) {
        return {
          statusCode: res.status,
          data: res.data.length ? formatMainTableData(res.data) : [],
          totalItems: res.headers["total-elements"],
        };
      }
    } catch (err) {
      console.log(err);
      if (err.response?.status === 401) auth.logout();
      return { statusCode: err.response?.status };
    }
  };

  export const getTimeSheet = async (headers, currentPage, pageSize, sortParams, filters) => {
    try {
       const url = !sortParams && !filters
       ? `?pageNo=${currentPage - 1}&pageSize=-1` 
       : sortParams ? `?dropdownFilter=true&pageNo=${currentPage - 1}&pageSize=${pageSize}&${sortParams}`
         : `?dropdownFilter=true&pageNo=${currentPage - 1}&pageSize=${pageSize}`;
       const response = !filters ? await axios.get(`${baseUrl}${url}`, { headers }) : await axios.put(`${baseUrl}${url}`, filters, { headers });
       if (response.status === 200) {
          return { 
            data: response.data.length ? formatMainTableData(response.data) : [],
            totalItems: response.headers["total-elements"],
            status: response.status
          }
       }
    } catch (error) {
       return catchHandle(error);
    }
  }

  export const getTimesheetArchive = async (headers, currentPage, pageSize) => {
    try {
       const res = await axios.get(`${baseUrl}?archives=true&pageNo=${currentPage - 1}&pageSize=${pageSize}`, { headers });
       if (res) {
          return {
            data:res.data.map((timesheet) => ({
              id: timesheet.id,
              cellOne: `${timesheet.worker?.firstName} ${timesheet.worker?.lastName}`,
              cellTwo: timesheet?.workOrder?.project?.projectName,
              cellThree: timesheet?.timeSheetStatus,
              cellFour: timesheet.updatedOn ?  moment(timesheet.updatedOn).format("MM/DD/YYYY") : "",
              cellFive: timesheet.statusChangedOn ? moment(timesheet.statusChangedOn).format("MM/DD/YYYY") : "",
              cellSix: timesheet.billableHours || "",
              cellSeven: timesheet.comments || "",
  
            })),
            totalItems: res.headers["total-elements"],
          };
  
        }
      } catch (error) {
         console.log(error);
      }
    }
  
  export const archiveTimesheets = async (headers, ids) => {
    try {
      const res = await axios.all(ids.map((id) => axios.delete(`${baseUrl}/${id}`, { headers })));
      if (res.length) {
        return res[0].status
       }
     } catch (error) {
        return catchHandle(error);
     }
   }
   export const getTimeSheetById = async (headers, id) => {
    try {
      const response = await axios.get(`${config.serverURL}/timesheet/${id}`, { headers });
      //  const response = await axios.get(`${config.serverURL}/timesheet/${id}`, { headers });
       let data = {};
       if (response.status === 200) {
          data.timeSheetData = response.data;
          data.Details = response.data;
          data.statusCode = response.status;
       }
    
       return data;
    } catch (error) {
       console.log(error);
       return { statusCode: error.response?.status };
    }
  }
  export const updateTimeSheet= async (headers, data, id) => {
    try {
       const response = await axios.put(`${baseUrl}/update/${id}`, data, { headers });
       if (response.status === 200) {
          return { statusCode: 200, data: response.data}
       } else if (response.status === 401) {
          return { statusCode: 401}
       }
    }
     catch (error) {
       console.log(error);
       return { statusCode: error.response.status }
     }
    }