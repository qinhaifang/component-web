import hlEmpty from "./src/index.vue";

/* istanbul ignore next */
hlEmpty.install = function (Vue) {
  Vue.component(hlEmpty.name, hlEmpty);
};

export default hlEmpty;
