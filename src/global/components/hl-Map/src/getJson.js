import axios from "axios";
export const getJson = function (method) {
  return new Promise((resolve, reject) => {
    axios({
      method: "get",
      url: method,
      headers: { "Content-type": "multipart/form-data" }
    })
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
