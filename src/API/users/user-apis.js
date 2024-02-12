import { config } from "../../config.js";
import axios from "axios";
import auth from "../../utils/AuthService";

const baseUrl = `${config.serverURL}/users`;

const getUsers = async (headers, path, params) => {
  try {
    let data = {};
    const res = await axios.get(`${baseUrl}${path}${params}`, { headers });
    if (res.status === 200) {
      data.data = res.data;
      data.totalItems = res.headers["total-elements"];
      data.statusCode = res.status;
    }
    return data;
  } catch (err) {
    if (err.response.status === 401) auth.logout();
    return { statusCode: err.response?.status, err };
  }
};

const deleteUsers = async (headers, path, params) => {
  try {
    return await axios.delete(`${baseUrl}${path}${params}`, { headers });
  } catch (err) {
    if (err.response.status === 401) auth.logout();
    return { statusCode: err.response?.status, err };
  }
};

const patchUsers = async (headers, path, params, body) => {
  try {
    return await axios.patch(`${baseUrl}${path}${params}`, body, { headers });
  } catch (err) {
    if (err.response.status === 401) auth.logout();
    return { statusCode: err.response?.status, err };
  }
};

//get users with recruiting permissions based on current user's auth
export const getAllRecruiters = async (headers, currentUserRole) => {
  let adminAccess = [];
  let managerAccess = [];

  try {
    const response = await axios.get(`${baseUrl}`, { headers });
    if (response.status === 200) {
      adminAccess = response.data.filter(
        (user) =>
          user.roles[0].roleName.toLowerCase() === "admin" ||
        // /  user.roles[0].roleName.toLowerCase() === "business_dev_manager" ||
          user.roles[0].roleName.toLowerCase() === "recruiter"
      );
      managerAccess = response.data.filter(
        (user) =>
          user.roles[0].roleName.toLowerCase() !== "admin" &&
          user.roles[0].roleName.toLowerCase() !== "hr"
      );
    }

    if (currentUserRole.toLowerCase() === "admin") {
      return {
        recruiters: adminAccess,
        statusCode: response.status,
      };
    }

    if (currentUserRole.toLowerCase() === "business_dev_manager") {
      return {
        recruiters: managerAccess,
        statusCode: response.status,
      };
    }
  } catch (error) {
    return { statusCode: error.response?.status };
  }
};

export const getRecruiters = async (headers) => {
  const path = "/role";
  const params = "?roleName=RECRUITER";
  return await getUsers(headers, path, params);
};

export const getUser = async (headers, id) => {
  const path = `/${id}`;
  return await getUsers(headers, path, "");
};

export const getAllUsers = async (headers) => {
  return await getUsers(headers, "", "");
};

export const getArchivedUsers = async (headers, page, perPage) => {
  const pages = `&pageNo=${page - 1}&pageSize=${perPage}`;
  const params = `?archives=true${pages}`;
  return await getUsers(headers, "", params);
};

export const deleteUser = async (headers, id) => {
  const path = `/${id}`;
  return await deleteUsers(headers, path, "");
};

export const patchUser = async (headers, id, body) => {
  const params = `?userId=${id}`;
  return await patchUsers(headers, "", params, body);
};

export const alertEmail = async (username) => {
  const path = `${baseUrl}/adminAlert`;
  const params = `?username=${username}`;
  try {
    return await axios.get(`${path}${params}`);
  } catch {
    return;
  }
};

export const getEnabledUsers = async (headers) => {
  const params = "/?enabled=true";
  try {
    return axios.get(`${baseUrl}${params}`, { headers });
  } catch (err) {
    if (err.response.status === 401) auth.logout();
    return { statusCode: err.response?.status, err };
  }
};

export const getUserById = async (headers, id) => {
  try {
    const response = await axios.get(`${baseUrl}/${id}`, { headers });
    let data = {};

    if (response.status === 200) {
      data.userdata = response.data;
      data.statusCode = response.status;
    }
    return data;
  } catch (err) {
    if (err.response?.status === 401) auth.logout();
    return { statusCode: err.response?.status };
    
  }
};

export const updateUser= async (headers, data, id) => {
  try {
     const response = await axios.patch(`${baseUrl}?userId=${id}`, data, { headers });
     if (response.status === 200) {
        return { statusCode: 200, data: response.data}
     } else if (response.status === 401) {
        return { statusCode: 401}
     }
  }
   catch (error) {
     console.log(error);
     return { statusCode: error.response.status }
  }
};
