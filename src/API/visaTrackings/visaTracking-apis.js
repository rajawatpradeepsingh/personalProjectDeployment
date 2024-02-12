import { config } from "../../config";
import auth from "../../utils/AuthService";
import axios from "axios";


const baseUrl = `${config.serverURL}/visatracking`;

const catchHandle = (err) => {
  if (!err.response) throw new Error();
  if (err.response?.status === 401) auth.logout();
  return { status: err.response?.status, err };
};

const formatMainTableData = (data) => {
   return data.map((visatracking) => {
     return {
       ...visatracking,
     };
   });
 };
 
 export const getVisaByParams = async (headers, path = "", params = "") => {
   
   const fullPath = `${path}${params}`;
   return await getVisaDrop(headers, fullPath);
 };
 
 const getVisaDrop = async (headers, path, params = "") => {
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

export const getAllVisas = async (headers, currentPage, pageSize, sortParams, filters) => {
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

export const archiveVisas = async (headers, ids) => {
   try {
      const res = await axios.all(ids.map((id) => axios.delete(`${baseUrl}/${id}`, { headers })));
      if (res) {
         return { status: res.map(res => res.status) };
      }
   } catch (error) {
      return catchHandle(error);
   }
}

export const 
getVisaArchive = async (headers, currentPage, pageSize) => {
  try {
    const res = await axios.get(
      `${baseUrl}?archives=true&pageNo=${currentPage - 1}&pageSize=${pageSize}`,
      { headers }
    );
    if (res) {
      return {
        data: res.data.map((visatracking) => ({
          id: visatracking.id,
          cellOne: `${visatracking.worker?.firstName} ${visatracking.worker?.lastName}`,
          cellTwo: visatracking.countryOfBirth,
          cellThree: visatracking.visaCountry,
          cellFour: visatracking.visaCountryOfResidence,
          cellFive: visatracking.visaType,
          cellSix: visatracking.visaStatus,
        })),
        totalItems: res.headers["total-elements"],
      };
    }
  } catch (error) {
    return catchHandle(error);
  }
};


export const getVisaById = async (headers, id) => {
    try {
       const response = await axios.get(`${baseUrl}/${id}`, { headers });
       let data = {};
       if (response.status === 200) {
          data.visaData = response.data;
          data.statusCode = response.status;
       }
       return data;
    } catch (error) {
       console.log(error);
       return { statusCode: error.response?.status };
    }
  }
  
  export const updateVisa = async (headers, data, id) => {
    try {
      const response = await axios.patch(`${baseUrl}/${id}`, data, { headers });
      console.log('Update Visa Response:', response);
  
      if (response.status === 200) {
        return { statusCode: 200, data: response.data };
      } else if (response.status === 401) {
        return { statusCode: 401 };
      }
    } catch (error) {
      console.error('Update Visa Error:', error);
      return { statusCode: error.response.status };
    }
  };  

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
