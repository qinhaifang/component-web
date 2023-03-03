import Layout from "@/global/layout";

// 公共路由

export default [
  {
    path: "/redirect",
    component: Layout,
    hidden: true,
    children: [
      {
        path: "/redirect/:path(.*)",
        component: (resolve) => require(["@/global/views/redirect"], resolve),
      },
    ],
  },
  { path: "/", redirect: { name: "login" } },
  {
    path: "/login",
    name: "login",
    component: (resolve) => require(["@/global/views/login"], resolve),
    hidden: true,
  },
  {
    path: "/404",
    component: (resolve) => require(["@/global/views/404"], resolve),
    hidden: true,
  },
  // {
  //   path: "/systemManagement",
  //   name: "systemManagement",
  //   component: Layout,
  //   meta: {
  //     title: "系统管理",
  //     icon: "",
  //   },
  //   children: [
  //     {
  //       path: "/UserManage",
  //       name: "UserManage",
  //       meta: {
  //         title: "用户管理",
  //         icon: "",
  //       },
  //       component: (resolve) =>
  //         require(["@/global/views/systemManagement/UserManage"], resolve),
  //     },
  //     {
  //       path: "/menuData",
  //       name: "menuData",
  //       meta: {
  //         title: "菜单管理",
  //         icon: "",
  //       },
  //       component: (resolve) =>
  //         require(["@/global/views/systemManagement/UserManage"], resolve),
  //     },
  //     // {
  //     //   path: "/RoleManage",
  //     //   name:'RoleManage',
  //     //   meta:{
  //     //     title:'角色管理',
  //     //     icon:''
  //     //   },
  //     //   component: (resolve) => require(["@/global/views/systemManagement/RoleManage"], resolve),
  //     // },
  //     // {
  //     //   path: "/menuData",
  //     //   name:'menuData',
  //     //   meta:{
  //     //     title:'菜单管理',
  //     //     icon:''
  //     //   },
  //     //   component: (resolve) => require(["@/global/views/systemManagement/menuData"], resolve),
  //     // }
  //   ],
  // },
];
