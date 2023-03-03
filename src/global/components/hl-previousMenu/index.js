import hlPreviousMenu from './src/index.vue';

/* istanbul ignore next */
hlPreviousMenu.install = function(Vue) {
  Vue.component(hlPreviousMenu.name, hlPreviousMenu);
};

export default hlPreviousMenu;
