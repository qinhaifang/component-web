import hlDate from './src/index.vue';

/* istanbul ignore next */
hlDate.install = function(Vue) {
  Vue.component(hlDate.name, hlDate);
};

export default hlDate;
