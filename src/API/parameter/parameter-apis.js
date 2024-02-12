import axios from "axios";
import { config } from "../../config";
import auth from "../../utils/AuthService";

const baseUrl = `${config.serverURL}/parameter`;



const catchHandle = (err) => {
  if (!err.response) throw new Error();
  if (err.response?.status === 401) auth.logout();
  return { status: err.response?.status, err };
};



export const getParameterById = async (headers, id) => {
  try {
    const response = await axios.get(`${baseUrl}/${id}`, { headers });
    let data = {};

    if (response.status === 200) {
      data.parameterdata = response.data;
      data.statusCode = response.status;
    }
    return data;
  } catch (err) {
    if (err.response?.status === 401) auth.logout();
    return { statusCode: err.response?.status };
    
  }
};


export const updateParameter = async (headers, data, id) => {
  try {
    const res = await axios.patch(`${baseUrl}/${id}`, data, { headers });
    if (res.status === 200) {
      return { statusCode: 200, data: res.data };
    } else if (res.status === 401) {
      return { statusCode: res.status };
    }
  } catch (err) {
    if (err.response.status === 401) auth.logout();
    return { statusCode: err.response?.status };
  }
};

export const getParamArchive = async (headers, currentPage, pageSize) => {
  try {
     const res = await axios.get(
      `${config.serverURL}/parameter?archives=true&pageNo=${
        currentPage - 1
      }&pageSize=${pageSize}`,
      { headers }
    )
     if (res) {
        return {
          data: res.data.map((parameter) => ({
            id: parameter.id,
            cellOne: parameter.paramType,
            cellThree: parameter.paramLevel,
            cellFour: parameter.paramValue,
            cellFive: parameter.comments
          })),
          totalItems: res.headers["total-elements"]
        };
     }
  } catch (error) {
     console.log(error);
  }
}

export const archiveParameters = async (headers, id) => {
  try {
    return await axios.delete(`${baseUrl}/${id}`, { headers });
  } catch (err) {
    if (err.response.status === 401) auth.logout();
    return { status: err.response?.status, err };
  }
};

export const getParameters = async (headers, currentPage, pageSize, sortParams, filters) => {
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