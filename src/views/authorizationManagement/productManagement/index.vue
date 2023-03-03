<template>
  <div class="productManagement">
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
import { projectDeleteById, projectSaveOrUpdate } from "@/api/authorizationlManagement";
import mixins from "@/views/mixins";
export default {
  mixins: [mixins],
  data() {
    return {
      apiRequest: true,
      searchForm: {
        projectType: "",
        content: "",
        searchHistoryParam: "productManagement",
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
        projectName: "",
        projectType: "",
      },
      ifDetail: false, // 是否是详情 默认false
      dialogTitle: "新增产品",
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
            width: 340,
            name: "projectType",
            options: this.dicts.projectTypeList,
          },
          {
            type: "autocomplete",
            width: 300,
            labelWidth: "0",
            name: "content",
            http: {
              url: "/project/search", // 接口路径
              params: {
                content: "", // 传给后台得值
                searchHistoryParam: "productManagement", // 查询历史参数  给后台传的唯一值
              },
            },
            extend: {
              placeholder: "请输入产品名称",
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
            name: "operation",
            label: "操作",
            type: "operation",
            data: [
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
          url: "/project/findListByParam",
          params: this.searchForm,
        },
      };
    },
    /**弹框配置 */
    dialogConfig() {
      return {
        extend: {
          width: "445px",
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
          labelWidth: "65px",
          labelPosition: "right",
        },
        http: {
          url: "/project/findById",
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
            label: "产品名称",
            name: "projectName",
            rules: [
              { required: true, message: "请输入产品名称", trigger: "blur" },
              { min: 1, max: 30, message: "长度不超过 30 个字符", trigger: "blur" },
            ],
          },
          {
            type: "select",
            label: "产品类型",
            name: "projectType",
            options: this.dicts.projectTypeList,
            rules: [
              { required: true, message: "请选择产品类型", trigger: "change" },
            ],
          },
        ],
      };
    },
  },
  mounted() {},
  methods: {
    // 新增
    handleAdd() {
      this.dialogForm = this.$options.data().dialogForm;
      this.dialogTitle = "新增产品";
      this.dialogFormParams = { id: "" };
      this.visibleDialog = true;
      this.apiRequest = false;
      this.ifDetail = false;
      this.$refs.form.resetForm();
    },
    // 查看
    handleDetail(item) {
      this.ifDetail = true;
      this.dialogTitle = "查看产品";
      this.dialogFormParams = { id: item.id };
      this.apiRequest = true;
      this.visibleDialog = true;
    },
    // 编辑
    handleEdit(item) {
      this.ifDetail = false;
      this.dialogTitle = "编辑产品";
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
      projectDeleteById(params).then(() => {
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
        projectSaveOrUpdate(formData).then((res) => {
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
<style scoped lang="scss"></style>

