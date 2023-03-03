import request from "@/utils/fetch";
const config = require("@/config");

//产品管理
export const projectSaveOrUpdate = (data) =>
  request({
    method: "post",
    url: config.version + "/project/saveOrUpdate",
    data,
    config: {
      showMessage: true,
    },
  });
export const projectDeleteById = (data) =>
  request({
    method: "post",
    url: config.version + "/project/deleteById",
    data,
    config: {
      showMessage: true,
    },
  });

//产品授权
export const projectAuthorizationSaveOrUpdate = (data) =>
  request({
    method: "post",
    url: config.version + "/project/authorization/saveOrUpdate",
    data,
    config: {
      showMessage: true,
    },
  });
export const projectAuthorizationDeleteById = (data) =>
  request({
    method: "post",
    url: config.version + "/project/authorization/deleteById",
    data,
    config: {
      showMessage: true,
    },
  });
export const projectAuthorizationDownloadFile = (data) =>
  request({
    method: "post",
    url: config.version + "/project/authorization/downloadFile",
    data,
    config: {
      showMessage: true,
    },
  });

