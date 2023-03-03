import Vue from "vue";
// import { getPermistions } from "@/venders/permission";
const install = function (Vue) {
  Vue.directive("permission", {
    inserted: function (el, binding) {
      //   const { value } = binding;
      //   const { buttonLabel: buttonPermissions } = getPermistions().find(
      //     (permission) => {
      //       return (
      //         permission.name == window.vm.$route.name ||
      //         permission.name == window.vm.$route.meta.routerParent
      //       );
      //     }
      //   );
      //   if (!buttonPermissions.includes(value)) {
      //     el.parentNode && el.parentNode.removeChild(el);
      //   }
    },
  });
};

Vue.use(install);
