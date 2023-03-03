<template>
  <div class="hl-dialog">
    <el-dialog
      class="hlcx-dialog"
      :class="dialogConfig.isDark ? 'darkDialog' : ''"
      :visible.sync="dialogVisible"
      v-bind="
        getMergedObject(
          dialogConfig.extend ? dialogConfig.extend : dialogConfig,
          {
            title: '标题',
            top: '10vh',
            width: '1146px',
            closeOnClickModal: false,
            beforeClose: beforeClose,
          }
        )
      "
      v-on="
        getMergedObject(dialogConfig.extend, {
          close: close,
        })
      "
    >
      <span v-if="dialogVisible">
        <div
          :style="{
            height: dialogConfig.height + 'px',
            background: dialogConfig.background,
          }"
        >
          <hl-scroll ref="scroll">
            <slot></slot>
          </hl-scroll>
        </div>
      </span>
      <span slot="footer" v-if="dialogConfig.btnData">
        <hl-button :buttonConfig="dialogConfig.btnData"></hl-button>
      </span>
      <span v-if="dialogConfig.titleSlot" slot="title">
        <slot name="title"></slot>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getMergedObject } from "@/utils/util";
import hlButton from "./../../hl-button";
export default {
  name: "hlDialog",
  components: { hlButton },
  props: {
    dialogConfig: {
      type: Object,
      default: () => {
        return {};
      },
    },
    visible: Boolean,
  },
  model: {
    prop: "visible",
    event: "change",
  },
  data() {
    return {
      dialogVisible: false,
      id: "dialog_" + new Date().getTime(),
    };
  },
  mounted() {
    this.dialogVisible = this.visible;
  },
  computed: {
    zdyWidth() {
      if (this.width.toString().indexOf("%") != -1)
        return this.width.toString();
      else {
        return this.width + "px";
      }
    },
  },
  watch: {
    dialogConfig: {
      handler(newVal) {
        this.dialogVisible = this.dialogConfig.visible;
      },
      deep: true,
    },
    visible(val) {
      this.dialogVisible = val;
    },
  },

  methods: {
    getMergedObject,
    beforeClose() {
      this.$emit("change", false);
    },
    close() {
      this.dialogVisible = false;
    },
  },
};
</script>
<style scoped lang="scss">
@import "../../theme-chalk/src/common/var.scss";

.hl-dialog {
  ::v-deep.hlcx-dialog .el-dialog {
    .el-dialog__header {
      padding: 8px 20px;
      background: $dialog-header-color;
      .el-dialog__title {
        font-size: 14px;
        color: $numberText;
      }
      .el-dialog__headerbtn {
        top: 11px;
      }
    }
    .el-dialog__body {
      padding: 40px 60px;
      /* font-size: 12px; */
    }
    .el-dialog__footer {
      padding: 0 20px;
      padding-bottom: 30px;
      text-align: center;
      box-sizing: border-box;
    }
  }
  /* 大屏Dialog样式 */
  .darkDialog.el-dialog__wrapper {
    background: rgba(0, 0, 0, 0.2) !important;
  }
  .darkDialog {
    ::v-deep .el-dialog {
      background: transparent;
    }
    ::v-deep .el-dialog__header {
      background: $darkDialog-header-color !important;
      border-radius: 0 4px 4px 0;
      span {
        color: $darkDialog-body-text-color !important;
      }
      .el-dialog__headerbtn .el-dialog__close {
        color: $darkDialog-body-text-color !important;
      }
    }
    ::v-deep .el-dialog__body {
      background: $darkDialog-body;
      color: $darkDialog-body-text-color !important;
    }
    ::v-deep .el-dialog__footer {
      display: none;
    }
  }
}
</style>
