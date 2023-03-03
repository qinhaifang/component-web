<template>
  <div>
    <hl-navMenu
      @select="handleSelect"
      :navMenuConfig="navMenuConfig"
      v-model="isCollapse"
    ></hl-navMenu>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { bus } from "@/utils/bus";

export default {
  computed: {
    ...mapGetters(["permission_routes", "sidebar"]),
    routes() {
      return this.permission_routes;
    },
    navMenuConfig() {
      return {
        color: {
          logoBg: "#017FDD", // logo背景颜色
          menuHover: "#0003", // 菜单hover颜色
          menuActive: "#0003", // 菜单选中颜色
          navMenuBg: "unset", // 菜单背景颜色
          isOpened: "#1f5ab4", // 菜单展开颜色
          navMenuTextColor: "#fff", // 菜单text颜色
        },
        routesList: this.permission_routes,
        showLogo: this.$store.state.settings.sidebarLogo,
        logoUrl: require("@/assets/imgs/logo.png"),
        logoSortUrl: require("@/assets/imgs/logo-sort.png"),
      };
    },
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      if (meta.routerParentUrl) return meta.routerParentUrl;
      else {
        if (meta.activeMenu) {
          return meta.activeMenu;
        }
        return path;
      }
    },
  },
  methods: {
    handleSelect() {
      bus.$emit("reload");
    },
  },
  watch: {
    isCollapse(v) {
      this.$store.dispatch("app/toggleSideBar", v);
    },
  },
  data() {
    return {
      isCollapse: true,
    };
  },
  mounted() {
    this.isCollapse = this.sidebar.opened;
  },
};
</script>
<style scoped>
.sidebar {
  position: relative;
}
.sidebar .hamburger-container {
  position: absolute;
  bottom: 90px;
  right: 0px;
  z-index: 999;
}

.sidebar-container {
  transition: width 0.08s;
  /* width: 250px; */
  height: 100%;
  position: fixed;
  font-size: 0px;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 1001;
}
</style>
