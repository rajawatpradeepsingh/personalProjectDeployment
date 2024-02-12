import { config } from "../../config";
import axios from "axios";
import auth from "../../utils/AuthService";
import moment from "moment";

const baseUrl = `${config.serverURL}/onboarding`; //http://localhost:9093
 
const formatMainTableData = (data) => {
   return data.map((o) => {
     return {
       ...o,
       candidateName: `${o.candidate.firstName} ${o.candidate.lastName}`
     };
   });
 };

export const getOnboardingByParams = async (headers, path = "", params = "") => {
   
   const fullPath = `${path}${params}`;
   return await getOnboardingDrop(headers, fullPath);
 };
 
 const getOnboardingDrop = async (headers, path, params = "") => {
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
export const getOnBoardingById = async (headers, id) => {
  try {
     const response = await axios.get(`${config.serverURL}/onboarding/${id}`, { headers });
     let data = {};
     if (response.status === 200) {
        data.onBoardingdata = response.data;
        data.onBoardingDetails = response.data;
        data.statusCode = response.status;
     }
     return data;
  } catch (error) {
     console.log(error);
     return { statusCode: error.response?.status };
  }
}

export const updateOnBoarding= async (headers, data, id) => {
   try {
      const response = await axios.patch(`${config.serverURL}/onboarding/${id}`, data, { headers });
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

export const getOnboardings = async (headers, currentPage, pageSize, sortParams = null, filters = null) => {
    try {
       const url = !sortParams && !filters
         ? `?pageNo=${currentPage - 1}&pageSize=-1` 
         : sortParams ? `?dropdownFilter=true&pageNo=${currentPage - 1}&pageSize=${pageSize}&${sortParams}`
         : `?dropdownFilter=true&pageNo=${currentPage - 1}&pageSize=${pageSize}`;
       const response = !filters ? await axios.get(`${baseUrl}${url}`, { headers }) : await axios.put(`${baseUrl}${url}`, filters, { headers });
     
       if (response.status === 200) {
          return {
            data: response.data.map(o => ({...o, candidateName: `${o.candidate?.firstName} ${o.candidate?.lastName}`})),
            totalItems: response.headers["total-elements"],
            status: response.status
          }
       }
    } catch (error) {
       if (error.response?.status === 401) auth.logout();
       return { status: error.response?.status };
    }
}

export const getOnboardArchive = async (headers, currentPage, pageSize) => {
   try {
      const res = await axios.get(`${config.serverURL}/onboarding?archives=true&pageNo=${currentPage - 1}&pageSize=${pageSize}`, { headers });
      if (res) {
         return {
           data: res.data.length ? res.data.map((o) => ({
             id: o.id,
             cellOne:
               `${o.candidate?.firstName} ${o.candidate?.lastName}` || "",
             cellTwo: o.client?.clientName || "",
             cellThree: o.hiringType || "",
             cellFour: o.startDate ?  moment(o.startDate).format("MM/DD/YYYY") : "",
             cellFive: o.endDate ? moment(o.endDate).format("MM/DD/YYYY") : "",
             cellSix: o.signUpContract || "",
             cellSeven: o.deliveryOfLaptop || "",
           })) : [],
           totalItems: res.headers["total-elements"],
         };
      }

   } catch (error) {
      console.log(error)
   }
}