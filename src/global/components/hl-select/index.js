import hlSelect from './src/index.vue';

/* istanbul ignore next */
hlSelect.install = function(Vue) {
  Vue.component(hlSelect.name, hlSelect);
};

export default hlSelect;
