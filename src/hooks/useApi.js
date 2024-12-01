import axios from "axios";
import decodeToken from "../utils/decodeToken";

const useApi = (refreshToken) => {
  const isTokenExpired = (token) => {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return true; // 토큰 형식이 잘못되었거나 `exp`가 없으면 만료로 간주
    const currentTime = Math.floor(Date.now() / 1000); // 현재 시간을 초 단위로
    return decoded.exp < currentTime;
  };

  const sendRequest = async (accessToken, endpoint, method) => {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    };

    // 유효기간 확인 및 토큰 추가
    if (isTokenExpired(accessToken)) {
      headers["x-refresh-token"] = refreshToken;
    }

    try {
      const response = await axios({
        url: `${process.env.REACT_APP_BASE_URL}${endpoint}`,
        method,
        headers,
      });
      return response.data;
    } catch (error) {
      console.error("API Request failed:", error);
      throw error;
    }
  };

  return sendRequest;
};

export default useApi;
