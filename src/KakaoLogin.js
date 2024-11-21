import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSetRecoilState } from "recoil";
import { userTokenState, tokenState, codeState } from "./atom";

const KakaoLogin = ({ setUser }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const setCode = useSetRecoilState(codeState);
  const setUserToken = useSetRecoilState(userTokenState);
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
        .get(apiUrl, { withCredentials: true })
        .then((response) => {
          // 성공 시 처리
          console.log(response.data);
          setUser(response.data);
          setUserToken({ isLoggedIn: true });
          setToken(response.data.accessToken);
          navigate("/");
        })
        .catch((error) => {
          // 오류 시 처리
          console.error("Error during Kakao login:", error);
        });
    }
  }, [location.search, setCode, setUser, setUserToken, setToken, navigate]);

  return <div>카카오 로그인 처리 중...</div>;
};

export default KakaoLogin;
