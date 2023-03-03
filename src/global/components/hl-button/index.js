import hlButton from './src/index.vue';

/* istanbul ignore next */
hlButton.install = function(Vue) {
  Vue.component(hlButton.name, hlButton);
};

export default hlButton;
