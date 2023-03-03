/* * @Author: zhangzc * @Email: zhangzc2@guahao.com * @Date: 2019-04-25 14:53:09
* @Last Modified by: qiuwt * @Last Modified time: 2020-12-26 15:20:57 *
@Description: 文件上传 */

<template>
  <div class="upload-box">
    <el-button
      v-if="mode === 'btn' && fileList.length"
      :size="size"
      @click="clearClearList"
      :disabled="currentDisabled"
      :type="btnType"
    >
      {{ modeBtnLoadLabel }}（{{ fileList.length }}）
    </el-button>
    <el-upload
      ref="file"
      v-else
      :class="[
        {
          'upload-readonly': readonly || fileList.length >= (extend.limit || 1),
        },
        'upload-item',
      ]"
      :on-success="handleSuccess"
      :on-error="handleFaild"
      :on-progress="handleProgress"
      :before-upload="handleBefore"
      :on-exceed="handleExceed"
      :disabled="currentDisabled"
      v-bind="
        getMergedObject(extend, {
          name: 'file',
          limit: 1,
          action: http.url || bkConfig.uploadPath,
          showFileList: false,
          fileList: fileList,
        })
      "
      v-on="extend"
    >
      <el-button
        v-if="
          !readonly && !uploadStatus && fileList.length < (extend.limit || 1)
        "
        :size="size"
        :disabled="currentDisabled"
        :type="btnType"
      >
        {{ buttonLabel }}
      </el-button>
      <el-button
        v-if="!readonly && uploadStatus"
        :size="size"
        :disabled="true"
        :loading="true"
        :type="btnType"
      >
        {{ loadingLabel }}
      </el-button>

      <div slot="tip" v-if="hasFileList" class="tip-box">
        <div v-if="!readonly && tip" v-html="tip" class="el-upload__tip" />
        <!-- list -->
        <bk-file-list
          ref="fileList"
          :disabled="currentDisabled"
          :http="http"
          :file-data="fileList"
          :readonly="readonly"
          :response-file-props="responseFileProps"
          :preview-type="previewType"
          :img-readonly-type="imgReadonlyType"
        />
        <!-- list end -->
      </div>
    </el-upload>
  </div>
</template>
<script>
import { getMergedObject, getUrlSuffix } from "@/utils/util";
import BkFileList from "./file-list";

export default {
  name: "BkUpload",
  components: {
    BkFileList,
  },
  // 向子元素注入属性
  provide() {
    return {
      medUpload: this,
    };
  },
  inject: {
    elFormItem: {
      default: () => {},
    },
  },
  props: {
    /**
     * 上传模式 btn 覆盖上传
     */
    mode: {
      type: String,
      default: "",
    },
    // 上传文件的接口相关配置
    http: {
      type: Object,
      default: () => ({}),
    },
    buttonLabel: {
      type: String,
      default: "点击上传",
    },
    loadingLabel: {
      type: String,
      default: "上传中...",
    },
    modeBtnLoadLabel: {
      type: String,
      default: "再次上传",
    },
    value: {
      type: [String, Array],
      default: "",
    },
    // 只读
    readonly: {
      type: Boolean,
      default: false,
    },
    // 最大
    maxSize: {
      type: Number,
      default: 100,
    },
    // 提醒文案
    tip: {
      type: String,
      default: "",
    },
    // 按钮大小
    size: {
      type: String,
      default: "small",
    },
    // 按钮类型
    btnType: {
      type: String,
      default: "primary",
    },
    // 禁止操作
    disabled: {
      type: [Boolean, Function],
      default: false,
    },
    // 文件响应数据键值
    responseFileProps: {
      type: Object,
      default: () => ({}),
    },
    // 是否需要展示文件列表
    hasFileList: {
      type: Boolean,
      default: true,
    },
    // 支持所有elementUI组件的配置
    extend: {
      type: Object,
      default: () => ({}),
    },
    // 上传前钩子
    uploadBefore: {
      type: Function,
      default: () => () => {},
    },
    // 上传成功钩子
    uploadSuccess: {
      type: Function,
      default: () => () => {},
    },
    // 上传失败钩子
    uploadFaild: {
      type: [Function, String],
      validator(val) {
        return val ? typeof val === "function" : true;
      },
      default: "",
    },
    // 文件预览方式 0：弹窗/客户端打开  1：浏览器新页签打开
    previewType: {
      type: Number,
      default: 0,
    },
    previewCallback: {
      type: [Function, String],
      validator(val) {
        return val ? typeof val === "function" : true;
      },
      default: "",
    },
    // readonly为true时，图片显示的方式，0：缩略图展示 1：文件名展示
    imgReadonlyType: {
      type: Number,
      default: 0,
    },
  },
  data() {
    const bkConfig = this.$root.bkConfig || this.$bkConfig;
    return {
      bkConfig,
      test: undefined,
      getMergedObject,
      // 显示数据
      fileList: [],
      // 上传的状态
      uploadStatus: false,
      fileProps: Object.assign(
        {
          fileId: "fileId",
        },
        bkConfig.responseFileProps,
        this.responseFileProps
      ),
      currentDisabled: this.hangdleAttrFn(this.disabled),
    };
  },
  watch: {
    value(data) {
      this.fileList = this.formattValueToArray(data);
    },
    disabled(val, old) {
      if (val === old) return;
      this.currentDisabled = this.hangdleAttrFn(val);
    },
  },
  created() {
    this.fileList = this.formattValueToArray(this.value);
  },
  methods: {
    /**
     * 属性支持function
     * @param { Functon,Boolean } attr
     */
    hangdleAttrFn(attr) {
      if (typeof attr === "function") {
        return attr(this);
      }
      return attr;
    },
    /**
     * 将字符串转为数组
     * @param {Number} data 索引位置
     */
    formattValueToArray(data) {
      const list = [];
      if (data && typeof data === "string") {
        data.split(",").forEach((item) => {
          list.push({
            [this.fileProps.fileId]: item,
          });
        });
      }
      if (Array.isArray(data)) {
        data.forEach((item) => {
          let subItem = item;
          if (typeof item === "string") {
            subItem = {
              [this.fileProps.fileId]: item,
            };
          }
          list.push(subItem);
        });
      }
      return list;
    },
    /**
     * 清除列表
     */
    clearClearList() {
      this.fileList = [];
    },
    /**
     * 删除文件
     * @param {Number} i 索引位置
     */
    handleFileRemove(i) {
      this.fileList.splice(i, 1);
      this.handleValue(this.fileList);
    },

    /**
     * 触发表单变化
     * @param {Array} fileList 文件数据
     */
    handleValue(fileList) {
      this.$emit("input", fileList);
      if (this.elFormItem) {
        this.elFormItem.onFieldChange();
      }
    },

    /**
     * 上传前钩子，默认进行文件大小校验
     * @param {Object} file 文件数据
     */
    handleBefore(file) {
      let bool = true;
      const max = this.maxSize * 1024 * 1024;
      const { accept = "" } = this.extend;
      if (file.size > max) {
        this.$message.warning(`文件最大上传限制${this.maxSize}M`);
        bool = false;
      } else if (file.name.indexOf(",") !== -1) {
        this.$message.warning("文件名称不能存在英文逗号");
        bool = false;
      } else if (accept && accept.indexOf("/") === -1) {
        const suffix = getUrlSuffix(file.name);
        const acceptArr = accept.replace(/\./g, "").toLowerCase().split(",");
        if (!acceptArr.includes(suffix)) {
          this.$message.warning(`仅支持上传${acceptArr.join("、")}格式文件`);
          bool = false;
        }
      } else if (typeof this.uploadBefore === "function") {
        bool = this.uploadBefore(file, this);
      }
      return bool === false ? false : bool;
    },

    /**
     * 上传中钩子，改变上传状态
     */
    handleProgress() {
      this.uploadStatus = true;
    },

    /**
     * 上传成功钩子
     * @param {Object} res 文件上传响应结果数据
     * @param {Object} file 文件信息
     * @param {Object} list 文件列表数据
     */
    handleSuccess(res, file, list) {
      const { code } = this.bkConfig.responseProps;
      let { successCode } = this.bkConfig.responseProps;
      if (successCode === undefined) successCode = "0"; // 默认0
      this.uploadStatus = false;
      if (res[code] !== successCode) {
        if (typeof this.uploadFaild === "function") {
          this.uploadFaild(res, file, list, this);
        } else {
          this.$message.error(res.message || "文件上传失败，请重新尝试");
        }
        list.splice(list.length - 1, 1);
        return;
      }
      const fileList = [];
      // 去重
      list.forEach((item) => {
        if (item.response && item.response.data) {
          fileList.push(item.response.data);
        } else {
          // 非上传文件添加
          fileList.push(item);
        }
      });

      this.$refs.file.clearFiles();
      this.fileList = fileList;
      this.handleValue(fileList);

      if (typeof this.uploadSuccess === "function") {
        this.uploadSuccess(res, file, list, this);
      } else {
        this.$message.success("文件上传成功");
      }
    },

    /**
     * 上传失败钩子
     * @param {Object} err 失败原因
     * @param {Object} file 文件信息
     * @param {Object} list 文件列表数据
     */
    handleFaild(err, file, list) {
      if (typeof this.http.onFaild === "function") {
        this.uploadFaild(err, file, list, this);
      }
      this.$message.error("文件上传失败，请重新尝试");
      this.uploadStatus = false;
    },

    /**
     * 文件超出个数限制时的钩子
     */
    handleExceed(files, fileList) {
      // 格式提示
      this.$message.warning(
        `不能超过 ${this.extend.limit || 1} 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
  },
};
</script>
