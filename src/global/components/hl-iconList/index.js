import hlIconList from "./src/index.vue";

/* istanbul ignore next */
hlIconList.install = function (Vue) {
  Vue.component(hlIconList.name, hlIconList);
};

export default hlIconList;
