import hlSteps from "./src/index.vue";

/* istanbul ignore next */
hlSteps.install = function (Vue) {
  Vue.component(hlSteps.name, hlSteps);
};

export default hlSteps;
