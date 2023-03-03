/* * @Author: sunhanmin * @Date: 2022-03-04 11:06:36 * @Last Modified by:
sunhanmin * @Last Modified time: 2022-03-04 11:13:07 */

<template>
  <div class="hlcx-title">
    <el-tooltip
      :disabled="visibleTooltip"
      class="item"
      effect="dark"
      :content="title"
      placement="top-start"
    >
      <div class="content">
        <slot name="icon"></slot>
        <span
          class="title"
          :style="level === 'first' ? firstLevelStyle : secondLevelStyle"
          v-html="title"
        ></span>
      </div>
    </el-tooltip>
    <div class="detail">
      <slot name="detail"></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: "hlTitle",
  props: {
    visibleTooltip: {
      type: Boolean,
      default: true,
    },
    title: {
      type: String,
      default: "",
    },
    level: {
      type: String,
      default: "first",
    },
  },
  data() {
    return {
      firstLevelStyle: {
        color: "#65789b",
        fontSize: "16px",
        fontFamily: "fangzhenglanting",
      },
      secondLevelStyle: {
        color: "#666666",
        fontSize: "14px",
        fontWeight: 600,
      },
    };
  },
  mounted() {},
  methods: {},
};
</script>
<style lang="scss" scoped>
@font-face {
  font-family: "fangzhenglanting";
  src: url("../fangzhenglanting.TTF");
  font-weight: normal;
  font-style: normal;
}
.hlcx-title {
  margin-bottom: 14px;
  display: flex;
  justify-content: space-between;
  // height: 25px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-all;
  span.title {
    display: inline-block;
    // line-height: 25px;
    letter-spacing: 0;
  }
  div.detail {
    cursor: pointer;
    display: inline-block;
    line-height: 25px;
  }
  .content {
    display: flex;
    align-items: center;
  }
}
</style>
