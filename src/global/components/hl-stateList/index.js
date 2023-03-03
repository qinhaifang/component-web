import hlStateList from './src/index.vue';

/* istanbul ignore next */
hlStateList.install = function(Vue) {
  Vue.component(hlStateList.name, hlStateList);
};

export default hlStateList;
