import hlForm from "./src/index";

hlForm.install = function (Vue) {
  Vue.component(hlForm.name, hlForm);
};

export default hlForm;
