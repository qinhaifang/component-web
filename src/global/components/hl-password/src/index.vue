/* * @Author: dubin * @Date: 2022-03-03 15:43:00 * @Last Modified by: dubin *
@Last Modified time: 2022-03-03 18:48:59 */

<template>
  <div style="width: 100%">
    <el-input
      v-model="pwd"
      :type="type"
      @input.native="inputChange"
      class="pwd-input w100"
      :disabled="disabled"
      placeholder="请输入密码"
      autocomplete="new-password"
    >
      <i
        v-if="showPassword"
        slot="suffix"
        class="icon-style"
        :class="elIcon"
        autocomplete="auto"
        @click="changePassword"
      />
    </el-input>
  </div>
</template>
<script>
import CryptoJS from "crypto-js";
export default {
  name: "hlPassword",
  props: {
    value: {
      type: [String, Number],
    },
    encode: String,
    disabled: Boolean,
    showPassword: Boolean,
  },
  data() {
    return {
      pwd: "",
      flag: false,
      JSEncrypt: null,
    };
  },
  watch: {
    value(v) {
      if (v) {
        this.pwd = this.decrypt(v, this.encode);
      } else {
        this.pwd = "";
      }
    },
  },
  methods: {
    inputChange() {
      if (this.pwd) {
        this.$emit("input", this.encrypt(this.pwd, this.encode));
      } else {
        this.$emit("input", this.pwd);
      }
    },
    changePassword() {
      if (!this.disabled) {
        this.flag = !this.flag;
      }
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
    // RSA加密
    encryptRSA(password, pub_key) {
      let enc = new this.JSEncrypt(); // 声明一个新的JSEncrypt对象
      enc.setPublicKey(pub_key); // 配置公钥
      return enc.encrypt(password); // 加密
    },
    // 解密
    decrypt(word, keyStr) {
      keyStr = keyStr ? keyStr : "absoietlj32fai12";
      var key = CryptoJS.enc.Utf8.parse(keyStr);
      var decrypt = CryptoJS.AES.decrypt(word, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
      });
      return CryptoJS.enc.Utf8.stringify(decrypt).toString();
    },
  },
  mounted() {
    import("jsencrypt/bin/jsencrypt").then((module) => {
      this.JSEncrypt = module.default;
      if (this.value) {
        this.pwd = this.decrypt(this.value, this.encode);
      }
      console.log(this.value, 34343);
      console.log(this.encode, 34343);
    });
  },
  computed: {
    type() {
      return this.flag ? "text" : "password";
    },
    elIcon() {
      return this.flag ? "el-icon-view" : "el-icon-view";
    },
  },
};
</script>
<style lang="scss" scoped>
.icon-style {
  font-size: 18px;
}
::v-deep {
  .pwd-input {
    border: 1px solid #fff;
    .el-input__inner {
      height: 28px;
      padding: 0 10px;
      border-radius: 2px;
    }
    .el-input__suffix {
      line-height: 31px;
      right: 15px;
    }
  }
}
</style>
