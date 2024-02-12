import axios from "axios";
import { config } from "../../config.js";
import auth from "../../utils/AuthService";
import { mapActivity } from "../../components/entity/candidate/utils/utils.js";
import { mapActivitiesData } from "../../components/entity/candidate/utils/utils.js";
import { mapCandidatesList } from "../../components/entity/candidate/utils/utils.js";
import { mapCandidate } from "../../components/entity/candidate/utils/utils.js";
import { getFullName, getAddress } from "../../utils/service.js";

const baseUrl = `${config.serverURL}/candidates`;
const activityUrl = `${config.serverURL}/activities/candidate`;
const activitiesUrl = `${config.serverURL}/activities`;

const getCandidates = async (headers, path, params) => {
  let data = {};
  try {
    const res = await axios.get(`${baseUrl}${path}${params}`, { headers });
    if (res.status === 200) {
      data.tableData = mapCandidatesList(res.data);
      data.totalItems = res.headers["total-elements"];
      data.statusCode = res.status;
    }
    return data;
  } catch (err) {
    if (err.response.status === 401) auth.logout();
    return { statusCode: err.response?.status };
  }
};

const putCandidates = async (headers, path, params, body) => {
  let data = {};
  try {
    const res = await axios.put(`${baseUrl}${path}${params}`, body, {
      headers,
    });
    if (res.status === 200) {
      data.tableData = mapCandidatesList(res.data);
      data.totalItems = res.headers["total-elements"];
      data.statusCode = res.status;
    }
    return data;
  } catch (err) {
    if (err.response.status === 401) auth.logout();
    return { statusCode: err.response?.status };
  }
};

const postCandidates = async (headers, path, params, body) => {
  try {
    const res = await axios.post(`${baseUrl}${path}${params}`, body, {
      headers,
    });
    return res;
  } catch (err) {
    if (err.response.status === 401) auth.logout();
    return { statusCode: err.response?.status };
  }
};

export const postCandidate = async (headers, body) => {
  return await postCandidates(headers, "", "", body);
};

export const checkCandidate = async (headers, id, body) => {
  const path = `/checks/${id}`;
  return await postCandidates(headers, path, "", body);
};

export const deleteResume = async (headers, id) => {
  const path = `/${id}/resume`;
  try {
    const res = await axios.delete(`${baseUrl}${path}`, { headers });
    return res;
  } catch (err) {
    if (err.response.status === 401) auth.logout();
    return { statusCode: err.response?.status };
  }
};

export const postResume = async (headers, id, body) => {
  const path = `/${id}/resume`;
  try {
    const res = await axios.post(`${baseUrl}${path}`, body, { headers });
    return res;
  } catch (err) {
    if (err.response.status === 401) auth.logout();
    return { statusCode: err.response?.status };
  }
};

const getActivities = async (headers, id) => {
  try {
    return await axios.get(`${activityUrl}/${id}`, { headers });
  } catch (err) {
    if (err.response.status === 401) auth.logout();
    return { statusCode: err.response?.status };
  }
};

export const getCandidatesPage = async (
  headers,
  page,
  perPage,
  sortKey,
  sortOrder
) => {
  const sort = !sortKey ? "" : `&orderBy=${sortKey}&orderMode=${sortOrder}`;
  let params = `?pageNo=${page - 1}&pageSize=-1`;
    if (auth.hasRecruiterRole()) params += `&recruiterId=${auth.getUserId()}`;
  //let key = "";
  if (Object.keys(sort).length) {
    //key = Object.keys(sort)[0];
    params += `${sort}`;
  }
  return await getCandidates(headers, "", params);
};

export const getCandidatesForDropdown = async (headers) => {
  const params = `?dropdownFilter=true`;
  return await getCandidates(headers, "", params);
};

export const getFilteredCandidates = async (
  headers,
  filters,
  page = 1,
  perPage = config.ITEMS_PER_PAGE,
  sortKey,
  sortOrder
) => {
  const sort = !sortKey ? "" : `&orderBy=${sortKey}&orderMode=${sortOrder}`;
  const pages = `&pageNo=${page - 1}&pageSize=${perPage}`;
  let params = `?dropdownFilter=true&${pages}`; 
  if (Object.keys(sort).length) {
    params += `${sort}`;
  }
  return await putCandidates(headers, "", params, filters);
};

export const getCandidateById = async (headers, id) => {
  try {
    const res = await axios.get(`${baseUrl}/${id}`, { headers });
    let data = {};
    if (res.status === 200) data = mapCandidate(res);
    return data;
  } catch (err) {
    if (err.res.status === 401) auth.logout();
    return { statusCode: err.response?.status, err };
  }
};

// get entity with no mapping
export const getCandidateAsIs = async (headers, id) => {
  try {
    return await axios.get(`${baseUrl}/${id}`, { headers });
  } catch (err) {
    if (err.res.status === 401) auth.logout();
    return { statusCode: err.response?.status, err };
  }
};

export const updateCandidate = async (headers, data, id) => {
  try {
    const res = await axios.patch(`${baseUrl}/${id}`, data, { headers });
    if (res.status === 200) return { statusCode: 200, data: res.data };
  } catch (err) {
    if (err.response.status === 401) auth.logout();
    return { statusCode: err.response?.status, err };
  }
};

export const archiveCandidates = async (headers, ids) => {
  try {
    const response = await axios.all(
      ids.map((id) => axios.delete(`${baseUrl}/${id}`, { headers }))
    );
    return response;
  } catch (err) {
    if (err.response.status === 401) auth.logout();
    return { statusCode: err.response?.status, err };
  }
};

export const getCandidatesArchive = async (headers, page, perPage) => {
  const pages = `pageNo=${page - 1}&pageSize=${perPage}`;
  const param = `?archives=true&${pages}`;
  try {
    const response = await axios.get(`${baseUrl}${param}`, { headers });
    let data = {};
    if (response.status === 200) {
      data.tableData = response.data.map((candidate) => ({
        id: candidate.id,
        cellOne: getFullName(candidate),
        cellTwo: candidate.recruiter ? getFullName(candidate.recruiter) : "",
        cellThree: getAddress(candidate.address),
        cellFour: `${candidate.professionalInfo?.totalExperience || ""} ${
          candidate.professionalInfo?.totalExpPeriod || ""
        }`,
        cellFive: candidate.workAuthStatus,
        cellSix: `${ candidate.professionalInfo?.expectedCtcCurrency || ""}${candidate.professionalInfo?.startExpCTC &&
          candidate.professionalInfo?.endExpCTC
            ? `${candidate.professionalInfo?.startExpCTC} - ${candidate.professionalInfo?.endExpCTC}`
            : candidate.professionalInfo?.startExpCTC &&
              !candidate.professionalInfo?.endExpCTC
            ? candidate.professionalInfo?.startExpCTC
            : !candidate.professionalInfo?.startExpCTC &&
              candidate.professionalInfo?.endExpCTC
            ? candidate.professionalInfo?.endExpCTC
            : candidate.professionalInfo?.expectedCtcValue
            ? candidate.professionalInfo?.expectedCtcValue
            : ""}${ candidate.professionalInfo?.expectedCtcType
              ? `${
                  candidate.professionalInfo?.expectedCtcType.includes("Annual")
                    ? "/yr"
                    : "/hr"
                }`
              : ""}${candidate.professionalInfo?.expectedCtcTax
                ? `, ${candidate.professionalInfo?.expectedCtcTax}`
                : ""}`,
      }));
      data.totalItems = response.headers["total-elements"];
      data.statusCode = response.status;
    }
    return data;
  } catch (err) {
    if (err.response.status === 401) auth.logout();
    return { statusCode: err.response?.status, err };
  }
};

export const checkDuplicates = async (headers, entity) => {
  const { firstName, lastName, email } = entity;
  const params = { firstName, lastName, email };
  const path = "/basics";
  try {
    return await axios.get(`${baseUrl}${path}`, { params, headers });
  } catch (err) {
    if (err.response.status === 401) auth.logout();
    return { statusCode: err.response?.status, err };
  }
};

export const getCandidateActivityData = async (headers, id, comments) => {
  const res = await getActivities(headers, id);
  return mapActivitiesData(res, comments);
};

export const getActivityId = async (headers, candidateId, jobId) => {
  const res = await getActivities(headers, candidateId);
  return mapActivity(res, jobId);
};

export const getActivitiesAll = async (headers) => {
  try {
    return await axios.get(`${activitiesUrl}`, { headers });
  } catch (err) {
    if (err.response.status === 401) auth.logout();
    return { statusCode: err.response?.status };
  }
};

export const getAllCandidates = async (headers) => {
  const params = "?dropdownFilter=true";
  const res = await getCandidates(headers, "", params);
  return res.tableData ? res.tableData : [];
};
