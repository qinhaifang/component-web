import { constantRoutes } from "@/router";
import { getUserRoutes } from "@/api/menu";
import Layout from "@/global/layout/index";

const permission = {
  state: {
    routes: [],
    addRoutes: [],
  },
  mutations: {
    SET_ROUTES: (state, routes) => {
      state.addRoutes = routes;
      state.routes = routes.concat(constantRoutes);
    },
    SET_SIDEBAR_ROUTERS: (state, routes) => {
      state.sidebarRouters = routes;
    },
    SET_ALLROUTES: (state, routes) => {
      state.allRoutes = routes;
    },
  },
  actions: {
    // 生成路由
    GenerateRoutes({ commit }) {
      return new Promise((resolve) => {
        // 向后端请求路由数据
        getUserRoutes().then((res) => {
          if (res.routeTaggingVOList) {
            // 获取管理端的菜单（菜单名称中含"Management"）
            const rdata = res.routeTaggingVOList.filter((item) => {
              return item.name.indexOf("Management") > -1;
            });
            commit("SET_ALLROUTES", filterAllRouter(rdata));
            const rewriteRoutes = filterAsyncRouter(rdata, false, true);
            rewriteRoutes.push({ path: "*", redirect: "/404", hidden: true });
            commit("SET_ROUTES", rewriteRoutes);
            resolve(rewriteRoutes);
          }
        });
      });
    },
  },
};

// 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(asyncRouterMap) {
  return asyncRouterMap.filter((route) => {
    if (route.component) {
      // Layout组件特殊处理
      if (route.component === "Layout") {
        route.component = Layout;
      } else {
        route.component = loadView(route.component);
      }
    }
    if (route.children != null && route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children);
    }
    return true;
  });
}
function filterAllRouter(asyncRouterMap) {
  let arr = [];
  asyncRouterMap.map((route) => {
    if (route.component === "Layout" && route.children.length == 1) {
      arr.push({
        ...route.children[0],
        orderNum: 1,
      });
    } else {
      if (route.children != null && route.children && route.children.length) {
        arr.push(...filterAllRouter(route.children));
      } else {
        arr.push(route);
      }
    }
  });
  return arr;
}

export const loadView = (view) => {
  // 路由懒加载
  return (resolve) => require([`@/views/${view}`], resolve);
};

export default permission;
