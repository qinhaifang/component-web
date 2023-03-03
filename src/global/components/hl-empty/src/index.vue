<!--
 * @Author: haifang.qin
 * @Date: 2022-03-02 14:52:55
 * @LastEditors: haifang.qin
 * @LastEditTime: 2022-03-04 10:00:38
 * @FilePath: \standard-component-web\src\components\hl-empty\src\index.vue
-->
<template>
  <div class="hl-empty" :class="imageSize !== 80 ? 'lineHeight16' : ''">
    <img :src="image" :style="{ width: imageSize + 'px' }" alt="" />
    <p>{{ description }}</p>
  </div>
</template>
<script>
export default {
  name: "hlEmpty",
  props: {
    image: {
      type: String,
      default: require("@/assets/image/notData.png"),
    },
    description: {
      type: String,
      default: "暂无数据",
    },
    imageSize: {
      type: [Number, String],
      default: "80",
    },
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {},
};
</script>
<style lang="scss" scoped>
@import "../../theme-chalk/src/common/var.scss";
.hl-empty {
  text-align: center;
  // position: absolute;
  // top: 50%;
  // left: 50%;
  p {
    font-size: 12px;
    color: #999;
  }
}
.lineHeight16 {
  line-height: 16px;
}
</style>
