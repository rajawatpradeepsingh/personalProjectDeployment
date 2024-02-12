import axios from "axios";
import { config } from "../../config";
import auth from "../../utils/AuthService";

const baseUrl = `${config.serverURL}/interviewer`;

const catchHandle = (err) => {
  if (!err.response) throw new Error();
  if (err.response?.status === 401) auth.logout();
  return { status: err.response?.status, err };
};

export const getInterviewerById = async (headers, id) => {
  const path = `/${id}`;
  try {
    return await axios.get(`${baseUrl}${path}`, { headers });
  } catch (err) {
    return catchHandle(err);
  }
};

const formatMainTableData = (data) => {
  return data.map((interviewer) => {
    return {
      ...interviewer,
    };
  });
};

export const getInterviewerByParams = async (headers, path = "", params = "") => {
  
  const fullPath = `${path}${params}`;
  return await getInterviewerDrop(headers, fullPath);
};

const getInterviewerDrop = async (headers, path, params = "") => {
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

export const getInterviewers = async (
  headers,
  currentPage,
  pageSize,
  sortParams,
  filters,
) => {
  
  try {
    const url =
      !sortParams && !filters
        ? `?pageNo=${currentPage - 1}&pageSize=-1`
        : sortParams
        ? `?dropdownFilter=true&pageNo=${currentPage - 1}&pageSize=${pageSize}&${sortParams}`
        : `?dropdownFilter=true&pageNo=${currentPage - 1}&pageSize=${pageSize}`;
    const response = !filters
      ? await axios.get(`${baseUrl}${url}`, { headers })
      : await axios.put(`${baseUrl}${url}`, filters, { headers });

    if (response.status === 200) {
      return {
        data: response.data,
        totalItems: response.headers["total-elements"],
        status: response.status,
      };
    }
  } catch (error) {
    return catchHandle(error);
  }
};

export const getInterviewersDropdown = async (headers) => {
  try {
    const res = await axios.get(`${baseUrl}?dropdownFilter=true`, { headers });
    if (res.status === 200) {
      return {
        data: res.data,
        totalItems: res.headers["total-elements"],
        status: res.status,
      };
    }
  } catch (error) {
    return catchHandle(error);
  }
};

export const getInterviewerArchive = async (headers, currentPage, pageSize) => {
  try {
    const res = await axios.get(
      `${baseUrl}?archives=true&pageNo=${currentPage - 1}&pageSize=${pageSize}`,
      { headers }
    );
    if (res) {
      return {
        data: res.data.map((interviewer) => ({
          id: interviewer.id,
          cellOne: `${interviewer.firstName} ${interviewer.lastName}`,
          cellTwo: interviewer.email,
          cellThree: interviewer.phone_no,
          cellFour: `${interviewer.address?.city}, ${interviewer.address?.country}, ${interviewer.address?.state}`,
          cellFive: interviewer?.interview_skills,
          cellSix: interviewer?.total_experience,
          cellSeven: interviewer.client?.clientName,
        })),
        totalItems: res.headers["total-elements"],
      };
    }
  } catch (error) {
    return catchHandle(error);
  }
};

export const archiveSelectedInterviewers = async (headers, selection) => {
  try {
    const res = axios.all(
      selection.map((id) => axios.delete(`${baseUrl}/${id}`, { headers }))
    );
    if (res) {
      return { status: (await res).map(r => r.status) };
    }
  } catch (error) {
    return catchHandle(error);
  }
};
