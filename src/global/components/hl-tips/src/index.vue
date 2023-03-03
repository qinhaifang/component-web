<!--
 * @Author: haifang.qin
 * @Date: 2022-03-03 11:06:34
 * @LastEditors: haifang.qin
 * @LastEditTime: 2022-03-04 16:51:56
 * @FilePath: \standard-component-web\src\components\hl-tips\src\index.vue
-->
<template>
  <div
    class="hl-tips"
    :style="{
      width: tipsConfig.width || '',
      borderColor: tipsConfig.color || '#ffb70c',
    }"
  >
    <hl-icon
      :color="tipsConfig.color || '#ffb70c'"
      :name="tipsConfig.name || 'icontishi'"
      :fontSize="tipsConfig.size || '14'"
      :size="tipsConfig.size || 'mini'"
    ></hl-icon>
    <span :style="{ fontSize: tipsConfig.fontSize || '12' + 'px' }">{{
      tipsConfig.msg
    }}</span>
  </div>
</template>
<script>
import { getMergedObject } from "@/utils/util";
import hlIcon from './../../hl-icon'
export default {
  name: "hlTips",
    components:{hlIcon},
  props: {
    tipsConfig: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {
    getMergedObject,
  },
};
</script>
<style lang="scss" scoped>
@import "../../theme-chalk/src/common/var.scss";
.hl-tips {
  border: 1px solid $commonly;
  height: 40px;
  line-height: 40px;
  padding: 0 20px;
  span {
    padding-left: 8px;
  }
}
</style>
