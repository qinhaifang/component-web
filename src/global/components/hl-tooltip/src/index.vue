/* * @Author: sunhanmin * @Date: 2022-03-04 11:05:26 * @Last Modified by:
sunhanmin * @Last Modified time: 2022-03-04 11:05:26 */

<template>
  <div class="hl-tooltip">
    <el-tooltip
      v-bind="
        getMergedObject(tooltipConfig.extend, tooltipConfig, {
          openDelay: 500,
        })
      "
      @click="handleClick"
    >
      <slot name="text"></slot>
      <div
        slot="content"
        v-if="
          !tooltipConfig.content ||
          (tooltipConfig.extend && !tooltipConfig.extend.content)
        "
      >
        <slot name="contentTootip"></slot>
      </div>
    </el-tooltip>
  </div>
</template>

<script>
import { getMergedObject } from "@/utils/util";
export default {
  name: "hlTooltip",
  props: {
    tooltipConfig: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {};
  },
  methods: {
    getMergedObject,
    handleClick() {
      this.$emit("click");
    },
  },
};
</script>
<style>
.el-tooltip__popper.is-dark {
  max-width: 500px !important;
}
</style>
