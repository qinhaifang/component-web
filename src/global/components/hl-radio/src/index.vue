<!--
 * @Author: haifang.qin
 * @Date: 2022-03-02 14:52:55
 * @LastEditors: haifang.qin
 * @LastEditTime: 2022-05-26 16:45:56
 * @FilePath: \standard-component-web\src\components\hl-radio\src\index.vue
-->
<template>
  <div class="hl-radio">
    <el-radio-group
      v-model="radioVal"
      @change="radioChange"
      v-bind="
        getMergedObject(radioConfig.extend ? radioConfig.extend : radioConfig)
      "
    >
      <template v-if="radioConfig && radioConfig.type != 'radioBtn'">
        <el-radio
          v-for="(item, index) in options"
          :key="index"
          :label="setMaterialOptionsLabelByConfig(item, 'value')"
          v-bind="
            getMergedObject(
              item.extend
                ? item.extend
                : radioConfig.extend
                ? radioConfig.extend
                : item
            )
          "
          v-on="
            getMergedObject(
              item.extend
                ? item.extend
                : radioConfig.extend
                ? radioConfig.extend
                : item
            )
          "
        >
          {{ setMaterialOptionsLabelByConfig(item, "label") }}</el-radio
        >
      </template>
      <template v-else>
        <el-radio-button
          v-for="(item, index) in options"
          :label="setMaterialOptionsLabelByConfig(item, 'value')"
          :key="index"
          v-bind="
            getMergedObject(
              item.extend
                ? item.extend
                : radioConfig.extend
                ? radioConfig.extend
                : item
            )
          "
        >
          <hl-icon
            v-if="item.icon"
            :fontSize="item.size"
            :name="item.icon"
            :color="radioVal == index ? item.activeColor : ''"
          ></hl-icon>

          {{ setMaterialOptionsLabelByConfig(item, "label") }}</el-radio-button
        >
      </template>
    </el-radio-group>
  </div>
</template>
<script>
import { getMergedObject } from "@/utils/util";
import hlIcon from "./../../hl-icon";
export default {
  name: "hlRadio",
  components: { hlIcon },
  props: {
    radioConfig: {
      type: [Array, Object],
      default: () => {
        return {};
      },
    }, //tab标签
    initValue: {
      type: [String, Number, Boolean],
      default: "",
    }, //发布当前选择的label
  },
  model: {
    prop: "initValue",
    event: "change",
  },
  data() {
    return {
      options: [],
      radioVal: "",
      tabActive: "",
    };
  },
  watch: {
    radioConfig: {
      handler() {
        this.init();
      },
      deep: true,
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    getMergedObject,
    /**
     * @Description 根据配置的属性获取数据对象的值
     * @params [Object] obj 数据对象
     * @params [String] key 配置的属性值
     */
    setMaterialOptionsLabelByConfig(obj, key) {
      const { props, valueObj } = this.radioConfig;

      // 针对select多选时值为选中的整个数据对象
      if (key === "value" && valueObj) {
        return obj;
      }
      if (props && props[key]) {
        return obj[props[key]];
      }
      return obj[key];
    },
    init() {
      if (Array.isArray(this.radioConfig.options)) {
        this.options = this.radioConfig.options;
      } else {
        this.options = [this.radioConfig.options];
      }
      if (this.initValue || this.initValue == 0) {
        this.radioVal = this.initValue;
      } else {
        this.radioVal = "";
      }
      this.radioChange(this.initValue);
    },
    radioChange(value) {
      this.$emit("change", value);
    },
  },
};
</script>
<style lang="scss" scoped>
@import "../../theme-chalk/src/common/element-var.scss";
.hl-radio {
  ::v-deep .el-radio__inner {
    width: 14px;
    height: 14px;
  }
  ::v-deep .el-radio {
    margin-right: 20px;
  }
  ::v-deep .el-radio__inner::after {
    width: 7px;
    height: 7px;
    background-color: $--color-primary;
  }
  ::v-deep .el-radio__input.is-checked .el-radio__inner {
    background: #fff;
  }
  ::v-deep .el-radio__input.is-checked + .el-radio__label {
    color: $--input-font-color;
  }
  ::v-deep .el-radio-button__orig-radio:checked + .el-radio-button__inner {
    color: $--color-primary;
  }
  ::v-deep .el-radio__label {
    display: inline-block;
    padding-left: 8px;
    font-size: 12px;
    color: #666;
  }
  ::v-deep .el-radio-button:first-child .el-radio-button__inner,
  ::v-deep .el-radio-button:last-child .el-radio-button__inner {
    border-radius: 2px 0 0 2px !important;
  }

  // ::v-deep .el-radio-button__orig-radio:checked + .el-radio-button__inner {
  //   background-color: rgba(6, 92, 211, 0.2);
  //   border-color: #065cd3;
  //   border-radius: 2px 0 0 2px;
  //   box-shadow: -1px 0 0 0 #065cd3;
  // }
  // ::v-deep .el-radio-button__inner:hover {
  //   color: #065cd3;
  // }
}
</style>
