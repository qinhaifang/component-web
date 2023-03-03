<!--
 * @Author: haifang.qin
 * @Date: 2022-03-03 11:06:34
 * @LastEditors: haifang.qin
 * @LastEditTime: 2022-05-26 16:54:39
 * @FilePath: \standard-component-web\src\components\hl-bread\src\index.vue
-->
<template>
  <div class="hl-bread">
    <el-breadcrumb
      v-bind="
        getMergedObject(breadConfig.extend ? breadConfig.extend : breadConfig, {
          separator: '/',
        })
      "
    >
      <el-breadcrumb-item v-for="(item, index) in breadList" :key="index">
        <span :class="item.path ? 'pointer' : ''" @click="jumpRoute(item)">{{
          item.name
        }}</span>
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>
<script>
import { getMergedObject } from "@/utils/util";
export default {
  name: "hlBread",
  props: {
    breadConfig: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  watch: {
    breadConfig: {
      handler(newVal) {
        if (Array.isArray(this.breadConfig.options)) {
          this.breadList = this.breadConfig.options;
        } else {
          this.breadList = [this.breadConfig.options];
        }
        console.log(this.breadList, "breadListbreadList");
      },
      deep: true,
    },
  },
  data() {
    return {
      breadList: [],
    };
  },
  mounted() {
    if (Array.isArray(this.breadConfig.options)) {
      this.breadList = this.breadConfig.options;
    } else {
      this.breadList = [this.breadConfig.options];
    }
  },
  methods: {
    jumpRoute(route) {
      const { path, query } = route;
      if (path) {
        this.$router.push({
          path,
          query,
        });
      }
    },
    getMergedObject,
  },
};
</script>
<style lang="scss" scoped>
@import "../../theme-chalk/src/common/var.scss";
.hl-bread {
  ::v-deep .el-breadcrumb__item:last-child .el-breadcrumb__inner {
    font-size: 14px;
    color: $numberText;
    font-weight: 600;
  }
  ::v-deep .el-breadcrumb__inner.is-link {
    font-size: 12px;
    // color: $mainText;
    font-weight: 400;
  }
  ::v-deep .el-breadcrumb {
    font-size: 12px;
    display: flex;
    align-items: center;
  }
}
</style>
