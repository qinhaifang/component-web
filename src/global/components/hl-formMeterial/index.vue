/* * @Author: dubin * @Date: 2022-03-03 15:41:56 * @Last Modified by: dubin *
@Last Modified time: 2022-03-03 19:32:06 */

<template>
  <!-- // 为了处理type group 验证 -->
  <div class="form-material-inline">
    <template v-if="materialConfig.textBefore">
      <span class="text-before" v-html="materialConfig.textBefore" />
    </template>
    <div
      v-else-if="materialConfig.type === 'divider'"
      class="divider--horizontal"
      v-bind="extend"
    ></div>
    <div v-else-if="materialConfig.type === 'button'">
      <hl-button :buttonConfig="materialConfig.button"></hl-button>
    </div>
    <el-form-item
      ref="formItem"
      v-else
      :prop="name"
      :label-width="materialConfig.labelWidth || extend.labelWidth"
      :rules="materialConfig.rules"
      :inline-message="false"
      :class="[
        'form-item',
        materialConfig.className,
        materialConfig.type === 'text' && 'text-label',
        materialConfig.disabled && 'form-item-disabled',
        formConfig.noMargin && 'form-item-noMargin',
        materialConfig.noMargin && 'form-item-noMargin',
        !materialConfig.label ? 'has-label-placeholder' : '',
        (materialConfig.readonly || formConfig.readonly) &&
          'form-item-readonly',
      ]"
      v-bind="extend"
      :required="materialConfig.required"
    >
      <template
        v-if="
          materialConfig.label &&
          (formConfig.layout !== 'flow' ||
            formConfig.searchConfig ||
            bkConfig.labelPosition !== 'top')
        "
        #label
      >
        <div class="label-box">
          <div class="label-text">
            <i
              v-if="
                materialConfig.readonlyShow ||
                formConfig.readonlyShow ||
                (!(materialConfig.readonly || formConfig.readonly) &&
                  (materialConfig.required ||
                    (Array.isArray(materialConfig.rules) &&
                      materialConfig.rules.find((item) => !!item.required))))
              "
              class="form-item-required"
            >
              *
            </i>
            {{ materialConfig.label }}
          </div>
        </div>
      </template>
      <div
        :class="[
          'form-item-content',
          materialConfig.textWrap && 'form-item-block',
        ]"
      >
        <template>
          <template v-if="Array.isArray(materialConfig.data)">
            <template v-for="materialConfigItem in materialConfig.data">
              <!-- 普通输入框 -->
              <template
                v-if="
                  materialConfigItem.type === 'input' ||
                  materialConfigItem.type === 'password'
                "
              >
                <el-form-item
                  :class="[
                    'form-item',
                    materialConfigItem.noMargin && 'form-item-noMargin',
                    materialConfigItem.noMarginRight &&
                      'form-item-noMarginRight',
                  ]"
                  :prop="materialConfigItem.name"
                  :rules="materialConfigItem.rules"
                >
                  <hl-input
                    @handlerEnter="handlerEnter"
                    v-model.trim="formParams[materialConfigItem.name]"
                    :inputConfig="materialConfigItem"
                  >
                  </hl-input>
                </el-form-item>
              </template>
              <template v-else-if="materialConfigItem.type === 'select'">
                <hl-select
                  v-model="formParams[materialConfigItem.name]"
                  :selectConfig="materialConfigItem"
                >
                </hl-select>
              </template>
              <template v-else-if="materialConfigItem.textAfter">
                <template v-if="materialConfigItem.textAfter.render">
                  <form-material-render v-bind="materialConfigItem.textAfter" />
                </template>
                <template v-else>
                  <div
                    v-bind="
                      getMergedObject(
                        materialConfigItem.extend
                          ? materialConfigItem.extend
                          : materialConfigItem
                      )
                    "
                    class="text-item-after textAlignCenter"
                    v-html="materialConfigItem.textAfter"
                  />
                </template>
              </template>
            </template>
          </template>
          <!-- 附件的前置文本 -->
          <template v-else-if="materialConfig.textBefore">
            <span class="text-before" v-html="materialConfig.textBefore" />
          </template>
          <!-- 只读控件 -->
          <template
            v-if="
              (hasField(materialConfig, 'readonly')
                ? materialConfig.readonly
                : formConfig.readonly) ||
              type === 'html' ||
              type === 'text' ||
              type === 'file' ||
              type === 'img' ||
              type === undefined
            "
          >
            <!-- 富文本 -->
            <template v-if="type === 'html'">
              <div class="form-read_text" />
              <label class="form-read-text-str" v-html="formParams[name]" />
            </template>

            <template v-else-if="type === 'address'">
              <address-select
                v-model="formParams[name]"
                :readonly="true"
                :material-config="materialConfig"
              />
            </template>

            <!-- 上传 -->
            <template v-else-if="type === 'upload'">
              <d-upload
                v-if="!bkConfig.labelPosition"
                v-model="formParams[name]"
                :readonly="true"
                v-bind="materialConfig"
                :extend="extend"
              />
              <!-- <bk-upload-block
                :readonly="true"
                v-else
                v-bind="materialConfig"
                v-model="formParams[name]"
                :extend="extend"
              /> -->
            </template>

            <!-- 颜色选择 -->
            <template v-else-if="type === 'colorPicker'">
              <el-color-picker v-model="formParams[name]" :disabled="true" />
            </template>
            <!-- 时间转为普通文本 -->
            <template
              v-else-if="
                (type === 'daterange' ||
                  type === 'datetimerange' ||
                  type === 'monthrange' ||
                  type === 'date' ||
                  type === 'year' ||
                  type === 'month' ||
                  type === 'datetime') &&
                materialParam
              "
            >
              <div class="form-read_text">
                <label class="form-read-text-str">
                  <template
                    v-if="
                      (type === 'daterange' ||
                        type === 'datetimerange' ||
                        type === 'monthrange') &&
                      Array.isArray(materialParam)
                    "
                  >
                    <span v-if="materialParam[0] && materialParam[1]">
                      {{
                        `${formatTimeReadonly(type, 1)}
                                    ${
                                      materialConfig.separator ||
                                      (materialConfig.extend &&
                                        materialConfig.extend.rangeSeparator) ||
                                      "至"
                                    }
                                    ${formatTimeReadonly(type, 2)}`
                      }}
                    </span>
                  </template>
                  <template v-else>
                    {{ formatTimeReadonly(type) }}
                  </template>
                </label>
              </div>
            </template>

            <template
              v-else-if="
                type === 'select' ||
                type === 'radio' ||
                type === 'checkbox' ||
                type === 'search' ||
                type === 'cascader' ||
                (type === 'tag' && materialConfig.layout !== 'block')
              "
            >
              <div class="form-read_text">
                <label class="form-read-text-str">{{
                  materialOptionsLabel
                }}</label>
              </div>
            </template>

            <!-- 普通文本 -->
            <template v-else>
              <div class="form-read_text">
                <label class="form-read-text-str">
                  <template v-if="extraFields">
                    <!-- extraFields 多字段显示 -->
                    <template v-if="Array.isArray(extraFields)">
                      <span v-for="(field, i) in extraFields" :key="i">
                        {{ formParams[field] }}
                      </span>
                    </template>
                    <!-- 如果值是个数组 -->
                    <template v-if="Array.isArray(formParams[extraFields])">
                      <span
                        v-for="(label, i) in formParams[extraFields]"
                        :key="i"
                      >
                        {{ combiningStr(label, i, materialConfig) }}
                      </span>
                    </template>
                    <!-- 显示字段 -->
                    <span v-else>{{ formParams[extraFields] || "-" }}</span>
                  </template>
                  <template v-else>
                    <hl-tooltip
                      :tooltipConfig="{
                        disabled: getToolTextDisabled(
                          materialConfig.substrNum,
                          formParams[name]
                        ),
                        content: subStrByNum(formParams[name]),
                      }"
                    >
                      <span slot="text">
                        {{
                          getFormatterVal(
                            subStrByNum(
                              formParams[name],
                              materialConfig.substrNum || 8,
                              ""
                            ),
                            materialConfig
                          )
                        }}</span
                      >
                    </hl-tooltip>
                  </template>
                </label>
              </div>
            </template>
          </template>

          <!-- 编辑控件 -->
          <template v-else>
            <!-- 普通输入框 -->
            <template v-if="type === 'input' || type === 'password'">
              <template v-if="bkConfig && bkConfig.inputLength">
                <hl-input
                  :class="{
                    'write-clear': extend.clearable !== false,
                    'form--edit': formConfig.layout !== 'flow',
                    'el-password': type === 'password',
                  }"
                  @handlerEnter="handlerEnter"
                  v-model.trim="formParams[name]"
                  :inputConfig="{
                    'show-password': type === 'password',
                    maxlength: extend.maxlength || bkConfig.inputLength || 100,
                    extend: extend,
                  }"
                >
                </hl-input>
              </template>
              <template v-else>
                <template v-if="bkConfig && bkConfig.inputLength">
                  <hl-input
                    :class="{
                      'write-clear': extend.clearable !== false,
                      'form--edit': formConfig.layout !== 'flow',
                      'el-password': type === 'password',
                    }"
                    @handlerEnter="handlerEnter"
                    v-model.trim="formParams[name]"
                    :inputConfig="{
                      'show-password': type === 'password',
                      extend: extend,
                    }"
                  >
                  </hl-input>
                </template>
              </template>
            </template>

            <!-- hlPassword -->
            <template v-else-if="type === 'hlPassword'">
              <hl-password
                :disabled="materialConfig.disabled"
                v-bind="extend"
                v-model="formParams[name]"
              ></hl-password>
            </template>
            <!-- 计数框 -->
            <template v-else-if="type === 'number'">
              <el-input-number
                :disabled="materialConfig.disabled"
                v-model="formParams[name]"
                v-bind="extend"
                class="form-number"
                v-on="extend"
              />
            </template>
            <!-- switch -->
            <template v-else-if="type === 'switch'">
              <el-switch
                v-model="formParams[name]"
                v-bind="extend"
                v-on="extend"
              >
              </el-switch>
            </template>

            <!-- 选择器 -->
            <template v-else-if="type === 'select'">
              <hl-select
                v-model="formParams[name]"
                :selectConfig="materialConfig"
              >
              </hl-select>
            </template>
            <!-- render -->
            <template v-else-if="type === 'render'">
              <form-material-render :row="formParams" v-bind="materialConfig" />
            </template>

            <!-- autocomplete -->
            <template v-else-if="type === 'autocomplete'">
              <hl-autocomplete
                :searchConfig="materialConfig"
                v-on:keyup.enter.native="materialConfig.extend.callback"
                v-model="formParams[name]"
              ></hl-autocomplete>
            </template>
            <!-- previousMenu 上级菜单 -->
            <template v-else-if="type === 'previousMenu'">
              <hl-previousMenu
                v-model="formParams[name]"
                :hasBorder="materialConfig.hasBorder || false"
                :menuConfig="materialConfig"
              />
            </template>
            <!-- iconSelect 图标选择 -->
            <template v-else-if="type === 'iconSelect'">
              <hl-iconSelect
                v-model="formParams[name]"
                :hasBorder="materialConfig.hasBorder || false"
              />
            </template>

            <!-- 带搜索 -->
            <template v-else-if="type === 'searchUrl'">
              <el-select
                v-model="formParams[name]"
                :class="{
                  'write-clear': extend.clearable !== false,
                  'el-search': true,
                }"
                :remote-method="(query) => getOptionsByQuery(query)"
                v-bind="
                  getMergedObject(extend, {
                    clearable: true,
                    placeholder: '请选择',
                    filterable: true,
                    remote: true,
                    reserveKeyword: true,
                  })
                "
                v-on="extend"
              >
                <el-option
                  v-for="option in materialConfig.options || []"
                  :key="option.value"
                  :label="setMaterialOptionsLabelByConfig(option, 'label')"
                  :value="setMaterialOptionsLabelByConfig(option, 'value')"
                />
              </el-select>
            </template>

            <!-- 级联选择器 -->
            <template v-else-if="type === 'cascader'">
              <el-cascader
                ref="cascader"
                v-model="formParams[name]"
                :options="materialConfig.options || []"
                :separator="materialConfig.separator || '/'"
                v-bind="
                  getMergedObject(extend, {
                    changeOnSelect: true,
                    placeholder: '请选择',
                    clearable: true,
                  })
                "
                @change="getCascaderSubset"
                v-on="extend"
              />
            </template>

            <!-- 多选 -->
            <template
              v-else-if="type === 'checkboxButton' || type === 'checkbox'"
            >
              <hl-checkbox
                :checkBoxConfig="materialConfig"
                v-model="formParams[name]"
              ></hl-checkbox>
            </template>
            <!-- 单选 -->
            <template v-else-if="type === 'radio' || type === 'radioBtn'">
              <hl-radio
                v-model="formParams[name]"
                :radioConfig="materialConfig"
              ></hl-radio>
            </template>

            <!-- 日期/时间选择/时间区间选择器/月份/周数/年份选择 -->
            <template
              v-else-if="
                type === 'date' ||
                type === 'datetime' ||
                type === 'daterange' ||
                type === 'datetimerange' ||
                type === 'monthrange' ||
                type === 'week' ||
                type === 'month' ||
                type === 'year'
              "
            >
              <hl-date
                v-model="formParams[name]"
                :dateConfig="materialConfig"
              ></hl-date>
            </template>

            <template v-else-if="type === 'address'">
              <address-select
                ref="address-select"
                v-model="formParams"
                :material-config="materialConfig"
              />
            </template>

            <!-- 文件上传 -->
            <template v-else-if="type === 'upload'">
              <d-upload
                v-model="formParams[name]"
                :readonly="
                  hasField(materialConfig, 'readonly')
                    ? materialConfig.readonly
                    : formConfig.readonly
                "
                v-bind="materialConfig"
                :max-size="materialConfig.maxSize"
                :extend="extend"
              />
            </template>
            <!-- 颜色选择 -->
            <template v-else-if="type === 'colorPicker'">
              <el-color-picker v-model="formParams[name]" />
            </template>
            <!-- 穿梭栏 -->
            <template v-else-if="type === 'transfer'">
              <el-transfer
                v-model="formParams[name]"
                :data="materialConfig.options"
                :props="materialConfig.props"
                v-bind="extend"
                v-on="extend"
              />
            </template>

            <!-- 文本域 -->
            <template v-else-if="type === 'textarea'">
              <el-input
                v-model="formParams[name]"
                v-bind="
                  getMergedObject(extend, {
                    placeholder: '请输入',
                    autosize: {
                      minRows: 1,
                      maxRows: 4,
                    },
                    resize: 'none',
                  })
                "
                type="textarea"
                v-on="extend"
              />
            </template>

            <!-- 富文本 -->
            <template v-else-if="type === 'editor'">
              <d-editor
                v-model="formParams[name]"
                :readonly="materialConfig.disabled || materialConfig.readonly"
              />
            </template>
          </template>

          <!-- 附加按钮 -->
          <template v-if="materialConfig.button">
            <hl-button
              :style="materialConfig.button.extend"
              :buttonConfig="materialConfig.button"
            ></hl-button>
          </template>

          <!-- 附加的后置文本 -->
          <template v-if="materialConfig.textAfter">
            <template v-if="materialConfig.textAfter.render">
              <form-material-render v-bind="materialConfig.textAfter" />
            </template>
            <template v-else-if="materialConfig.textAfter.tips">
              <el-tooltip
                :content="materialConfig.textAfter.tips"
                class="item text-after"
                v-bind="getMergedObject(extend.textAfter)"
                effect="light"
                placement="bottom"
              >
                <span
                  v-popover:tips
                  class="icon icon-primary iconfont iconwenti"
                />
              </el-tooltip>
            </template>
            <template v-else>
              <span
                v-bind="getMergedObject(extend.textAfter)"
                class="text-after"
                v-html="materialConfig.textAfter"
              />
            </template>
          </template>
        </template>
      </div>
    </el-form-item>
  </div>
</template>

<script>
import {
  getMergedObject,
  nameMatchType,
  allKeysValueExpected,
  subStrByNum,
  hasField,
  formatDateEL,
  isDate,
} from "@/utils/util";
import dEditor from "./editor.vue";
import addressSelect from "./address-select.vue";
import dUpload from "./upload/index.js";
import hlButton from "./../hl-button";
import Lodash from "lodash";
import formMaterialRender from "./../common/render";

export default {
  name: "hlFormMaterial",
  components: { dEditor, dUpload, addressSelect, hlButton, formMaterialRender },
  props: {
    // 元件配置
    materialConfig: {
      type: Object,
      required: true,
    },
    // 表单所有元件参数
    formParams: {
      type: Object,
      required: true,
    },
    // 全局表单配置
    formConfig: {
      type: Object,
      default: () => ({}),
    },
    // 支持所有elementUI组件的配置
    extend: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    const bkConfig = this.$root.bkConfig || this.$bkConfig;
    const { http } = this.materialConfig;
    return {
      bkConfig,
      getMergedObject,
      url: http ? http.url : "",
      hasField,
      targetOptions: "",
      yearFormat: "yyyy", // 年
      yearMonthFormat: "yyyy-MM", // 年-月
      yearMonthDayFormat: "yyyy-MM-dd", // 年-月-日
      timeValueFormat: "yyyy-MM-dd HH:mm:ss", // 年-月-日 时:分:秒 格式
      optionsLabelList: [], // 从options里找到value对应的label组成的数组
      materialOptionsLabel: "", // 从options里找到value对应的label，用于只读时显示
      optionsTypeList: [
        "select",
        "search",
        "checkbox",
        "radio",
        "cascader",
        "transfer",
      ], // 需要初始化options字段的type类型
      typeArrayList: [
        "cascader",
        "checkbox",
        "transfer",
        "areaselect",
        "listselect",
        "tag",
        "daterange",
        "monthrange",
        "datetimerange",
      ], // 数据类型为数组的列表
      timeArrayList: ["daterange", "monthrange", "datetimerange"], // 日期值为数组的类型
      // 下面是解构materialConfig的高频属性，避免在模板中写太多重复字段
      materialParam: "",
      name: "", // 组件唯一标识
      type: "", // 组件类型
      props: "", // 自定义label和value的key
      extraFields: "", // 额外自定义字段
    };
  },
  watch: {
    formParams: {
      handler() {
        // 表单值发生变化时告知父元素
        this.$emit("formParamsChange", this.formParams);
        this.setMaterialReadLabel();
      },
      deep: true,
    },
    optionsLabelList: {
      handler(val) {
        this.materialOptionsLabel = val.join(
          this.materialConfig.separator || " / "
        );
      },
      deep: true,
    },
  },
  created() {
    // 重新将materialConfig的属性解构赋值，避免在模板中写太多重复字段
    const { name, type, props, extraFields, options, http } =
      this.materialConfig;
    this.name = name;
    this.type = type;
    this.props = props;
    this.extraFields = extraFields;
    this.listResKey =
      (http && http.responseListProps && http.responseListProps.results) ||
      this.bkConfig.responseListProps.results;
    this.listDataKey =
      (http && http.responseProps && http.responseProps.data) ||
      this.bkConfig.responseProps.data;

    if (!Array.isArray(options) && this.optionsTypeList.includes(type)) {
      this.$set(this.materialConfig, "options", []);
    }
    this.initConfig(this.materialConfig);

    // 解决bk-list嵌套bk-form-material时数据回显问题
    if (Array.isArray(extraFields) && this.timeArrayList.includes(type)) {
      const arr = [];
      extraFields.forEach((key) => {
        if (this.formParams[key]) arr.push(this.formParams[key]);
      });
      if (arr.length === extraFields.length) this.formParams[name] = arr;
    }
    this.materialParam = this.formParams[name];
  },
  mounted() {
    this.flowLayoutCalculate();
    window.addEventListener("resize", this.flowLayoutCalculate);
  },
  unmounted() {
    window.removeEventListener("resize", this.flowLayoutCalculate);
  },
  methods: {
    subStrByNum,
    formatDateEL,
    isDate,
    getToolTextDisabled(num, content) {
      const length = content ? content.toString().length : 0;
      return (num || 8) > length;
    },
    getFormatterVal(value, form) {
      const { formatter, options, type, extend } = form;
      const { noDefault } = extend || {};
      if (!formatter)
        return value || (type === "text" && !noDefault ? "—" : "");
      if (!Array.isArray(options)) return value;
      if (options) {
        const result = options.find((item) => item.value == value);
        return result ? result.label : "";
      }
    },
    flowLayoutCalculate() {
      const { layout } = this.formConfig;

      if (layout !== "flow") {
        return;
      }
      let el = this.$el;
      while (el && el.nodeName !== "FORM") {
        el = el.parentNode;
      }
      if (el.nodeName !== "FORM") {
        return;
      }
      const { clientWidth } = el;
      let { grid } = this.materialConfig;
      if (!grid) {
        grid = 1;
      }
      const formMaterial = this.$el.parentNode;
      // 在表格的筛选块里，表单的margin-right是有值的，以此区别现在表单是否bk-list里的，避免修改bk-list的
      if (this.formConfig.searchConfig) {
        return;
      }
      const divide = parseInt(clientWidth / grid, 10);
      const rowPad = 48;
      if (this.bkConfig.labelPosition) {
        // 供应链金融模式下
        formMaterial.style.width = `${parseInt(divide - rowPad * 2.5, 10)}px`;
        formMaterial.style.paddingLeft = `${rowPad}px`;
      }
    },
    /**
     * 设置只读模式下的表单内容
     */
    setMaterialReadLabel() {
      this.materialParam = this.formParams[this.name];
      const {
        type,
        options,
        props,
        separator,
        contentSeparator,
        targetKeys,
        extraFields,
      } = this.materialConfig;
      // 处理options显示value对应的label
      if (Array.isArray(options)) {
        // option编码值的键，默认为label
        const labelKey = props && props.label ? props.label : "label";
        // option显示值的键，默认为value
        const valueKey = props && props.value ? props.value : "value";
        // 子集标识，默认为children
        const childrenKey =
          props && props.children ? props.children : "children";
        if (Array.isArray(this.materialParam)) {
          const tmpOptionsLabel = [];
          // 循环遍历options，有子节点继续遍历
          const iterate = (opts, labelList) => {
            opts.forEach((item) => {
              if (this.materialParam.indexOf(item[valueKey]) > -1) {
                labelList.push(item[labelKey]);
                if (
                  Array.isArray(item[childrenKey]) &&
                  item[childrenKey].length > 0
                ) {
                  iterate(item[childrenKey], labelList);
                }
              }
            });
          };
          iterate(options, tmpOptionsLabel);
          this.materialOptionsLabel = tmpOptionsLabel.join(separator || "；");
        } else {
          const obj = options.find(
            (item) => item[valueKey] === this.materialParam
          );
          this.materialOptionsLabel = obj ? obj[labelKey] : "";
        }
      } else if (type === "tag" && Array.isArray(this.materialParam)) {
        const tmpOptionsLabel = [];
        this.materialParam.forEach((tag) => {
          if (typeof tag === "object") {
            if (Array.isArray(targetKeys)) {
              const itemLabel = [];
              targetKeys.forEach((key) => {
                if (tag[key] !== undefined && tag[key] !== null)
                  itemLabel.push(tag[key]);
              });
              tmpOptionsLabel.push(
                itemLabel.join(contentSeparator || "\xa0\xa0\xa0\xa0")
              );
            } else {
              tmpOptionsLabel.push(tag.label);
            }
          } else {
            tmpOptionsLabel.push(tag);
          }
        });
        this.materialOptionsLabel = tmpOptionsLabel.join(separator || "；");
      } else if (
        !this.materialParam &&
        this.timeArrayList.includes(type) &&
        Array.isArray(extraFields)
      ) {
        const normalFlag = extraFields.every(
          (key) => this.formParams[key] || this.formParams[key] === 0
        );
        if (!normalFlag) return;
        this.materialParam = [
          this.formParams[extraFields[0]],
          this.formParams[extraFields[1]],
        ];
      }
    },

    /**
     * 只读模式下时间格式化成配置的格式
     * @param {Object} type  时间类型
     * @param {Object} type  时间区间的起始1或结束2
     */
    formatTimeReadonly(type, index) {
      const { materialParam, extend, valueFormat } = this;

      if (index && !Array.isArray(materialParam)) return "";

      // 时间值
      const value = index ? materialParam[index - 1] : materialParam;

      if (!value) return "";

      const defaultFormat = {
        datetime: this.timeValueFormat,
        year: this.yearFormat,
        month: this.yearMonthFormat,
        date: this.yearMonthDayFormat,
        monthrange: this.yearMonthFormat,
        daterange: this.yearMonthDayFormat,
        datetimerange: this.timeValueFormat,
      };
      if (typeof value === "number") {
        return formatDateEL(value, defaultFormat[type]);
      }
      return formatDateEL(
        value,
        valueFormat || (extend && extend.valueFormat) || defaultFormat[type]
      );
    },
    /**
     * 初始化配置
     * @param {Object} materialConfigF  元组件配置
     */
    initConfig() {
      const { materialConfig, formParams } = this;
      const {
        http,
        type,
        name,
        disabled,
        depend,
        required,
        rules = [],
      } = materialConfig;
      const nullValue = this.typeArrayList.includes(type) ? [] : "";
      let value =
        materialConfig.value !== undefined ? materialConfig.value : nullValue;
      value =
        formParams[name] !== undefined &&
        formParams[name] !== null &&
        formParams[name] !== "" &&
        JSON.stringify(formParams[name]) !== "[]"
          ? formParams[name]
          : value;

      // 默认必填校验规则
      const tipList = [
        "input",
        "password",
        "autocomplete",
        "textarea",
        "editor",
      ];
      const tipLabel = tipList.includes(type) ? "输入" : "选择";
      const rulesConfig = !Array.isArray(rules) ? [rules] : rules;
      if (required && !rulesConfig.find((item) => item.required)) {
        materialConfig.rules = [
          {
            required: true,
            message: `请${tipLabel}`,
            trigger: ["blur", "change"],
          },
          ...rulesConfig,
        ];
      }

      // 元组件未配置禁用时使用全局的禁用配置
      if (this.formConfig.disabled !== undefined && disabled === undefined) {
        this.setInlineInheritDisabled(materialConfig);
      }

      // 添加value监控值
      if (name) {
        this.$set(formParams, name, value);
        this.setMaterialReadLabel();
      }

      // 关联操作
      if (depend) {
        if (Array.isArray(depend.name)) {
          // 多个关联
          depend.name.forEach((key) => {
            this.setRelevantWatch(key, materialConfig);
          });
        } else {
          // 单个关联
          this.setRelevantWatch(depend.name, materialConfig);
        }
      }

      // if (type === "cascader") {
      //   this.$watch("materialConfig.level", () => {
      //     this.getOptions();
      //   });
      // }
    },

    /**
     * 设置禁用状态
     * @param {Object} materialConfigF  元组件配置
     */
    setInlineInheritDisabled(materialConfigF) {
      const materialConfig = materialConfigF;
      this.$set(materialConfig, "disabled", this.formConfig.disabled);
      this.$watch("formConfig.disabled", (val, oldVal) => {
        if (val === oldVal) return;
        materialConfig.disabled = val;
      });
    },

    /**
     * 关联设置watch
     * @param {String} name
     * @param {Object} materialConfig
     */
    setRelevantWatch(name, materialConfig) {
      this.$watch(
        () => this.formParams[name],
        (val) => {
          const { depend, http, options } = materialConfig;
          const { value, clearSwitch, onChange } = depend;
          const { url } = http || {};

          // 联动时自动清空
          if (clearSwitch !== false) {
            let toClearFlag = true;
            // value存在时，依赖的字段完全匹配value值时才清空
            if (value) {
              toClearFlag = allKeysValueExpected({
                value,
                name: depend.name,
                formParamisArray: this.formParamisArray,
                formParams: this.formParams,
              });
            }
            if (
              value === undefined ||
              value === null ||
              (value && toClearFlag)
            ) {
              if (Array.isArray(this.formParams[materialConfig.name])) {
                this.formParams[materialConfig.name] = [];
              } else {
                this.formParams[materialConfig.name] = "";
              }
            }
          }
          if (onChange instanceof Function) onChange(val, this);
          if (url && Array.isArray(options) && !options.length) {
            this.getOptions();
          }
          this.$emit("dependOnChange", materialConfig);
        }
      );
    },

    /**
     * 根据配置获取远程数据
     * @param {String} query 请求条件参数
     * * @param {Function} callback 请求成功后的回调函数
     */
    getOptions(query = "", callback) {
      const { http } = this.materialConfig;
      const { url, method, onBefore } = http || {};
      let realParams = "";

      if (typeof onBefore === "function") {
        realParams = onBefore(query, this);
      } else {
        realParams = this.dealParmasBeforeGetOptions(query);
      }
      if (realParams === false) return;

      if (!url) return;
      // 发送请求
      this.sendGetOptionsRequest(
        {
          url,
          data: realParams,
          method: method || "post",
        },
        callback
      );
    },

    /**
     * 根据输入内容获取远程数据
     * @param {Object} query 输入内容
     */
    getOptionsByQuery(query = "") {
      const { http } = this.materialConfig;
      const { url, method, onBefore } = http || {};
      let realParams = "";

      if (typeof onBefore === "function") {
        realParams = onBefore(query, this);
      } else {
        realParams = this.dealParmasBeforeGetOptions(query);
      }
      if (realParams === false) return;

      if (!url) return;

      // 发送请求
      this.sendGetOptionsRequest({
        params: realParams,
        url,
        method: method || "get",
      });
    },

    /**
     * 请求前处理参数
     * @param {Object} query 输入内容
     */
    dealParmasBeforeGetOptions(query) {
      const { params } = this.materialConfig.http || {};

      let realParams;

      // 请求参数，default字段用来更改默认传输数据的字段名，如果设置，默认传输数据的字段名为query
      if (params && params.default) {
        let value = "";
        if (hasField(params, "defaultValue")) value = params.defaultValue;
        realParams = {
          ...params,
          [params.default]: query || value,
        };
        delete realParams.default;
        if (hasField(params, "defaultValue")) delete realParams.defaultValue;
      } else if (params) {
        realParams = {
          ...params,
          query,
        };
      } else {
        realParams = {
          query,
        };
      }

      return realParams;
    },

    /**
     * 发送请求
     * @param {Object} request 请求相关配置
     * @param {Function} callback 请求成功的回调函数
     */
    sendGetOptionsRequest(request, callback) {
      const { type, http, props, level, loadModel } = this.materialConfig;
      const { onSuccess, onFaild } = http || {};
      this.$fetch(request).then((res) => {
        if (!res) {
          if (typeof onFaild === "function") onFaild(res, this);
          return;
        }
        const data = res[this.listDataKey];

        let options = [];
        if (Array.isArray(data)) {
          options = data;
        } else if (data && Array.isArray(data[this.listResKey])) {
          options = data[this.listResKey];
        }

        const childrenKey =
          props && props.children ? props.children : "children";
        if (type === "cascader") {
          // 设置返回的下级数据是否显示含有子集的向右箭头
          if (loadModel === "onceAll") {
            this.dealCascaderOnceAllOptionsDependLevel({
              options,
              childrenKey,
              level,
            });
          } else {
            this.dealCascaderOptionHasSubset(
              options,
              level > 1 || level === undefined
            );
          }
        }

        if (typeof onSuccess === "function") {
          options = onSuccess(res, this) || options;
        }

        this.materialConfig.options = options;
        this.setMaterialReadLabel();
        // 关联赋值使用
        if (typeof callback === "function") callback(options);
      });
    },

    /**
     * @Description 普通按钮点击事件
     * @param {Object} button  按钮配置
     */
    handleBtnClick(button) {
      if (button.target) {
        this.$emit("btnClick", button);
      } else if (button.callback && typeof button.callback === "function") {
        // 自定义回调
        button.callback(this);
      }
    },

    /**
     * @Description 根据配置的属性获取数据对象的值
     * @params [Object] obj 数据对象
     * @params [String] key 配置的属性值
     */
    setMaterialOptionsLabelByConfig(obj, key) {
      const { props, type, valueObj } = this.materialConfig;

      // 针对select多选时值为选中的整个数据对象
      if (type === "select" && key === "value" && valueObj) {
        return obj;
      }
      if (props && props[key]) {
        return obj[props[key]];
      }
      return obj[key];
    },

    // 拼接字符串
    combiningStr(label, i, item) {
      return `${label}${
        i < this.formParams[item.extraFields].length - 1 ? "、" : ""
      }`;
    },

    /**
     * 级联多级选择,选中时触发，并发起请求，若返回存在则添加子集，无则设置值并去除 children
     * @param {Array} val 获得Cascader 传回来的value
     */
    getCascaderSubset(val) {
      const { materialConfig } = this;
      const { props, level, options, loadModel } = materialConfig;
      const readonly = hasField(materialConfig, "readonly")
        ? materialConfig.readonly
        : this.formConfig.readonly;
      // 获得设置的props value字段
      const valueKey = props && props.value ? props.value : "value";
      const labelKey = props && props.label ? props.label : "label";
      const childrenKey = props && props.children ? props.children : "children";

      // 获得选中值
      const obj = this.getSelectCascaderObj(val);

      if (!obj) return;

      // 只读模式下获取value对应的label
      if (readonly) {
        if (loadModel !== "onceAll") {
          this.optionsLabelList.push(obj[labelKey]);
        } else {
          this.setCascaderOnecAllReadLabel({
            options,
            val,
            valueKey,
            labelKey,
            childrenKey,
          });
        }
      }

      if (loadModel === "onceAll") return;

      // 加载下一级
      if (Array.isArray(obj[childrenKey])) {
        const value = obj[valueKey];

        this.sendGetCascaderSubsetRequest(value, (res) => {
          if (!res) return;

          // 避免重复加载
          let { data } = res;
          if (data && Array.isArray(data[this.listResKey])) {
            data = data[this.listResKey];
          }
          // 处理数据，是否有含子集的效果
          this.dealCascaderOptionHasSubset(
            data,
            level - 2 > obj.index || level === undefined
          );
          // 赋值
          if (data.length) {
            obj[childrenKey] = data;
          } else {
            this.$refs.cascader.menuVisible = false;
            delete obj[childrenKey];
          }
          // 目标不是最后一级继续加载
          if (value !== val[val.length - 1]) {
            this.getCascaderSubset(val);
          }
        });
      }
    },

    /**
     * 对级联返回的下级数据进行处理，基于是否存在子集的条件来决定该数据是否允许后续请求
     * @param {Array} options 请求返回的下级数据
     * @param {Boolean} hasNextLevel 是否有下一级
     */
    dealCascaderOptionHasSubset(options, hasNextLevel = true) {
      const { props, subsetDepend, loadModel } = this.materialConfig;
      const { name, value } = subsetDepend || {};
      const childrenKey = props && props.children ? props.children : "children";
      options.forEach((option) => {
        if (hasNextLevel) {
          if (loadModel === undefined || loadModel === "noFlag") {
            option[childrenKey] = [];
            return;
          }
          if (
            !(subsetDepend instanceof Object) ||
            !name ||
            value === undefined ||
            value === null
          )
            return;
          if (option[name] !== value) {
            delete option[childrenKey];
          } else {
            option[childrenKey] = [];
          }
        } else {
          delete option[childrenKey];
        }
      });
    },

    /**
     * 根据cascader的level格式化onceAll一次性请求回的数据结构
     * @param {Object} objF 涉及到数据处理的相关字段
     * @param {Number} i 遍历数据的层级
     */
    dealCascaderOnceAllOptionsDependLevel(objF, i = 1) {
      const { options, childrenKey, level } = objF;
      options.forEach((option) => {
        if (!Array.isArray(option[childrenKey])) return;
        if (
          (i < level || level === undefined) &&
          option[childrenKey].length > 0
        ) {
          this.dealCascaderOnceAllOptionsDependLevel(
            {
              options: option[childrenKey],
              childrenKey,
              level,
            },
            i + 1
          );
        } else {
          delete option[childrenKey];
        }
      });
    },

    /**
     * 获取当前被选中的级联option数据对象
     * @param {String} val 选中目标
     * @param {Array} options 级联选项
     * @param {Number} i 索引字段，递归自增
     */
    getSelectCascaderObj(val, options = this.materialConfig.options, i = 0) {
      if (!Array.isArray(val)) return false;
      // 获得设置的props value字段
      const valueKey =
        this.materialConfig.props && this.materialConfig.props.value
          ? this.materialConfig.props.value
          : "value";
      const childrenKey =
        this.materialConfig.props && this.materialConfig.props.children
          ? this.materialConfig.props.children
          : "children";
      const subOption = options.find((cell) => cell[valueKey] === val[i]);

      if (subOption) subOption.index = i;
      if (
        subOption &&
        Array.isArray(val) &&
        val.length > i + 1 &&
        Array.isArray(subOption[childrenKey]) &&
        subOption[childrenKey].length
      ) {
        return this.getSelectCascaderObj(val, subOption[childrenKey], i + 1);
      }
      return subOption;
    },

    /**
     * 获取cascader的options数据
     * @param {Array} value 请求参数，即选中的值
     * @param {Function} cb 请求成功的回调函数
     */
    sendGetCascaderSubsetRequest(value, cb) {
      const { url, method, params } = this.materialConfig.http || {};
      if (!url) return;

      // 获取发送下级数据的请求字段名
      const idFeild = params && params.default ? params.default : "value";
      // 删除无用字段
      const realParams = {
        ...params,
        [idFeild]: value || (params && params.defaultValue),
      };
      if (realParams && realParams.default) delete realParams.default;
      if (realParams && realParams.defaultValue) delete realParams.defaultValue;
      // 请求远程下级数据
      this.$fetch({
        url,
        params: realParams,
        method: method || "get",
      }).then((res) => {
        if (res && typeof cb === "function") cb(res);
      });
    },

    /**
     * 针对onceAll情况，只读状态下cascader的回显数据处理
     * @param {Object} objF 涉及到数据处理的相关字段
     * @param {Number} i 循环遍历的索引
     */
    setCascaderOnecAllReadLabel(objF, i = 0) {
      const { val, options, valueKey, labelKey, childrenKey } = objF;
      if (!Array.isArray(options)) return;
      const obj = options.find((option) => option[valueKey] === val[i]);
      if (!obj) return;
      if (obj[labelKey]) {
        this.optionsLabelList.push(obj[labelKey]);
      }
      if (Array.isArray(obj[childrenKey])) {
        this.setCascaderOnecAllReadLabel(
          {
            options: obj[childrenKey],
            val,
            valueKey,
            labelKey,
            childrenKey,
          },
          i + 1
        );
      }
    },

    /**
     * 清空当前组件的表单内容
     */
    empty() {
      let value = "";
      // 当前数据
      const current = this.formParams[this.materialConfig.name];
      if (current instanceof Array) {
        value = [];
      } else if (current instanceof Object) {
        value = {};
      }

      this.formParams[this.materialConfig.name] = value;
    },

    /**
     * 根据name找到对应的元组件，判断表单值是否为数组类型
     * @param {String} name 匹配元组件的依赖值
     */
    formParamisArray(name) {
      return this.typeArrayList.includes(nameMatchType(name, this.formConfig));
    },

    /**
     * 计算label的宽度
     */
    calculateLabelWidth() {
      const { materialConfig, formConfig } = this;
      const { extend: materialExtend } = materialConfig;
      const { extend: formExtend } = formConfig;

      if (materialExtend && materialExtend.labelWidth) {
        return {
          width: materialExtend.labelWidth,
        };
      }
      if (formExtend && formExtend.labelWidth) {
        return {
          width: formExtend.labelWidth,
        };
      }
      return {
        width: "120px",
      };
    },

    /**
     * type为tag类型的label显示文案处理方法
     * @param {Object || String} tag tag类型的每个标签的数据
     * @param {Object} materialConfig 表单元组件配置
     */
    formatTagLabel(tag, materialConfig) {
      const { targetKeys, contentSeparator } = materialConfig;
      if (typeof tag === "object") {
        if (Array.isArray(targetKeys)) {
          const labelList = [];
          targetKeys.forEach((key) => {
            if (tag[key] !== undefined && tag[key] !== null)
              labelList.push(tag[key]);
          });
          return labelList.join(contentSeparator || "\xa0\xa0\xa0\xa0");
        }
        return tag.label;
      }
      return tag;
    },
    /**
     * type为tag类型的标签点击事件
     * @param {Object} tag tag 配置
     * @param {Object} objT tag类型的表单数据值
     */
    handleTagClick(tag, objT) {
      if (tag.callback && typeof tag.callback === "function") {
        tag.callback(objT);
      }
    },
    /**
     * type为tag类型的标签关闭事件
     * @param {Array} value tag类型的表单数据值
     * @param {Number} i 要删除的数据索引
     */
    handleTagClose(value, i) {
      value.splice(i, 1);
    },

    /**
     * 时间区域选择控件
     */
    handleTimeChange(val, materialConfig) {
      // 解决
      // bk-contrast初始化数据不触发change
      // extraFields为数组选中后给results赋值其他字段时不清空
      // 以上两者之间的冲突问题
      const { extraFields } = materialConfig;
      if (Array.isArray(extraFields)) {
        extraFields.forEach((key, i) => {
          if (val !== null) {
            this.formParams[key] = val[i];
            // this.formParams[key] = ''; // 处理控件清空值时val的为空的情况
          }
        });
      }
    },

    /**
     * autocomplete数据请求
     */
    querySearchAsync(queryString, cb) {
      const { props = {} } = this.materialConfig;
      const { value = "value" } = props;
      this.getOptions(queryString, (options) => {
        const results = (Array.isArray(options) && options) || [];
        results.forEach((item) => {
          item.value = item[value];
        });
        cb(results);
      });
    },
    handlerEnter: Lodash.debounce(function () {
      this.$emit("handlerEnter");
    }, 300),
  },
};
</script>
