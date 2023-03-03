/* * @Author: dubin * @Date: 2022-03-03 15:42:31 * @Last Modified by: dubin *
@Last Modified time: 2022-03-03 15:42:31 */

<template>
  <el-popover
    placement="bottom-start"
    width="360"
    trigger="click"
    @show="$refs['iconSelect'].reset()"
  >
    <IconSelectComponent ref="iconSelect" @selected="selected" />
    <el-input
      clearable
      slot="reference"
      v-model="iconPath"
      placeholder="点击选择图标"
      readonly
    >
      <span slot="suffix" class="iconClose" v-if="iconPath">
        <i @click.stop="clearContent" class="el-icon-close"></i>
      </span>
      <svg-icon
        v-if="iconPath"
        slot="prefix"
        :icon-class="iconPath"
        class="el-input__icon"
      />
      <i v-if="!iconPath" slot="prefix" class="el-icon-search el-input__icon" />
    </el-input>
  </el-popover>
</template>
<script>
import IconSelectComponent from "./iconSelect.vue";
export default {
  name: "hlIconSelect",
  data() {
    return {
      iconPath: "",
    };
  },
  mounted() {
    if (this.value) {
      this.iconPath = this.value;
    }
  },
  watch: {
    iconPath(v) {
      this.$emit("input", v);
    },
    value(v) {
      this.iconPath = v;
    },
  },
  components: { IconSelectComponent },
  props: ["value"],
  methods: {
    //清除icon选择
    clearContent() {
      this.iconPath = "";
    },
    selected(name) {
      this.iconPath = name;
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.icon-body {
  width: 100%;
  padding: 10px;
  .icon-list {
    height: 200px;
    overflow-y: scroll;
    div {
      height: 30px;
      line-height: 30px;
      margin-bottom: 0px;
      cursor: pointer;
      width: 50%;
      float: left;
    }
    span {
      display: inline-block;
      vertical-align: -0.15em;
      fill: currentColor;
      overflow: hidden;
      margin-left: 10px;
    }
  }
}
::v-deep {
  .el-input__inner {
    height: 28px;
    padding-left: 35px;
    border-radius: 2px;
  }
  .iconClose {
    height: 28px;
    line-height: 28px;
  }
  .el-input--prefix .el-input__inner {
    padding-left: 35px;
  }
  .el-input__prefix {
    line-height: 28px;
    left: 10px;
  }
  .el-input__icon {
    line-height: 28px;
    width: 15px;
    font-size: 15px;
  }
  .el-input__suffix {
    right: 10px;
    .el-icon-circle-close {
      display: none;
    }
  }
  .el-input__icon.svg-icon {
    vertical-align: middle;
  }
}
</style>
