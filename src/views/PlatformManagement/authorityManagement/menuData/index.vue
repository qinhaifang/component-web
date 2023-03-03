<template>
  <div class="userManage">
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
          permissions: ['menuData:edit'],
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
import {
  saveData,
  delData,
  findById,
  findMenuNameAll,
} from "@/api/menu";
import mixins from "@/views/mixins";
import router from "@/router";
export default {
  mixins: [mixins],
  data() {
    return {
      searchForm: {
        menuName: "",
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
        iconPath: "",
        menuName: "",
        hidden: 1,
        menuType: 1,
        permUrl: "",
        url: "",
        component: "",
        routerParentUrl: "",
        routeTagging: "",
        orderNum: 1,
        visible: "",
        status: 1,
      },
      ifDetail: false, // 是否是详情 默认false
      visibleDialog: false, // 弹框默认不展示
      dialogTitle: "新增菜单",
      previousMenuList: [], // 弹框上级菜单数据
      isMenuType: false, // 是否是菜单类型 默认false
      isBtnType: true, // 是否展示显示状态
      isRouteTagging: false, // 默认不展示权限标识
    };
  },
  watch: {
    "dialogForm.menuType": {
      handler(newVal) {
        if (newVal === 2) {
          this.isMenuType = true;
          this.isBtnType = true;
          this.isRouteTagging = true;
        } else if (newVal === 3) {
          this.isBtnType = false;
          this.isRouteTagging = true;
        } else {
          this.isBtnType = true;
          this.isMenuType = false;
          this.isRouteTagging = false;
        }
      },
      deep: true,
    },
  },
  computed: {
    /**表单配置 */
    formConfig() {
      return {
        layout: "inlineBlock",
        noMargin: true,
        data: [
          {
            label: "菜单名称：",
            width: 340,
            type: "input",
            name: "menuName",
            extend: {
              placeHolder: "请输入菜单名称",
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
            children: "childrenMenu",
            hasChildren: "hasChildren",
          },
          stripe: false,
        },
        data: [
          {
            name: "menuName",
            label: "菜单名称",
            extend: { sortable: false },
          },
          {
            name: "",
            label: "图标",
            extend: { sortable: false },
            render: (h, params) => (
              <hl-icon name={"icon" + params.row.iconPath}></hl-icon>
            ),
          },
          {
            name: "orderNumString",
            label: "排序",
            extend: { sortable: false },
          },
          {
            name: "menuType",
            label: "类型",
            extend: { sortable: false },
            formatter: true,
            options: this.dicts.menuType,
          },
          {
            name: "url",
            label: "URL",
            extend: { sortable: false },
          },
          {
            name: "hidden",
            label: "是否显示",
            extend: { sortable: false },
            formatter: true,
            options: this.dicts.menuHidden,
          },
          {
            name: "operation",
            label: "操作",
            type: "operation",
            data: [
              {
                content: "编辑",
                icon: "iconbianji",
                visibleIcon: true,
                visibleTooltip: true,
                clickEvent: this.tableEdit,
                permissions: ["menuData:edit"],
              },
              {
                content: "删除",
                icon: "iconshanchu",
                visibleIcon: true,
                visibleTooltip: true,
                type: "danger",
                clickEvent: this.tableDel,
                permissions: ["menuData:delete"],
              },
            ],
          },
        ],
        http: {
          url: "/system/menu/findListByParam",
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
        extend: { labelWidth: "65px", labelPosition: "right" },
        data: [
          {
            type: "input",
            label: "菜单名称",
            name: "menuName",
            extend: {
              maxlength: 40,
            },
            rules: [
              {
                required: true,
                message: "请输入菜单名称",
                trigger: "blur",
              },
            ],
          },
          {
            name: "menuType",
            label: "菜单类型",
            type: "radio",
            options: this.dicts.menuType,
          },
          {
            type: "iconSelect",
            label: "菜单图标",
            name: "iconPath",
            visible: this.isBtnType,
          },
          {
            type: "previousMenu",
            label: "上级菜单",
            name: "parentId",
            hasBorder: true,
            options: this.previousMenuList,
          },
          {
            name: "orderNum",
            label: "菜单排序",
            type: "number",
            rules: [
              {
                required: true,
                message: "请输入菜单排序",
              },
            ],
            extend: {
              "controls-position": "right",
            },
          },
          {
            type: "input",
            label: "路由地址",
            name: "url",
            extend: {
              maxlength: 100,
            },
            rules: [
              { required: true, message: "请输入路由地址", trigger: "blur" },
            ],
            visible: this.isBtnType,
          },
          {
            type: "input",
            label: "父级地址",
            name: "routerParentUrl",
            visible: this.isBtnType,
            extend: {
              maxlength: 100,
            },
          },
          {
            type: "input",
            label: "组件路径",
            name: "component",
            extend: {
              maxlength: 100,
            },
            visible: this.isMenuType,
          },
          {
            type: "input",
            label: "前端标识",
            name: "routeTagging",
            visible: this.isRouteTagging,
            extend: {
              maxlength: 100,
            },
          },
          {
            type: "input",
            label: "接口标识",
            name: "permUrl",
            visible: this.isRouteTagging,
            extend: {
              maxlength: 100,
            },
          },
          {
            name: "hidden",
            label: "显示状态",
            type: "radio",
            options: this.dicts.menuHidden,
            visible: this.isBtnType,
          },
        ],
      };
    },
  },
  mounted() {},
  methods: {
    /** 查询菜单下拉树结构 */
    getTreeselect() {
      findMenuNameAll().then((response) => {
        this.previousMenuList = [];
        this.previousMenuList = response;
      });
    },
    // 新增
    handleAdd() {
      this.$refs.form.resetForm();
      this.dialogForm = this.$options.data().dialogForm;
      this.visibleDialog = true;
      this.dialogTitle = "新增菜单";
      this.ifDetail = false;
      this.getTreeselect();
    },
    // 编辑
    tableEdit(item) {
      this.visibleDialog = true;
      this.ifDetail = false;
      this.dialogTitle = "编辑菜单";
      this.getTreeselect();
      this.getEditInfo(item.id);
    },
    // 获取编辑信息
    getEditInfo(id) {
      findById({ id }).then((res) => {
        this.dialogForm = res;
      });
    },
    // 返回
    returnEvent() {
      this.visibleDialog = false;
      this.dialogForm = this.$options.data().dialogForm;
    },
    // 删除
    tableDel(item) {
      this.$notice.confirm({
        msg: "确定要删除么？",
        title: "删除",
        params: { id: item.id },
        onSubmit: this.handleDel,
      });
    },
    handleDel(params) {
      delData(params).then(() => {
        this.freshTable();
        this.updateRouter();
      });
    },
    // 点击确定
    submitEvent() {
      this.$refs.dialogForm.validate().then((res) => {
        saveData(this.dialogForm).then((res) => {
          this.visibleDialog = false;
          this.freshTable();
          this.updateRouter();
          this.dialogForm = this.$options.data().dialogForm;
        });
      });
    },
    updateRouter() {
      this.$store.dispatch("GenerateRoutes").then((accessRoutes) => {
        // 测试 默认静态页面
        // store.dispatch('permission/generateRoutes', { roles }).then(accessRoutes => {
        // 根据roles权限生成可访问的路由表
        router.addRoutes(accessRoutes); // 动态添加可访问路由表
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
