<template>
  <div>
    <hl-button class="marginRight14" :buttonConfig="btnData"></hl-button>
    <div
      v-clickoutside="close"
      class="hl-popover"
      ref="contentWrapper"
      v-show="visible"
      :style="{ top: top + 'px' }"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script>
import hlButton from "./../../hl-button";
export default {
  name: "hlPopover",
  components: { hlButton },
  data() {
    return {
      visible: false,
      btnData: {
        text: "更多选项",
        clickEvent: this.moreOptions,
        isMoreOptions: true,
        isOpen: false,
      },
    };
  },
  props: {
    top: {
      type: String,
      default: "70",
    },
  },
  computed: {},
  watch: {},
  directives: {
    clickoutside: {
      bind: function (el, binding, vnode) {
        console.log(el, binding, vnode, 999);
        const documentHandler = function (e) {
          if (!vnode.context || el.contains(e.target)) return;
          binding.value(e);
        };
        setTimeout(() => {
          document.addEventListener("click", documentHandler);
        }, 0);
      },
    },
  },
  methods: {
    moreOptions(item) {
      this.$set(this.btnData, "isOpen", !item.isOpen);
      this.visible = !this.visible;
    },
    close(e) {
      console.log(this.$el.contains(e.target), "this.$el");
      if (this.$el.contains(e.target)) return;
      this.visible = false;
      this.$set(this.btnData, "isOpen", false);
    },
  },
  mounted() {},
};
</script>
<style lang="scss" scoped>
@import "../../theme-chalk/src/common/var.scss";
.hl-popover {
  position: absolute;
  left: 0;
  width: 100%;
  background: #fff;
  padding: 10px 20px 0 20px;
  z-index: 99;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  border-radius: 0 0 2px 2px;
}
</style>
