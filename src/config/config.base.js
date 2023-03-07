const { url, ws } = require("./index");
module.exports = {
  url: "http://" + url,
  title: "我",
  sidebarLogo: true,
  ws: ws,
  responseProps: {
    code: "code", // 响应状态码
    data: "data", // 响应数据
    message: "message", // 响应文案信息
    successCode: "0000", // 文件上传联调
  },
  TokenKey: "AdminToken",
  responseListProps: {
    results: "pageData", // 响应数组数据
    pageSize: "pageSize", // 页长
    pageNumber: "pageNum", // 页码
    totalCount: "totalSize", // 页面数据总量
    cursorCode: "cursorCode", // 游标标记字段
  },
  // 文件响应数据键值
  responseFileProps: {
    fileId: "fileId", // 文件标识字段
    fileUrl: "fileUrl", // 文件地址
    fileName: "originalFileName", // 文件名
    fileSuffix: "fileExt", // 文件后缀
  },
  homePath: "/knowledgeLibrary",
  uploadPath: url + "/bizfile/uploadFile",
  // type为input类型的之后，新增字符长度限制
  inputLength: 100,
  // 列表无数据时是否展示分页信息，默认为false
  emptyPagingShow: false,
  // 当前页码大于1且records无数据时自动跳上一页
  autoPrevPage: true,
};
