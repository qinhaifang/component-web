<template>
  <div
    class="hamburger"
    :class="{ 'is-active': isActive }"
    @click="toggleClick"
  >
    <el-image v-if="icon" :src="icon" class="sidebar-logo" />
    <!-- <i class="iconfont iconzhankaishouqi-left"></i> -->
  </div>
</template>

<script>
export default {
  name: "Hamburger",
  props: {
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    icon() {
      if (!this.isActive) {
        return require("./imgs/right.png");
      } else {
        return require("./imgs/left.png");
      }
    },
  },
  methods: {
    toggleClick() {
      this.$emit("toggleClick");
    },
  },
};
</script>

<style scoped lang="scss">
.hamburger {
  // padding: 0 15px;
  // display: inline-block;
  // vertical-align: middle;
  // width: 40px;
  // color: #fff;
  cursor: pointer;
  // height: 40px;
  // background: rgba(255, 255, 255, 0.3);
  // border-radius: 2px 0 0 2px;
  // line-height: 40px;
  &.is-active {
    // transform: rotate(180deg);
  }
}
</style>
