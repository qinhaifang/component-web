<template>
  <el-form
    :model="ruleForm"
    status-icon
    :rules="rules"
    ref="ruleForm"
    label-width="120px"
    class="demo-ruleForm hlcx-reset"
  >
    <el-form-item label="输入旧密码" prop="originalPassword">
      <el-input
        type="password"
        v-model="ruleForm.originalPassword"
        autocomplete="off"
      ></el-input>
    </el-form-item>
    <el-form-item label="设置新密码" prop="password">
      <el-input
        type="password"
        v-model="ruleForm.password"
        autocomplete="off"
      ></el-input>
    </el-form-item>
    <el-form-item label="再次输入新密码" prop="checkPass">
      <el-input
        type="password"
        v-model="ruleForm.checkPass"
        autocomplete="off"
      ></el-input>
    </el-form-item>
    <el-form-item>
      <div class="hlcx-msg">
        <p>长度为8-16个字符</p>
        <p>不能使用空格、中文</p>
        <p>至少含大小写字母/数字/特殊字符3种组合</p>
        <p>不能含有非法字符</p>
      </div>
    </el-form-item>
    <el-form-item>
      <p style="color: #8f9090">确认修改后需重新登录</p>
    </el-form-item>
  </el-form>
</template>
<script>
import { validateChinese } from "@/utils/validate";
import { resetPassword, getAsymmetricPublicKey, getSymmetricKey } from "@/api/login";
import CryptoJS from "crypto-js";
import JSEncrypt from "jsencrypt/bin/jsencrypt";
import { removeToken } from "@/utils/auth";

export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入旧密码"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    var validateNewPass = (rule, value, callback) => {
      var reg =
        /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_!@#$%^&*`~()-+=]+$)(?![a-z0-9]+$)(?![a-z\W_!@#$%^&*`~()-+=]+$)(?![0-9\W_!@#$%^&*`~()-+=]+$)[a-zA-Z0-9\W_!@#$%^&*`~()-+=]{8,15}$/;
      if (value === "") {
        callback(new Error("请输入新密码"));
      } else {
        if (
          this.ruleForm.password !== "" &&
          reg.test(this.ruleForm.password) &&
          !validateChinese(value)
        ) {
          this.$refs.ruleForm.validateField("checkPass");
        } else {
          callback(new Error("请输入正确格式的密码"));
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    let inputDescription = (rule, value, callback) => {
      var reg = /\s+/g;
      if (value && reg.test(value)) {
        callback(new Error("密码不可以输入空格"));
      } else {
        callback();
      }
    };
    return {
      passwordPop: "修改密码",
      showClose: true,
      ruleForm: {
        originalPassword: "",
        password: "",
        checkPass: "",
        symmetricKey: "", //对称密钥
      },
      publicKey: "",
      rules: {
        originalPassword: [
          { validator: validatePass, trigger: "blur" },
          { validator: inputDescription, trigger: ["blur", "change"] },
        ],
        password: [{ validator: validateNewPass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }],
      },
    };
  },
  mounted() {
    this.handleDialogReset();
  },
  methods: {
    handleClick() {
      this.$emit("update:drawer", !this.drawer);
    },
    // 获取非对称私钥
    handlePublicKey() {
      getAsymmetricPublicKey().then((res) => {
        this.publicKey = res;
      });
    },
    // 获取对称密钥
    handleSymmetricKey() {
      getSymmetricKey().then((res) => {
        this.ruleForm.symmetricKey = res;
      });
    },
    // RSA加密
    encryptRSA(password, pub_key) {
      let enc = new JSEncrypt(); // 声明一个新的JSEncrypt对象
      enc.setPublicKey(pub_key); // 配置公钥
      return enc.encrypt(password); // 加密
    },
    // AES加密
    encrypt(word, keyStr) {
      // keyStr = keyStr ? keyStr : "absoietlj32fai12";
      let key = CryptoJS.enc.Utf8.parse(keyStr);
      let srcs = CryptoJS.enc.Utf8.parse(word);
      let encrypted = CryptoJS.AES.encrypt(srcs, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
      });
      return encrypted.toString();
    },
    submitForm(formName = "ruleForm") {
      // RSA加密
      let RSAoldPassword = this.encryptRSA(
        this.ruleForm.originalPassword,
        this.publicKey
      );
      // AES加密
      let AESoldPassword = this.encrypt(
        RSAoldPassword,
        this.ruleForm.symmetricKey
      );
      // RSA加密
      let RSAnewPassword = this.encryptRSA(
        this.ruleForm.password,
        this.publicKey
      );
      // AES加密
      let AESnewPassword = this.encrypt(
        RSAnewPassword,
        this.ruleForm.symmetricKey
      );
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.ruleForm.originalPassword = AESoldPassword;
          this.ruleForm.password = AESnewPassword;
          this.ruleForm.checkPass = AESnewPassword;
          this.validatePass = false;
          resetPassword(this.ruleForm)
            .then((res) => {
              this.$refs[formName].resetFields();
              // this.$notice.notify("密码修改成功");
              this.$notice.message({
                type: "success",
                msg: "密码修改成功",
              });
              setTimeout(() => {
                removeToken();
                this.$store.commit("SET_ROLES", []);
                this.$router.push({ path: "/login" });
              }, 1000);
            })
            .catch(() => {
              this.$emit("hasFirstLogin");
              this.$refs[formName].resetFields();
            });
        } else {
          return false;
        }
      });
    },
    resetForm(formName = "ruleForm") {
      this.$refs[formName].resetFields();
    },

    handleDialogReset() {
      this.handlePublicKey();
      this.handleSymmetricKey();
    },
  },
};
</script>
<style lang="scss" scoped>
.hlcx-header-container {
  height: 100%;
  > div {
    height: 100%;
  }
}
.iconfont {
  cursor: pointer;
}
::v-deep .hlcx-menu {
  background: inherit;
  .el-submenu__title {
    background: #494f63;
  }
}
.hlcx-reset {
  .hlcx-msg {
    border: 1px solid #edd5a0;
    background: #fef5d6;
    padding: 0 20px;
  }
  i {
    color: #8f9090;
  }
}
::v-deep .hlcx-reset {
  .el-form-item {
    width: 100%;
    margin-left: 0;
    margin-right: 0;
    .el-form-item__label {
      width: 14rem !important;
    }
  }
}
</style>
