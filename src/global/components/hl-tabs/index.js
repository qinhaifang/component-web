import hlTabs from "./src/index.vue";

/* istanbul ignore next */
hlTabs.install = function (Vue) {
  Vue.component(hlTabs.name, hlTabs);
};

export default hlTabs;
