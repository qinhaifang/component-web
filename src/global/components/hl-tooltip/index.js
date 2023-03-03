import hlTooltip from './src/index.vue';

/* istanbul ignore next */
hlTooltip.install = function(Vue) {
  Vue.component(hlTooltip.name, hlTooltip);
};

export default hlTooltip;
