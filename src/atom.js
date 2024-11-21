import { atom } from "recoil";

export const userTokenState = atom({
  key: "userToken",
  default: { isLoggedIn: false },
});

export const tokenState = atom({
  key: "token",
  default: null,
});

export const codeState = atom({
  key: "code",
  default: null,
});
