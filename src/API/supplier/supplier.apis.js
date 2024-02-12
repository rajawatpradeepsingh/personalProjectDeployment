import { config } from "../../config";
import auth from "../../utils/AuthService";
import axios from "axios";

const baseUrl = `${config.serverURL}/supplier`;

const catchHandle = (err) => {
  if (!err.response) throw new Error();
  if (err.response?.status === 401) auth.logout();
  return { status: err.response?.status, err };
};

const formatMainTableData = (data) => {
   return data.map((supplier) => {
     return {
       ...supplier,
     };
   });
 };
 
 export const getSupplierByParams = async (headers, path = "", params = "") => {
   
   const fullPath = `${path}${params}`;
   return await getSupplierDrop(headers, fullPath);
 };
 
 const getSupplierDrop = async (headers, path, params = "") => {
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

export const getSupplierById = async (headers, id) => {
  try {
     const response = await axios.get(`${config.serverURL}/supplier/${id}`, { headers });
     let data = {};
     if (response.status === 200) {
        data.supplierData = response.data;
        data.supplierDetails = response.data;
        data.statusCode = response.status;
     }
     return data;
  } catch (error) {
     console.log(error);
     return { statusCode: error.response?.status };
  }
}

export const updateSupplier= async (headers, data, id) => {
   try {
      const response = await axios.patch(`${config.serverURL}/supplier/${id}`, data, { headers });
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
}

export const getSuppliers = async (headers, currentPage, pageSize, sortParams, filters) => {
    try {
       const url = !sortParams && !filters
         ? `?pageNo=${currentPage - 1}&pageSize=-1` 
         : sortParams ? `?dropdownFilter=true&pageNo=${currentPage - 1}&pageSize=${pageSize}&${sortParams}`
         : `?dropdownFilter=true&pageNo=${currentPage - 1}&pageSize=${pageSize}`;
       const response = !filters ? await axios.get(`${baseUrl}${url}`, { headers }) : await axios.put(`${baseUrl}${url}`, filters, { headers });
     
       if (response.status === 200) {
          return {
            data: response.data,
            totalItems: response.headers["total-elements"],
            status: response.status
          }
       }
    } catch (error) {
       return catchHandle(error);
    }
}

export const getSupplierArchive = async (headers, currentPage, pageSize) => {
   try {
      const res = await axios.get(`${config.serverURL}/supplier?archives=true&pageNo=${currentPage - 1}&pageSize=${pageSize}`, { headers });
      if (res) {
         return {
           data: res.data.map((supplier) => ({
             id: supplier.id,
             cellOne: supplier.supplierCompanyName,
             cellTwo: `${supplier.firstName} ${supplier.lastName}`,
             cellThree: supplier.email,
             cellFour: supplier.phone_no,
             cellFive: `${supplier.address?.city}, ${supplier.address?.country}, ${supplier.address?.state}`,
             cellSix: supplier.designation,
             cellSeven: supplier.website,
           })),
           totalItems: res.headers["total-elements"]
         };
      }
   } catch (error) {
      console.log(error);
   }
}

export const archiveSuppliers = async (headers, ids) => {
   try {
     const res = await axios.all(ids.map((id) => axios.delete(`${baseUrl}/${id}`, { headers })));
     if (res.length) {
      return res[0].status
     }
   } catch (error) {
      return catchHandle(error);
   }
}