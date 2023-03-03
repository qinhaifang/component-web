<script>
export default {
  name: "MenuItem",
  functional: true,
  props: {
    icon: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "",
    },
  },
  render(h, context) {
    const { icon, title, ifSvgIcon } = context.props;
    const vnodes = [];
    vnodes.push(
      h("i", {
        attrs: {
          class: "icon" + icon + " iconfont svg-icon",
        },
      })
    );
    if (title) {
      vnodes.push(
        h(
          "span",
          {
            slot: "title",
          },
          title
        )
      );
    }
    return vnodes;
  },
};
</script>
<style scoped>
.svg-icon {
  margin-right: 12px;
  font-size: 18px;
  width: 1em;
  height: 1em;
  vertical-align: middle;
  fill: currentColor;
  overflow: hidden;
}
</style>
