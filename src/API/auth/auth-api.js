import axios from "axios";
import { config } from "../../config";
import auth from "../../utils/AuthService";
import { securityQuestions as questions } from "../../utils/defaultData";

const baseUrl = `${config.serverURL}`;

const postAuth = async (body) => {
  try {
    let data = {};
    const header = { "Access-Control-Allow-Origin": "*" };
    const res = await axios.post(`${baseUrl}/authenticate`, body, header);
    if (res.status === 200) {
      const headers = {
        "Access-Control-Allow-Origin": "*",
        Authorization: "Bearer " + res.data.token,
      };
      data = { headers, data: res.data };
    }
    return { ...data, statusCode: res.status };
  } catch (err) {
    if (err.response.status === 401) auth.logout();
    const { data, status } = err.response;
    return { message: data.message, statusCode: status };
  }
};

const postForgotten = async (path, params, body = null) => {
  try {
    if (body) return await axios.post(`${baseUrl}${path}${params}`, body);
    else return await axios.post(`${baseUrl}${path}${params}`);
  } catch (err) {
    if (err.response.status === 401) auth.logout();
    return { statusCode: err.response?.status, err };
  }
};

export const getAuthUser = async (details) => {
  const body = { username: details.name, password: details.password };
  try {
    const authRes = await postAuth(body);
    if (authRes.statusCode === 200) {
      const url = `${baseUrl}/users/current`;
      const headers = authRes.headers;
      const token = authRes.data.token;
      const current = await axios.get(url, { headers });
      const { data, statusCode } = current;
      return { headers, token, data, statusCode };
    }
    if (authRes.statusCode === 401) auth.logout();
    return authRes;
  } catch (err) {
    if (!err.response) throw new Error();
    if (err.response?.status === 401) auth.logout();
    return { statusCode: err.response?.status, err };
  }
};

export const postRegister = async (details) => {
  const newrole = { id: details.role };
  const body = {
    username: details.username,
    password: details.password,
    firstName: details.firstName,
    lastName: details.lastName,
    phoneNumber: details.phoneNumber,
    email: details.email,
    enabled: false,
    roles: [newrole],
    question: details.question,
    answer: details.answer,
  };
  try {
    return await axios.post(`${baseUrl}/register`, body);
  } catch (err) {
    return { status: err.response?.status, data: err.response?.data };
  }
};

export const resetPass = async (token) => {
  const path = `/resetPassword/${token}`;
  try {
    return await axios.get(`${baseUrl}${path}`);
  } catch (err) {
    if (err.response?.status === 401) auth.logout();
    return { statusCode: err.response?.status, err };
  }
};

export const patchPass = async (token, body) => {
  const path = `/resetPassword/${token}`;
  try {
    return await axios.patch(`${baseUrl}${path}`, body);
  } catch (err) {
    if (err.response?.status === 401) auth.logout();
    return { statusCode: err.response?.status, err };
  }
};

export const forgottenCheck = async (body) => {
  const params = "";
  const path = "/forgottenPassword/check";
  return await postForgotten(path, params, body);
};

export const forgottenEmail = async (email) => {
  const params = "";
  const path = `/forgottenPassword/${email}`;
  return await postForgotten(path, params);
};

export const forgottenQuestion = async (email) => {
  const params = "";
  const path = `/forgottenPassword/${email}/getQuestion`;
  try {
    const res = await postForgotten(path, params);
    let question, stage;
    if (res.data) {
      // getting a question by question id
      question = questions.find((item) => item.id === res.data).name;
      stage = 2;
    } else {
      // old users with no security questions
      question = "Old Account: contact system admin for help.";
      stage = 3;
    }
    return { question, stage, statusCode: res.status };
  } catch (err) {
    if (!err.response) throw new Error();
    return { statusCode: err.response?.status, err };
  }
};
