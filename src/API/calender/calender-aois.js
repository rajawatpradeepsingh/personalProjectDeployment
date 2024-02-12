
import { config } from "../../config";
import auth from "../../utils/AuthService";
import axios from "axios";


const baseUrl = `${config.serverURL}/calender`;

const catchHandle = (err) => {
  if (!err.response) throw new Error();
  if (err.response?.status === 401) auth.logout();
  return { status: err.response?.status, err };
};

  export const getCalenderArchive = async (headers, currentPage, pageSize) => {
    try {
      const res = await axios.get(
        `${baseUrl}?archives=true&pageNo=${currentPage - 1}&pageSize=-1`,
        { headers }
      );       if (res) {
          return {
            data: res.data.length ? res.data.map((o) => ({
              id: o.id,
              cellOne:o.startDate,
              cellTwo: o.endDate,
              cellThree: o.calender_status,
              cellFour: o.noOfWeeks,

            })) : [],
            totalItems: res.headers["total-elements"],
          };
       }
 
    } catch (error) {
       console.log(error)
    }
 }
 export const archiveCalen = async (headers, ids) => {
   try {
     const res = await axios.all(ids.map((id) => axios.delete(`${baseUrl}/${id}`, { headers })));
     if (res.length) {
      return res[0].status
     }
   } catch (error) {
      return catchHandle(error);
   }
 }


 const formatMainTableData = (data) => {
  return data.map((calender) => {
    return {
      ...calender,
    };
  });
};

 export const getFilteredCalender = async (headers, currentPage,pageSize, filters,sortKey,sortOrder) => {
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

export const getCalendarByParams = async (headers, path = "", params = "") => {
   
  const fullPath = `${path}${params}`;
  return await getCalendarDrop(headers, fullPath);
};
const getCalendarDrop = async (headers, path, params = "") => {
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
export const getCalender = async (headers, currentPage, pageSize, sortParams = null, filters = null) => {
  try {
     const url = !sortParams && !filters
       ? `?pageNo=${currentPage - 1}&pageSize=-1` 
       : sortParams ? `?dropdownFilter=true&pageNo=${currentPage - 1}&pageSize=${pageSize}&${sortParams}`
       : `?dropdownFilter=true&pageNo=${currentPage - 1}&pageSize=${pageSize}`;
     const response = !filters ? await axios.get(`${baseUrl}${url}`, { headers }) : await axios.put(`${baseUrl}${url}`, filters, { headers });
   
     if (response.status === 200) {
        return {
          data: response.data.map(o => ({...o})),
          totalItems: response.headers["total-elements"],
          status: response.status
        }
     }
  } catch (error) {
     if (error.response?.status === 401) auth.logout();
     return { status: error.response?.status };
  }
}
