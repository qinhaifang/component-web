import request from "@/utils/fetch";
const config = require("@/config");
// 字典
export const getDictData = (data) =>
  request({
    method: "post",
    url: config.version + "/system/dict/getDictData",
    data,
    config: {
      caches: true,
      showLoading: false,
    },
  });
export function sellectUrl(url, data, showLoading, showMessage) {
  return request({
    url: url,
    method: "post",
    data: data,
    config: {
      caches: true,
      showLoading: showLoading,
      showMessage: showMessage,
    },
  });
}
/*
 * @Description:
 * @Author: haifang.qin
 * @Date: 2021-04-02 17:39:23
 */
// 导出
export function exportFile(url, data) {
  // 配置地址
  request({
    url,
    method: "post",
    data: data,
    responseType: "blob", // 也可以使用blob
  })
    .then((res) => {
      const fileStream = res.data;
      const fileName = res.headers["filename"];
      const fileType = fileName.split(".");
      const type = fileType[fileType.length - 1];
      const mimeTypeList = {
        doc: "application/msword",
        docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        xls: "application/vnd.ms-excel",
        xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8",
        ppt: "application/vnd.ms-powerpoint",
        pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        pdf: "application/pdf",
      };
      console.log("res", res);
      console.log("fileStream", fileStream);
      console.log("type", type);
      console.log("mimeTypeList[type]", mimeTypeList[type]);
      console.log("fileName", fileName);

      if (res) {
        let blob = new Blob([fileStream], {
          type: "mimeTypeList[type]",
        });
        let objectUrl = URL.createObjectURL(blob);
        const elink = document.createElement("a");
        elink.download = decodeURI(fileName); // 下载文件名称
        elink.style.display = "none";
        elink.href = objectUrl;
        document.body.appendChild(elink);
        elink.click();
        URL.revokeObjectURL(elink.href); // 释放URL 对象
        document.body.removeChild(elink);
      }
    })
    .catch(function (error) {});
}

// 导出txt
export function exportOperateTxt(url, data) {
  // 配置地址
  request({
    url,
    method: "post",
    data: data,
    responseType: "blob", // 也可以使用blob
  })
    .then((res) => {
      if (res) {
        let blob = new Blob([res.data], {
          type: "text/plain;charset=utf-8",
        }); // res就是接口返回的文件流了
        let objectUrl = URL.createObjectURL(blob);
        const elink = document.createElement("a");
        elink.download = decodeURI(res.headers["filename"]); // 下载文件名称
        elink.style.display = "none";
        elink.href = objectUrl;
        document.body.appendChild(elink);
        elink.click();
        URL.revokeObjectURL(elink.href); // 释放URL 对象
        document.body.removeChild(elink);
      }
    })
    .catch(function (error) {});
}

// 导出压缩包
export function exportOperateZip(url, data) {
  request({
    url,
    method: "post",
    data: data,
    responseType: "blob", // 也可以使用blob
  })
    .then((res) => {
      console.log(res, "res");
      if (res) {
        let blob = new Blob([res.data], {
          type: "application/octet-stream;charset=UTF-8",
        }); // res就是接口返回的文件流了
        let objectUrl = URL.createObjectURL(blob);
        const elink = document.createElement("a");
        elink.download = decodeURI(res.headers["filename"]); // 下载文件名称
        elink.style.display = "none";
        elink.href = objectUrl;
        document.body.appendChild(elink);
        elink.click();
        URL.revokeObjectURL(elink.href); // 释放URL 对象
        document.body.removeChild(elink);
      }
    })
    .catch(function (error) {});
}

// 导入
export function importFile(url, data) {
  return new Promise((resolve) => {
    request({
      url: url,
      method: "post",
      contentType: "multipart/form-data",
      data: data,
    })
      .then((res) => {
        resolve(res);
      })
      .catch(() => {});
  });
}
// 导出模板
export function exportTemplateFile(url, data) {
  return new Promise((resolve) => {
    request({
      url: url,
      method: "post",
      responseType: "blob",
      data: data,
    })
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {});
  });
}
