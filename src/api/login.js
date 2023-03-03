import request from "@/utils/fetch";
const config = require("@/config");
// 获取验证码
export const getKaptcha = (data) =>
  request({
    method: "post",
    url: config.version + "/login/kaptcha",
    data,
    config: {
      showLoading: false,
    },
  });
// 获取对称密钥
export const getSymmetricKey = (data) =>
  request({
    method: "post",
    url: config.version + "/login/getSymmetricKey",
    data,
    config: {
      showLoading: false,
    },
  });
// 获取公钥
export const getAsymmetricPublicKey = (data) =>
  request({
    method: "post",
    url: config.version + "/login/getAsymmetricPublicKey",
    data,
    config: {
      showLoading: false,
    },
  });
// 登录接口
export const login = (data) =>
  request({
    method: "post",
    url: config.version + "/login/login",
    data,
  });

// 退出登录
export const logout = (data) =>
  request({
    method: "post",
    url: config.version + "/login/logout",
    data,
    config: {
      type: "put",
      zdyMsg: "确定要退出登录吗",
      showLoading: true,
      showMessage: false,
    },
  });
// 重置密码
export const resetPassword = (data) =>
  request({
    method: "post",
    url: config.version + "/login/modifyUserPassword",
    data,
  });
// 获取用户信息
export const getUserInfo = (data) =>
  request({
    method: "post",
    url: config.version + "/login/getUserInfo",
    data,
    config: {
      showLoading: false,
    },
  });
