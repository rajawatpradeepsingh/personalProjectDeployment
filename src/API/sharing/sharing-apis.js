import axios from "axios";
import { config } from "../../config";
import auth from "../../utils/AuthService";

const baseUrl = `${config.serverURL}/email/share`;
const headers = auth.getHeaders();

export const postSharing = async (body) => {
  try {
    const res = await axios.post(`${baseUrl}`, body, { headers });
    return res;
  } catch (err) {
    if (err.response.status === 401) auth.logout();
    return { statusCode: err.response?.status };
  }
};
