<template>
  <div class="hl-tree">
    <el-tree
      v-if="treeConfig.options && treeConfig.options.length > 0"
      ref="tree"
      :default-expand-all="treeConfig.isExpend"
      :props="treeConfig.defaultProps"
      :data="treeConfig.options"
      @node-click="handleNodeClick"
      :filter-node-method="filterNode"
      v-bind="
        getMergedObject(treeConfig.extend ? treeConfig.extend : treeConfig, {
          nodeKey: 'id',
        })
      "
      v-on="getMergedObject(treeConfig.extend ? treeConfig.extend : treeConfig)"
    >
    </el-tree>
    <hl-empty v-else :imageSize="100" class="treeEmpty"></hl-empty>
  </div>
</template>
<script>
import { getMergedObject } from "@/utils/util";
export default {
  name: "hlTree",
  props: {
    treeConfig: {
      type: Object,
      default: () => {
        return {};
      },
    },
    filterText: {
      type: String,
      default: () => {
        return "";
      },
    },
  },
  data() {
    return {
      checked: [],
    };
  },
  watch: {
    filterText: {
      handler(newVal) {
        this.$refs.tree.filter(newVal);
      },
      deep: true,
    },
    "treeConfig.isExpend": {
      handler(newVal) {
        console.log(newVal, "newVal");
        this.treeConfig.isExpend = newVal;
      },
      deep: true,
    },
  },
  mounted() {
    const { options } = this.treeConfig;
    this.checked = this.setChecked(options);
    if (this.filterText) {
      this.$refs.tree.filter(this.filterText);
    }
    if (this.checked.length != 0) {
      this.$nextTick(() => {
        this.$refs.tree.setCheckedKeys(this.checked);
      });
    }
  },
  methods: {
    setChecked(options) {
      let arr = [];
      if (Array.isArray(options)) {
        options
          .filter((item) => {
            if (Array.isArray(item.childList)) {
              const result = this.setChecked(item.childList);
              arr.push(...result);
            } else {
              return item.selected === 1;
            }
          })
          .map((item) => {
            arr.push(item.id);
          });
      }
      return arr;
    },
    shrinkTreeNode(treeStatus) {
      this.changeTreeNodeStatus(this.$refs.tree.store.root, treeStatus);
    },
    // 改变节点的状态
    changeTreeNodeStatus(node, treeStatus) {
      node.expanded = treeStatus;
      for (let i = 0; i < node.childNodes.length; i++) {
        // 改变节点的自身expanded状态
        node.childNodes[i].expanded = treeStatus;
        // 看看他孩子的长度，有的话就调用自己往下找
        if (node.childNodes[i].childNodes.length > 0) {
          this.changeTreeNodeStatus(node.childNodes[i], treeStatus);
        }
      }
    },
    getMergedObject,
    filterNode(value, data) {
      console.log(value, data);
      if (!value) return true;
      if (
        this.treeConfig &&
        this.treeConfig.defaultProps &&
        this.treeConfig.defaultProps.label
      ) {
        return data[this.treeConfig.defaultProps.label].indexOf(value) !== -1;
      } else {
        return data.label.indexOf(value) !== -1;
      }
    },
    handleNodeClick(obj, node, item) {
      this.$emit("handleNodeClick", obj, node, item);
    },
    setCheckedKeys() {
      this.$refs.tree.setCheckedKeys([]);
    },
  },
};
</script>
<style lang="scss" scoped>
@import "../../theme-chalk/src/common/var.scss";
.hl-tree {
  ::v-deep .el-tree-node__content > label.el-checkbox {
    margin-right: 10px;
  }
  ::v-deep .el-checkbox__inner {
    width: 15px;
    height: 15px;
  }
  ::v-deep .el-tree-node__content > .el-tree-node__expand-icon {
    padding: 6px 9px;
  }
  ::v-deep .el-tree-node__content {
    height: 40px;
  }
  .treeEmpty {
    position: absolute;
    top: 39%;
    left: 39%;
  }
  // 选中及hover效果
  // ::v-deep .el-tree-node.is-checked {
  //   background: rgba(88, 184, 130, 0.2);
  // }
  // ::v-deep .el-tree-node__content:hover {
  //   background: rgba(88, 184, 130, 0.1);
  // }
}
</style>
