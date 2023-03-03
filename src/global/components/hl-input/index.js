import hlInput from "./src/index.vue";

/* istanbul ignore next */
hlInput.install = function (Vue) {
  Vue.component(hlInput.name, hlInput);
};

export default hlInput;
