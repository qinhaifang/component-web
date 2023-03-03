import Vue from "vue";
import App from "./App";
import store from "./store";
import router from "./router";
import fetch from "@/utils/fetch";
import "./assets/css/index.scss";
Vue.prototype.$fetch = fetch;
import hlElement from "./global";
import permission from "@/directives"; //权限指令
import "./permission"; // permission control
import * as dicts from "@/dict";
import "xterm/dist/xterm.css";
import VueCompositionAPI from "@vue/composition-api";
import * as echarts from "echarts";
const configBase = require("@/config/config.base");
Vue.use(hlElement, { size: "small" });
Vue.use(VueCompositionAPI);
Vue.use(permission);

Vue.prototype.dicts = dicts;
Vue.prototype.$echarts = echarts;
Vue.prototype.$bkConfig = Object.assign({}, configBase);

//wangeditor编辑器上传附件插件注册
// 注册。要在创建编辑器之前注册，且只能注册一次，不可重复注册。
import { Boot } from "@wangeditor/editor";
import attachmentModule from "@wangeditor/plugin-upload-attachment";
Boot.registerModule(attachmentModule);

window.vm = new Vue({
  el: "#app",
  router,
  store,
  render: (h) => h(App),
});
