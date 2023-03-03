<template>
  <div class="hl-input">
    <el-input
      @keyup.enter.native="handlerEnter"
      v-model="inputVal"
      :style="{ width: width + 'px' || '' }"
      v-bind="
        getMergedObject(inputConfig.extend ? inputConfig.extend : inputConfig, {
          placeholder: '请输入',
          type: 'text',
          maxlength: 30,
        })
      "
      v-on="
        getMergedObject(inputConfig.extend ? inputConfig.extend : inputConfig)
      "
    >
      <template
        slot="append"
        v-if="
          inputConfig.hasOwnProperty('extend') &&
          inputConfig.extend.hasOwnProperty('appendValue')
        "
        >{{ inputConfig.extend.appendValue }}</template
      >
      <i
        v-if="
          inputConfig.hasOwnProperty('extend') &&
          inputConfig.extend.hasOwnProperty('suffixVisible')
        "
        :class="inputConfig.extend.suffixIcon"
      ></i>
      <i
        v-if="
          inputConfig.hasOwnProperty('extend') &&
          inputConfig.extend.hasOwnProperty('prefixVisible')
        "
        :class="inputConfig.extend.prefixIcon"
      ></i>
    </el-input>

    <template v-if="inputConfig.textAfter">
      <span v-bind="inputConfig.extend">
        {{ inputConfig.textAfter }}
      </span>
    </template>
  </div>
</template>

<script>
import { deepCopy, getMergedObject } from "@/utils/util";
export default {
  name: "hlInput",
  data() {
    return {
      inputVal: "",
    };
  },
  props: {
    value: {
      type: [String, Number],
      default: "",
    },
    width: {
      type: String,
      default: "",
    },
    inputConfig: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  watch: {
    inputVal: function (newVal, oldVal) {
      this.$emit("input", newVal);
    },
    value: function (newVal, oldVal) {
      this.inputVal = newVal;
    },
  },
  mounted() {
    this.inputVal = this.value;
  },
  methods: {
    getMergedObject,
    handlerEnter() {
      this.$emit("handlerEnter");
    },
  },
};
</script>
<style lang="scss" scoped>
@import "../../theme-chalk/src/common/var.scss";
.hl-input {
  width: 100%;
  position: relative;
  .el-input {
    ::v-deep .el-input__inner {
      height: 28px;
      line-height: 28px;
      padding: 0 10px;
      border-radius: 2px;
    }
  }
  ::v-deep .el-input-number--mini {
    width: 100%;
  }
  ::v-deep .el-input-group__append,
  .el-input-group__prepend {
    padding: 0 10px;
    border: 1px solid $--border-color-base;
    border-left: 0;
    background: transparent;
  }
  ::v-deep .el-input--prefix .el-input__inner {
    padding-left: 30px;
  }
  ::v-deep .el-input__prefix {
    left: 10px;
    & i {
      line-height: 28px;
      width: auto;
    }
  }
  ::v-deep .el-input__suffix {
    right: 10px;
    & i {
      line-height: 28px;
      width: auto;
    }
  }
}
</style>
