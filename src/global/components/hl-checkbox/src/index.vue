/* * @Author: dubin * @Date: 2022-03-02 09:04:07 * @Last Modified by: dubin *
@Last Modified time: 2022-03-05 11:05:22 */

<template>
  <div class="hlCheckBoxAll">
    <hl-button
      class="floatL allBtn"
      v-if="checkBoxConfig.allVisible"
      :buttonConfig="buttonConfig"
    ></hl-button>
    <el-checkbox-group
      @change="handleCheckedChange"
      v-model="checkboxGroup"
      v-bind="
        getMergedObject(
          checkBoxConfig.extend ? checkBoxConfig.extend : checkBoxConfig,
          {
            size: 'mini',
          }
        )
      "
    >
      <template v-if="checkBoxConfig.type === 'checkboxButton'">
        <el-checkbox-button
          v-for="(checkItem, num) in checkBoxOption"
          :label="setMaterialOptionsLabelByConfig(checkItem, 'value')"
          :key="num"
          >{{
            setMaterialOptionsLabelByConfig(checkItem, "label")
          }}</el-checkbox-button
        >
      </template>
      <template v-else-if="checkBoxConfig.type === 'checkbox'">
        <el-checkbox
          v-for="(checkItem, num) in checkBoxOption"
          :label="setMaterialOptionsLabelByConfig(checkItem, 'value')"
          :key="num"
          >{{
            setMaterialOptionsLabelByConfig(checkItem, "label")
          }}</el-checkbox
        >
      </template>
    </el-checkbox-group>
  </div>
</template>

<script>
import { deepCopy, getMergedObject } from "@/utils/util";
import hlButton from "./../../hl-button";
export default {
  components: { hlButton },
  name: "hlCheckbox",
  props: {
    name: String,
    checkBoxConfig: {
      type: Object,
      default: () => {
        return {};
      },
    },
    value: [String, Number, Boolean, Array],
  },
  watch: {
    // 监听checkBoxConfig的改变，更新option
    checkBoxConfig: {
      handler() {
        this.checkBoxOption = deepCopy(this.checkBoxConfig.options);
        // this.$emit("input", [""]);
      },
      deep: true,
    },
    value(v) {
      this.checkboxGroup = v;
      this.setValueChange(v);
    },
  },
  computed: {
    buttonConfig() {
      return {
        text: "全部",
        size: "mini",
        type: this.checkAllFlag ? "allCheck" : "",
        clickEvent: this.handleCheckAllChange,
      };
    },
  },
  data() {
    return {
      checkAllFlag: true,
      checkBoxOption: [],
      checkboxGroup: [],
    };
  },
  mounted() {
    if (this.checkBoxConfig.options) {
      this.checkBoxOption = deepCopy(this.checkBoxConfig.options);
    }
    if (this.value) {
      this.checkboxGroup = this.value;
      this.setValueChange(this.value);
    } else {
      this.$emit("input", []);
    }
  },
  methods: {
    setValueChange(v) {
      if (Array.isArray(v) && v.length == 0) {
        this.checkAllFlag = true;
      } else {
        this.checkAllFlag = false;
      }
    },
    getMergedObject,
    /**
     * @Description 根据配置的属性获取数据对象的值
     * @params [Object] obj 数据对象
     * @params [String] key 配置的属性值
     */
    setMaterialOptionsLabelByConfig(obj, key) {
      const { props, type, valueObj } = this.checkBoxConfig;

      // 针对select多选时值为选中的整个数据对象
      if (type === "select" && key === "value" && valueObj) {
        return obj;
      }
      if (props && props[key]) {
        return obj[props[key]];
      }
      return obj[key];
    },
    handleCheckAllChange() {
      this.checkAllFlag = !this.checkAllFlag;
      if (this.checkAllFlag) {
        this.checkboxGroup = [];
        this.$emit("input", []);
      }
    },
    handleCheckedChange(value) {
      this.checkAllFlag = false;
      this.$emit("input", value);
    },
  },
};
</script>
<style lang="scss">
@import "./../../theme-chalk/src/common/element-var.scss";
.hlCheckBoxAll {
  & > .hl-button {
    .el-button {
      padding-right: 10px;
      padding-left: 10px;
      padding: 6px 10px;
      border-radius: 2px;
    }
  }
  & > .floatL {
    margin-right: 10px;
    margin-top: -1px;
  }
  .el-checkbox {
    margin-right: 20px;
  }
  & > .el-checkbox-group {
    .el-checkbox__label {
      color: #666;
      padding-left: 8px;
    }
    & > .el-checkbox-button {
      margin-right: 10px;
      margin-bottom: 10px;
      &.el-checkbox-button--mini{
        .el-checkbox-button__inner:hover{
          background: $btn-primary-plain-bgHover;
          color:#fff;
        }
      }
      &.is-checked {
        .el-checkbox-button__inner {
          border-left: none;
          background-color: $el-button--allCheck;
          border-color: $el-button--allCheck;
        }
      }
      .el-checkbox-button__inner {
        border-radius: 2px;
        padding: 6px 10px;
        border-left: 1px solid $--border-color-base;
      }
      &.is-focus {
        .el-checkbox-button__inner {
          border-left: 1px solid  $el-button--allCheck;
        }
      }
    }
  }
}
</style>
