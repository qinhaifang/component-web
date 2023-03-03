import hlChart from "./src/index.vue";

/* istanbul ignore next */
hlChart.install = function (Vue) {
  Vue.component(hlChart.name, hlChart);
};

export default hlChart;
