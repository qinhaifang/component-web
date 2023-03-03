import request from "@/utils/fetch";
const config = require("@/config");

//查询负责人
export const findResponsibilityPeople = (data) =>
  request({
    method: "post",
    url: config.version + "/system/workerUser/findAll",
    data,
    config: {
      showLoading: false,
    },
  });

//查询演示站
export const findLibraryById = (data) =>
  request({
    method: "post",
    url: config.version + "/product/findById",
    data,
    config: {
      showLoading: false,
    },
  });

//演示站新增与保存
export const demoLibrarySaveOrUpdate = (data) =>
  request({
    method: "post",
    url: config.version + "/product/demo/saveOrUpdate",
    data,
    config: {
      showMessage: true,
    },
  });

//测试站新增与保存
export const testLibrarySaveOrUpdate = (data) =>
  request({
    method: "post",
    url: config.version + "/product/test/saveOrUpdate",
    data,
    config: {
      showMessage: true,
    },
  });

//竞品站新增与保存
export const competitiveProductLibrarySaveOrUpdate = (data) =>
  request({
    method: "post",
    url: config.version + "/product/competitiveProduct/saveOrUpdate",
    data,
    config: {
      showMessage: true,
    },
  });

// 演示站删除
export const demoLibraryDeleteById = (data) =>
  request({
    method: "post",
    url: config.version + "/product/demo/deleteById",
    data,
    config: {
      showMessage: true,
    },
  });

// 测试站删除
export const testLibraryDeleteById = (data) =>
  request({
    method: "post",
    url: config.version + "/product/test/deleteById",
    data,
    config: {
      showMessage: true,
    },
  });

// 演示站删除
export const competitiveProductLibraryDeleteById = (data) =>
  request({
    method: "post",
    url: config.version + "/product/competitiveProduct/deleteById",
    data,
    config: {
      showMessage: true,
    },
  });
