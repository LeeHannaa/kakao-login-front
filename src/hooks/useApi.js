import axios from "axios";
import decodeToken from "../utils/decodeToken";
import { useSetRecoilState } from "recoil";
import { tokenState, refreshTokenState } from "../atom";

const useApi = (refreshToken) => {
  const setToken = useSetRecoilState(tokenState);
  const setRefreshToken = useSetRecoilState(refreshTokenState);

  const isTokenExpired = (token) => {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return true; // 토큰 형식이 잘못되었거나 `exp`가 없으면 만료로 간주
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp - 2 < currentTime;
  };

  const sendRequest = async (accessToken, endpoint, method) => {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    };

    if (isTokenExpired(accessToken)) {
      // 토큰 만료
      headers["x-refresh-token"] = refreshToken;
      try {
        const response = await axios({
          url: `${process.env.REACT_APP_BASE_URL}${endpoint}`,
          method,
          headers,
        });
        const accessToken = response.headers["authorization"].split(" ")[1]; // Authorization 헤더
        const refreshToken = response.headers["x-refresh-token"]; // X-Refresh-Token 헤더
        setToken(accessToken);
        setRefreshToken(refreshToken);
        return response.data;
      } catch (error) {
        console.error("API Request failed:", error);
        throw error;
      }
    } else {
      // 토큰 미완료
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
    }
  };

  return sendRequest;
};

export default useApi;
