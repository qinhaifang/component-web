import hlEditor from "./src/index.vue";

/* istanbul ignore next */
hlEditor.install = function (Vue) {
  Vue.component(hlEditor.name, hlEditor);
};

export default hlEditor;
