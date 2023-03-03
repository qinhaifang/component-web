<template>
  <div class="hl-button">
    <el-tooltip
      v-for="(item, index) in btnDataArr"
      :key="index"
      :disabled="!item.visibleTooltip"
      class="item"
      effect="dark"
      :openDelay="500"
      :content="item.content"
      :placement="item.placement || 'bottom'"
    >
      <template v-if="!item.visible">
        <hl-icon
          v-if="item.visibleIcon || false"
          :name="item.icon"
          :type="item.type"
          :height="item.height"
          :lineHeight="item.lineHeight"
          :marginLeft="item.marginLeft"
          @click="handleClick(item.clickEvent, item.disabled, item, this)"
        ></hl-icon>
        <el-button
          v-else
          class="hlcx-button"
          :style="item.style || ''"
          v-bind="
            getMergedObject(item.extend ? item.extend : item, {
              type: item.type || 'primary',
            })
          "
          @click="handleClick(item.clickEvent, item.disabled, item, this)"
          >{{ item.text }}
          <i
            v-if="item.isMoreOptions"
            :class="item.isOpen ? 'openBox' : ''"
            class="el-icon-caret-bottom el-icon--right"
          ></i>
        </el-button>
      </template>
    </el-tooltip>
  </div>
</template>
<script>
import { getMergedObject, deepCopy } from "@/utils/util";
import hlIcon from "./../../hl-icon";
export default {
  name: "hlButton",
  components: { hlIcon },
  data() {
    return {
      btnDataArr: [],
      open: false,
    };
  },
  props: {
    buttonConfig: {
      type: [Array, Object],
      default: () => {
        return {};
      },
    },
    tableRow: {
      type: [Object],
      default: () => {
        return {};
      },
    },
  },
  watch: {
    buttonConfig: {
      handler(newVal) {
        this.initBtnConfig(newVal);
      },
      deep: true,
    },
  },
  created() {},
  computed: {},
  methods: {
    getMergedObject,
    handleClick(clickFun, disabled, item, button) {
      const { beforeClick } = item;
      if (beforeClick) {
        beforeClick(item);
      }
      if (!disabled && clickFun) {
        clickFun(
          {
            ...item,
            ...this.tableRow,
          },
          button
        );
      }
    },
    initBtnConfig(buttonConfig) {
      buttonConfig = deepCopy(buttonConfig);
      if (Array.isArray(buttonConfig)) {
        this.btnDataArr = buttonConfig;
      } else {
        this.btnDataArr = [buttonConfig];
      }
    },
  },
  mounted() {
    this.initBtnConfig(this.buttonConfig);
  },
};
</script>
<style scoped lang="scss">
@import "./../../theme-chalk/src/common/element-var.scss";
.hl-button {
  .el-button + .el-button,
  .iconfont + .iconfont {
    margin-left: 14px;
  }
  ::v-deep .hlcx-button {
    padding-right: 19px;
    padding-left: 19px;
    border-radius: 2px;
  }

  ::v-deep .el-button--primary.is-plain {
    background: $btn-primary-plain-color;
    border-color: $--color-primary;
    &:hover,
    &:focus {
      background: $btn-primary-plain-bgHover;
      border-color: $btn-primary-plain-bgHover;
      color: $btn-primary-plain-color;
    }
  }
  ::v-deep .el-button--allCheck {
    background-color: $el-button--allCheck;
    border-color: $el-button--allCheck;
    color: $el-button-text-allCheck;
    &:hover,
    &:focus {
      background: $btn-primary-plain-bgHover;
      border-color: $btn-primary-plain-bgHover;
      color: $btn-primary-plain-color;
    }
  }
  .openBox {
    transform: rotate(180deg);
  }
}
</style>
