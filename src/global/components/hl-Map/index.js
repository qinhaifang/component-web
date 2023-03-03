import hlMap from "./src/index.vue";

/* istanbul ignore next */
hlMap.install = function (Vue) {
  Vue.component(hlMap.name, hlMap);
};

export default hlMap;
