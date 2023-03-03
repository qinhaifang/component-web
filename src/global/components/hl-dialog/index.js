import hlDialog from './src/index.vue';

/* istanbul ignore next */
hlDialog.install = function(Vue) {
  Vue.component(hlDialog.name, hlDialog);
};

export default hlDialog;
