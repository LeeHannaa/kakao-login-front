import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSetRecoilState } from "recoil";
import {
  userTokenState,
  tokenState,
  codeState,
  refreshTokenState,
} from "./atom";

const KakaoLogin = ({ setUser }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const setCode = useSetRecoilState(codeState);
  const setUserToken = useSetRecoilState(userTokenState);
  const setRefreshToken = useSetRecoilState(refreshTokenState);
  const setToken = useSetRecoilState(tokenState);

  // api 요청에 필요한 토큰 저장

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    console.log("searchParams : " + searchParams);
    const code = searchParams.get("code");
    setCode(code);

    if (code) {
      const apiUrl = `${process.env.REACT_APP_BASE_URL}/auth/kakao-login?code=${code}`;
      console.log("apiUrl " + apiUrl);

      axios
        .get(apiUrl, {
          headers: {
            Referer: "http://localhost:3000/",
          },
        })
        .then((response) => {
          // 헤더에서 accessToken과 refreshToken을 가져와서 상태에 저장
          const accessToken = response.headers["authorization"].split(" ")[1]; // Authorization 헤더
          const refreshToken = response.headers["x-refresh-token"]; // X-Refresh-Token 헤더

          // 성공 시 처리
          console.log(
            response.data,
            "accessToken : ",
            accessToken,
            ", refreshToken : " + refreshToken
          );
          setUser(response.data);
          setUserToken({ isLoggedIn: true });
          setToken(accessToken); // accessToken 저장
          setRefreshToken(refreshToken); // refreshToken 저장
          navigate("/");
        })
        .catch((error) => {
          // 오류 시 처리
          console.error("Error during Kakao login:", error);
        });
    }
  }, [
    location.search,
    setCode,
    setUser,
    setUserToken,
    setToken,
    setRefreshToken,
    navigate,
  ]);

  return <div>카카오 로그인 처리 중...</div>;
};

export default KakaoLogin;
