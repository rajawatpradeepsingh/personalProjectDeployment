import axios from "axios";
import { config } from "../../config";
import auth from "../../utils/AuthService";

const baseUrl = `${config.serverURL}/roles`;
const pageSize = config.ITEMS_PER_PAGE;

const catchHandle = (err) => {
  if (err.response?.status === 401) auth.logout();
  return { statusCode: err.response?.status, err };
};

export const getAllRoles = async () => {
  try {
    return await axios.get(`${baseUrl}/registerpage`);
  } catch (err) {
    return catchHandle(err);
  }
};

const getRolesList = async (headers, path, params = "") => {
  try {
    return await axios.get(`${baseUrl}${path}${params}`, { headers });
  } catch (err) {
    return catchHandle(err);
  }
};

export const patchRoles = async (headers, id,body) => {
  try {
    return await axios.patch(`${baseUrl}/${id}`,body, { headers });
  } catch (err) {
    return catchHandle(err);
  }
};

export const postRoles = async (headers, body) => {
  try {
    return await axios.post(`${baseUrl}`, body, { headers });
  } catch (err) {
    return catchHandle(err);
  }
};

export const getArhivedRoles = async (headers, page) => {
  const pages = `&pageNo=${page - 1}&pageSize=${pageSize}`;
  const params = `?archives=true${pages}`;
  return await getRolesList(headers, "", params);
};

export const getRoles = async (headers, page) => {
  const params = `?pageNo=${page - 1}&pageSize=${pageSize}`;
  return await getRolesList(headers, "", params);
};

export const archiveRoles = async (headers, roles) => {
  const ids = [];
  for (const id in roles) ids.push(id);
  try {
    return await axios.all(
      ids.map((id) => axios.delete(`${baseUrl}/${id}`, { headers }))
    );
  } catch (err) {
    return catchHandle(err);
  }
};
export const getRoleById = async (headers, id) => {
  try {
    const response = await axios.get(`${baseUrl}/${id}`, { headers });
    let data = {};
    if (response.status === 200) {
      data.roledata = response.data;
      data.statusCode = response.status;
    }
    return data;
  } catch (err) {
    if (err.response?.status === 401) auth.logout();
    return { statusCode: err.response?.status };
  }
};