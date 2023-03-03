import hlPopover from "./src/index.vue";

/* istanbul ignore next */
hlPopover.install = function (Vue) {
  Vue.component(hlPopover.name, hlPopover);
};

export default hlPopover;
