const getters = {
  sidebar: (state) => state.app.sidebar,
  size: (state) => state.app.size,
  device: (state) => state.app.device,
  visitedViews: (state) => state.tagsView.visitedViews,
  cachedViews: (state) => state.tagsView.cachedViews,
  token: (state) => state.user.token,
  userId: (state) => state.user.userId,
  avatar: (state) => state.user.avatar,
  name: (state) => state.user.name,
  btnPermissions: (state) => state.user.btnPermissions,
  introduction: (state) => state.user.introduction,
  roles: (state) => state.user.roles,
  permission_routes: (state) => state.permission.routes,
  allRoutes: (state) => state.permission.allRoutes,
  firstTimeLogin: (state) => state.user.firstTimeLogin,
};
export default getters;
