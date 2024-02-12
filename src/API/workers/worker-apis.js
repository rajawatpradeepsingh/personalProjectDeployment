import { config } from "../../config";
import auth from "../../utils/AuthService";
import axios from "axios";

const baseUrl = `${config.serverURL}/worker`;

const catchHandle = (err) => {
  if (!err.response) throw new Error();
  if (err.response?.status === 401) auth.logout();
  return { status: err.response?.status, err };
};

export const getWorkers = async (headers, currentPage, pageSize, sortParams = null, filters = null) => {
   try {
      // const url = !sortParams && !filters
      // ? `/latestrecord?pageNo=${currentPage - 1}&pageSize=-1` 
      // : sortParams ? `/latestrecord?pageNo=${currentPage - 1}&pageSize=-1&${sortParams}`
      // : `?dropdownFilter=true&pageNo=${currentPage - 1}&pageSize=${pageSize}`;
      const url = !sortParams && !filters
      ? `?pageNo=${currentPage - 1}&pageSize=-1` 
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

export const getWorkerById = async (headers, id) => {
   try {
      const response = await axios.get(`${config.serverURL}/worker/${id}`, { headers });
      let data = {};
      if (response.status === 200) {
         data.workerData = response.data;
         data.workerProjectDetails = response.data;
         data.statusCode = response.status;
      }
      return data;
   } catch (error) {
      console.log(error);
      return { statusCode: error.response?.status };
   }
}

const formatMainTableData = (data) => {
   return data.map((worker) => {
     return {
       ...worker,
     };
   });
 };
 
 export const getWorkerByParams = async (headers, path = "", params = "") => {
   
   const fullPath = `${path}${params}`;
   return await getWorkerDrop(headers, fullPath);
 };
 
 export const getWorkerDrop = async (headers, path, params = "") => {
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

export const getWorkerForDropdown = async (headers) => {
   try {
      const response = await axios.get(`${config.serverURL}/worker?dropdownFilter=true`, { headers });
      let data = {};
      if (response.status === 200) {
         data.tableData = response.data;
         data.totalItems = response.headers["total-elements"];
         data.statusCode = response.status;
      }
      return data;
   } catch (error) {
      console.log(error)
      return { statusCode: error.response?.status}
      
   }
}

export const updateWorker= async (headers, data, id) => {
   try {
      const response = await axios.patch(`${config.serverURL}/worker/${id}`, data, { headers });
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

export const archiveWorkers = async (headers, ids) => {
   try {
      const res = await axios.all(ids.map((id) => axios.delete(`${baseUrl}/${id}`, { headers })));
      if (res) {
         return { status: res[0].status };
      }
   } catch (error) {
      return catchHandle(error);
   }
}

export const getWorkerArchive = async (headers, currentPage, pageSize) => {
   try {
      const res = await axios.get(`${baseUrl}?archives=true&pageNo=${currentPage - 1}&pageSize=${pageSize}`, { headers });
      if (res) {
         return {
           data: res.data.map((worker) => ({
              id: worker.id,
              cellOne: `${worker.firstName} ${worker.lastName}`,
              cellTwo: worker.email,
              cellThree: worker.phoneNumber,

              cellFour: worker?.status,
              cellFive: worker?.subContractorCompanyName,
              cellSix: worker.client?.clientName,
           })),
           totalItems: res.headers["total-elements"]
         };
      }
   } catch (error) {
      return catchHandle(error);
   }

}

export const deleteResume = async (headers, id) => {
   const path = `/${id}/resume`;
   try {
     const res = await axios.delete(`${baseUrl}${path}`, { headers });
     return res;
   } catch (err) {
     if (err.response.status === 401) auth.logout();
     return { statusCode: err.response?.status };
   }
 };
 
 export const postResume = async (headers, id, body) => {
   const path = `/${id}/resume`;
   try {
     const res = await axios.post(`${baseUrl}${path}`, body, { headers });
     return res;
   } catch (err) {
     if (err.response.status === 401) auth.logout();
     return { statusCode: err.response?.status };
   }
 };
