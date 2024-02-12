import axios from "axios";
import { config } from "../../config";
import auth from "../../utils/AuthService";

const baseUrl = `${config.serverURL}/guides`;

const headersObj = (headers) => ({
  ...headers,
  Accept: "application/json",
  "Content-Type": "application/json",
});

const getGuides = async (headers, path, params) => {
  try {
    return await axios.get(`${baseUrl}${path}${params}`, { headers });
  } catch (err) {
    if (err.response.status === 401) auth.logout();
    return { statusCode: err.response?.status };
  }
};

export const getSubjects = async (headers) => {
  const response = await fetch(`${baseUrl}/subjects`, {
    method: "GET",
    headers: headersObj(headers),
  });
  const data = await response.json();
  return data;
};

export const postSubject = async (headers, subject) => {
  const response = await fetch(`${baseUrl}/subjects`, {
    method: "POST",
    headers: headersObj(headers),
    body: JSON.stringify(subject),
  });
  const data = await response.json();
  return data;
};

export const getAreas = async (headers) => {
  const response = await fetch(`${baseUrl}/areas`, {
    method: "GET",
    headers: headersObj(headers),
  });
  const data = await response.json();
  return data;
};

export const postArea = async (headers, area) => {
  const response = await fetch(`${baseUrl}/areas`, {
    method: "POST",
    headers: headersObj(headers),
    body: JSON.stringify(area),
  });
  const data = await response.json();
  return data;
};

export const postSection = async (headers, section, body) => {
  const response = await fetch(`${baseUrl}/${section}s`, {
    method: "POST",
    headers: headersObj(headers),
    body: JSON.stringify(body),
  });
  const data = await response.json();
  return data;
};

export const getLatest = async (headers, filters, page, size) => {
  const pages = `?page=${page - 1 || 0}&size=${size || config.ITEMS_PER_PAGE}`;
  const filter = filters?.subject ? `&subjectName=${filters.subject}` : ""; // parent table is filtered by Subject only
  const search = filters?.search ? `&search=${filters.search}` : "";
  const params = `${pages}${filter}${search}`;
  const res = await getGuides(headers, "/latest", params);
  const data = {};
  if (res.status === 200) {
    data.data = res.data.content;
    data.totalItems = res.data["totalElements"];
    data.statusCode = res.status;
  }
  return data;
};

export const getBySubjectAndArea = async (
  headers,
  subjectId,
  areaId,
  page,
  size,
  filters
) => {
  //TODO: refactor backend to get filters and search from PUT method body
  const pages = `?page=${page - 1 || 0}&size=${size || 10}`;
  const ids = `&subjectId=${subjectId}&areaId=${areaId}`;
  const search = filters?.search ? `&search=${filters.search}` : "";
  const params = `${pages}${ids}${search}`;
  try {
    const res = await axios.put(`${baseUrl}${params}`, {}, { headers });
    return { data: res.data, totalItems: res.headers["total-elements"] };
  } catch (err) {
    console.log(`Error: ${err}`);
  }
};

export const postGuide = async (headers, guide) => {
  const response = await fetch(`${baseUrl}`, {
    method: "POST",
    headers: headersObj(headers),
    body: JSON.stringify(guide),
  });
  const data = await response.json();
  return data;
};

export const putGuide = async (headers, guide) => {
  const putGuide = {
    subject: { id: guide.subject.id },
    area: { id: guide.area.id },
    client: { id: guide?.client?.id || null },
    user: { id: guide.user.id },
    questions: guide.questions,
  };
  const response = await fetch(`${baseUrl}/${guide.id}`, {
    method: "PUT",
    headers: headersObj(headers),
    body: JSON.stringify(putGuide),
  });
  const data = await response.json();
  return data;
};

export const deleteGuides = async (headers, ids) => {
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

export const getDeletedGuides = async (headers, page, size) => {
  try {
    let data = {};
    const pages = `?pageNo=${page - 1}&pageSize=${size}`;
    const path = `/deleted`;
    const response = await getGuides(headers, path, pages);
    if (response.status === 200) {
      data.tableData = response.data.content?.map((guide) => ({
        id: guide.id,
        cellOne: guide?.subject?.name,
        cellTwo: guide?.area?.name,
        cellThree: guide?.client?.clientName,
      }));
      data.totalItems = response.data["totalElements"];
      data.statusCode = response.status;
    }
    return data;
  } catch (err) {
    if (err.response.status === 401) auth.logout();
    return { statusCode: err.response?.status, err };
  }
};

export const getFilteredGuides = async (
  headers,
  filters,
  page = 1,
  size = config.ITEMS_PER_PAGE
) => {
  const filter = Object.entries(filters)
    .map(([key, value]) => `${key}Name=${value}`)
    .join("&");
  const pages = `?page=${page - 1 || 0}&size=${size}`;
  const params = `${pages}&${filter}`;
  const path = "/filter";
  const res = await getGuides(headers, path, params);
  const data = {};
  if (res.status === 200) {
    data.data = res.data.content;
    data.totalItems = res.data["totalElements"];
    data.statusCode = res.status;
  }
  return data;
};
