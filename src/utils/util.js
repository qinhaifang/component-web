import Axios from "axios";
import fecha from "element-ui/src/utils/date";
import { message } from "./notice";
import Vue from "vue";
import { getToken, setToken, removeToken } from "./auth";
/**
 * brick提示集合
 * @namespace
 */
export const brickTip = {
  lackCaRead: "brick:缺少hxFileCert,请入引入@heisea/ca/lib/read依赖",
};
/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path);
}
//判断是否是空对象
export const isNullObject = (data) => {
  const result = JSON.stringify(data) == "{}";
  return result;
};
/**
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 * @param {Object} source
 * @returns {Object}
 */
export function deepClone(source) {
  if (!source && typeof source !== "object") {
    throw new Error("error arguments", "deepClone");
  }
  const targetObj = source.constructor === Array ? [] : {};
  Object.keys(source).forEach((keys) => {
    if (source[keys] && typeof source[keys] === "object") {
      targetObj[keys] = deepClone(source[keys]);
    } else {
      targetObj[keys] = source[keys];
    }
  });
  return targetObj;
}
/*
 * @description 获取地址栏参数
 */
export const getUrlParame = (paramName) => {
  const urlParams = {};
  const url = window.location.href;
  const idx = url.indexOf("?");
  if (idx === -1) {
    return false;
  }
  let params = url.substring(url.indexOf("?") + 1);
  params = params.split("#");
  params = params[0].split("&");
  params.forEach((item) => {
    const param = item.split("=");
    urlParams[param[0]] = decodeURIComponent(param[1]);
  });
  if (paramName) {
    return urlParams[paramName];
  }
  return urlParams;
};
export const getRandom = function (n) {
  var jschars = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ];
  var res = "";
  for (var i = 0; i < n; i++) {
    var id = Math.ceil(Math.random() * 35);
    res += jschars[id];
  }
  return res;
};
/**
 * 转化成连接参数
 *
 */
export const toUrlParam = (param) => {
  let base = param;
  if (typeof param === "object") {
    base = "";
    Object.keys(param).forEach((key) => {
      const item = param[key];
      if (Array.isArray(item)) {
        item.forEach((val) => {
          base += `&${key}[]=${val}`;
        });
      } else {
        base += `&${key}=${item}`;
      }
    });
    if (base) base = base.replace(/^&/, "");
  }

  return base;
};
/*
 * @description 获取地址栏hash参数
 */
export const getUrlHash = (paramName) => {
  const urlParams = {};
  const url = window.location.href;
  const idx = url.indexOf("#");
  if (idx === -1) {
    return false;
  }
  let params = url.substring(url.indexOf("#") + 1);
  params = params.split("&");
  params.forEach((item) => {
    const param = item.split("=");
    urlParams[param[0]] = decodeURIComponent(param[1]);
  });
  if (paramName) {
    return urlParams[paramName];
  }
  return urlParams;
};

/**
 * 为extend属性，提供一个默认参数
 * @param {Object} extend  extend的参数
 * @param {object} defaults 设置默认参数
 */
export const getMergedObject = (extend, defaults) => {
  let current = defaults;
  if (extend && defaults) {
    // extend 的数据比较复制，默认保留
    if (extend.extend && current.extend) {
      Object.assign(extend.extend, current.extend);
    }
    Object.assign(current, extend);
  } else if (!defaults) {
    current = extend;
  }
  return current;
};
/**
 * 带单位的参数转化成数字或0
 * @param {String} str
 */
export const toUnitNumber = (str) => {
  const reg = /[px|rem|em|pt]/g;
  if (!str) return 0;
  const n = str.replace(reg, "") || 0;
  return Number(n);
};
/*
 * @description 密码正则
 */
export const passwordReg = () => /^[a-zA-Z]{1}[a-zA-Z0-9@#$%&*?]{7,}$/gi;

/*
 * @description 手机正则
 */
export const mobileReg = () => /^1[0-9]{10}$/g;

/*
 * @description 英文下划线字段转驼峰
 */
export const fieldSwitchReg = (variable) =>
  variable.replace(/_+[a-zA-Z]/g, (str, index) =>
    index ? str.substr(-1).toUpperCase() : str
  );

// 判断对象是否为空
export const isEmptyObj = (obj) => !obj || Object.keys(obj).length === 0;

// 判断浏览器类型是否为IE
export const isIE = () => {
  const u = window.userAgent || navigator.userAgent;
  return u.indexOf("MSIE") > 0 || u.indexOf("Trident") > 0;
};

/**
 * 判断目标对象是否含有指定字段名
 * @param {Object} obj 目标对象
 * @param {String} field 字段名
 */
export const hasField = (obj, field) => {
  if (!obj || isEmptyObj(obj)) return false;
  const keyList = Object.keys(obj).map((key) => key);
  return keyList.includes(field);
};

/**
 * 下载文件iframe
 */
export const downloadFile = (url) => {
  const iframeEle = document.createElement("iframe");
  iframeEle.src = url;
  iframeEle.style.display = "none";
  document.body.appendChild(iframeEle);
};

/**
 * base64文件下载
 * @export
 * @param {*} content base64文件流
 * @param {*} fileName 文件名称
 */
export const base64Download = (content, fileName) => {
  const base64ToBlob = (code) => {
    const parts = code.split(";base64,");
    const contentType = parts[0].split(":")[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);
    for (let i = 0; i < rawLength; i += 1) {
      uInt8Array[i] = raw.charCodeAt(i);
    }
    return new Blob([uInt8Array], {
      type: contentType,
    });
  };
  const aLink = document.createElement("a");
  // new Blob([content]);
  const blob = base64ToBlob(content);
  const evt = document.createEvent("HTMLEvents");
  // initEvent 不加后两个参数在FF下会报错  事件类型，是否冒泡，是否阻止浏览器的默认行为;
  evt.initEvent("click", true, true);
  aLink.download = fileName;
  aLink.href = URL.createObjectURL(blob);
  aLink.click();
};

/**
 * 下载文件blob
 * @param {*} url 请求url
 * @param {string} fileName 文件名称
 */
export const DownLoader = (url, fileName) => {
  const vm = new Vue();
  if (!url) {
    vm.$message.error("文件地址不能为空");
    return;
  }
  // 当url返回为base64文件流时走base64Download方法下载
  if (url.indexOf("base64") !== -1) {
    base64Download(url, fileName);
  } else {
    Axios({
      method: "get",
      url,
      responseType: "blob",
    })
      .then((res) => {
        const { data } = res;
        if (data.type !== "application/json") {
          const blob = new Blob([data]);
          if ("download" in document.createElement("a")) {
            // 非IE下载
            const elink = document.createElement("a");
            elink.download = fileName;
            elink.style.display = "none";
            elink.href = URL.createObjectURL(blob);
            document.body.appendChild(elink);
            elink.click();
            URL.revokeObjectURL(elink.href); // 释放URL 对象
            document.body.removeChild(elink);
          } else if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            // IE、edge
            window.navigator.msSaveOrOpenBlob(blob, fileName);
          }
        } else {
          // 文件流请求失败时通过FileReader来获取异常result
          const reader = new FileReader();
          reader.readAsText(data, "utf-8");
          reader.onload = (e) => {
            const msg = JSON.parse(e.target.result);
            if (Object.prototype.hasOwnProperty.call(msg, "code")) {
              vm.$message.error(msg.detail);
            }
          };
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

/**
 * 下载文件
 * @export
 * @param {*} type 设置接收数据类型 参数 1 或 2
 * @param {*} data type为 1 时 data 为文件地址； type为 2 时 data 为canvas对象
 * @param {*} name 当文件为图片类型时需设置文件名
 * @param {*} extData  文件名后缀
 */
export const download = (type, data, name, extData) => {
  /**
   * 将 base64 转换位 blob 对象
   * blob 存储 2进制对象的容器
   * @export
   * @param {*} base64
   * @returns
   */
  function convertBase64UrlToBlob(base64) {
    const parts = base64.dataURL.split(";base64,");
    const contentType = parts[0].split(":")[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);
    for (let i = 0; i < rawLength; i += 1) {
      uInt8Array[i] = raw.charCodeAt(i);
    }
    return new Blob([uInt8Array], { type: contentType });
  }
  /**
   * 将图片地址转换为 base64 格式
   * @param {*} url
   */
  function convertUrlToBase64(url) {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = url;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, img.width, img.height);
        const ext = img.src
          .substring(img.src.lastIndexOf(".") + 1)
          .toLowerCase();
        const dataURL = canvas.toDataURL(`image/${ext}`);
        const base64 = {
          dataURL,
          type: `image/${ext}`,
          ext,
        };
        resolve(base64);
      };
    });
  }
  // 判断浏览器类型
  function myBrowser() {
    const { userAgent } = navigator; // 取得浏览器的userAgent字符串
    if (userAgent.indexOf("OPR") > -1) {
      return "Opera";
    }
    if (userAgent.indexOf("Firefox") > -1) {
      return "FF";
    }
    if (userAgent.indexOf("Trident") > -1) {
      return "IE";
    }
    if (userAgent.indexOf("Edge") > -1) {
      return "Edge";
    }
    if (userAgent.indexOf("Chrome") > -1) {
      return "Chrome";
    }
    if (userAgent.indexOf("Safari") > -1) {
      return "Safari";
    }
    return "";
  }

  if (type === 1) {
    const vm = new Vue();
    if (vm.$bkConfig && !vm.$bkConfig.downloadFlag) {
      // 原逻辑
      const url = data;
      // 通过地址判断是否为图片类型文件
      const ext = extData || url.slice(url.lastIndexOf(".") + 1).toLowerCase();
      if (/^.{0,1}(jpeg|jpg|png|gif)$/i.test(ext)) {
        if (myBrowser() !== "IE") {
          const oA = document.createElement("a");
          oA.href = data;
          oA.download = name;
          oA.click();
        } else {
          convertUrlToBase64(url).then((base64) => {
            const blob = convertBase64UrlToBlob(base64);
            // 下载
            window.navigator.msSaveBlob(blob, `${name}`);
          });
        }
      } else {
        const a = document.createElement("a");
        a.download = name;
        a.href = url;
        a.click();
      }
    } else {
      DownLoader(data, name);
    }
  } else {
    // canvas obj
    const dataURL = data.toDataURL("image/jpeg", 1.0);
    const base64 = {
      dataURL,
      type: "image/jpg",
      ext: "jpg",
    };
    const blob = convertBase64UrlToBlob(base64);
    // 下载
    if (myBrowser() === "IE") {
      window.navigator.msSaveBlob(blob, `${name}`);
    } else {
      const a = document.createElement("a");
      a.download = name;
      a.href = URL.createObjectURL(blob);
      a.click();
    }
  }
};

/**
 * 判断是否为日期
 * @param {*} date 要判断是否为日期的值
 */
export const isDate = (date) => {
  if (date === null || date === undefined) return false;
  if (Number.isNaN(new Date(date).getTime())) return false;
  if (Array.isArray(date)) return false; // deal with `new Date([ new Date() ]) -> new Date()`
  return true;
};

/**
 * 日期格式化
 * (new Date(), 'yyyy-mm-dd hh:ii:ss.S')==> 2006-07-02 08:09:04.423
 * (new Date(), 'yyyy-mm-dd E HH:ii:ss') ==> 2009-03-10 二 20:09:04
 * (new Date(), 'yyyy-mm-dd EE hh:ii:ss') ==> 2009-03-10 周二 08:09:04
 * (new Date(), 'yyyy-mm-dd EEE hh:ii:ss') ==> 2009-03-10 星期二 08:09:04
 * (new Date(), 'yyyy-m-d h:m:s.S') ==> 2006-7-2 8:9:4.18
 * (new Date(), 'yyyy/mm/dd hh:ii:ss.S') ==> 2017/04/17 10:00:48.282
 */
export const formatDate = (value, fmt) => {
  if (!value) {
    return null;
  }
  // 兼容IE
  if (isIE() && String(value).match("-")) {
    value = value.replace(/(-)/g, "/");
  }
  /* eslint-disable no-param-reassign */
  const date = new Date(value);
  /* eslint no-console: 'off' */
  if (date.toString() === "Invalid Date") {
    console.log("日期不合法");
  }
  const o = {
    "M+": date.getMonth() + 1, // 月份,
    "m+": date.getMonth() + 1, // 月份
    "d+": date.getDate(), // 日
    "h+": date.getHours() % 24 === 0 ? 0 : date.getHours() % 24, // 小时
    "H+": date.getHours(), // 小时
    "i+": date.getMinutes(), // 分
    "s+": date.getSeconds(), // 秒
    "q+": Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds(), // 毫秒
  };
  const week = {
    0: "/u65e5",
    1: "/u4e00",
    2: "/u4e8c",
    3: "/u4e09",
    4: "/u56db",
    5: "/u4e94",
    6: "/u516d",
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      `${date.getFullYear()}`.substr(4 - RegExp.$1.length)
    );
  }
  if (/(E+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (match, p1) => {
      if (p1.length > 1) {
        return (
          (p1.length > 2 ? "/u661f/u671f" : "/u5468") + week[`${date.getDay()}`]
        );
      }
      return week[`${date.getDay()}`];
    });
  }
  const keys = Object.keys(o);
  for (let k = 0, len = keys.length; k < len; k += 1) {
    const prop = keys[k];
    if (new RegExp(`(${prop})`).test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1
          ? o[prop]
          : `00${o[prop]}`.substr(`${o[prop]}`.length)
      );
    }
  }
  /* eslint-disable consistent-return */
  return fmt;
};

/**
 * elementUI日期格式化
 * (new Date(), 'yyyy-M-d H:m:s')==> 2006-7-2 8:9:4
 * (new Date(), 'yyyy-MM-dd HH:mm:ss') ==> 2009-07-02 08:09:04
 * (new Date(), 'h:mm:ss a') ==> 2009-03-10 8:09:04 pm
 * (new Date(), 'hh:mm:ss A') ==> 2009-03-10 08:09:04 PM
 * (new Date(), 'HH:mm:ss') ==> 20:09:04
 * (new Date(), 'timestamp') ==> 1236686944000
 */
export const formatDateEL = (value, fmt) => {
  if (!value) {
    return null;
  }
  // 兼容IE
  if (isIE() && String(value).match("-")) {
    value = value.replace(/(-)/g, "/");
  }
  /* eslint-disable no-param-reassign */
  const date = new Date(value);
  /* eslint no-console: 'off' */
  if (date.toString() === "Invalid Date") {
    console.log("日期不合法");
  }
  return fecha.format(date, fmt || "yyyy-MM-dd");
};

/*
 * 判断数组是否含有目标值  eg: [[A,B],C]含有[A,B]   A和B可为任意类型
 * attention: 只从一维的角度去判断，引用类型的前后顺序要一致
 * @param {Array} 目标数组
 * @param {String || Array || Object} 目标值
 */
export const judgeArrayIncludeTargetValue = (arr, target) => {
  if (!Array.isArray(arr) || !target) return;
  const strArr = arr.map((item) => JSON.stringify(item));
  return strArr.includes(JSON.stringify(target));
};

/*
 * 根据name判断对应的元组件type类型
 * @param {String} name 判断的依据name
 * @param {Object} config 整个页面的formConfig表单组配置
 */
export const nameMatchType = (name, config) => {
  let obj = {};
  config.data.forEach((dataConfig) => {
    const target = dataConfig.data.find((item) => item.name === name);
    if (target) obj = target;
  });
  return obj.type;
};

/**
 * 判断依赖的单一字段值是否在期望值中, 若不在则改变标记对象的值
 * @param {Object} obj 参数集合对象
 * @param {String || Array} obj.value 期望值
 * @param {String} obj.name 依赖的字段名
 * @param {Boolean} obj.formParamisArray 依赖的字段名对应的字段值是否为数组类型
 * @param {Object} obj.formParams 表单值对象
 * @param {Object} obj.obj 标记对象
 */
export const singleKeysValueExpected = ({
  value,
  name,
  formParamisArray,
  formParams,
  obj,
}) => {
  if (formParamisArray) {
    // 判断期望值是一维数组还是二维数组
    if (Array.isArray(value[0])) {
      if (!judgeArrayIncludeTargetValue(value, formParams[name])) {
        obj.flag = false;
      }
    } else if (JSON.stringify(value) !== JSON.stringify(formParams[name])) {
      obj.flag = false;
    }
  } else if (!value.includes(formParams[name])) {
    obj.flag = false;
  }
};

/**
 * 判断依赖的所有字段值是否符合期望
 * @param {Object} obj 参数集合对象
 * @param {String || Array} obj.value 期望值
 * @param {String} obj.name 依赖的所有字段名
 * @param {Boolean} obj.formParamisArray 依赖的字段名对应的字段值是否为数组类型
 * @param {Object} obj.formParams 表单值对象
 */
export const allKeysValueExpected = ({
  value,
  name,
  formParamisArray,
  formParams,
}) => {
  // 默认符合期望
  const obj = { flag: true };
  if (Array.isArray(name)) {
    name.forEach((key, i) => {
      if (Array.isArray(value[i])) {
        singleKeysValueExpected({
          value: value[i],
          name: key,
          formParamisArray: formParamisArray(key),
          formParams,
          obj,
        });
      } else if (formParams[key] !== value[i]) {
        obj.flag = false;
      }
    });
  } else if (Array.isArray(value)) {
    singleKeysValueExpected({
      value,
      name,
      formParamisArray: formParamisArray(name),
      formParams,
      obj,
    });
  } else {
    obj.flag = formParams[name] === value;
  }
  return obj.flag;
};
/**
 * 对象深度拷贝
 * @param {Object} obj 拷贝对象
 */
export const deepCopy = (obj) =>
  (function deepcopy(oldObj) {
    // 定义一个新的空对象
    let newObject = {};
    // 判断原对象是否存在
    if (oldObj) {
      // 判断原对象的类型
      if (oldObj.constructor === Object) {
        newObject = new oldObj.constructor();
      } else {
        newObject = new oldObj.constructor(oldObj.valueOf());
      }
      // 遍历克隆原对象的属性
      Object.keys(oldObj).forEach((key) => {
        if (newObject[key] !== oldObj[key]) {
          if (typeof oldObj[key] === "object") {
            // 对象内部的子对象
            newObject[key] = deepcopy(oldObj[key]);
          } else {
            newObject[key] = oldObj[key];
          }
        }
      });
      // 克隆原对象的常用方法
      newObject.toString = oldObj.toString;
      newObject.valueOf = oldObj.valueOf;
      return newObject;
    }
  })(obj);

/**
 * 判断字符串是否是标签格式
 * @param {String} str 要判断的字符串
 */
export const stringIsHTML = (str) => {
  if (!str || typeof str !== "string") return;
  const reg = /<("[^"]*"|'[^']*'|[^'">])*>/;
  return reg.test(str);
};

/**
 * 防抖函数
 * @param {Function} fn 处理函数
 * @param {Number} delay 延时时间
 */
export const debounce = (fn, delay) => {
  let timer = null;
  return (...args) => {
    const self = this;
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(self, args);
    }, delay);
  };
};

/**
 * 将url转换为对象形式
 * @param {String} url 链接地址
 */
export const urlObject = (url) => {
  const urlArr = url && url.split("/");
  const urlLen = urlArr.length - 1;
  const urlObj = {
    host: urlArr[2],
    hostname: urlArr[2].split(":")[0],
    origin: `${urlArr[0]}//${urlArr[2]}`,
    pathname: "",
    port: urlArr[2].split(":")[1],
    protocol: urlArr[0].split(":")[0],
    search: `?${urlArr[urlLen].split("?")[1]}`,
  };

  urlArr.forEach((item, index) => {
    if (index > 2 && index < urlLen) {
      urlObj.pathname += `/${item}`;
    } else if (index === urlLen) {
      urlObj.pathname += `/${item.split("?")[0]}`;
    }
  });
  return urlObj;
};

/**
 * 获取目标元素的样式
 */
export const targetStyle = (target) => {
  if (!window.getComputedStyle) {
    return target.currentStyle;
  }
  return getComputedStyle(target);
};

/**
 * 通过url获取文件后缀
 */
export const getUrlSuffix = (url) => {
  let type = "";
  if (url.indexOf(".") > -1) {
    type = url.split(".");
    type = type[type.length - 1];
  }
  return type.toLowerCase();
};
/**
 * 截取指定字符后的内容
 * @param path 截取内容
 * @param str 字符
 */
export const getCaption = (path, str) => {
  const index = path.lastIndexOf(str);
  return path.substring(index + 1, path.length);
};

/**
 * 上传附件校验
 * @param {Array} typeArr 接收上传文件的类型
 * @param {Object} file 文件数据
 * @param {String} msg 错误文案提示
 */
export const limitsFile = (file, typeArr, msg) => {
  const { name } = file;
  const fileType = getCaption(name, ".");
  if (typeArr.includes(fileType)) {
    return true;
  }
  message(msg, "error");
  return false;
};
/**
 * 根据不同环境，处理请求头
 */
export const headerConfig = (config) => {
  let headerObj;
  headerObj = {
    Authorization: getToken() || "",
    ...config,
  };
  return headerObj;
};
/**
 * 构造树型结构数据
 * @param {*} data 数据源
 * @param {*} id id字段 默认 'id'
 * @param {*} parentId 父节点字段 默认 'parentId'
 * @param {*} children 孩子节点字段 默认 'children'
 * @param {*} rootId 根Id 默认 0
 */
export function handleTree(data, id, parentId, children, rootId) {
  id = id || "id";
  parentId = parentId || "parentId";
  children = children || "children";
  rootId =
    rootId ||
    Math.min.apply(
      Math,
      data.map((item) => {
        return item[parentId];
      })
    ) ||
    0;
  //对源数据深度克隆
  const cloneData = JSON.parse(JSON.stringify(data));
  //循环所有项
  const treeData = cloneData.filter((father) => {
    let branchArr = cloneData.filter((child) => {
      //返回每一项的子级数组
      return father[id] === child[parentId];
    });
    branchArr.length > 0 ? (father.children = branchArr) : "";
    //返回第一层
    return father[parentId] === rootId;
  });
  return treeData != "" ? treeData : data;
}
/**
 * @param {*} str 需要裁减的字符串
 * @param {*} num 需要裁减的长度
 * @param {*} separator 追加字符串
 */
export function subStrByNum(str, num, separator) {
  if (!str) return "";
  str = str.toString();
  if (!num) return str;
  return str.length >= num ? str.substr(0, num) + separator : str;
}
