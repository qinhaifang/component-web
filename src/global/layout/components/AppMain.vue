<template>
  <section class="app-main">
    <hl-bread class="hlBread" :breadConfig="breadConfig"></hl-bread>
    <transition name="fade-transform" mode="out-in">
      <router-view class="mainRouterView" :key="key" />
    </transition>
  </section>
</template>

<script>
import { bus } from "@/utils/bus";
import { mapGetters } from "vuex";
export default {
  name: "AppMain",
  computed: {
    breadConfig() {
      return {
        options: this.levelList,
      };
    },
    ...mapGetters(["permission_routes", "allRoutes"]),
  },
  watch: {
    $route(route) {
      // if you go to the redirect page, do not update the breadcrumbs
      if (route.path.startsWith("/redirect/")) {
        return;
      }
      this.getBreadcrumb(route);
    },
  },
  data() {
    return {
      key: "",
      levelList: [],
    };
  },
  methods: {
    getBreadcrumb(route) {
      // only show routes with meta.title
      if (route) {
        const { query } = route;
        const { appendRoute } = query;
        if (appendRoute) {
          this.levelList.push({
            name: route.meta.title,
            path: "",
            query: route.query,
          });
          sessionStorage.setItem("levelList", JSON.stringify(this.levelList));
        } else {
          this.getComonBreadCrumb();
        }
      } else {
        const { query } = this.$route;
        if (query) {
          const { appendRoute } = query;
          if (appendRoute === "true") {
            this.levelList =
              sessionStorage.getItem("levelList") &&
              JSON.parse(sessionStorage.getItem("levelList"));
          } else {
            this.getComonBreadCrumb();
          }
        } else {
          this.getComonBreadCrumb();
        }
      }
    },
    distinct(arr) {
      var result = [],
        i,
        j,
        len = arr.length;
      for (i = 0; i < len; i++) {
        for (j = i + 1; j < len; j++) {
          if (arr[i].name === arr[j].name) {
            j = ++i;
          }
        }
        result.push(arr[i]);
      }
      return result;
    },
    getComonBreadCrumb() {
      let matched = this.$route.matched
        .filter((item) => item.meta && item.meta.title)
        .map((item) => {
          const result = this.allRoutes.find(
            (items) => items.name === item.name
          );
          return {
            ...item,
            ...result,
          };
        });
      this.levelList = matched
        .filter((item) => item.meta && item.meta.title)
        .map((item) => {
          return {
            name: item.meta.title,
            path: item.orderNum && item.path,
            query: item.query,
          };
        });
      this.levelList = this.distinct(this.levelList);
    },
    isDashboard(route) {
      const name = route && route.name;
      if (!name) {
        return false;
      }
      return name.trim() === "首页";
    },
  },
  mounted() {
    this.getBreadcrumb();
    bus.$on("reload", () => {
      this.key = this.$route.path + "?t=" + Date.now();
    });
  },
  beforeDestroy() {
    bus.$off("reload");
  },
};
</script>

<style scoped>
.hlBread {
  padding: 10px 0;
}
.app-main > .mainRouterView {
  /* padding: 20px; */
  height: calc(100vh - 94px);
  overflow-y: auto;
  /* background: #fff; */
  /* box-shadow: 0 4px 8px 0 rgba(71, 121, 236, 0.12); */
  /* border-radius: 2px; */
}

.app-main {
  /*50 = navbar  */
  min-height: calc(100vh - 60px);
  width: 100%;
  position: relative;
  overflow: hidden;
  background: rgb(243, 244, 247);
  padding: 0 20px 20px 20px;
  height: calc(100vh - 60px);
}

.fixed-header + .app-main {
  padding-top: 50px;
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
