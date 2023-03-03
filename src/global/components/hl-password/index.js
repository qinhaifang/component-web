import hlPassword from './src/index.vue';

/* istanbul ignore next */
hlPassword.install = function(Vue) {
  Vue.component(hlPassword.name,hlPassword);
};

export default hlPassword;
