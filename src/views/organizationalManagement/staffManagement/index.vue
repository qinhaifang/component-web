<template>
  <div class="staffManagement">
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
        :buttonConfig="[
          {
            text: '导出',
            clickEvent: this.handleExport,
            permissions: ['staffManagement:export'],
          },
          {
            text: '新增',
            clickEvent: this.handleAdd,
            permissions: ['staffManagement:edit'],
          },
        ]"
      ></hl-button>
    </div>
    <div class="content">
      <el-row :gutter="10">
        <el-col :span="5">
          <div class="table">
            <hl-scroll ref="scroll">
              <el-tree
                ref="tree"
                node-key="value"
                highlight-current
                :default-expand-all="true"
                :expand-on-click-node="false"
                :data="data"
                :props="defaultProps"
                :render-content="renderContent"
                @node-click="handleNodeClick"
              >
              </el-tree>
            </hl-scroll>
          </div>
        </el-col>
        <el-col :span="19">
          <div class="table">
            <hl-table ref="tables" :table-config="tableConfig"></hl-table>
          </div>
        </el-col>
      </el-row>
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
import { findDepartmentNameAll, workerUserDeleteById, workerUserSaveOrUpdate } from "@/api/staffManagement";
import { exportFile } from "@/api/common";
import mixins from "@/views/mixins";

export default {
  mixins: [mixins],
  data() {
    return {
      //部门树相关
      data: [],
      currentKey: "",
      defaultProps: {
        children: "children",
        label: "label",
      },
      //表格相关
      apiRequest: true,
      searchForm: {
        deptId: "",
        content: "",
        searchHistoryParam: "staffManagement",
      },
      // 新增弹框配置
      dialogForm: {
        id: "",
        workerName: "",
        phoneNumber: "",
        deptId: "",
        job: "",
        directSuperior: "",
        workerType: "",
        entryTime: "",
        memo: "",
        disabled: true,
      },
      ifDetail: false, // 是否是详情 默认false
      visibleDialog: false, // 弹框默认不展示
      dialogTitle: "新增员工",
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
              url: "system/workerUser/search", // 接口路径
              params: {
                searchHistoryParam: "staffManagement", // 查询历史参数  给后台传的唯一值
                content: "", // 传给后台得值
              },
            },
            extend: {
              placeholder: "请输入员工姓名",
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
            name: "workerName",
            label: "员工姓名",
          },
          {
            name: "job",
            label: "岗位",
            formatter: true,
            options: this.dicts.jobTypeList,
          },
          {
            name: "phoneNumber",
            label: "手机号",
          },
          {
            name: "entryTime",
            label: "入职时间",
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
                clickEvent: this.departmentDetail,
                permissions: ["staffManagement:check"],
              },
              {
                content: "编辑",
                icon: "iconbianji",
                visibleIcon: true,
                visibleTooltip: true,
                clickEvent: this.departmentEdit,
                permissions: ["staffManagement:edit"],
              },
              {
                content: "删除",
                icon: "iconshanchu",
                visibleIcon: true,
                visibleTooltip: true,
                type: "danger",
                clickEvent: this.departmentDel,
                permissions: ["staffManagement:delete"],
              },
            ],
          },
        ],
        http: {
          url: "/system/workerUser/findListByParam",
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
          url: "/system/workerUser/findById",
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
            label: "员工姓名",
            name: "workerName",
            rules: [
              { required: true, message: "请输入员工姓名", trigger: "blur" },
              { min: 1, max: 30, message: "长度不超过 30 个字符", trigger: "blur" },
            ],
          },
          {
            type: "input",
            label: "手机号",
            name: "phoneNumber",
            rules: [
              { required: true, message: "请输入手机号", trigger: "blur" },
            ],
          },
          {
            type: "previousMenu",
            label: "所属部门",
            name: "deptId",
            hasBorder: true,
            options: this.previousMenuList,
            topLevelLabel: "合力创新",
            disabled: this.ifDetail,
            // rules: [
            //   { required: true, message: "请选择部门", trigger: "change" },
            // ],
          },
          {
            type: "select",
            label: "岗位",
            name: "job",
            options: this.dicts.jobTypeList,
            rules: [
              { required: true, message: "请选择岗位", trigger: "change" },
            ],
          },
          {
            type: "input",
            label: "直属上级",
            name: "directSuperior",
          },
          {
            type: "select",
            label: "人员类型",
            name: "workerType",
            options: this.dicts.workerTypeList,
          },
          {
            type: "date",
            label: "入职时间",
            name: "entryTime",
            formDate: "datetime",
            valueFormat: "yyyy-MM-dd",
            rules: [
              { required: true, message: "请选择入职时间", trigger: "blur" },
            ],
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
              autosize: { minRows: 3 },
            },
          },
        ],
      };
    },
  },
  mounted() {
    this.initTree();
  },
  methods: {
    renderContent(h, { data }) {
      const { label, count } = data;
      return <span>{label + "（" + count + "人）"}</span>;
    },
    initTree() {
      let total = 0;
      findDepartmentNameAll().then((response) => {
        response.forEach((item) => (total += item.count));
        this.data = [
          {
            children: response,
            count: total,
            label: "合力创新",
            parentId: "",
            url: null,
            value: "",
          },
        ];
        this.$nextTick(() => {
          this.$refs.tree.setCurrentKey(this.currentKey);
        });
      });
    },
    handleNodeClick(obj, node, item) {
      this.currentKey = obj.value;
      this.searchForm.deptId = obj.value;
      this.handleReset();
    },
    /** 查询所属部门菜单下拉树结构 */
    getTreeselect() {
      findDepartmentNameAll().then((response) => {
        this.previousMenuList = response;
      });
    },
    //导出
    handleExport() {
      let obj = {
        ...this.searchForm,
        pageSize: 0,
        pageNum: 1,
      };
      exportFile("/system/workerUser/exportFile", obj);
    },
    // 新增
    handleAdd() {
      this.dialogForm = this.$options.data().dialogForm;
      this.dialogTitle = "新增员工";
      this.dialogFormParams = {
        id: "",
      };
      this.visibleDialog = true;
      this.apiRequest = false;
      this.ifDetail = false;
      this.$refs.form.resetForm();
      this.getTreeselect();
    },
    // 编辑
    departmentEdit(item) {
      this.ifDetail = false;
      this.dialogTitle = "编辑员工";
      this.apiRequest = true;
      this.dialogFormParams = {
        id: item.id,
      };
      this.visibleDialog = true;
      this.getTreeselect();
    },
    departmentDetail(item) {
      this.ifDetail = true;
      this.dialogTitle = "查看员工";
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
      this.$notice.confirm({
        msg: "确定要删除么？",
        title: "删除",
        params: { id: item.id },
        onSubmit: this.handleDel,
      });
    },
    handleDel(params) {
      workerUserDeleteById(params).then(() => {
        this.freshTable();
        this.initTree();
      });
    },
    // 点击确定
    submitEvent() {
      this.$refs.dialogForm.validate().then((res) => {
        const formData = {
          ...this.dialogForm,
        };
        // 向后台发送请求
        workerUserSaveOrUpdate(formData).then((res) => {
          this.visibleDialog = false;
          this.freshTable();
          this.initTree();
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
div.content {
  overflow-x: hidden;
  height: calc(100% - 99px);
  .el-row {
    height: 100%;
    .el-col {
      height: 100%;
      > div {
        height: 100%;
      }
    }
  }
  ::v-deep .el-tree {
    height: 100%;
    background: #ffffff;
    .el-tree-node__content {
      height: 40px;
      .el-tree-node__expand-icon {
        padding: 6px 9px;
      }
    }
  }
}
</style>
