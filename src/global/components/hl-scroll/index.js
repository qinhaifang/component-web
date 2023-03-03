import hlScroll from './src/index.vue';

/* istanbul ignore next */
hlScroll.install = function(Vue) {
  Vue.component(hlScroll.name, hlScroll);
};

export default hlScroll;
