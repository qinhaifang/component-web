import hlBread from "./src/index.vue";

/* istanbul ignore next */
hlBread.install = function (Vue) {
  Vue.component(hlBread.name, hlBread);
};

export default hlBread;
