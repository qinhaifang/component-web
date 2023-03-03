// ip校验
export function ipValidateRule(str) {
  // const reg = /([1-9]|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])(\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])){3}/;
  const reg =
    /^(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|[1-9])\.(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)\.(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)\.(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)$/;
  return reg.test(str);
}
// 校验特殊字符
export function inputValidSpecial(str) {
  const reg =
    /[`~!@#$^&*+=|{}':;',\\[\]<>/?~！@#￥¥%……&*+|{}【】‘；：”“’。，、？\s]/;
  return reg.test(str);
}
// 校验数字
export function validateNumber(str) {
  // const reg = /^-?\d+\.?\d{0,10}$/
  const reg = /[^\d.]/g;
  // const reg = /^[1-9]\d*$/;

  return reg.test(str);
}
// 只能输入正整数
export function validateInteger(str) {
  const reg = /^[1-9]\d*$/;

  return reg.test(str);
}
// 校验oid值  数字加点
export function inputValidOidValue(str) {
  const reg = /^(1.3.6.1.[2,4].1)(\.\d+)*$/;
  return reg.test(str);
}
// 只读团体字和读写团体字    不允许输入空格和中文
export function validateChinese(str) {
  var reg = /[\u4E00-\u9FA5 ]/;
  return reg.test(str);
}
// 校验ip范围
export function inputIpRangeValid(str) {
  var reg =
    /^([0-9]|[0-9]\d|1\d{2}|2[0-4]\d|25[0-5])$|^(([0-9]|[0-9]\d|1\d{2}|2[0-4]\d|25[0-5])-([1-9]|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5]))$/;
  return reg.test(str);
}
// 校验登录密码
export function validatePassword(str) {
  var reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,30}$/;
  return reg.test(str);
}
// 数字和字母
export function validateAccount(str) {
  var reg = /^[A-Za-z0-9]+$/;
  return reg.test(str);
}
// 不可以输入空格
export function validateSpace(str) {
  var reg = /^[^\s]*$/;
  return reg.test(str);
}
// 不允许输入中文
export function validateOnlyChinese(str) {
  var reg = /^[\u4E00-\u9FA5\uF900-\uFA2D\u0020]*$/;
  return reg.test(str);
}
