import request from "@/utils/fetch";
const config = require("@/config");

// 编辑或新增部门
export const departmentSaveOrUpdate = (data) =>
  request({
    method: "post",
    url: config.version + "/system/department/saveOrUpdate",
    data,
    config: {
      showMessage: true,
    },
  });
// 部门删除
export const departmentDeleteById = (data) =>
  request({
    method: "post",
    url: config.version + "/system/department/deleteDept",
    data,
    config: {
      showMessage: true,
    },
  });
// 查询所有部门名称
export const findDepartmentNameAll = (data) =>
  request({
    method: "post",
    url: config.version + "/system/department/findDeptNameAll",
    data,
    config: {
      showLoading: false,
    },
  });
