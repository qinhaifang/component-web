//进度条相关
import NProgress from "nprogress";
import "nprogress/nprogress.css";
NProgress.configure({ showSpinner: false });

//工具类相关
import store from "./store";
import router, { createRouter } from "./router";
import { getToken, removeToken } from "@/utils/auth";

//白名单配置，无需登录
const whiteList = ["/login", "/", "/404", "/auth-redirect"];

router.beforeEach(async (to, from, next) => {
  NProgress.start();
  const hasToken = getToken();
  if (hasToken) {
    if (to.path === "/login") {
      NProgress.done();
      removeToken();
      next();
    } else if (whiteList.indexOf(to.path) !== -1) {
      next();
    } else {
      if (!store.getters.roles.length) {
        // 用户角色信息为空
        store
          .dispatch("GetInfo")
          .then((res) => {
            // 拉取user_info
            store.dispatch("GenerateRoutes").then((accessRoutes) => {
              router.addRoutes(accessRoutes); // 动态添加可访问路由表
              next({ ...to, replace: true }); // hack方法 确保addRoutes已完成
            });
          })
          .catch((err) => {
            store.dispatch("FedLogOut").then(() => {
              next({ path: "/" });
            });
          });
      } else {
        next();
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next();
    } else {
      next(`/login?redirect=${to.fullPath}`); // 否则全部重定向到登录页
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  NProgress.done();
});
