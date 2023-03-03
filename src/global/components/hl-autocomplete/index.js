import hlAutocomplete from "./src/index.vue";

/* istanbul ignore next */
hlAutocomplete.install = function (Vue) {
  Vue.component(hlAutocomplete.name, hlAutocomplete);
};

export default hlAutocomplete;
