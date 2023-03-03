import { login, logout, getUserInfo } from "@/api/login";
import { getDictData } from "@/api/common";
import { setDictData } from "@/dict";
import { getToken, setToken, removeToken } from "@/utils/auth";
import { constantRoutes } from "@/router";
import { getRouters } from "@/api/menu";
import Layout from "@/global/layout/index";

const user = {
  state: {
    token: getToken(),
    name: "",
    avatar: "",
    userId: "",
    roles: [],
    btnPermissions: [],
    firstTimeLogin: true,
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_NAME: (state, name) => {
      state.name = name;
    },
    SET_BTN_Permissions: (state, btnPermissions) => {
      state.btnPermissions = btnPermissions;
    },
    SET_USERID: (state, userId) => {
      state.userId = userId;
    },
    SET_FIRSTLOGIN: (state, firstTimeLogin) => {
      state.firstTimeLogin = firstTimeLogin == 0 ? false : true;
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles;
    },
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo)
          .then((res) => {
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    // 获取用户信息
    GetInfo({ dispatch, commit, state }) {
      return new Promise((resolve, reject) => {
        getUserInfo(state.token)
          .then(async (res) => {
            const user = res.userInfo;
            commit("SET_FIRSTLOGIN", res.firstTimeLogin);
            commit("SET_NAME", user.userName);
            commit("SET_USERID", user.id);
            commit('SET_BTN_Permissions', res.permissions)
            if (res.roles && res.roles.length) {
              commit("SET_ROLES", res.roles.map((item) => item.roleName));
            } else {
              commit("SET_ROLES", ["ROLE_DEFAULT"]);
            }
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    // 退出系统
    LogoutAction({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token)
          .then(() => {
            commit("SET_TOKEN", "");
            commit("SET_ROLES", []);
            removeToken();
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise((resolve) => {
        commit("SET_TOKEN", "");
        removeToken();
        resolve();
      });
    },
  },
};
export default user;
