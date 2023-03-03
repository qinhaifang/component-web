<template>
  <div class="productAuthorization">
    <div class="searchContainer">
      <div class="isFlex">
        <hl-form
          class="marginRight14"
          v-model="searchForm"
          ref="form"
          :form-config="formConfig"
        ></hl-form>
        <hl-button :buttonConfig="btnData"></hl-button>
      </div>
      <hl-button
        :buttonConfig="{
          text: '新增',
          clickEvent: this.handleAdd,
        }"
      ></hl-button>
    </div>
    <div class="table">
      <hl-table ref="tables" :table-config="tableConfig"></hl-table>
    </div>
    <hl-dialog :dialogConfig="dialogConfig" v-model="visibleDialog">
      <hl-form
        ref="dialogForm"
        v-model="dialogForm"
        :form-config="dialogFormConfig"
      ></hl-form>
    </hl-dialog>
  </div>
</template>
<script>
import { projectAuthorizationDeleteById, projectAuthorizationSaveOrUpdate, projectAuthorizationDownloadFile } from "@/api/authorizationlManagement";
import mixins from "@/views/mixins";
export default {
  mixins: [mixins],
  data() {
    return {
      apiRequest: true,
      searchForm: {
        projectType: "",
        obsoleteFlag: "",
        content: "",
        searchHistoryParam: "productAuthorization",
      },
      btnData: [
        {
          text: "查询",
          clickEvent: this.handleSearch,
        },
        {
          text: "重置",
          plain: true,
          clickEvent: this.handleReset,
        },
      ],

      visibleDialog: false, // 弹框默认不展示
      // 新增弹框配置
      dialogForm: {
        id: "",
        authorizationUser: "",
        projectId: "",
        projectType: "",
        mac: "",
        monitorNumber: "",
        authorizationPeriod: "",
      },
      projectList: [],
      ifDetail: false, // 是否是详情 默认false
      dialogTitle: "新增授权",
      dialogFormParams: {},
    };
  },
  computed: {
    /**表单配置 */
    formConfig() {
      return {
        layout: "inlineBlock",
        labelWidth: "78px",
        noMargin: true,
        data: [
          {
            type: "select",
            label: "产品类型：",
            width: 352,
            name: "projectType",
            options: this.dicts.projectTypeList,
          },
          {
            type: "select",
            label: "授权状态：",
            width: 340,
            name: "obsoleteFlag",
            options: this.dicts.obsoleteFlagList,
          },
          {
            type: "autocomplete",
            width: 300,
            labelWidth: "0",
            name: "content",
            http: {
              url: "/project/authorization/search", // 接口路径
              params: {
                content: "",
                searchHistoryParam: "productAuthorization",
              },
            },
            extend: {
              placeholder: "请输入产品名称、授权用户、Mac地址",
              callback: this.handleSearch,
            },
          },
        ],
      };
    },
    /**表格配置 */
    tableConfig() {
      return {
        results: [],
        autoHeight: true,
        data: [
          {
            name: "authorizationUser",
            label: "授权用户",
          },
          {
            name: "projectName",
            label: "产品名称",
          },
          {
            name: "projectType",
            label: "产品类型",
            formatter: true,
            options: this.dicts.projectTypeList,
          },
          {
            name: "mac",
            label: "MAC地址",
          },
          {
            name: "monitorNumber",
            label: "监测设备数量",
          },
          {
            name: "authorizationPeriod",
            label: "授权周期",
            formatter: true,
            options: this.dicts.authorizationPeriodList,
          },
          {
            name: "obsoleteFlag",
            label: "授权状态",
            formatter: true,
            options: this.dicts.obsoleteFlagList,
            extend: { sortable: false },
          },
          {
            name: "operation",
            label: "操作",
            type: "operation",
            data: [
              {
                content: "下载",
                icon: "iconxiazai",
                visibleIcon: true,
                visibleTooltip: true,
                clickEvent: this.handleDownLoad,
              },
              {
                content: "查看",
                icon: "iconchakan",
                visibleIcon: true,
                visibleTooltip: true,
                clickEvent: this.handleDetail,
              },
              {
                content: "编辑",
                icon: "iconbianji",
                visibleIcon: true,
                visibleTooltip: true,
                clickEvent: this.handleEdit,
              },
              {
                content: "删除",
                icon: "iconshanchu",
                visibleIcon: true,
                visibleTooltip: true,
                type: "danger",
                clickEvent: this.handleDel,
              },
            ],
          },
        ],
        http: {
          url: "/project/authorization/findListByParam",
          params: this.searchForm,
        },
      };
    },
    /**弹框配置 */
    dialogConfig() {
      return {
        extend: {
          width: "480px",
          title: this.dialogTitle,
          close: this.closeEvent,
        },
        btnData: [
          {
            text: "确定",
            clickEvent: this.submitEvent,
            visible: this.ifDetail,
          },
          {
            text: "取消",
            extend: {
              plain: true,
            },
            clickEvent: this.closeEvent,
            visible: this.ifDetail,
          },
          {
            text: "返回",
            plain: true,
            clickEvent: this.returnEvent,
            visible: !this.ifDetail,
          },
        ],
      };
    },
    /**form配置 */
    dialogFormConfig() {
      return {
        layout: "flow",
        disabled: this.ifDetail,
        apiRequest: this.apiRequest,
        extend: {
          labelWidth: "75px",
          labelPosition: "right",
        },
        http: {
          url: "/project/authorization/findById",
          params: this.dialogFormParams,
          onSuccess: (res) => {
            return {
              ...res,
            };
          },
        },
        data: [
          {
            type: "input",
            label: "授权用户",
            name: "authorizationUser",
            rules: [
              { required: true, message: "请输入授权用户", trigger: "blur" },
              { min: 1, max: 30, message: "长度不超过 30 个字符", trigger: "blur" },
            ],
          },
          {
            type: "select",
            label: "产品",
            name: "projectId",
            extend: {
              disabled: this.ifDetail,
              change: (v) => {
                this.dialogForm.projectType = this.projectList.filter((item) => item.id === v)[0].projectType;
              },
            },
            props: {
              value: "id",
              label: "projectName",
            },
            http: {
              url: "/project/findListByParam",
              method: "post",
              params: {
                projectType: "",
                content: "",
                searchHistoryParam: "productManagement",
                pageNum: 1,
                pageSize: 0,
              },
              onSuccess: (res) => {
                this.projectList = res.pageData;
                return res.pageData;
              },
            },
            rules: [
              { required: true, message: "请选择产品", trigger: "change" },
            ],
          },
          {
            type: "select",
            label: "产品类型",
            name: "projectType",
            disabled: true,
            options: this.dicts.projectTypeList,
          },
          {
            type: "input",
            label: "MAC地址",
            name: "mac",
            rules: [
              { required: true, message: "请输入MAC地址", trigger: "blur" },
              { min: 1, max: 30, message: "长度不超过 30 个字符", trigger: "blur" },
            ],
          },
          {
            type: "number",
            label: "监测数量",
            name: "monitorNumber",
            extend: {
              min: 1,
            },
            rules: [
              { required: true, message: "请输入监测数量", trigger: "blur" },
            ],
          },
          {
            type: "radio",
            label: "授权周期",
            name: "authorizationPeriod",
            options: this.dicts.authorizationPeriodList,
            rules: [
              { required: true, message: "请选择授权周期", trigger: "blur" },
            ],
          },
        ],
      };
    },
  },
  mounted() {},
  methods: {
    handleDownLoad(item) {
      const { id } = item;
      projectAuthorizationDownloadFile({ id }).then((res) => {
        const { fileName, filePath } = res;
        const elink = document.createElement("a");
        elink.download = fileName;
        elink.style.display = "none";
        elink.href = "/department_entrance/api/" + filePath;
        document.body.appendChild(elink);
        elink.click();
        URL.revokeObjectURL(elink.href); // 释放URL 对象
        document.body.removeChild(elink);
      });
    },
    // 新增
    handleAdd() {
      this.dialogForm = this.$options.data().dialogForm;
      this.dialogTitle = "新增授权";
      this.dialogFormParams = { id: "" };
      this.visibleDialog = true;
      this.apiRequest = false;
      this.ifDetail = false;
      this.$refs.form.resetForm();
    },
    // 查看
    handleDetail(item) {
      this.ifDetail = true;
      this.dialogTitle = "查看授权";
      this.dialogFormParams = { id: item.id };
      this.apiRequest = true;
      this.visibleDialog = true;
    },
    // 编辑
    handleEdit(item) {
      this.ifDetail = false;
      this.dialogTitle = "编辑授权";
      this.apiRequest = true;
      this.dialogFormParams = {
        id: item.id,
      };
      this.visibleDialog = true;
    },
    // 返回
    returnEvent() {
      this.visibleDialog = false;
      this.dialogForm = this.$options.data().dialogForm;
    },
    // 删除
    handleDel(item) {
      this.$notice.confirm({
        msg: "确定要删除么？",
        title: "删除",
        params: { id: item.id },
        onSubmit: this.handleDel_,
      });
    },
    handleDel_(params) {
      projectAuthorizationDeleteById(params).then(() => {
        this.freshTable();
      });
    },
    // 点击确定
    submitEvent() {
      this.$refs.dialogForm.validate().then((res) => {
        const formData = {
          ...this.dialogForm,
        };
        // 向后台发送请求
        projectAuthorizationSaveOrUpdate(formData).then((res) => {
          this.visibleDialog = false;
          this.freshTable();
          this.dialogForm = this.$options.data().dialogForm;
        });
      });
    },
    // 点击取消
    closeEvent() {
      this.visibleDialog = false;
    },
  },
};
</script>
<style scoped lang="scss">
::v-deep {
  .el-input-number--mini {
    width: 33.33%;
  }
}
</style>


