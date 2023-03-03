import { getToken } from "@/global/utils/auth";
let Base64 = require("js-base64").Base64;
export function hasFirstLogin() {
  let data = getToken().split(".")[1];
  let resData = Base64.decode(data);
  let sub = JSON.parse(JSON.parse(resData).sub);
  // 判断第一次登录 1 是   0 否
  return sub.firstTimeLogin === 1 ? true : false;
}
