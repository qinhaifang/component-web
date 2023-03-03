import hlTable from "./src/index";

hlTable.install = function (Vue) {
  Vue.component(hlTable.name, hlTable);
};

export default hlTable;
