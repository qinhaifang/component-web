import hlCheckbox from './src/index.vue';

/* istanbul ignore next */
hlCheckbox.install = function(Vue) {
  Vue.component(hlCheckbox.name, hlCheckbox);
};

export default hlCheckbox;
