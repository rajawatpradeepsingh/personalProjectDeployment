import axios from "axios";
import { config } from "../../config";
import auth from "../../utils/AuthService";

const baseUrl = `${config.serverURL}/commission`; 





const formatMainTableData = (data) => {
  return data.map((commType) => {
    return {
      ...commType,
    
    };
  });
};

const getCommission = async (headers, path, params = "") => {
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

export const getCommissionById = async (headers, id) => {
  try {
    const response = await axios.get(`${baseUrl}/${id}`, { headers });
    let data = {};
    if (response.status === 200) {
      data.commData = response.data;
      data.statusCode = response.status;
    }
    return data;
  } catch (err) {
    if (err.response?.status === 401) auth.logout();
    return { statusCode: err.response?.status };
  }
};

export const getAllCommission = async (headers) => {
  const params = "?dropdownFilter=true";
  return await getCommission(headers, "", params);
};

export const getCommissionByParams = async (headers, path = "", params = "") => {
  const fullPath = `${path}${params}`;
  return await getCommission(headers, fullPath);
};

export const getFilteredCommission = async (headers, currentPage,pageSize, filters,sortKey,sortOrder) => {
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

export const updateCommission = async (headers, data, id) => {
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

export const getCommissionArchive = async (headers, currentPage, pageSize) => {
  try {
    const res = await axios.get(
      `${baseUrl}?archives=true&pageNo=${currentPage - 1}&pageSize=${pageSize}`,
      { headers }
    );
    if (res.status === 200) {
      return {
        tableData: res.data.map((ct) => ({
          id: ct.id,
          cellOne:`${ct.resourceManager?.firstName} ${ct.resourceManager?.lastName}`,
          cellTwo: `${ct.resourceManager?.role}`,
          cellThree: ct.startDate,
          cellFour: ct.endDate,
          cellFive: ct.commissionAmount,
        })),
        totalItems: res.headers["total-elements"],
      };
    } else {
      return {
        tableData: [],
        totalItems: 0,
      };
    }
  } catch (err) {
    if (err.response.status === 401) auth.logout();
    return { statusCode: err.response?.status };
  }
};
