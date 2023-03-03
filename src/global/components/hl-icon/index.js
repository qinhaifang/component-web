import hlIcon from './src/index.vue';

/* istanbul ignore next */
hlIcon.install = function(Vue) {
  Vue.component(hlIcon.name, hlIcon);
};

export default hlIcon;
