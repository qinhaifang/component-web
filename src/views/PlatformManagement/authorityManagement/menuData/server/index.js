import request from "@/utils/fetch";
const config = require("@/config");
// 历史告警
// 新增/编辑菜单
export function saveData(data) {
  return request({
    url: "/system/menu/saveOrUpdate",
    method: "post",
    data,
    config: {
      showMessage: true,
      msg: "保存成功",
    },
  });
}
// 查看
export function findById(data) {
  return request({
    url: "/system/menu/findById",
    method: "post",
    data,
  });
}
// 删除
export function delData(data) {
  return request({
    url: "/system/menu/deleteById",
    method: "post",
    data,
    config: {
      showLoading: false,
      showMessage: true,
    },
  });
}
// 根据父类查询下一个排序号
export function findNextOrderByParentId(data) {
  return request({
    url: "/system/menu/findNextOrderByParentId",
    method: "post",
    data,
    config: {
      showLoading: false,
    },
  });
}
// 查询所有菜单名称
export const findMenuNameAll = (data) =>
  request({
    method: "post",
    url: config.version + "/system/role/findMenuNameAll",
    data,
    config: {
      showLoading: false,
    },
  });
// 查询所有路由
export const getUserRoutes = (data) =>
  request({
    method: "post",
    url: config.version + "/system/user/getUserRoutes",
    data,
    config: {
      showLoading: false,
    },
  });
