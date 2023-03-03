import hlRadio from "./src/index.vue";

/* istanbul ignore next */
hlRadio.install = function (Vue) {
  Vue.component(hlRadio.name, hlRadio);
};

export default hlRadio;
