import { config } from "../../config";
import auth from "../../utils/AuthService";
import axios from "axios";
import moment from "moment/moment";

const baseUrl = `${config.serverURL}/projects`;

const catchHandle = (err) => {
  if (!err.response) throw new Error();
  if (err.response?.status === 401) auth.logout();
  return { status: err.response?.status, err };
};

const formatMainTableData = (data) => {
   return data.map((projects) => {
     return {
       ...projects,
       projectNumber: `PRJ-${projects?.client?.clientName.toUpperCase().substr(0, 3)}-${("00" + projects?.id).slice(-5)}`,
     };
   });
 };

 export const getProjectByParams = async (headers, path = "", params = "") => {
   
  const fullPath = `${path}${params}`;
  return await getProjectDrop(headers, fullPath);
}; 
const getProjectDrop = async (headers, path, params = "") => {
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

 export const getFilteredProjects = async (headers, currentPage,pageSize, filters,sortKey,sortOrder) => {
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
export const getProjects = async (headers, currentPage, pageSize, sortParams, filters) => {
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

// export const getProjects = async (headers, currentPage, pageSize, sortParams = null, filters = null) => {
//   try {
//      const url = !sortParams && !filters
//      ? `?pageNo=${currentPage - 1}&pageSize=${pageSize}` 
//      : sortParams ? `?pageNo=${currentPage - 1}&pageSize=${pageSize}&${sortParams}`
//        : `?dropdownFilter=true&pageNo=${currentPage - 1}&pageSize=${pageSize}`;
//      const response = !filters ? await axios.get(`${baseUrl}${url}`, { headers }) : await axios.put(`${baseUrl}${url}`, filters, { headers });
//      if (response.status === 200) {
//         return {
//           data: response.data,
//           totalItems: response.headers["total-elements"],
//           status: response.status
//         }
//      }
//   } catch (error) {
//      return catchHandle(error);
//   }
// }

export const getProjectArchive = async (headers, currentPage, pageSize) => {
  try {
     const res = await axios.get(`${baseUrl}?archives=true&pageNo=${currentPage - 1}&pageSize=${pageSize}`, { headers });
     if (res) {
        return {
          data:res.data.map((projects) => ({
            id: projects.id,
            cellOne:projects.client?.clientName || "",
            cellTwo: projects?.projectName || "",
            cellThree: `${projects.worker?.firstName} ${projects.worker?.lastName}`,
            cellFour: projects.startDate ?  moment(projects.startDate).format("MM/DD/YYYY") : "",
            cellFive: projects.endDate ? moment(projects.endDate).format("MM/DD/YYYY") : "",
            cellSix: `${projects.resourceManager?.firstName} ${projects.resourceManager?.lastName}`,
            cellSeven: projects.netBillRate || "",

          })),
          totalItems: res.headers["total-elements"],
        };

      }
    } catch (error) {
       console.log(error);
    }
  }

export const archiveProjects = async (headers, ids) => {
  try {
    const res = await axios.all(ids.map((id) => axios.delete(`${baseUrl}/${id}`, { headers })));
    if (res.length) {
      return res[0].status
     }
   } catch (error) {
      return catchHandle(error);
   }
 }
 
 export const getProjectById = async (headers, id) => {
  try {
    const response = await axios.get(`${config.serverURL}/projects/${id}`, { headers });
     let data = {};
     if (response.status === 200) {
        data.projectData = response.data;
        data.Details = response.data;
        data.statusCode = response.status;
     }
  
     return data;
  } catch (error) {
     console.log(error);
     return { statusCode: error.response?.status };
  }
}


export const updateProject= async (headers, data, id) => {
  try {
     const response = await axios.patch(`${config.serverURL}/projects/${id}`, data, { headers });
     if (response.status === 200) {
        return { statusCode: 200, data: response.data}
     } else if (response.status === 401) {
      return { statusCode: response.status };
    }
  } catch (err) {
    if (err.response.status === 401) auth.logout();
    return { statusCode: err.response?.status };
  }
};