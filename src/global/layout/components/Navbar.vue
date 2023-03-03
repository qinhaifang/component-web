<template>
  <div class="navbar">
    <div class="left-menu">{{ title }}</div>
    <div class="right-menu">
      <el-dropdown
        trigger="click"
        class="navbar-fun-icon"
        @command="setUser"
        style=""
      >
        <span class="el-dropdown-link">
          <i class="user iconfont iconyonghu"></i>
          <span class="account">{{ name }}</span>
          <i class="smallFont el-icon-caret-bottom"></i>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              v-for="align in userSet"
              :icon="align.icon"
              :key="align.value"
              :command="align"
              >{{ align.label }}</el-dropdown-item
            >
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <hl-dialog :dialogConfig="dialogConfig">
        <resetPasswordComponent ref="rest"></resetPasswordComponent>
      </hl-dialog>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import resetPasswordComponent from "./resetPassword";
export default {
  components: {
    resetPasswordComponent,
  },
  data() {
    return {
      title: this.$bkConfig.title,
      dialogReset: false,
      passwordPop: "修改密码",
      firstLogin: false,
      userSet: [
        {
          label: "修改密码",
          icon: "iconfont iconbianji",
          value: "changePassword",
        },
        {
          label: "退出登录",
          icon: "iconfont icontuichu",
          value: "quit",
        },
      ],
    };
  },
  computed: {
    dialogConfig() {
      return {
        disabled: true,
        zdyBeforeClose: true,
        visible: this.dialogReset,
        cancelButton: "重置",
        extend: {
          beforeClose: this.beforeClose,
          title: this.passwordPop,
          width: "600px",
        },
        btnData: [
          {
            text: "确定",
            clickEvent: this.onSubmin,
          },
          {
            text: "重置",
            plain: true,
            clickEvent: this.onCancel,
          },
        ],
      };
    },
    ...mapGetters(["firstTimeLogin", "name"]),
  },
  mounted() {
    this.hasFirstLogin();
  },
  methods: {
    hasFirstLogin() {
      if (this.firstTimeLogin) {
        this.passwordPop = "重置密码";
        this.dialogReset = true;
      }
    },
    onSubmin() {
      this.$refs.rest.submitForm();
    },
    beforeClose() {
      if (!this.firstTimeLogin) this.dialogReset = false;
    },
    onCancel() {
      this.$refs.rest.resetForm();
    },
    handleChange(color) {
      this.$store.dispatch("settings/changeSetting", {
        key: "theme",
        value: color,
      });
    },
    handleChangePassword() {
      this.passwordPop = "修改密码";
      this.dialogReset = true;
    },
    setUser(user) {
      switch (user.value) {
        case "quit":
          this.logout();
          break;
        case "changePassword":
          this.handleChangePassword();
          break;
      }
    },
    async logout() {
      await this.$store.dispatch("LogoutAction");
      this.$router.push(`/login?redirect=${this.$route.fullPath}`);
    },
  },
};
</script>
<style lang="scss" scoped>
.navbar {
  height: 60px;
  overflow: hidden;
  position: relative;
  background: #fff;
  -webkit-box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
  box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
  .left-menu {
    float: left;
    font-size: 24px;
    color: #1f85ec;
    font-weight: 700;
    margin-left: 30px;
    height: 60px;
    cursor: pointer;
    line-height: 60px;
  }
  .right-menu {
    float: right;
    padding-right: 30px;
    height: 100%;
    color: #8ca0b3;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    .account {
      margin: 0 10px;
      cursor: pointer;
    }
  }
}
</style>
