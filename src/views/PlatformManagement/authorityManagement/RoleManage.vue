<template>
  <div class="roleManage">
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
          permissions: ['RoleManage:edit'],
        }"
      ></hl-button>
    </div>
    <div class="table">
      <hl-table ref="tables" :table-config="tableConfig"></hl-table>
    </div>
    <hl-dialog :dialogConfig="dialogConfig" v-model="visibleDialog">
      <hl-title title="角色信息"></hl-title>
      <hl-form
        ref="dialogForm"
        v-model="dialogForm"
        :form-config="dialogFormConfig"
      ></hl-form>
      <hl-title class="marginTop20" title="权限配置"></hl-title>
      <hl-input
        v-model="powerValue"
        :inputConfig="inputConfig"
        class="marginBottom5"
      >
      </hl-input>
      <hl-tree
        :treeConfig="treeConfig"
        :filterText="powerValue"
        ref="tree"
        v-if="treeShow"
      ></hl-tree>
    </hl-dialog>
  </div>
</template>
<script>
import { inputValidStation } from "@/utils/formItemValidate";
import {
  roleSaveOrUpdate,
  rolefindById,
  roleDeleteById,
  perFindListByParam,
} from "@/api/role";
import mixins from "@/views/mixins";
export default {
  mixins: [mixins],
  data() {
    return {
      searchForm: {
        status: "",
        content: "",
        searchHistoryParam: "role",
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
      // 新增弹框配置
      dialogForm: {
        id: "",
        roleName: "",
        status: 1, //用户状态
        menuIdList: [],
        disabled: true,
      },
      ifDetail: false, // 是否是详情 默认false
      visibleDialog: false, // 弹框默认不展示
      dialogTitle: "新增角色",
      powerValue: "", // 权限过滤input
      inputConfig: {
        extend: {
          placeholder: "请输入关键字进行过滤",
          prefixVisible: true,
          prefixIcon: "el-input__icon el-icon-search",
        },
      },
      permissionList: [], //权限字符
      /**树形配置 */
      treeConfig: {
        options: [],
        extend: {
          showCheckbox: true,
          nodeKey: "value",
          defaultCheckedKeys: [],
          check: this.treeCheckEvent,
          disabled: true,
          "render-content": function (h, { data }) {
            const { parentId, label, url } = data;
            if (parentId === "0") {
              if (url.indexOf("Management") > -1) {
                return <span>{label}(管理端)</span>;
              } else {
                return <span>{label}(用户端)</span>;
              }
            } else {
              return <span>{label}</span>;
            }
          },
        },
        defaultProps: {
          children: "children",
          label: "label",
        },
      },
      treeShow: true,
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
            label: "角色状态：",
            width: 352,
            name: "status",
            options: this.dicts.DicKeyByStatus,
          },
          {
            type: "autocomplete",
            width: 300,
            labelWidth: "0",
            name: "content",
            http: {
              url: "/system/role/search", // 接口路径
              params: {
                searchHistoryParam: "role", // 查询历史参数  给后台传的唯一值
                content: "", // 传给后台得值
              },
            },
            extend: {
              placeholder: "请输入角色名称",
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
            name: "roleName",
            label: "角色名称",
          },
          {
            name: "status",
            label: "角色状态",
            formatter: true,
            options: this.dicts.DicKeyByStatus,
          },
          {
            name: "createTime",
            label: "创建时间",
          },
          {
            name: "userNum",
            label: "关联账号",
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
                clickEvent: this.userDetail,
                permissions: ["RoleManage:check"],
              },
              {
                content: "编辑",
                icon: "iconbianji",
                visibleIcon: true,
                visibleTooltip: true,
                clickEvent: this.userEdit,
                permissions: ["RoleManage:edit"],
              },
              {
                content: "删除",
                icon: "iconshanchu",
                visibleIcon: true,
                visibleTooltip: true,
                type: "danger",
                clickEvent: this.userDel,
                permissions: ["RoleManage:delete"],
              },
            ],
          },
        ],
        http: {
          url: "/system/role/findListByParam",
          params: this.searchForm,
        },
      };
    },
    /**弹框配置 */
    dialogConfig() {
      return {
        height: "500",
        extend: {
          width: "545px",
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
        extend: { labelWidth: "65px", labelPosition: "right" },
        data: [
          {
            type: "input",
            label: "角色名称",
            name: "roleName",
            extend: {
              disabled: this.ifDetail,
            },
            rules: [
              {
                required: true,
                message: "请输入角色名称",
                trigger: "blur",
              },
              {
                min: 1,
                max: 10,
                message: "长度不超过 10 个字符",
                trigger: "blur",
              },
              {
                validator: inputValidStation,
                trigger: ["blur", "change"],
              },
            ],
          },
          {
            type: "switch",
            label: "角色状态",
            name: "status",
            extend: {
              activeValue: 1,
              inactiveValue: 0,
              disabled: this.ifDetail,
            },
          },
        ],
      };
    },
  },
  methods: {
    // 查询所有权限
    handlePerList() {
      perFindListByParam({}).then((res) => {
        this.treeConfig.options = res;
        if (this.ifDetail) {
          this.treeConfig.options.map((item) => {
            item.disabled = true;
            item.children.map((k) => {
              k.disabled = true;
              k.children.map((child) => {
                child.disabled = true;
              });
            });
          });
        } else {
          this.treeConfig.options.map((item) => {
            item.disabled = false;
            item.children.map((k) => {
              k.disabled = false;
              k.children.map((child) => {
                child.disabled = false;
              });
            });
          });
        }
      });
    },
    // 复选框点击
    treeCheckEvent(currentObj, status) {
      this.dialogForm.menuIdList = [];
      this.dialogForm.menuIdList = status.checkedKeys;
    },

    // 新增
    handleAdd() {
      this.$refs.form.resetForm();
      this.dialogForm = this.$options.data().dialogForm;
      this.visibleDialog = true;
      this.ifDetail = false;
      this.dialogTitle = "新增角色";
      this.handlePerList();
      this.treeConfig.extend.defaultCheckedKeys = [];
    },
    // 查看
    userDetail(item) {
      this.visibleDialog = true;
      this.ifDetail = true;
      this.dialogTitle = "查看角色";
      this.handlePerList();
      this.getRoleInfo(item.id);
    },
    // 编辑
    userEdit(item) {
      this.visibleDialog = true;
      this.ifDetail = false;
      this.dialogTitle = "编辑角色";
      this.handlePerList();
      this.getRoleInfo(item.id);
    },
    // 获取角色信息
    getRoleInfo(id) {
      let obj = {
        id: id,
      };
      this.treeShow = false;
      rolefindById(obj).then((res) => {
        this.dialogForm = res;
        this.treeShow = true;
        this.treeConfig.extend.defaultCheckedKeys = JSON.parse(
          JSON.stringify(res.menuIdList)
        );
      });
    },
    // 返回
    returnEvent() {
      this.visibleDialog = false;
      this.dialogForm = this.$options.data().dialogForm;
    },
    // 删除
    userDel(item) {
      if (item.userNum > 0) {
        this.$notice.message({
          type: "warning",
          msg: "删除失败，请先移除该角色下所有用户",
        });
      } else {
        this.$notice.confirm({
          msg: "删除角色后将无法赋予用户该角色下的权限",
          title: "删除",
          params: { id: item.id },
          onSubmit: this.handleDel,
        });
      }
    },
    handleDel(params) {
      roleDeleteById(params).then(() => {
        this.freshTable();
      });
    },
    // 点击确定
    submitEvent() {
      this.$refs.dialogForm.validate().then((res) => {
        roleSaveOrUpdate(this.dialogForm).then((res) => {
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
.marginBottom5 {
  margin-bottom: 5px;
}
</style>
