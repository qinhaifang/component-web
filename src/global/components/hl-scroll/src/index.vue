<template>
  <el-scrollbar ref="myScrollbar" class="h-100 zdyScroll">
    <slot />
  </el-scrollbar>
</template>
<script>
export default {
  name: "hlScroll",
  methods: {
    toTop() {
      this.$refs.myScrollbar.wrap.scrollTop = 0;
    },
  },
};
</script>

<style scoped>
/* .zdyScroll >>> .el-scrollbar__wrap {
  overflow-x: hidden;
} */
.h-100 {
  height: 100%;
}
::v-deep .el-scrollbar__view {
  height: 100%;
}
.zdyScroll >>> .el-scrollbar__bar {
  z-index: 9999;
}
.zdyScroll >>> .el-scrollbar__bar.is-horizontal {
  display: none;
}
.zdyScroll >>> .el-scrollbar__bar.is-horizontal {
  display: none;
}
.zdyScroll >>> .el-scrollbar__wrap {
  margin-bottom: 0 !important;
  overflow-x: hidden;
  /* padding-right: 10px; */
}
</style>
