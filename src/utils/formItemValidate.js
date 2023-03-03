import {
  inputValidSpecial,
  validateAccount,
  validateInteger,
  validateChinese,
  validateOnlyChinese,
  ipValidateRule
} from "./validate";

// 用户名称;
export const inputValidStation = (rule, value, callback) => {
  const reg = /[-()（）——]/;
  if ((value && inputValidSpecial(value)) || reg.test(value)) {
    callback(new Error("请输入正确的名称"));
  } else {
    callback();
  }
};
//字母数字组合校验
export const inputValidateAccount = (rule, value, callback) => {
  if (!validateAccount(value)) {
    callback(new Error("账号为字母数字组合"));
  } else {
    callback();
  }
};
// 正整数校验机柜组
export const inputValidGroupNum = (rule, value, callback) => {
  if (value && !validateInteger(value)) {
    callback(new Error("请输入正整数"));
  } else {
    callback();
  }
};
// 校验机柜型号
export const inputValidModel = (rule, value, callback) => {
  if (value && validateChinese(value)) {
    callback(new Error("请输入正确的机柜型号"));
  } else {
    callback();
  }
};
// 通讯端口
export const checkCollectPort = (rule, value, callback) => {
  if (!Number.isInteger(parseFloat(value))) {
    callback(new Error("请输入正确的端口号"));
  } else {
    if (/^[0-9]\d*$/.test(value) === false) {
      callback(new Error("请输入正确的端口号"));
    } else {
      if (value > 65535) {
        callback(new Error("请输入正确的端口号"));
      } else if (value < 1) {
        callback(new Error("请输入正确的端口号"));
      } else {
        callback();
      }
    }
  }
};
// 超时时间
export const checkTimeout = (rule, value, callback) => {
  if (!Number.isInteger(value)) {
    callback(new Error("请输入正确的超时时间"));
  } else {
    if (/^[1-9]\d*$/.test(value) === false) {
      callback(new Error("请输入正确的超时时间"));
    } else {
      if (value > 30) {
        callback(new Error("请输入正确的超时时间"));
      } else {
        callback();
      }
    }
  }
};
// 重试次数
export const checkRetryCount = (rule, value, callback) => {
  if (!Number.isInteger(value)) {
    callback(new Error("请输入正确的重试次数"));
  } else {
    if (/^[1-9]\d*$/.test(value) === false) {
      callback(new Error("请输入正确的重试次数"));
    } else {
      if (value > 3) {
        callback(new Error("请输入正确的重试次数"));
      } else {
        callback();
      }
    }
  }
};
// 只读团体字
export const checkReadonlyText = (rule, value, callback) => {
  console.log(validateChinese(value), 111111);
  if (value && validateChinese(value)) {
    callback(new Error("请输入正确的只读团体字"));
  } else {
    callback();
  }
};
// 读写团体字
export const checkWriteText = (rule, value, callback) => {
  if (validateChinese(value)) {
    callback(new Error("请输入正确的读写团体字"));
  } else {
    callback();
  }
};
// 验证密码
export const validatePass = (rule, value, callback) => {
  var reg =
    /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_!@#$%^&*`~()-+=]+$)(?![a-z0-9]+$)(?![a-z\W_!@#$%^&*`~()-+=]+$)(?![0-9\W_!@#$%^&*`~()-+=]+$)[a-zA-Z0-9\W_!@#$%^&*`~()-+=]{8,15}$/;
  if (value === "") {
    callback(new Error("请输入密码"));
  } else if (!reg.test(value) && validateChinese(value)) {
    callback(new Error("请输入正确格式的密码"));
  } else {
    callback();
  }
};
// 验证用户名
export const inputDescription = (rule, value, callback) => {
  if (value && inputValidSpecial(value)) {
    callback(new Error("请输入正确的用户名"));
  } else {
    callback();
  }
};
// // 校验设备型号
export const inputValidModelName = (rule, value, callback) => {
  if (value && validateOnlyChinese(value)) {
    callback(new Error("请输入正确的设备型号"));
  } else {
    callback();
  }
};
// 采集频率值
export const frequencyValidStation = (rule, value, callback) => {
  if (value && !validateInteger(value)) {
    callback(new Error("请输入正确的采集频率值"));
  } else if (parseFloat(value) < 2) {
    callback(new Error("采集频率最快支持2分钟"));
  } else {
    callback();
  }
};
// ip校验
export const ipValidate = (rule, value, callback) => {
  if (value && !ipValidateRule(value)) {
    callback(new Error("请输入正确的IP地址"));
  } else {
    callback();
  }
};
