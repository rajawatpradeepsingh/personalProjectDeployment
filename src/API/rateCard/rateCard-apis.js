import { config } from "../../config";
import axios from "axios";
import auth from "../../utils/AuthService";

const baseUrl = `${config.serverURL}/ratecard`;


export const getRateCardById = async (headers, id) => {
    try {
       const response = await axios.get(`${config.serverURL}/ratecard/${id}`, { headers });
       let data = {};
       if (response.status === 200) {
          data.rateCardData = response.data;
          data.statusCode = response.status;
       }
       return data;
    } catch (error) {
      if (error.response.status === 401) auth.logout();
       return { statusCode: error.response?.status };
    }
  }

  const formatMainTableData = (data) => {
   return data.map((ratecard) => {
     return {
       ...ratecard,
     };
   });
 };
 
 export const getRatecardByParams = async (headers, path = "", params = "") => {
   
   const fullPath = `${path}${params}`;
   return await getRatecardDrop(headers, fullPath);
 };
 
 const getRatecardDrop = async (headers, path, params = "") => {
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
  
  export const updateRateCard= async (headers, data, id) => {
    try {
       const response = await axios.patch(`${config.serverURL}/ratecard/${id}`, data, { headers });
       if (response.status === 200) {
          return { statusCode: 200, data: response.data}
       } else if (response.status === 401) {
          return { statusCode: 401}
       }
    }
     catch (error) {
      if (error.response.status === 401) auth.logout();
       return { statusCode: error.response.status }
    }
 }
 const catchHandle = (err) => {
   if (!err.response) throw new Error();
   if (err.response?.status === 401) auth.logout();
   return { status: err.response?.status, err };
 };

 export const getRateCard = async (headers, currentPage, pageSize, sortParams = null, filters = null,
   ) => {
   try {
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

export const archiveRateCard = async (headers, ids) => {
   try {
      const res = await axios.all(ids.map((id) => axios.delete(`${config.serverURL}/ratecard/${id}`, { headers })));
      if (res) {
         return { status: res[0].status };
      }
   } catch (error) {
      return catchHandle(error);
   }
}

export const getRateCardArchive = async (headers, currentPage, pageSize) => {
   try {
      const res = await axios.get(`${config.serverURL}/ratecard?archives=true&pageNo=${currentPage - 1}&pageSize=${pageSize}`, { headers });
      if (res) {
         return {
           data: res.data.map((ratecard) => ({
              id: ratecard.id,
              cellOne: `${ratecard.worker?.firstName} ${ratecard.worker?.lastName}`,
              cellTwo: ratecard.client?.clientName,
              cellThree: ratecard.workerStatus,
              cellFour: ratecard?.customer,
              cellFive: ratecard?.source,
              cellSix: ratecard.seller,
              cellSeven: ratecard.recruiter,
           })),
           totalItems: res.headers["total-elements"]
         };
      }
   } catch (error) {
      return catchHandle(error);
   }

}