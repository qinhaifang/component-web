<template>
  <el-table-column
    v-if="Array.isArray(data.data)"
    :key="data.name"
    :prop="data.name"
    v-bind="
      getMergedObject(data.extend, {
        'show-overflow-tooltip': true,
        align: 'left',
        label: data.label,
        minWidth: data.minWidth || '165px',
      })
    "
  >
    <hlRecursiveTitle
      v-for="item in data.data"
      :key="item.name"
      v-if="item.visible !== false"
      v-bind="{
        rowKey: rowKey,
        data: item,
        formConfigs: formConfigs,
        dialogConfig: dialogConfig,
        dialogVisible: dialogVisible,
      }"
    />
  </el-table-column>
  <!-- 行内按钮 -->
  <el-table-column
    v-else-if="data.scene"
    :key="data.name"
    :prop="data.name"
    :label="data.label"
    :fixed="data.fixed"
    :width="data.width"
    v-bind="
      getMergedObject(data.extend, {
        'show-overflow-tooltip': true,
        align: 'left',
        sortable: 'custom',
        minWidth: data.minWidth || '165px',
      })
    "
  >
    <template slot-scope="scope">
      <hl-button
        :tableRow="scope.row"
        :buttonConfig="data"
        class="cell-btn-item"
      />
    </template>
  </el-table-column>
  <!-- 自定义配置项 -->
  <el-table-column
    v-else-if="data.formatter"
    :key="data.name"
    :prop="data.name"
    :label="data.label"
    :fixed="data.fixed"
    :width="data.width"
    v-bind="
      getMergedObject(data.extend, {
        'show-overflow-tooltip': true,
        align: 'left',
        sortable: 'custom',
        minWidth: data.minWidth || '165px',
      })
    "
  >
    <template slot-scope="scope">
      {{ getFormatterVal(data.options, scope.row[data.name]) }}
    </template>
  </el-table-column>

  <!--  表单 -->
  <el-table-column
    v-else-if="data.formExtend"
    :key="data.name"
    :prop="data.name"
    v-bind="
      getMergedObject(data.extend, {
        label: data.label,
        align: 'left',
        sortable: 'custom',
        minWidth: data.minWidth || '165px',
      })
    "
  >
    <template slot-scope="scope">
      <el-form
        :ref="`list_form_${data.name}_${scope.row[rowKey]}`"
        :model="scope.row"
        @submit.native.prevent
        class="form-wrapper"
      >
        {{ getFormConfig(formConfigs[scope.row[rowKey]], data.name).exten }}

        <hl-form-material
          :key="data.name"
          :ref="`${data.name}_${scope.row[rowKey]}`"
          :materialConfig="
            getFormConfig(formConfigs[scope.row[rowKey]], data.name)
          "
          :formConfig="formConfigs[scope.row[rowKey]]"
          :formParams="scope.row"
          :extend="
            getFormConfig(formConfigs[scope.row[rowKey]], data.name).extend ||
            getFormConfig(formConfigs[scope.row[rowKey]], data.name)
          "
          v-on="
            getFormConfig(formConfigs[scope.row[rowKey]], data.name).extend ||
            getFormConfig(formConfigs[scope.row[rowKey]], data.name)
          "
        />
      </el-form>
    </template>
  </el-table-column>
  <!-- 自定义 -->
  <el-table-column
    v-else-if="data.render"
    :key="data.name"
    :prop="data.name"
    v-bind="
      getMergedObject(data.extend, {
        label: data.label,
        align: 'left',
        sortable: 'custom',
        minWidth: data.minWidth || '165px',
      })
    "
  >
    <template slot-scope="scope">
      <table-columns-render :row="scope.row" v-bind="data" />
    </template>
  </el-table-column>
  <el-table-column
    v-else
    :key="data.name"
    :prop="data.name"
    v-bind="
      getMergedObject(data.extend, {
        label: data.label,
        'show-overflow-tooltip': true,
        align: 'left',
        sortable: 'custom',
        minWidth: data.minWidth || '165px',
        width: data.width,
      })
    "
  >
    <template slot-scope="scope">
      {{
        scope.row[data.name] || scope.row[data.name] === 0
          ? scope.row[data.name]
          : "—"
      }}
    </template>
    <template slot="header" slot-scope="scope">
      <span :class="data.extend ? data.extend.classExtend : ''">
        <span>{{ data.label }}</span>
        <el-input
          class="scopeHeaderInput"
          v-if="data.scopeHeader"
          v-model="tableHeaderSearch[data.name]"
          @input="data.callback(tableHeaderSearch[data.name])"
          size="mini"
          placeholder="请输入"
        />
      </span>
    </template>
  </el-table-column>
</template>

<script>
import hlFormMaterial from "./../../hl-formMeterial/index.vue";

import hlRecursiveTitle from "./recursive-title";
import {
  getMergedObject,
  isEmptyObj,
  stringIsHTML,
  hasField,
} from "@/utils/util";
import tableColumnsRender from "./render";
import hlButton from "./../../hl-button";
export default {
  name: "hlRecursiveTitle",
  components: {
    tableColumnsRender,
    hlRecursiveTitle,
    hlFormMaterial,
    hlButton,
  },
  data() {
    return {
      tableHeaderSearch: {},
    };
  },
  props: {
    rowKey: {
      type: String,
      default: "",
    },
    dialogVisible: {
      type: Object,
      default: () => ({}),
    },
    dialogConfig: {
      type: Object,
      default: () => ({}),
    },
    data: {
      type: Object,
      default: () => ({}),
    },
    formConfigs: {
      type: Object,
      default: () => ({}),
    },
  },
  methods: {
    getMergedObject,
    isEmptyObj,
    stringIsHTML,
    hasField,
    /**
     * 获得表单name对应的配置
     * @param {object} formConfig 表单配置
     */
    getFormConfig(formConfig, name) {
      return formConfig.data.find((i) => i.name === name) || {};
    },
    getFormatterVal(options, value) {
      if (!Array.isArray(options)) return;
      if (options) {
        const result = options.find((item) => item.value === value);
        return result ? result.label : "—";
      }
    },
  },
};
</script>
