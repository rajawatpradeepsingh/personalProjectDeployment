import axios from "axios";
import { config } from "../../config";
import auth from "../../utils/AuthService";

const baseUrl = `${config.serverURL}/jobopenings`;

const getJobs = async (headers, path, params = "") => {
  try {
    const res = await axios.get(`${baseUrl}${path}${params}`, { headers });
    if (res.status === 200) {
      return { statusCode: 200, data: res.data };
    }
    return { statusCode: res.status };
  } catch (err) {
    if (err.response.status === 401) auth.logout();
    return { statusCode: err.response?.status };
  }
};

export const getAllJobs = async (headers) => {
  const param = "?dropdownFilter=true";
  return await getJobs(headers, "", param);
};

export const getJobById = async (headers, id) => {
  const path = `/${id}`;
  return await getJobs(headers, path);
};

export const updateJob = async (headers, data, id) => {
  try {
    const res = await axios.patch(`${baseUrl}/${id}`, data, { headers });
    if (res.status === 200) {
      return { statusCode: 200, data: res.data };
    }
    return { statusCode: res.status };
  } catch (err) {
    if (err.response.status === 401) auth.logout();
    return { statusCode: err.response?.status };
  }
};

const formatDataForTable = (jobs) => {
  return jobs.map((job) => ({
    ...job,
    jobNumber: `DH${("00000" + job.id).slice(-5)}`,
    clientBillRate: `${job.currency}${job.clientBillRate}, ${
      job.period || "Per hour"
    }`,
    clientName: job.client?.clientName,
    location: job.client?.address
      ? `${job.client.address.city}, ${job.client.address.state}, ${job.client.address.countryCode}`
      : "",
    utcDate: new Date(job.creationDate),
    submissions: job.candidateList
      ? job.candidateList?.map((c) => ({
          id: c.id,
          name: `${c.firstName} ${c.lastName}`,
          recruiter: `${c.recruiter.firstName} ${c.recruiter.lastName}`,
          date: c.submitDate,
        }))
      : [],
  }));
};

export const getJobTableData = async (headers, currentPage, pageSize, sort) => {
  // debugger
  let url = `${baseUrl}?pageNo=${currentPage - 1}&pageSize=-1`;
  // console.log("auth >>>"+auth.hasRecruiterRole());
  if (auth.hasRecruiterRole()) url += `&recruiterId=${auth.getUserId()}`;
  for (const key in sort) {
    if (key) url += `&orderBy=${key}&orderMode=${sort[key]}`;
  }
  try {
    const res = await axios.get(url, { headers });
    if (res) {
      return {
        statusCode: res.status,
        data: res.data.length ? formatDataForTable(res.data) : [],
        totalItems: res.headers["total-elements"],
      };
    }
  } catch (err) {
    if (err.response.status === 401) auth.logout();
    return { statusCode: err.response?.status };
  }
};

export const getFilteredJobTableData = async (
  headers,
  currentPage,
  pageSize,
  filters,
  sortKey,sortOrder
) => {
  const sort = !sortKey ? "" : `&orderBy=${sortKey}&orderMode=${sortOrder}`;
  const pages = `pageNo=${currentPage - 1}&pageSize=${pageSize}`;
  let url = `${baseUrl}?dropdownFilter=true&${pages}`;
  if (auth.hasRecruiterRole()) url += `&recruiterId=${auth.getUserId()}`;
  if (Object.keys(sort).length) {
    url += `${sort}`;
  }
  try {
    const res = await axios.put(url, filters, { headers });
    if (res) {
      return {
        statusCode: res.status,
        data: res.data.length ? formatDataForTable(res.data) : [],
        totalItems: res.headers["total-elements"],
      };
    }
  } catch (err) {
    console.log(err);
    if (err.response?.status === 401) auth.logout();
    return { statusCode: err.response?.status };
  }
};

export const getJobsArchive = async (headers, currentPage, pageSize) => {
  let url = `${baseUrl}?archives=true&pageNo=${
    currentPage - 1
  }&pageSize=${pageSize}`;
  if (auth.hasRecruiterRole()) url += `&recruiterid=${auth.getUserId()}`;
  try {
    const res = await axios.get(url, { headers });
    if (res) {
      return {
        totalItems: res.headers["total-elements"],
        data: res.data.map((job) => ({
          id: job.id,
          cellOne: job.jobTitle,
          cellTwo: job.client?.clientName || "",
          cellThree: job.noOfJobopenings,
          cellFour: job.hiringManager,
          cellFive: job.priority,
          cellSix: job.status,
          cellSeven: job.jobType,
        })),
      };
    }
  } catch (err) {
    if (err.response.status === 401) auth.logout();
    return { statusCode: err.response?.status };
  }
};
