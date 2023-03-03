import request from "@/utils/fetch";
const config = require("@/config");

// 编辑或新增员工
export const workerUserSaveOrUpdate = (data) =>
  request({
    method: "post",
    url: config.version + "/system/workerUser/saveOrUpdate",
    data,
    config: {
      showMessage: true,
    },
  });

// 删除员工
export const workerUserDeleteById = (data) =>
  request({
    method: "post",
    url: config.version + "/system/workerUser/deleteById",
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
