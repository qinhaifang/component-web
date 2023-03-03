<template>
  <div class="newLibrary">
    <hl-dialog :dialogConfig="dialogConfig" v-model="visible">
      <el-form
        ref="form"
        :rules="rules"
        :model="form"
        :disabled="ifDetail"
        label-width="80px"
      >
        <el-form-item label="平台名称" prop="proaductName">
          <el-input v-model="form.proaductName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="平台logo" prop="icon">
          <el-upload
            ref="upload"
            class="avatar-uploader"
            :action="action"
            :headers="headers"
            :show-file-list="false"
            :accept="accept"
            :on-success="handleAvatarSuccess"
            :on-error="handleAvatarError"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="演示单位" prop="demonstrationUnit" v-if="dialogTitle.indexOf('演示') > -1">
          <el-input v-model="form.demonstrationUnit" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="部署地址" prop="proaductAddress">
          <el-input v-model="form.proaductAddress" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="负责人" prop="responsibility">
          <el-select v-model="form.responsibility" placeholder="请选择">
            <el-option
              v-for="item in responsibilityPeople"
              :key="item.id"
              :label="item.workerName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账号" prop="account" v-if="dialogTitle.indexOf('竞品') > -1">
          <el-input v-model="form.account" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="dialogTitle.indexOf('竞品') > -1">
          <el-input v-model="form.password" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="memo">
          <el-input type="textarea" rows="3" v-model="form.memo"></el-input>
        </el-form-item>
      </el-form>
    </hl-dialog>
  </div>
</template>
<script>
import { getToken } from "@/utils/auth";
import {
  findResponsibilityPeople,
  findLibraryById,
  demoLibrarySaveOrUpdate,
  testLibrarySaveOrUpdate,
  competitiveProductLibrarySaveOrUpdate,
} from "@/api/ProductLibraryManagement";
export default {
  props: {
    dialogTitle: String,
    dialogFormParams: Object,
    visibleDialog: {
      type: Boolean,
      default: false,
    },
    ifDetail: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      visible: this.visibleDialog,
      responsibilityPeople: [],

      imageUrl: "",
      action: "/department_entrance/api/bizfile/uploadFile",
      headers: { Authorization: getToken() },
      accept: ".jpg,.jpeg,.png,.gif,.JPG,.JPEG",
      form: {
        id: "",
        proaductName: "", //平台名称
        icon: "", //logo地址
        demonstrationUnit: "", //演示单位（演示站特有）
        proaductAddress: "", //部署地址
        responsibility: "", //负责人
        memo: "", //备注

        account: "", //（竞品站特有）
        password: "", //（竞品站特有）
      },
      rules: {
        proaductName: [
          { required: true, message: "请输入平台名称", trigger: "blur" },
          { min: 1, max: 30, message: "长度不超过 30 个字符", trigger: "blur" },
        ],
        icon: [
          { required: true, message: "请输入平台logo", trigger: "blur" },
        ],
        demonstrationUnit:
          this.dialogTitle.indexOf("演示") > -1
            ? [
                { required: true, message: "请输入演示单位", trigger: "blur" },
                {
                  min: 1,
                  max: 30,
                  message: "长度不超过 30 个字符",
                  trigger: "blur",
                },
              ]
            : [],
        proaductAddress: [
          { required: true, message: "请输入部署地址", trigger: "blur" },
        ],
        memo: [
          { min: 1, max: 200, message: "长度不超过 200 个字符", trigger: "blur" },
        ],
      },
    };
  },
  computed: {
    dialogConfig() {
      return {
        extend: {
          width: "445px",
          title: this.dialogTitle,
          close: this.closeEvent,
        },
        btnData: [
          { text: "确定", clickEvent: this.submitEvent, visible: this.ifDetail },
          { text: "取消", extend: { plain: true }, clickEvent: this.closeEvent, visible: this.ifDetail },
          { text: "返回", plain: true, clickEvent: this.closeEvent, visible: !this.ifDetail },
        ],
      };
    },
  },
  created() {
    this.init();
  },
  methods: {
    handleAvatarSuccess(response, file, fileList) {
      this.imageUrl = "/department_entrance/api/" + response.data.virtualPath;
      this.form.icon = response.data.virtualPath;
    },
    handleAvatarError() {},
    init() {
      if (this.dialogFormParams.id) {
        findLibraryById(this.dialogFormParams).then((res) => {
          this.findResponsibilityPeople();
          const {
            id = "",
            proaductName,
            icon,
            demonstrationUnit = "",
            proaductAddress,
            responsibility,
            memo,
            account = "",
            password = "",
          } = res;
          this.imageUrl = "/department_entrance/api/" + icon;
          this.form = {
            id,
            proaductName,
            icon,
            demonstrationUnit,
            proaductAddress,
            responsibility,
            account,
            password,
            memo,
          };
        });
      } else {
        this.findResponsibilityPeople();
      }
    },
    findResponsibilityPeople() {
      findResponsibilityPeople().then((res) => {
        this.responsibilityPeople = res;
      });
    },
    closeEvent() {
      this.$emit("closeDialog");
    },
    submitEvent() {
      //字段校验
      this.$refs.form.validate().then((res) => {
        let formData = {
          ...this.form,
        };
        if (this.dialogTitle.indexOf("演示") > -1) {
          demoLibrarySaveOrUpdate(formData).then((res) => {
            this.$emit("saved");
          });
        } else if (this.dialogTitle.indexOf("测试") > -1) {
          testLibrarySaveOrUpdate(formData).then((res) => {
            this.$emit("saved");
          });
        } else {
          competitiveProductLibrarySaveOrUpdate(formData).then((res) => {
            this.$emit("saved");
          });
        }
      });
    },
  },
};
</script>
<style lang="scss">
div.newLibrary {
  .el-form-item__label {
    font-weight: normal;
    color: #000;
  }
  .el-select {
    width: 100%;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 80px;
    height: 80px;
    line-height: 80px;
    text-align: center;
  }
  .avatar {
    width: 80px;
    height: 80px;
    display: block;
  }
}
</style>
