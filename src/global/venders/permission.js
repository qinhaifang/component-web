import jwtDecode from "jwt-decode";
import { getToken } from "@/global/utils/auth";

let permissions = [];
let uid = "";
let userName = "";
const setPermistions = () => {
  const token = getToken();
  if (token) {
    permissions = JSON.parse(jwtDecode(token).sub).routeTaggingList;
    uid = jwtDecode(token).uid;
    userName = jwtDecode(token).iss;
  }
};
setPermistions();
const getPermistions = () => permissions;

export { permissions, getPermistions, setPermistions, uid, userName };
