<template>
  <div class="hl-date">
    <el-date-picker
      v-model="dateValue"
      popper-class="hl-date-picker"
      :type="dateConfig.type || 'date'"
      v-bind="
        getMergedObject(dateConfig.extend ? dateConfig.extend : dateConfig, {
          placeholder: '选择日期',
          valueFormat: formatFun(),
          format: formatFun(),
          rangeSeparator: '至',
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
          editable: true,
          clearIcon: 'el-icon-close',
          pickerOptions: pickerOptions,
        })
      "
      v-on="getMergedObject(dateConfig.extend, {})"
    ></el-date-picker>
  </div>
</template>

<script>
import { getMergedObject } from "@/utils/util";
import { shortcuts } from "./pickerOptions";
export default {
  name: "hlDate",
  props: {
    value: {
      type: [String, Array],
      default: "",
    },
    dateConfig: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      dateValue: "",
      pickerOptions: {
        shortcutsNew: [],
      },
    };
  },
  watch: {
    dateValue: function (newVal) {
      this.$emit("input", newVal);
    },
    value: function (newVal) {
      this.dateValue = newVal;
    },
  },
  methods: {
    getMergedObject,
    formatFun() {
      const type = this.dateConfig.extend
        ? this.dateConfig.extend.type
        : this.dateConfig.type;
      switch (type) {
        case "week":
          return "yyyy-MM-dd";
        case "month":
          return "yyyy-MM";
        case "year":
          return "yyyy";
        case "daterange":
          return "yyyyyy-MM-dd";
        default:
          return "yyyy-MM-dd";
      }
    },
  },
  mounted() {
    if (this.value) {
      this.dateValue = this.value;
    }
  },
  created() {
    this.pickerOptions.shortcutsNew = shortcuts;
  },
};
</script>

<style lang="scss">
@import "../../theme-chalk/src/common/var.scss";
.el-input__inner {
  border-radius: 2px;
}
.hl-date {
  width: 100%;
}
.hl-date-picker {
  .available.current span {
    border-radius: 2px 0 0 2px;
  }
  .el-date-table {
    td.today span {
      font-weight: normal;
    }
  }
  .el-date-table td.end-date span,
  .el-date-table td.start-date span {
    color: #fff;
    border-radius: 2px 0 0 2px;
  }

  .el-picker-panel__footer {
    padding-right: 25px;
  }

  .el-button.el-picker-panel__link-btn.el-button--default.el-button--mini.is-plain {
    border: none;

    padding: 0;
  }
}
</style>
<style lang="scss" scoped>
@import "../../theme-chalk/src/common/var.scss";
.hl-date {
  ::v-deep .el-input__prefix {
    left: 10px;
  }
  ::v-deep .el-input__suffix {
    right: 10px;
  }
  ::v-deep .el-input__icon,
  ::v-deep .el-input__icon {
    // line-height: 28px;
    // width: 15px;
    // font-size: 15px;
  }
  ::v-deep .el-range-editor--mini .el-range__icon,
  ::v-deep .el-range-editor--mini .el-range__close-icon {
    line-height: 18px;
  }
  ::v-deep .el-input__inner {
    // padding: 0px 10px 0 32px !important;
  }
  ::v-deep .el-range-editor.el-input__inner {
    // padding: 0 15px !important;
  }
  ::v-deep .el-date-editor {
    width: 100%;
  }
  ::v-deep .el-date-editor .el-range-separator {
    width: auto;
  }
}
</style>
