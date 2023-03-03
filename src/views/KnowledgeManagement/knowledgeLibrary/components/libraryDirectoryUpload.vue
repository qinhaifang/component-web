<template>
  <div class="libraryDirectoryUpload">
    <el-upload
      ref="upload"
      :action="action"
      :headers="headers"
      :multiple="true"
      :data="extraParams"
      :show-file-list="false"
      :accept="accept"
      :on-success="handleSuccess"
      :on-error="handleError"
    >
      <slot></slot>
    </el-upload>
  </div>
</template>
<script>
import { getToken } from "@/utils/auth";
import { message } from "@/utils/notice";
export default {
  props: {
    extraParams: Object,
  },
  data() {
    return {
      action: "/department_entrance/api/knowledge/title/uploadFile",
      headers: { Authorization: getToken() },
      accept:
        "application/msword," +
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document," +
        "application/vnd.ms-excel," +
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet," +
        "application/vnd.ms-powerpoint," +
        "application/vnd.openxmlformats-officedocument.presentationml.presentation," +
        "application/pdf,",
    };
  },
  created() {},
  methods: {
    handleSuccess(response, file, fileList) {
      this.$emit("success");
      message({ msg: "操作成功", type: "success" });
    },
    handleError(err, file, fileList) {},
  },
};
</script>
<style lang="scss" scoped>
div.libraryDirectoryUpload {
}
</style>
