<template>
  <div class="hl-button" :class="buttonSize ? 'hl-button-' + buttonSize : ''">
    <el-tooltip
      v-for="(item, index) in btnData"
      :key="index"
      :disabled="!item.visibleTooltip"
      class="item"
      effect="dark"
      :openDelay="500"
      v-hasPermi="item.permissions"
      :content="getPermissionName(item.permissions, item.content)"
      :placement="item.placement || 'bottom'"
    >
      <template v-if="!item.visible">
        <hl-icon
          v-if="item.visibleIcon || false"
          :name="item.icon"
          :type="item.type"
          :height="item.height"
          :fontSize="item.fontSize"
          :color="item.color"
          :lineHeight="item.lineHeight"
          :marginLeft="item.marginLeft"
          @click="
            handleClick(item.clickEvent, item.disabled, item, this, $event)
          "
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
          @click="
            handleClick(item.clickEvent, item.disabled, item, this, $event)
          "
          >{{ getPermissionName(item.permissions, item.text) }}
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
  computed: {
    buttonSize() {
      return this.size || (this.$ELEMENT || {}).size;
    },
    btnData() {
      if (this.tableRow) {
        return this.btnDataArr.filter((item) => {
          const { visibleExtend } = item;
          if (visibleExtend) {
            const { key, value, visible } = visibleExtend;
            if (this.tableRow[key] == value) {
              return visible;
            } else return false;
          } else return true;
        });
      } else {
        return this.btnDataArr;
      }
    },
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
  methods: {
    getMergedObject,
    getPermissionName(btnPermission, val) {
      //按钮名称使用item.text, 而不是权限按钮名称。
      return val;
      // if (btnPermission) {
      //   const permissions =
      //     this.$store.getters && this.$store.getters.btnPermissions;
      //   const permissionsObj = permissions.find((permission) => {
      //     return btnPermission.includes(permission.frontPermName);
      //   });
      //   if (permissionsObj) {
      //     return permissionsObj.buttonLabel;
      //   } else {
      //     return val;
      //   }
      // } else {
      //   return val;
      // }
    },
    handleClick(clickFun, disabled, item, button, ev) {
      const { beforeClick } = item;
      let target = ev.target;
      if (target.nodeName == "SPAN") {
        target = ev.target.parentNode;
      }
      target.blur();
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
    padding-right: 21px;
    padding-left: 21px;
    border-radius: 2px;
  }

  ::v-deep .el-button--primary.is-plain {
    background: $btn-primary-plain-color;
    border-color: $--color-primary;
    &:hover,
    &:focus {
      border-color: $--color-primary;
      background: $btn-primary-plain-bgHover;
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
      border-color: $--color-primary;
      color: $--color-primary;
    }
  }
  .openBox {
    transform: rotate(180deg);
  }
}
</style>
