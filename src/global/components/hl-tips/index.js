import hlTips from "./src/index.vue";

/* istanbul ignore next */
hlTips.install = function (Vue) {
  Vue.component(hlTips.name, hlTips);
};

export default hlTips;
