const qureys = {
  username: "",
  j_host: "",
  j_username: "",
  j_passwd: "",
  loginDevType: "",
  loginDevName: "",
  r_type: "",
  r_host: "",
  r_username: "",
  r_passwd: "",
  s_type: "",
  s_host: "",
  s_username: "",
  s_passwd: "",
  s_logincmd: "",
  s_loginParamStr: "",
  log_server: atob("123"),
  webconsole_server: atob("123"),
};
function o2s(object) {
  let str = "";
  for (let key in object) {
    str += `${key}:${object[key]},`;
    console.log(key, object[key]);
  }
  str = str.substring(0, str.length - 1);
  return str;
}

export const str = o2s(qureys);
