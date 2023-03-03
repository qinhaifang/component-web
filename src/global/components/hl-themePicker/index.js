import hlThemePicker from "./src/index.vue";

/* istanbul ignore next */
hlThemePicker.install = function (Vue) {
  Vue.component(hlThemePicker.name, hlThemePicker);
};

export default hlThemePicker;
