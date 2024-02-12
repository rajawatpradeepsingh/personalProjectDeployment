import axios from "axios";
import { config } from "../../config";
import auth from "../../utils/AuthService";

const baseUrl = `${config.serverURL}/clients`; //http://localhost:9093/clients

const headersObj = (headers) => ({
  ...headers,
  Accept: "application/json",
  "Content-Type": "application/json",
});

export const getUniqueClients = async (headers) => {
  const response = await fetch(`${baseUrl}/uniqueClientNames`, {
    method: "GET",
    headers: headersObj(headers),
  });
  const data = await response.json();
  return data;
};

const formatMainTableData = (data) => {
  return data.map((client) => {
    return {
      ...client,
      city: client.address?.city,
      postalCode: client.address?.postalCode,
    };
  });
};

const getClients = async (headers, path, params = "") => {
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

export const getClientById = async (headers, id) => {
  try {
    const response = await axios.get(`${baseUrl}/${id}`, { headers });
    let data = {};
    if (response.status === 200) {
      data.clientdata = response.data;
      data.statusCode = response.status;
    }
    return data;
  } catch (err) {
    if (err.response?.status === 401) auth.logout();
    return { statusCode: err.response?.status };
  }
};

export const getAllClients = async (headers) => {
  const params = "?dropdownFilter=true";
  return await getClients(headers, "", params);
};

export const getClientsByParams = async (headers, path = "", params = "") => {
  const fullPath = `${path}${params}`;
  return await getClients(headers, fullPath);
};

export const getFilteredClients = async (headers, currentPage,pageSize, filters,sortKey,sortOrder) => {
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

export const updateClient = async (headers, data, id) => {
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

export const getClientArchive = async (headers, currentPage, pageSize) => {
  try {
    const res = await axios.get(
      `${baseUrl}?archives=true&pageNo=${currentPage - 1}&pageSize=${pageSize}`,
      { headers }
    );
    if (res.status === 200) {
      return {
        tableData: res.data.map((client) => ({
          id: client.id,
          cellOne: client.clientName,
          cellTwo: client.phoneNumber || "n/a",
          cellThree: client.website || "n/a",
          cellFour: client.address
            ? `${client.address.city && `${client.address.city}, `}${
                client.address.state && `${client.address.state}, `
              }${client.address.country && `${client.address.country}`}`
            : "",
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
