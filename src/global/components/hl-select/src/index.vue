/* * @Author: sunhanmin * @Date: 2022-03-02 09:42:03 * @Last Modified by:
sunhanmin * @Last Modified time: 2022-03-04 11:04:39 */
<template>
  <div class="hl-select">
    <template
      v-if="
        selectConfigParams.extend && selectConfigParams.extend.remoteMethodFlag
      "
    >
      <el-select
        v-model="selectValue"
        @change="handleChange"
        popper-class="hl-select-dropDown"
        v-bind="
          getMergedObject(
            selectConfigParams.extend
              ? selectConfigParams.extend
              : selectConfigParams,
            {
              placeholder: '请选择',
            }
          )
        "
        v-on="getMergedObject(selectConfigParams.extend)"
      >
        <el-option
          v-for="(item, index) in options"
          :key="index"
          :label="setMaterialOptionsLabelByConfig(item, 'label')"
          :value="setMaterialOptionsLabelByConfig(item, 'value')"
          v-bind="getMergedObject(item.extend ? item.extend : item, {})"
        ></el-option>
      </el-select>
    </template>
    <template v-else>
      <el-select
        v-model="selectValue"
        @change="handleChange"
        popper-class="hl-select-dropDown"
        :remote-method="remoteMethod"
        v-bind="
          getMergedObject(
            selectConfigParams.extend
              ? selectConfigParams.extend
              : selectConfigParams,
            {
              placeholder: '请选择',
            }
          )
        "
        v-on="getMergedObject(selectConfigParams.extend)"
      >
        <el-option
          v-for="(item, index) in options"
          :key="index"
          :label="setMaterialOptionsLabelByConfig(item, 'label')"
          :value="setMaterialOptionsLabelByConfig(item, 'value')"
          v-bind="getMergedObject(item.extend ? item.extend : item, {})"
        ></el-option>
      </el-select>
    </template>
  </div>
</template>
<script>
import { getMergedObject, deepClone, isEmptyObj } from "@/utils/util";
export default {
  name: "hlSelect",
  props: {
    value: {
      default: "",
    },
    selectConfig: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      selectValue: "",
      options: [],
      selectConfigParams: {},
    };
  },
  watch: {
    value: function (newVal) {
      this.selectValue = newVal;
    },
    selectConfig: {
      handler(newVal) {
        this.selectConfigParams = deepClone(newVal);
        this.remoteMethod();
      },
      deep: true,
    },
  },
  computed: {},
  methods: {
    handleChange(v) {
      this.$emit("input", v);
    },
    selectFocus() {
      this.selectValue = "";
    },
    remoteMethod(query) {
      const { name, http, options, extend } = this.selectConfig;
      const { remoteMethodFlag } = extend || {};
      // console.log(this.selectConfig, "3333");
      if (http && http.url && !remoteMethodFlag) {
        let { url, params, method, onSuccess, paramsName } = http;
        params = {
          ...params,
          [paramsName || "content"]: query,
        };
        this.$fetch({
          url, // 配置过来的请求地址
          params,
          method: method || "post",
          config: {
            showLoading: false,
          },
        }).then((res) => {
          // 成功回调并获得用户调整的参数
          if (onSuccess) {
            // 回填经过上层onSuccess拦处理后的表格数据
            res = onSuccess(res, this) || res;
          }
          this.options = deepClone(res || []);
        });
      } else {
        this.options = options;
      }
    },
    getMergedObject,
    /**
     * @Description 根据配置的属性获取数据对象的值
     * @params [Object] obj 数据对象
     * @params [String] key 配置的属性值
     */
    setMaterialOptionsLabelByConfig(obj, key) {
      const { props, type, valueObj } = this.selectConfigParams;

      // 针对select多选时值为选中的整个数据对象
      if (type === "select" && key === "value" && valueObj) {
        return obj;
      }
      if (props && props[key]) {
        return obj[props[key]];
      }
      return obj[key];
    },
  },
  mounted() {
    this.selectValue = this.value;
    this.selectConfigParams = deepClone(this.selectConfig);
    this.remoteMethod();
  },
};
</script>
<style lang="scss">
@import "../../theme-chalk/src/common/var.scss";
.hl-select-dropDown {
  margin-top: 5px !important;
  box-shadow: 0 3px 6px -4px rgba(0, 0, 0, 0.12),
    0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 16px 8px rgba(0, 0, 0, 0.05);
  border-radius: 2px;
  .popper__arrow {
    display: none;
  }
  .el-select-dropdown__item {
    height: 28px;
    line-height: 28px;
    font-size: 12px;
  }
  .el-select-dropdown__item.selected {
    font-weight: normal;
  }
  .el-select-dropdown__item.hover,
  .el-select-dropdown__item:hover {
    // background: rgba(229, 244, 240, 1);
  }
}
.hl-select-dropDown.el-popper[x-placement^="top"] {
  margin-top: 0;
}
</style>
<style scoped lang="scss">
@import "../../theme-chalk/src/common/var.scss";
.hl-select {
  width: 100%;
  ::v-deep .el-select {
    .el-input__inner {
      height: 28px;
      line-height: 28px;
      font-size: 12px;
      padding: 0 10px;
      border-radius: 2px;
    }
    .el-input__suffix {
      right: 10px;
    }
    .el-input__icon {
      width: auto;
      line-height: 28px;
    }
    .el-tag.el-tag--info .el-tag__close {
      color: #fff;
    }
  }
}
</style>
