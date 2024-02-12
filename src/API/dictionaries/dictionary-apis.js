import axios from "axios";
import { config } from "../../config";
import { sortAscending } from '../../utils/service';

// helpers
export const getSel = (selection) => {
  if (Array.isArray(selection)) {
    const record = selection.filter((sel) => sel["__isNew__"]);
    return record.length ? record[0].value : undefined;
  }
  return selection["__isNew__"] ? selection.value : undefined;
};

// APIs
export const postDict = async (dictionary, value, headers) => {
  const body = {
    dictionary,
    value,
  };
  headers = {
    ...headers,
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  const res = await fetch(`${config.serverURL}/dictionary/`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  return res.json();
};

export const getDict = async (dictionary, headers) => {
  headers = {
    ...headers,
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  try {
    const res = await fetch(`${config.serverURL}/dictionary/${dictionary}`, {
      method: "GET",
      headers,
    });
    return res.json();
  } catch (error) {
    console.log(error);
  }
};

export const delDict = async (id, headers) => {
  headers = {
    ...headers,
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  const res = await fetch(`${config.serverURL}/dictionary/${id}`, {
    method: "DELETE",
    headers,
  });
  return res.json();
};

export const deleteMultipleDictValues = async (ids, headers) => {
  try {
    return await axios.all(ids.map((id) => axios.delete(`${config.serverURL}/dictionary/${id}`, { headers })));
  } catch (err) {
    console.log(err)
  }
}


export const getCandidateRolesDictionary = async (headers) => {
  try {
    const response = await getDict("professionalRoles", headers);
    if (response) {
      return sortAscending("value", response)
        .filter((role) => !role.isDeleted)
        .map((role) => {
          return { id: role.id, value: role.value };
        });
    } 
  } catch (error) {
    console.log(`Error getting candidate roles: ${error}`);
  }
};

export const getWorkAuthDictionary = async (headers) => {
  try {
    const response = await getDict("workAuthStatus", headers);
    if (response) {
      const data = sortAscending("value", response)
        .filter((role) => !role.isDeleted)
        .map((role) => {
          return { id: role.id, value: role.value };
        });
      return data;
    } 
  } catch (error) {
    console.log(`Error getting work auth options: ${error}`);
  }
};

export const getPrimarySkillsDictionary = async (headers) => {
  try {
    const response = await getDict("primeSkills", headers);
    if (response.length) {
      return sortAscending("value", response)
        .filter((skill) => !skill.isDeleted)
        .map((skill) => {
          return { id: skill.id, value: skill.value };
        });
    } 
  } catch (error) {
    console.log(`Error getting candidate roles: ${error}`);
  }
};

export const getDesignationDictionary = async (headers) => {
  try {
    const response = await getDict("designation", headers);
    if (response) {
      const data = sortAscending("value", response)
        .filter((designation) => !designation.isDeleted)
        .map((designation) => {
          return { id: designation.id, value: designation.value };
        });
      return data;
    } 
  } catch (error) {
    console.log(`Error getting work auth options: ${error}`);
  }
};

export const supplierDict = async (headers) => {
  try {
    const response = await getDict("supplierCompanyName", headers);
    if (response) {
      const data = sortAscending("value", response)
        .filter((supplierCompanyName) => !supplierCompanyName.isDeleted)
        .map((supplierCompanyName) => {
          return { id: supplierCompanyName.id, value: supplierCompanyName.value };
        });
      return data;
    } 
  } catch (error) {
    console.log(`Error getting work auth options: ${error}`);
  }
};

