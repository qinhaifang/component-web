/* * @Author: dubin * @Date: 2022-03-03 15:42:42 * @Last Modified by: dubin *
@Last Modified time: 2022-03-03 15:42:42 */

<template>
  <div class="icon-body">
    <el-input
      v-model="name"
      style="position: relative"
      clearable
      placeholder="请输入图标名称"
      @clear="filterIcons"
      @input.native="filterIcons"
    >
      <i slot="prefix" class="el-icon-search el-input__icon" />
    </el-input>
    <div class="icon-list">
      <hlScroll class="w100" style="height: 300px">
        <div
          v-for="(item, index) in iconList"
          :key="index"
          @click="selectedIcon(item)"
          class="icon-list-item"
        >
          <svg-icon :icon-class="item" style="height: 30px; width: 16px" />
          <span>{{ item }}</span>
        </div>
      </hlScroll>
    </div>
  </div>
</template>

<script>
import hlScroll from "./../../hl-scroll";
import icons from "./requireIcons";
export default {
  name: "hlIconSelectComponent",
  components: { hlScroll },
  data() {
    return {
      name: "",
      iconList: icons,
    };
  },
  props: ["currentName"],
  methods: {
    filterIcons() {
      this.iconList = icons;
      if (this.name) {
        this.iconList = this.iconList.filter((item) =>
          item.includes(this.name)
        );
      }
    },
    selectedIcon(name) {
      this.$emit("selected", name);
      document.body.click();
    },
    reset() {
      this.name = "";
      this.iconList = icons;
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.icon-body {
  width: 100%;
  padding: 10px;
  .icon-list {
    padding: 20px;
    div.icon-list-item {
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
  .el-input__prefix {
    left: 10px;
    line-height: 28px;
  }
}
::v-deep .el-input__suffix .el-icon-circle-close {
  display: none;
}
</style>
