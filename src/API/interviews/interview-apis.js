import axios from "axios";
import auth from "../../utils/AuthService";
import { config } from "../../config.js";

const baseUrl = `${config.serverURL}/interviews`;

const getInterviews = async (headers, path) => {
  try {
    const res = await axios(`${baseUrl}/${path}`, { headers });
    return { status: res.status, data: res.data, headers: res.headers };
  } catch (err) {
    if (err.response.status === 401) auth.logout();
    return { status: err.response.status, err };
  }
};

export const archiveInterview = async (headers, id) => {
  try {
    return await axios.delete(`${baseUrl}/${id}`, { headers });
  } catch (err) {
    if (err.response.status === 401) auth.logout();
    return { status: err.response?.status, err };
  }
};

export const archiveInterviews = async (headers, ids) => {
  try {
    return await axios.all(ids.map((id) => archiveInterview(headers, id)));
  } catch (err) {
    if (err.response.status === 401) auth.logout();
    return { status: err.response?.status, err };
  }
};

export const getInterview = async (headers, id) => {
  try {
    const res = await axios.get(`${baseUrl}/${id}`, { headers });
    return { status: res.status, data: res.data };
  } catch (err) {
    return { status: err.response.status, err };
  }
};

export const getInterviewsByParams = async (
  headers,
  path = "",
  params = ""
) => {
  const fullPath = `${path}${params}`;
  return await getInterviews(headers, fullPath);
};

export const getLatestRecord = async (headers, params = "") => {
  const fullPath = `latestrecord${params}`;
  try {
    const res = await axios(`${baseUrl}/${fullPath}`, { headers });
    return { status: res.status, data: res.data, headers: res.headers };
  } catch (err) {
    if (err.response.status === 401) auth.logout();
    return { status: err.response.status, err };
  }
};

export const putLatestRecord = async (headers, data, params = "") => {
  const path = `latestrecord${params}`;
  try {
    const res = await axios.put(`${baseUrl}/${path}`, data, { headers });
    return { status: res.status, data: res.data, headers: res.headers };
  } catch (err) {
    if (err.response.status === 401) auth.logout();
    return { status: err.response.status, err };
  }
};

export const updateSelectedInterview = async (
  headers,
  id,
  emailService,
  newInterview
) => {
  try {
    const response = await axios.patch(
      `${baseUrl}/${id}?emailing=${emailService}`,
      newInterview,
      { headers }
    );
    if (response.status === 200) {
      return {
        statusCode: response.status,
        data: response.data,
      };
    }
  } catch (error) {
    console.log(error);
    return { statusCode: error.response.status };
  }
};
