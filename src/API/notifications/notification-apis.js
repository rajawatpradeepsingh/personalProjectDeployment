import { config } from "../../config";
import axios from "axios";
import auth from "../../utils/AuthService";

const baseUrl = `${config.serverURL}/notifications`;

const catchHandle = (err) => {
  if (!err.response) throw new Error();
  if (err.response?.status === 401) auth.logout();
  return { statusCode: err.response?.status, err };
};

const getNotifications = async (headers, path, params = "") => {
  try {
    const res = await axios.get(`${baseUrl}${path}${params}`, { headers });
    return res;
  } catch (err) {
    return catchHandle(err);
  }
};

const deleteNotifications = async (headers, path, params) => {
  try {
    return await axios.delete(`${baseUrl}${path}${params}`, { headers });
  } catch (err) {
    return catchHandle(err);
  }
};

export const deleteNotification = async (headers, id) => {
  const path = `/delete/${id}`;
  try {
    return await axios.delete(`${baseUrl}${path}`, { headers });
  } catch (err) {
    return catchHandle(err);
  }
};

export const getUserNotifications = async (
  headers,
  userId,
  page = 0,
  pageSize = 10,
  tab = null
) => {
  const path1 = auth.hasRecruiterRole() ? `/${userId}` : "";
  const path2 = auth.hasBDManagerRole() ? "/role/BUSINESS_DEV_MANAGER" : "";
  const path = `${path1}${path2}`;
  const params1 = `?paginated=true&pageNo=${page - 1}&pageSize=${pageSize}`;
  const params2 = tab ? `&entity=${tab}` : "";
  const params = `${params1}${params2}`;
  //.get(`${url}${path1}${path2}${params1}${params2}`, { headers })
  return await getNotifications(headers, path, params);
};

export const getUnreadUserNotifications = async (headers, userId) => {
  const path = `/unread/${userId}`;
  return await getNotifications(headers, path);
};

export const readNotification = async (headers, id, userId) => {
  const params = `?notice=${id}&user=${userId}`;
  return await deleteNotifications(headers, "", params);
};

export const readNotifications = async (headers, userId) => {
  const path = `/all/${userId}`;
  try {
    return await axios.delete(`${baseUrl}${path}`, { headers });
  } catch (err) {
    return catchHandle(err);
  }
};
