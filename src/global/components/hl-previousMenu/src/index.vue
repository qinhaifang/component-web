<template>
  <div>
    <treeselect
      class="zdyTreeSelect"
      :class="hasBorder ? 'border' : 'noBorder'"
      v-model="parentId"
      size="mini"
      :options="menuOptions"
      :normalizer="normalizer"
      :show-count="true"
      placeholder="选择上级菜单"
      :disabled="disabled"
    />
  </div>
</template>

<script>
import Treeselect from "@riophae/vue-treeselect";
import { handleTree } from "@/utils/util";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  name: "hlPreviousMenu",
  components: { Treeselect },
  data() {
    return {
      parentId: 0,
      menuOptions: [],
      disabled: this.menuConfig.disabled,
    };
  },
  props: {
    value: {
      type: [Number, String],
    },
    hasBorder: Boolean,
    menuConfig: {
      type: Object,
      default: () => {
        return {
          id: "menuId",
          data: [],
        };
      },
    },
  },
  watch: {
    parentId(v) {
      this.$emit("input", v);
    },
    menuConfig: {
      // 深度监听，可监听到对象、数组的变化
      handler(val, oldVal) {
        const { id, options } = val;
        this.getTreeselect(id, options);
      },
      deep: true,
    },
    value(v) {
      this.parentId = this.value;
    },
  },
  mounted() {
    const { id, options } = this.menuConfig;
    this.parentId = this.value || 0;
    this.getTreeselect(id, options);
  },
  methods: {
    /** 转换菜单数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.value,
        label: node.label,
        children: node.children,
      };
    },
    getTreeselect(id, data) {
      this.menuOptions = [];
      const { topLevelLabel } = this.menuConfig;
      const menu = { value: 0, label: topLevelLabel || "主类目", children: [] };
      menu.children = handleTree(data, id);
      this.menuOptions.push(menu);
    },
  },
};
</script>
<style lang="scss">
.zdyTreeSelect {
  border-radius: 2px;
  padding-right: 10px;
  .vue-treeselect__control {
    border: none;
  }
  &.noBorder {
    .vue-treeselect__control {
      border: none;
    }
  }

  .vue-treeselect__control {
    height: 28px;
    padding: 0px;
    .vue-treeselect__placeholder {
      color: #999999;
    }
    .vue-treeselect__placeholder,
    .vue-treeselect__single-value {
      line-height: 26px;
      font-size: 12px;
      padding: 0px 10px;
    }
  }
}
.vue-treeselect__menu-container {
  .vue-treeselect__menu {
    font-size: 12px;
  }
}
</style>
