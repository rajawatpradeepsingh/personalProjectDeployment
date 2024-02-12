import { config } from "../../config";
import auth from "../../utils/AuthService";
import axios from "axios";
import moment from "moment/moment";


const baseUrl = `${config.serverURL}/workOrders`; 
const catchHandle = (err) => {
    if (!err.response) throw new Error();
    if (err.response?.status === 401) auth.logout();
    return { status: err.response?.status, err };
  };

const formatMainTableData = (data) => {
    return data.map((workOrder) => {
      return {
        ...workOrder,
      };
    });
  };

 
  export const getWorkorderByParams = async (headers, path = "", params = "") => {
   
    const fullPath = `${path}${params}`;
    return await getWorkorderDrop(headers, fullPath);
  };
  const getWorkorderDrop = async (headers, path, params = "") => {
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


 

  export const getWorkOrderById = async (headers, id) => {
    try {
       const response = await axios.get(`${config.serverURL}/workOrders/${id}`, { headers });
       let data = {};
       if (response.status === 200) {
          data.workOrderData = response.data;
          data.Details = response.data;
          data.statusCode = response.status;
       }
       return data;
    } catch (error) {
       console.log(error);
       return { statusCode: error.response?.status };
    }
  }
  export const getWorkOrders = async (headers, currentPage, pageSize, sortParams, filters) => {
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
    export const updateWorkOrder= async (headers, data, id) => {
      try {
         const response = await axios.patch(`${config.serverURL}/workOrders/${id}`, data, { headers });
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
  export const getWorkOrderByParams = async (headers, path = "", params = "") => {
   
    const fullPath = `${path}${params}`;
    return await getWorkOrderDrop(headers, fullPath);
  };
  export const getWorkOrderDrop = async (headers, path, params = "") => {
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
  export const getWorkorderArchive = async (headers, currentPage, pageSize) => {
    try {
       const res = await axios.get(`${baseUrl}?archives=true&pageNo=${currentPage - 1}&pageSize=${pageSize}`, { headers });
       if (res) {
          return {
            data:res.data.map((workOrder) => ({
              id: workOrder.id,
              cellOne:workOrder.project?.projectName ,
              cellTwo: `${workOrder.worker?.firstName} ${workOrder.worker?.lastName}`,
              cellThree: workOrder.startDate ?  moment(workOrder.startDate).format("MM/DD/YYYY") : "",
              cellFour: workOrder.endDate ? moment(workOrder.endDate).format("MM/DD/YYYY") : "",
              cellFive: `${workOrder.project.resourceManager?.firstName} ${workOrder.project.resourceManager?.lastName}`,
              cellSix: workOrder.activeDate ?  moment(workOrder.activeDate).format("MM/DD/YYYY") : "" || "",

            })),
            totalItems: res.headers["total-elements"],
          };
  
        }
      } catch (error) {
         console.log(error);
      }
    }
  
  export const archiveWorkorder = async (headers, ids) => {
    try {
      const res = await axios.all(ids.map((id) => axios.delete(`${baseUrl}/${id}`, { headers })));
      if (res.length) {
        return res[0].status
       }
     } catch (error) {
        return catchHandle(error);
     }
   };
   

