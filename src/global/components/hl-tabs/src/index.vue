<!--
 * @Author: haifang.qin
 * @Date: 2022-03-03 11:06:34
 * @LastEditors: haifang.qin
 * @LastEditTime: 2022-03-04 16:51:56
 * @FilePath: \standard-component-web\src\components\hl-tabs\src\index.vue
-->
<template>
  <div class="hl-tabs">
    <el-radio-group
      v-if="isRaioGroup"
      v-model="tabActive"
      @change="tabRadioChange"
      :class="plain ? 'plain' : ''"
    >
      <slot v-for="(item, index) in options">
        <el-radio-button
          :disabled="item.disabled"
          :label="item.value"
          :key="index"
          v-if="!item.visible"
        >
          <hl-icon
            v-if="item.icon"
            :name="item.icon"
            :color="tabActive === index ? '#fff' : ''"
          ></hl-icon>
          {{ item.name }}</el-radio-button
        >
      </slot>
    </el-radio-group>
    <el-tabs v-else v-model="tabActive" @tab-click="handleClick">
      <slot v-for="(item, index) in options">
        <el-tab-pane
          :label="item.name"
          :name="item.value"
          :key="index"
        ></el-tab-pane>
      </slot>
    </el-tabs>
  </div>
</template>
<script>
import hlIcon from "./../../hl-icon";
export default {
  components: { hlIcon },
  name: "hlTabs",
  props: {
    isRaioGroup: {
      type: Boolean,
      default: true,
    },
    plain: {
      type: Boolean,
      default: false,
    },
    options: {
      type: Array,
      default: () => {
        return [];
      },
    }, //tab标签
    initValue: {
      type: String,
      default: "",
    }, //发布当前选择的label
  },
  model: {
    prop: "initValue",
    event: "change",
  },
  data() {
    return {
      tabActive: "",
    };
  },
  watch: {
    initValue: function (newVal, oldVal) {
      this.init();
    },
    tabActive: function (newVal) {
      this.$emit("change", newVal);
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.tabActive = this.initValue || this.options[0].value;
      this.tabRadioChange(this.tabActive);
    },
    tabRadioChange(value) {
      this.$emit("change", value);
    },
    handleClick(tab, event) {
      this.$emit("handleClick", tab);
    },
  },
};
</script>
<style lang="scss" scoped>
@import "../../theme-chalk/src/common/var.scss";
.hl-tabs {
  ::v-deep .el-radio-button__inner {
    // width: 88px;
    padding: 7px 20px;
  }
  ::v-deep .el-radio-button:first-child .el-radio-button__inner {
    border-radius: 2px 0 0 2px;
  }
  ::v-deep .el-radio-button:last-child {
    .el-radio-button__inner {
      padding: 7px 20px;
      border-radius: 0 2px 2px 0;
    }
  }
  ::v-deep .el-radio-button__orig-radio:checked + .el-radio-button__inner {
    color: #fff;
  }
  ::v-deep .el-tabs__header {
    margin-bottom: 0;
  }
  ::v-deep .el-tabs__nav-wrap::after {
    //   height: 0;
    background-color: #d9d9d9;
  }
  ::v-deep .el-radio-group.plain {
    .el-radio-button__orig-radio:checked + .el-radio-button__inner {
      color: #065cd3;
      background-color: #fff;
      border-color: #065cd3;
    }
    .el-radio-button__inner {
      border-radius: 0;
    }
  }
  ::v-deep .el-tabs__item {
    // padding: 0 20px !important;
  }
}
</style>
