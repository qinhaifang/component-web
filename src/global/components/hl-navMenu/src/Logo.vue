<template>
  <div
    class="sidebar-logo-container"
    :class="{ collapse: collapse }"
    :style="{ '--logoBg': logoBg }"
  >
    <transition name="sidebarLogoFade">
      <router-link
        v-if="collapse"
        key="collapse"
        class="sidebar-logo-link"
        to="/knowledgeLibrary"
      >
        <el-image v-if="logoUrl" :src="logoUrl" class="sidebar-logo" />
        <h1 v-else class="sidebar-title">{{ title }}</h1>
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" to="/knowledgeLibrary">
        <el-image v-if="logoUrl" :src="logoUrl" class="sidebar-logo" />
        <h1 class="sidebar-title" v-if="title">{{ title }}</h1>
      </router-link>
    </transition>
  </div>
</template>

<script>
export default {
  name: "SidebarLogo",
  props: {
    collapse: {
      type: Boolean,
      required: true,
    },
    logo: {
      type: String,
      required: true,
    },
    logoSort: {
      type: String,
      required: true,
    },
    logoBg: {
      type: String,
      required: true,
    },
  },
  computed: {
    logoUrl() {
      if (!this.collapse) {
        return this.logo;
      } else {
        return this.logoSort;
      }
    },
  },
  data() {
    return {
      title: "",
    };
  },
};
</script>

<style lang="scss" scoped>
// logo颜色
// $logo-background-color: #0d0d0d;
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}
.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}
.hideSidebar .sidebar-logo-container .sidebar-logo-link {
  display: flex;
}
.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 60px;
  line-height: 60px;
  background: var(--logoBg);
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.05);
  overflow: hidden;
  text-align: center;
  & .sidebar-logo-link {
    height: 100%;
    width: 100%;
    display: block;
    align-items: center;
    & .sidebar-logo {
      width: 148px;
      margin-top: 12px;
      // height: 43px;
      vertical-align: middle;
      // img{
      //   vertical-align: middle;
      // }
    }
    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #fff;
      font-weight: 600;
      line-height: 50px;
      font-size: 14px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }
}
</style>
