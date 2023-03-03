import request from "@/utils/fetch";
const config = require("@/config");
// 获取用户列表
export const userFindListByParam = (data) =>
  request({
    method: "post",
    url: config.version + "/system/user/findListByParam",
    data,
  });
// 获取启用角色列表
export const getfindEnableRoleList = (data) =>
  request({
    method: "post",
    url: config.version + "system/role/findRoleNameAll",
    data,
  });
// 新增用户
export const usersaveOrUpdate = (data) =>
  request({
    method: "post",
    url: config.version + "/system/user/saveOrUpdate",
    data,
    config: {
      showMessage: true,
    },
  });
// 角色删除
export const roleDeleteById = (data) =>
  request({
    method: "post",
    url: config.version + "/system/role/deleteById",
    data,
    config: {
      type: "del",
      showMessage: true,
    },
  });
// 查找用户
export const userfindById = (data) =>
  request({
    method: "post",
    url: config.version + "/system/user/findById",
    data,
  });
// 删除用户
export const userDeleteById = (data) =>
  request({
    method: "post",
    url: config.version + "/system/user/deleteById",
    data,
    config: {
      showMessage: true,
    },
  });
// 重置密码
export const resetUserPassword = (data) =>
  request({
    method: "post",
    url: config.version + "/system/user/resetPassword",
    data,
    config: {
      showMessage: true,
    },
  });
// 模糊搜索数据
export const userSearch = (data) =>
  request({
    method: "post",
    url: config.version + "/system/user/search",
    data,
    config: {
      showLoading: false,
    },
  });
