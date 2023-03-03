/* * @Author: dubin * @Date: 2022-03-03 15:41:38 * @Last Modified by: dubin *
@Last Modified time: 2022-03-03 15:41:38 */

<template>
  <div class="form-wrapper">
    <!-- 表单title顶部自定义插槽 -->
    <d-slot :config="formConfig" slot-name="above-title" />

    <!-- 表单标题 -->
    <div v-if="formConfig.title" class="form-title-wrapper">
      <d-title :label="formConfig.title.label" :note="formConfig.title.note" />
      <!-- 表单标题同行按钮配置 -->
      <template v-if="formConfig.title.button">
        <hl-button :buttonConfig="formConfig.title.button"> </hl-button>
      </template>
    </div>
    <el-form
      v-if="formConfig.data && showFlag"
      ref="formGroup"
      :model="formParams"
      :class="[
        (formConfig.layout && `form-${formConfig.layout}`) || 'form-grid',
        formConfig.noMargin && 'form-item-noMargin',
        formConfig.border && `form-border`,
      ]"
      v-bind="
        getMergedObject(formConfig.extend ? formConfig.extend : formConfig, {
          labelWidth: formConfig.layout === 'flow' ? '77px' : '80px',
          size: 'mini',
          inline: formConfig.layout === 'grid' ? true : false,
        })
      "
      @submit.native.prevent
    >
      <!-- 表单项 -->
      <template
        v-if="
          (formConfig.layout === 'flow' ||
            formConfig.layout === 'inlineBlock') &&
          formConfig.media !== false &&
          Array.isArray(formConfig.data)
        "
      >
        <template v-for="materialConfig in formConfig.data">
          <div
            v-if="handleSearchFormVisible(materialConfig)"
            :key="materialConfig.name"
            :class="{
              'form-material': true,
              hide: dependOnChange(materialConfig),
              'search-show': handleSearchFormVisible(materialConfig),
              [materialConfig.className]: materialConfig.className,
            }"
            :style="{
              width:
                (formConfig.layout === 'inlineBlock' &&
                  setMaterialConfigWidth(materialConfig.width)) ||
                '100%',
            }"
          >
            <hlFormMaterial
              :ref="`form-${materialConfig.name}`"
              :key="materialConfig.name"
              :material-config="materialConfig"
              :form-config="formConfig"
              :form-params="formParams"
              :extend="
                materialConfig.extend ? materialConfig.extend : materialConfig
              "
              @toggle="handleToggle"
              @dependOnChange="dependOnChange"
              @btnClick="handleBtnClick"
              @handlerEnter="handlerEnter"
            />
          </div>
          <div v-else-if="materialConfig.textBefore">
            <span class="text-before" v-html="materialConfig.textBefore" />
          </div>
          <div
            v-else-if="materialConfig.type === 'divider'"
            class="divider--horizontal"
            v-bind="
              materialConfig.extend ? materialConfig.extend : materialConfig
            "
          ></div>
          <div v-else-if="materialConfig.type === 'button'">
            <hl-button :buttonConfig="materialConfig.button"></hl-button>
          </div>
        </template>
      </template>
      <template v-else>
        <div
          v-if="
            Array.isArray(materialConfigsforLayout) &&
            materialConfigsforLayout.length > 0
          "
          class="form-body-wrapper"
        >
          <template v-for="materialConfigsInRow in materialConfigsforLayout">
            <template>
              <el-row
                :gutter="formConfig.gutter || 14"
                v-show="
                  !materialConfigsInRow.every((item) => item.visible === false)
                "
              >
                <template v-for="materialConfig in materialConfigsInRow">
                  <el-col
                    v-show="handleSearchFormVisible(materialConfig)"
                    :key="materialConfig.name"
                    :span="
                      materialConfig.grid
                        ? parseInt(24 / materialConfig.grid)
                        : 24
                    "
                    :class="{
                      hide: dependOnChange(materialConfig),
                      [materialConfig.className]: materialConfig.className,
                    }"
                  >
                    <hlFormMaterial
                      :ref="`form-${materialConfig.name}`"
                      :key="materialConfig.name"
                      :material-config="materialConfig"
                      :form-config="formConfig"
                      :form-params="formParams"
                      :extend="
                        materialConfig.extend
                          ? materialConfig.extend
                          : materialConfig
                      "
                      @toggle="handleToggle"
                      @dependOnChange="dependOnChange"
                    />
                  </el-col>
                </template>
              </el-row>
            </template>
          </template>
        </div>
      </template>
    </el-form>

    <!-- 表单title底部自定义插槽 -->
    <d-slot :config="formConfig" slot-name="under-title" />
  </div>
</template>

<script>
import {
  isEmptyObj,
  allKeysValueExpected,
  getMergedObject,
  hasField,
} from "@/utils/util";
import dSlot from "./../../common/slot.vue";
import dTitle from "./../../common/title.vue";
import hlFormMaterial from "./../../hl-formMeterial/index.vue";
import hlButton from "./../../hl-button";
export default {
  name: "hlForm",
  components: { dSlot, dTitle, hlFormMaterial, hlButton },
  props: {
    formConfig: {
      required: true,
      type: Object,
      default: () => ({}),
    },
    value: {
      type: [Object, Array],
      default: function () {
        return {};
      },
    },
  },
  data() {
    return {
      showFlag: false,
      getMergedObject,
      formParams: {}, // 表单的所有参数集合
      materialConfigs: [], // 将formConfig转化后的一维元组件配置数组，拿掉了data这一层
      materialConfigsforLayout: [], // 将元组件配置按照grid进行二维化，方便进行多栏布局
      typeArrayList: [
        "cascader",
        "checkbox",
        "transfer",
        "areaselect",
        "listselect",
        "daterange",
        "monthrange",
        "datetimerange",
      ], // 数据类型为数组的列表
      rangeTypeList: ["daterange", "monthrange", "datetimerange"], // 时间区域选择控件
    };
  },
  watch: {
    // 监听formConfig的改变，更新materialConfigs
    formConfig: {
      handler(val) {
        this.formatFormConfigToMaterialConfigs();
      },
      deep: true,
    },
    // 监听formParams表单值的改变
    formParams: {
      handler(val) {
        this.$emit("input", val);
      },
      deep: true,
    },
    // 监听results的变化，进行赋值
    value: {
      handler(val) {
        if (
          !isEmptyObj(val) &&
          JSON.stringify(val) !== JSON.stringify(this.formParams)
        ) {
          console.log(val, "val");
          this.handleServerData(Object.assign(this.formParams, val));
        }
      },
      deep: true,
    },
  },
  mounted() {
    // 格式化materialConfigs
    this.formatFormConfigToMaterialConfigs();
    const { formConfig } = this;
    // 当results属性不存在，进行初始化，否则无法对results进行监听
    if (this.value) {
      this.handleServerData(this.value);
    } else {
      this.formParams = {};
      this.showFlag = true;
    }
    const { http, apiRequest = true } = formConfig;
    // 请求页面数据
    if (apiRequest && http && http.url) this.load();
  },
  methods: {
    //校验form
    validate() {
      return new Promise((resolve, reject) => {
        this.$refs.formGroup.validate((valid) => {
          if (valid) {
            resolve(true);
          } else {
            reject(false);
          }
        });
      });
    },
    /**
     * 请求页面数据
     */
    load() {
      const { http, showLoading } = this.formConfig;
      if (!http || !http.url) return;
      const { onSuccess, onBefore, method } = http;
      let params = Object.assign({}, http.params);
      if (onBefore) {
        params = onBefore(params, this) === false ? false : params;
        if (params === false) return;
      }
      this.$fetch({
        url: http.url,
        method: method || "post",
        config: { showLoading: showLoading },
        params,
      }).then((res) => {
        this.$emit("server-change", res);
        if (!res) return;
        let form = res;
        if (onSuccess) {
          form = onSuccess(res, this) || form;
          if (form === false) return;
        }
        this.handleServerData(form);
      });
    },
    //重置form
    resetForm() {
      this.$refs.formGroup.resetFields();
      this.handleServerData(this.formParams);
      this.$refs.formGroup.clearValidate();
    },
    setMaterialConfigWidth(width) {
      if (width) {
        width = width.toString();
        if (width.indexOf("%") != -1) {
          return width;
        } else {
          return width + "px";
        }
      } else {
        return false;
      }
    },
    hasTextAfter(formConfig) {
      const { data } = formConfig;
      const result = data.find((item) => item.textAfter);
      return !!result;
    },
    handlerEnter() {
      this.$emit("handlerEnter");
    },
    /**
     * 按钮点击事件
     * @param {Object} btn 被点击的按钮实例
     */
    handleBtnClick(btn) {
      if (btn.target) {
        this.dialogVisible[btn.target] = true;
      } else if (btn.callback && typeof btn.callback === "function") {
        // 自定义回调
        btn.callback(this);
      }
    },
    /**
     * 根据元组件配置对部分特殊元组件参数进行处理
     * @param {object} materialConfigF 元组件配置
     * @param {object} formParamsValue 表单参数值，来源于父组件给的初始值或更新值
     * @param {object} tprFormParamsF 临时的formParams对象
     */
    dealMaterialFieldByConfig(
      materialConfigF,
      formParamsValue,
      tprFormParamsF
    ) {
      const materialConfig = materialConfigF;
      const tprFormParams = tprFormParamsF;
      const { name, type, extraFields, props } = materialConfig;
      const value = formParamsValue[name];
      // 默认直接赋值
      tprFormParams[name] = value;

      // 特殊情况
      if (type === "checkbox" && typeof value === "string") {
        // 多选框，字符串数据需格式化为数组
        tprFormParams[name] = value.split(",");
      } else if (type === "cascader") {
        // 获取cascader实例
        const key = `form-${name}`;
        const $item = this.$refs[key] ? this.$refs[key][0] : undefined;
        if (!$item) return;
        $item.getOptions("", () => {
          $item.getCascaderSubset(value);
        });
      } else if (
        (type === "search" || type === "autocomplete") &&
        formParamsValue[extraFields]
      ) {
        // // select search 用显示
        // label key
        const keyLabel = props && props.label ? props.label : "label";
        // val key
        const keyVal = props && props.value ? props.value : "value";

        // search value
        const extraFieldValue = formParamsValue[extraFields];
        const option = {
          [keyLabel]: extraFieldValue,
          [keyVal]: value,
        };
        this.$set(materialConfig, "options", [option]);
      } else if (
        this.rangeTypeList.includes(type) &&
        Array.isArray(extraFields)
      ) {
        if (!value || !Array.isArray(value)) {
          const valueArr = [];
          extraFields.forEach((key) => {
            valueArr.push(formParamsValue[key]);
          });
          tprFormParams[name] = valueArr;
        } else {
          // 同bk-form-material的handleTimeChange方法的应用场景
          extraFields.forEach((key) => {
            tprFormParams[key] = formParamsValue[key] || "";
          });
        }
      } else if (type === "areaselect" || type === "listselect") {
        if (typeof value === "string") {
          const valueObj = JSON.parse(value);
          if (Array.isArray(valueObj)) {
            tprFormParams[name] = valueObj;
          } else {
            console.warn(`${name}返回数据结构异常`);
            tprFormParams[name] = [];
          }
        } else if (!Array.isArray(value)) {
          console.warn(`${name}返回数据结构异常`);
          tprFormParams[name] = [];
        }
      } else if (type === "address") {
        if (extraFields && Array.isArray(extraFields)) {
          extraFields.forEach((extraFieldsItem) => {
            tprFormParams[extraFieldsItem] = formParamsValue[extraFieldsItem];
          });
        }
      }
    },
    /**
     * 设置表单参数的值
     * @param {object} materialConfig 元组件配置
     * @param {object} formParamsValue 表单参数值，来源于父组件给的初始值或更新值
     * @param {object} tprFormParams 临时的formParams对象
     */
    setFormParamValue(materialConfig, formParamsValue, tprFormParams) {
      const { name, type, extraFields, http = {} } = materialConfig;
      const value = formParamsValue[name];
      const extraValue = formParamsValue[extraFields];
      if (
        value === undefined ||
        value === null ||
        value === "" ||
        (value.length != 0 && value[0] === "")
      ) {
        if (name) {
          tprFormParams[name] = this.typeArrayList.includes(type) ? [] : "";
        }
      }
      // 判断extraFields字段是否都为空
      let extraFieldsHasValue = false;
      if (Array.isArray(extraFields)) {
        extraFieldsHasValue =
          extraFields.findIndex((item) => formParamsValue[item]) > -1;
      }

      // 当获取的值不存在则跳出
      if (
        !this.rangeTypeList.includes(type) &&
        (value === undefined || value === null)
      )
        return;

      if (Array.isArray(extraFields) && !extraFieldsHasValue) return;
      // 数据转换
      // this.dealMaterialFieldByConfig(
      //   materialConfig,
      //   formParamsValue,
      //   tprFormParams
      // );
    },
    /**
     * 转化数据结构并设置表单参数的值
     * @param {Object} formParamsValue 表单参数值，来源于父组件给的初始值或更新值
     */
    handleServerData(formParamsValue) {
      // 关闭关联清空
      this.allowEmpty = false;
      this.showFlag = false;
      let tprFormParams = formParamsValue || {};
      // 所有表单配置
      this.materialConfigs.forEach((item) => {
        this.setFormParamValue(item, formParamsValue, tprFormParams);
      });

      // TODO
      this.formParams = tprFormParams;
      this.$nextTick(() => {
        this.showFlag = true;
      });
    },
    /**
     * 当元组件发生变更，触发此函数
     * @param {String} val 元组件变更后的值
     * @param {Object} item 元组件配置
     */
    handleToggle(val, item) {
      this.$emit("toggle-config", {
        item,
        value: val,
      });
    },
    /**
     * 依赖字段值匹配时隐藏
     * @param {Object} materialConfig 元组件配置
     */
    dependOnChange(materialConfig) {
      const { depend } = materialConfig;
      const { name, value, visibleSwitch } = depend || {};
      if (
        !depend ||
        !name ||
        value === undefined ||
        value === null ||
        !visibleSwitch
      )
        return false;
      // 默认依赖字段符合预期
      let visibleFlag = true;
      // 根据预期值判断是否有不符合预期的情况
      visibleFlag = allKeysValueExpected({
        value,
        name,
        formParamisArray: this.formParamisArray,
        formParams: this.formParams,
      });
      // 控制数据的rules，隐藏的标签都不需要校验数据 v0.13.12
      if (materialConfig.rules) {
        if (visibleSwitch) {
          if (visibleFlag || materialConfig.visible === false) {
            materialConfig.required = false;
            materialConfig.rules.map((item) => {
              item.required = false;
              return "";
            });
          } else {
            materialConfig.required = true;
            materialConfig.rules.map((item) => {
              item.required = true;
              return "";
            });
          }
        }
      }
      return visibleFlag;
    },
    /**
     * 针对list组件查询条件部分的显示隐藏
     */
    handleSearchFormVisible(materialConfig) {
      const { noFold, visible, name } = materialConfig;
      const { layout } = this.formConfig;
      let visibleVal;
      if (typeof visible === "function") {
        visibleVal = visible.call(materialConfig, this);
      } else if (typeof visible === "boolean") {
        visibleVal = visible;
      }
      if (hasField(materialConfig, "noFold")) {
        if (noFold === true && hasField(materialConfig, "visible")) {
          return visibleVal;
        }
        return noFold;
      }
      if (hasField(materialConfig, "visible")) {
        return visibleVal;
      }
      if (layout === "flow" && !name) {
        return false;
      }
      return true;
    },
    formatFormConfigToMaterialConfigs() {
      this.materialConfigs = [];
      this.materialConfigsforLayout = [];
      if (!Array.isArray(this.formConfig.data)) return;
      let k = 0;
      this.formConfig.data.forEach((item) => {
        this.materialConfigs.push(item);
        const tb = this.materialConfigsforLayout;
        if (!tb[k]) {
          tb[k] = [item];
          if (item.grid === 1 || !item.grid) {
            k += 1;
          }
        } else {
          let num = 24 / item.grid;
          const row = tb[k]; // 行

          for (let n = 0; n < row.length; n += 1) {
            const col = row[n];
            const { grid = 1 } = col;
            num += 24 / grid;
            const isLast = n === row.length - 1; // 是否为最后一个元素
            if (item.grid === 1) {
              // 单行
              tb[k + 1] = [item];
              k += 2;
              break;
            } else if (num === 24 && isLast) {
              // 总和刚刚好则下一行
              row.push(item);
              k += 1;
              break;
            } else if (num > 24) {
              // 超出另起一行
              k += 1;
              tb[k] = [item];
              break;
            } else if (isLast) {
              // 最后一个时num 不大于24时添加
              row.push(item);
              break;
            }
          }
        }
      });
    },
  },
};
</script>
<style lang="scss" src="./index.scss"></style>
