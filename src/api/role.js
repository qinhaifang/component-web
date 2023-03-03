import request from "@/utils/fetch";
const config = require('@/config')
// 获取角色列表
export const roleFindListByParam = (data) =>
  request({
    method: "post",
    url: config.version + "/system/role/findListByParam",
    data,
  });
// 角色修改新增
export const roleSaveOrUpdate = (data) =>
  request({
    method: "post",
    url: config.version + "/system/role/saveOrUpdate",
    data,
    config: {
      showMessage: true,
    },
  });
// 查找角色
export const rolefindById = (data) =>
  request({
    method: "post",
    url: config.version + "/system/role/findById",
    data,
    config: {
      showLoading: false,
    },
  });
// 角色删除
export const roleDeleteById = (data) =>
  request({
    method: "post",
    url: config.version + "/system/role/deleteById",
    data,
    config: {
      // type: "del",
      showMessage: true,
    },
  });
// 查询所有权限
export const perFindListByParam = (data) =>
  request({
    method: "post",
    url: config.version + "system/role/findMenuNameAll",
    data,
  });
// 模糊搜索数据
export const roleSearch = (data) =>
  request({
    method: "post",
    url: config.version + "/system/role/search",
    data,
    config: {
      showLoading: false,
    },
  });
