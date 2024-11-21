import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";
import App from "./App";
import KakaoLogin from "./KakaoLogin";

const Root = () => {
  const [user, setUser] = useState(null);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <App user={user} setUser={setUser} />,
    },
    {
      path: "/login/oauth/kakao",
      element: <KakaoLogin setUser={setUser} />,
    },
  ]);

  return <RouterProvider router={router} />;
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <RecoilRoot>
    <Root />
  </RecoilRoot>
);
