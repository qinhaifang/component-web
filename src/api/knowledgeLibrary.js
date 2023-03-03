import request from "@/utils/fetch";
const config = require("@/config");

//知识库列表
export const knowledgeLibraryList = (data) =>
  request({
    method: "post",
    url: config.version + "/knowledge/findListByParam",
    data,
  });

export const knowledgeLibrarySaveOrUpdate = (data) =>
  request({
    method: "post",
    url: config.version + "/knowledge/saveOrUpdate",
    data,
    config: {
      showMessage: true,
    },
  });

export const knowledgeLibraryDeleteById = (data) =>
  request({
    method: "post",
    url: config.version + "/knowledge/deleteById",
    data,
    config: {
      showMessage: true,
    },
  });

//知识库回收站
export const deleteCompletelyById = (data) =>
  request({
    method: "post",
    url: config.version + "/knowledge/deleteCompletelyById",
    data,
    config: {
      showMessage: true,
    },
  });

export const recoveryById = (data) =>
  request({
    method: "post",
    url: config.version + "/knowledge/recoveryById",
    data,
    config: {
      showMessage: true,
    },
  });

//知识库目录
export const knowledgeLibraryDirectory = (data) =>
  request({
    method: "post",
    url: config.version + "/knowledge/title/findListByParam",
    data,
    config: {
      showLoading: false,
    },
  });

//知识库目录排序
export const knowledgeLibraryTitleSort = (data) =>
  request({
    method: "post",
    url: config.version + "/knowledge/title/titleSort",
    data,
    config: {
      showLoading: false,
    },
  });

export const renameById = (data) =>
  request({
    method: "post",
    url: config.version + "/knowledge/title/rename",
    data,
    config: {
      showMessage: true,
    },
  });

export const saveOrUpdate = (data) =>
  request({
    method: "post",
    url: config.version + "/knowledge/title/saveOrUpdate",
    data,
  });

export const deleteById = (data) =>
  request({
    method: "post",
    url: config.version + "/knowledge/title/deleteById",
    data,
  });

//知识库目录回收站彻底删除
export const directoryDeleteCompletely = (data) =>
  request({
    method: "post",
    url: config.version + "/knowledge/title/deleteCompletelyById",
    data,
  });

//知识库目录回收站恢复
export const directoryRecovery = (data) =>
  request({
    method: "post",
    url: config.version + "/knowledge/title/recoveryById",
    data,
  });

//知识库目录回收站是否存在父级
export const parentExist = (data) =>
  request({
    method: "post",
    url: config.version + "/knowledge/title/parentExist",
    data,
  });

//新建文档在线保存
export const saveFile = (data) =>
  request({
    method: "post",
    url: config.version + "/knowledge/title/saveFile",
    data,
    config: {
      showLoading: false,
    },
  });

export const reviewFiles = (data) =>
  request({
    method: "post",
    url: config.version + "/knowledge/title/reviewFiles",
    data,
    config: {
      showLoading: false,
    },
  });

export const downLoadFiles = (data) =>
  request({
    method: "post",
    url: config.version + "/knowledge/title/downloadFile",
    data,
    config: {
      showLoading: false,
    },
  });

export const downloadHistoryFile = (data) =>
  request({
    method: "post",
    url: config.version + "/knowledge/title/downloadHistoryFile",
    data,
    config: {
      showLoading: false,
    },
  });

export const findHistoryList = (data) =>
  request({
    method: "post",
    url: config.version + "/knowledge/title/findHistoryList",
    data,
    config: {
      showLoading: false,
    },
  });

export const setNewVersion = (data) =>
  request({
    method: "post",
    url: config.version + "/knowledge/title/setNewVersion",
    data,
    config: {
      showLoading: true,
    },
  });

export const reviewHistoryFiles = (data) =>
  request({
    method: "post",
    url: config.version + "/knowledge/title/reviewHistoryFiles",
    data,
    config: {
      showLoading: true,
    },
  });
