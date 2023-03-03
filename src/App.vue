<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>
<style lang="scss">
body {
  height: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB,
    Microsoft YaHei, Arial, sans-serif;
}
#app,
html {
  height: 100%;
}
.gifLoading {
  background: url("./assets/imgs/load.gif") no-repeat center;
  background-size: 100px;
}
.el-loading-mask.is-fullscreen .el-loading-spinner .circular {
  display: none;
}
.el-loading-spinner .el-loading-text {
  color: rgba(255, 255, 255, 0.8) !important;
  font-size: 12px !important;
}
.el-loading-mask.is-fullscreen .el-loading-spinner {
  margin-top: 10px !important;
}
.zdy-sub-menu {
  background: #1f5ab4;
}
</style>
