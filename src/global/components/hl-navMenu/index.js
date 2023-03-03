import hlNavMenu from "./src/index.vue";

/* istanbul ignore next */
hlNavMenu.install = function (Vue) {
  Vue.component(hlNavMenu.name, hlNavMenu);
};

export default hlNavMenu;
