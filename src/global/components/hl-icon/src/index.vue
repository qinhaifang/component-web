/* * @Author: dubin * @Date: 2022-03-03 15:42:07 * @Last Modified by: dubin *
@Last Modified time: 2022-03-03 15:42:07 */

<template>
  <i
    @click.stop="handleClick"
    class="pointer"
    :class="[
      noPointer && 'noPointer',
      'iconfont-' + size,
      hasElIcon(name) ? name : 'iconfont ' + name,
      'icon-' + type,
    ]"
    :style="{
      color: color,
      fontSize: fontSize + 'px',
      height: height + 'px',
      lineHeight: lineHeight + 'px',
      marginLeft: marginLeft + 'px',
    }"
  ></i>
</template>

<script>
export default {
  name: "hlIcon",
  props: {
    name: String,
    size: {
      type: String,
      default: "primary",
    },
    color: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "primary",
    },
    noPointer: {
      type: Boolean,
      default: false,
    },
    fontSize: {
      type: [Number, String],
      default: "",
    },
    height: { type: [Number, String], default: "" },
    lineHeight: { type: [Number, String], default: "" },
    marginLeft: { type: [Number, String], default: "" },
  },
  methods: {
    hasElIcon(icon) {
      if (icon.includes("el-icon")) {
        return true;
      }
      return false;
    },
    handleClick(e) {
      this.$emit("click", e);
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./../../theme-chalk/src/common/var.scss";
.iconfont {
  &.noPointer {
    cursor: auto;
  }
  &.icon-primary {
    color: $normal;
  }
  &.icon-danger {
    color: #ff0000;
  }
  &.iconfont-primary {
    font-size: 14px;
  }
  &.icon-medium {
    font-size: 32px;
  }
  &.icon-small {
    font-size: 24px;
  }
  &.icon-mini {
    font-size: 12px;
  }
}
</style>
