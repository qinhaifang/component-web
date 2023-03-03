<template>
  <div class="departmentManagement">
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
          permissions: ['departmentManagement:add'],
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
import { departmentSaveOrUpdate, departmentDeleteById, findDepartmentNameAll } from "@/api/departmentManagement";
import { inputValidStation } from "@/utils/formItemValidate";
import mixins from "@/views/mixins";
export default {
  mixins: [mixins],
  data() {
    return {
      apiRequest: true,
      searchForm: {
        content: "",
        searchHistoryParam: "departmentManagement",
      },

      // 新增弹框配置
      dialogForm: {
        id: "",
        parentId: "",
        deptName: "",
        leader: "",
        memo: "",
        disabled: true,
      },
      ifDetail: false, // 是否是详情 默认false
      visibleDialog: false, // 弹框默认不展示
      dialogTitle: "新增部门",
      previousMenuList: [], // 弹框上级菜单数据
      dialogFormParams: {},
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
            type: "autocomplete",
            width: 300,
            labelWidth: "0",
            name: "content",
            http: {
              url: "/system/department/search", // 接口路径
              params: {
                searchHistoryParam: "departmentManagement", // 查询历史参数  给后台传的唯一值
                content: "", // 传给后台得值
              },
            },
            extend: {
              placeholder: "请输入部门名称、负责人",
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
        order: false,
        autoHeight: true,
        props: { results: "" },
        extend: {
          "row-key": "id", //行唯一标记
          "tree-props": {
            children: "childrenDept",
            hasChildren: "hasChildren",
          },
          stripe: false,
        },
        data: [
          {
            name: "deptName",
            label: "部门名称",
            extend: { sortable: false },
          },
          {
            name: "workerNum",
            label: "部门人数",
            extend: { sortable: false },
          },
          {
            name: "leaderName",
            label: "负责人",
            extend: { sortable: false },
          },
          {
            name: "parentName",
            label: "上级部门",
            extend: { sortable: false },
          },
          {
            name: "operation",
            label: "操作",
            type: "operation",
            data: [
              {
                content: "添加子部门",
                icon: "icontianjia",
                visibleIcon: true,
                visibleTooltip: true,
                clickEvent: this.departmentAdd,
                permissions: ["departmentManagement:add"],
              },
              {
                content: "编辑",
                icon: "iconbianji",
                visibleIcon: true,
                visibleTooltip: true,
                clickEvent: this.departmentEdit,
                permissions: ["departmentManagement:edit"],
              },
              {
                content: "删除",
                icon: "iconshanchu",
                visibleIcon: true,
                visibleTooltip: true,
                type: "danger",
                clickEvent: this.departmentDel,
                permissions: ["departmentManagement:delete"],
              },
            ],
          },
        ],
        http: {
          url: "/system/department/findListByParam",
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
          labelWidth: "80px",
          labelPosition: "right",
        },
        http: {
          url: "/system/department/findById",
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
            label: "部门名称",
            name: "deptName",
            rules: [
              { required: true, message: "请输入部门名称", trigger: "blur" },
              { min: 1, max: 30, message: "长度不超过 30 个字符", trigger: "blur" },
            ],
          },
          {
            type: "previousMenu",
            label: "上级部门",
            name: "parentId",
            hasBorder: true,
            options: this.previousMenuList,
            topLevelLabel: "合力创新",
          },
          {
            type: "select",
            label: "部门负责人",
            name: "leader",
            props: {
              value: "id",
              label: "workerName",
            },
            http: {
              url: "/system/workerUser/findAll",
              method: "post",
              onSuccess: (res) => {
                return res;
              },
            },
          },
          {
            type: "textarea",
            label: "备注",
            name: "memo",
            rules: [
              { min: 1, max: 200, message: "长度不超过 200 个字符", trigger: "blur" },
            ],
            extend: {
              disabled: this.ifDetail,
              autosize: {
                minRows: 3,
              },
            },
          },
        ],
      };
    },
  },
  mounted() {},
  methods: {
    /** 查询菜单下拉树结构 */
    getTreeselect() {
      findDepartmentNameAll().then((response) => {
        this.previousMenuList = [];
        this.previousMenuList = response;
      });
    },
    // 新增
    handleAdd() {
      this.dialogForm = this.$options.data().dialogForm;
      this.dialogTitle = "新增部门";
      this.dialogFormParams = {
        id: "",
      };
      this.visibleDialog = true;
      this.apiRequest = false;
      this.ifDetail = false;
      this.$refs.form.resetForm();
      this.getTreeselect();
    },
    // 添加子部门
    departmentAdd(item) {
      this.dialogForm = this.$options.data().dialogForm;
      this.dialogTitle = "添加子部门";
      this.dialogFormParams = {
        id: "",
      };
      this.dialogForm.parentId = item.id;
      this.visibleDialog = true;
      this.apiRequest = false;
      this.ifDetail = false;
      this.$refs.form.resetForm();
      this.getTreeselect();
    },
    // 编辑
    departmentEdit(item) {
      this.ifDetail = false;
      this.dialogTitle = "编辑部门";
      this.apiRequest = true;
      this.dialogFormParams = {
        id: item.id,
      };
      this.visibleDialog = true;
      this.getTreeselect();
    },
    // 返回
    returnEvent() {
      this.visibleDialog = false;
      this.dialogForm = this.$options.data().dialogForm;
    },
    // 删除
    departmentDel(item) {
      if (item.workerNum > 0) {
        this.$notice.confirm({
          msg: "请先移除该部门中的员工再进行删除",
          title: "删除",
        });
      } else {
        this.$notice.confirm({
          msg: "确定要删除么？",
          title: "删除",
          params: { id: item.id },
          onSubmit: this.handleDel,
        });
      }
    },
    handleDel(params) {
      departmentDeleteById(params).then(() => {
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
        departmentSaveOrUpdate(formData).then((res) => {
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
