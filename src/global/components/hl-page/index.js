import hlPage from "./src/index.vue";

/* istanbul ignore next */
hlPage.install = function (Vue) {
  Vue.component(hlPage.name, hlPage);
};

export default hlPage;
