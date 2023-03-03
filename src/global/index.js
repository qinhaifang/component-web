import ElementUI from "element-ui";
import requireComponent from "./hl-components";
import "./hl-components/theme-chalk/src/index.scss";
import * as notice from "@/utils/notice";
import "./icons";
// Vue.use(ElementUI);

const hlElement = {
  // 必须得有install方法
  install(Vue, opts) {
    Vue.prototype.$ELEMENT = {
      size: opts.size || "mini",
      zIndex: opts.zIndex || 2000,
    };
    Vue.use(ElementUI, {
      size: opts.size || "mini",
    });
    Vue.prototype.$notice = notice;
    requireComponent.map((component) => {
      Vue.component(component.name, component);
    });
  },
  ...requireComponent,
};
if (typeof window !== "undefined" && window.Vue) {
  window.Vue.use(hlElement);
}
export default hlElement;
