export default {
  name: "hlRender",
  functional: true,
  props: {
    row: Object,
    formParams: Object,
    render: Function,
  },
  render(h, context) {
    return context.props.render(h, context.props);
  },
};
