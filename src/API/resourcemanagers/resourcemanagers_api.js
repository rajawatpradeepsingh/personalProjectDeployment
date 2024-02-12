import { config } from "../../config";
import auth from "../../utils/AuthService";
import axios from "axios";
import moment from "moment";

const baseUrl = `${config.serverURL}/resourcemanager`;

const catchHandle = (err) => {
  if (!err.response) throw new Error();
  if (err.response?.status === 401) auth.logout();
  return { status: err.response?.status, err };
};


const formatMainTableData = (data) => {
   return data.map((manager) => {
     return {
       ...manager,
     };
   });
 };


export const getManagerById = async (headers, id) => {
  try {
     const response = await axios.get(`${config.serverURL}/resourcemanager/${id}`, { headers });
     let data = {};
     if (response.status === 200) {
        data.managerData = response.data;
        data.Details = response.data;
        data.statusCode = response.status;
     }
     return data;
  } catch (error) {
     console.log(error);
     return { statusCode: error.response?.status };
  }
}
export const updateManager= async (headers, data, id) => {
  try {
     const response = await axios.patch(`${config.serverURL}/resourcemanager/${id}`, data, { headers });
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

export const getManagers = async (headers, currentPage, pageSize, sortParams = null, filters = null) => {
  try {
     const url = !sortParams && !filters
       ? `?pageNo=${currentPage - 1}&pageSize=${pageSize}` 
       : sortParams ? `?dropdownFilter=true&pageNo=${currentPage - 1}&pageSize=${pageSize}&${sortParams}`
       : `?dropdownFilter=true&pageNo=${currentPage - 1}&pageSize=${pageSize}`;
     const response = !filters ? await axios.get(`${baseUrl}${url}`, { headers }) : await axios.put(`${baseUrl}${url}`, filters, { headers });
   
     if (response.status === 200) {
        return {
          data: response.data,
          totalItems: response.headers["total-elements"],
          status: response.status
        }
     }
  } catch (error) {
     return catchHandle(error);
  }
}

export const getManagerArchive = async (headers, currentPage, pageSize) => {
  try {
     const res = await axios.get(`${config.serverURL}/resourcemanager?archives=true&pageNo=${currentPage - 1}&pageSize=${pageSize}`, { headers });
     if (res) {
        return {
          data: res.data.map((resourcemanager) => ({
            id: resourcemanager.resourceManagerId,
            cellOne: `${resourcemanager.firstName} ${resourcemanager.lastName}`,
            cellTwo: resourcemanager.role,
            cellThree: resourcemanager.email,
            cellFour: resourcemanager.phoneNumber,
            // cellFive: resourcemanager.startDate,
           cellFive:`${moment(resourcemanager?.startDate).format("MM.DD.YYYY")}` ,
           cellSix:`${moment(resourcemanager?.endDate).format("MM.DD.YYYY")}` ,
            // cellSix: resourcemanager.endDate,
          cellSeven:resourcemanager.state
           
          })),
          totalItems: res.headers["total-elements"]
        };
     }
  } catch (error) {
     console.log(error);
  }
}

export const archiveManagers = async (headers, ids) => {
  try {
    const res = await axios.all(ids.map((id) => axios.delete(`${baseUrl}/${id}`, { headers })));
    if (res.length) {
     return res[0].status
    }
  } catch (error) {
     return catchHandle(error);
  }
}

export const getManagerByParams = async (headers, path = "", params = "") => {
   
   const fullPath = `${path}${params}`;
   return await getManagerDrop(headers, fullPath);
 };
 
 export const getManagerDrop = async (headers, path, params = "") => {
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

 
 
     
 





