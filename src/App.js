import React, { useState } from "react";
import axios from "axios";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  tokenState,
  codeState,
  userTokenState,
  refreshTokenState,
} from "./atom";

function App({ user, setUser }) {
  const [every, setEvery] = useState(null);
  const [test, setTest] = useState(null);
  const [error, setError] = useState(null);
  const [code, setCode] = useRecoilState(codeState);
  const [token, setToken] = useRecoilState(tokenState);
  const setRefreshToken = useSetRecoilState(refreshTokenState);
  const [userToken, setUserToken] = useRecoilState(userTokenState);

  const logoutClickHandler = () => {
    setCode(null);
    setToken(null);
    setUserToken({ isLoggedIn: false });
    setUser(null);
    setEvery(null);
    setTest(null);
    setRefreshToken(null);
  };

  const headers = {
    ...(token && { Authorization: "Bearer " + token }),
    // "Content-Type": "application/json", // 필요 시 추가
  };

  const handleLoginClick = () => {
    window.location.href = process.env.REACT_APP_KAKAO_URL;
  };

  const testApiClick = () => {
    console.log(token);
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/api/test`, { headers })
      .then((response) => {
        // 성공 시 처리
        setTest(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        // 오류 시 처리
        setError(error.message);
        console.error("Error test api: ", error);
      });
  };

  const everyApiClick = () => {
    console.log(token);
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/every`)
      .then((response) => {
        // 성공 시 처리
        setEvery(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        // 오류 시 처리
        setError(error.message);
        console.error("Error test api: ", error);
      });
  };

  return (
    <>
      <h3> 카카오 로그인 테스트</h3>
      {userToken.isLoggedIn ? (
        <button onClick={logoutClickHandler}> 로그아웃 </button>
      ) : (
        <button onClick={handleLoginClick}>카카오 로그인</button>
      )}

      <br />
      <button onClick={testApiClick}>테스트 api 요청</button>
      <br />
      <button onClick={everyApiClick}>
        로그인하지 않아도 가능할걸? api 요청
      </button>
      {code && (
        <>
          <p>
            프론트에서 제일 첫번째로 카카오 api로 로그인 요청 후 받는 code 정보
            :
          </p>
          {code}
        </>
      )}
      {user ? (
        <>
          <p>{user.name}</p>
          <p>
            앞으로 header에 넣어서 확인받을 accessToken 값 : {user.accessToken}
          </p>
          <p>refreshToken 확인 : {user.refreshToken}</p>
        </>
      ) : (
        <p>로그인 후 사용자 정보를 확인하세요.</p>
      )}
      {every && <p>권한 없이 이용 가능한 api : {every}</p>}
      {test && <p>권한이 있어야만 이용 가능한 api : {test}</p>}
      {error && <p>{error}</p>}
    </>
  );
}

export default App;
