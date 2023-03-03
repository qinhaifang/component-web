import hlTree from "./src/index.vue";

/* istanbul ignore next */
hlTree.install = function (Vue) {
  Vue.component(hlTree.name, hlTree);
};

export default hlTree;
