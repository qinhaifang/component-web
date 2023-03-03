import hlTitle from './src/index.vue';

/* istanbul ignore next */
hlTitle.install = function(Vue) {
  Vue.component(hlTitle.name, hlTitle);
};

export default hlTitle;
