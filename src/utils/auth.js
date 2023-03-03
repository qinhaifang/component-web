import * as config from "@/config/config.base";
const { TokenKey } = config;
export function getToken() {
  return localStorage.getItem(TokenKey);
}

export function setToken(token) {
  return localStorage.setItem(TokenKey, token);
}

export function removeToken() {
  return localStorage.setItem(TokenKey, "");
}