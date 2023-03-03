export default {
  data() {
    return {
      searchForm: {},
      dialogForm: {},
    };
  },
  computed: {
    formConfig() {
      return {
        layout: "inlineBlock",
        noMargin: true,
        labelWidth: "78px",
        data: [
          {
            type: "select",
            label: "项目分类：",
            width: 260,
            name: "status",
            options: this.dicts.projectCategory,
          },
        ],
      };
    },
    /**更多选项 */
    popoverConfig() {
      return {
        layout: "flow",
        noMargin: true,
        extend: { labelWidth: "65px", labelPosition: "right" },
        data: [
          {
            label: "开发模式",
            type: "checkboxButton",
            allVisible: true,
            name: "developmentMode",
            options: this.dicts.developmentMode,
          },
          { type: "divider" },
          {
            label: "项目规模",
            type: "checkboxButton",
            allVisible: true,
            name: "messagePushTypeList",
            options: this.dicts.projectScale,
          },
          { type: "divider" },
          {
            label: "项目类型",
            type: "checkboxButton",
            allVisible: true,
            name: "messagePushTypeList2",
            options: this.dicts.projectType,
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
            name: "menuName",
            label: "项目分类",
            extend: { sortable: false },
          },
          {
            name: "orderNumString",
            label: "项目规模",
            extend: { sortable: false },
          },
          {
            name: "menuType",
            label: "项目类型",
            extend: { sortable: false },
            formatter: true,
            options: this.dicts.menuType,
          },
          {
            name: "qq",
            label: "开发模式",
            extend: { sortable: false },
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
                clickEvent: this.handleLook,
                permissions: ["projectType:look"],
              },
              {
                content: "编辑",
                icon: "iconbianji",
                visibleIcon: true,
                visibleTooltip: true,
                clickEvent: this.handleEdit,
                permissions: ["projectType:edit"],
              },
              {
                content: "删除",
                icon: "iconshanchu",
                visibleIcon: true,
                visibleTooltip: true,
                type: "danger",
                clickEvent: this.handleDel,
                permissions: ["projectType:delete"],
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
          top: this.dialogTop || "6vh",
          width: this.dialogWidth,
          title: this.localTitle || this.dialogTitle,
          close: this.closeEvent,
        },
        height: this.dialogHeight,
        btnData: [
          {
            text: "确定",
            clickEvent: this.submitFormEvent,
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
            extend: {
              plain: true,
            },
            clickEvent: this.closeEvent,
            visible: !this.ifDetail,
          },
        ],
      };
    },
    dialogFormConfig() {
      return {
        layout: "grid",
        extend: { labelWidth: "75px", labelPosition: "right" },
        data: [
          {
            type: "select",
            label: "项目分类",
            name: "deviceName",
            extend: {
              disabled: this.ifDetail,
            },
            rules: [
              {
                required: true,
                message: "请选择项目分类",
                trigger: "blur",
              },
            ],
          },
          {
            type: "select",
            label: "项目规模",
            name: "deviceName2",
            extend: {
              disabled: this.ifDetail,
            },
            rules: [
              {
                required: true,
                message: "请选择项目规模",
                trigger: "blur",
              },
            ],
          },
          {
            type: "select",
            label: "项目类型",
            name: "deviceName2",
            extend: {
              disabled: this.ifDetail,
            },
            rules: [
              {
                required: true,
                message: "请选择项目类型",
                trigger: "blur",
              },
            ],
          },
          {
            type: "select",
            label: "开发模式",
            name: "deviceName2",
            extend: {
              disabled: this.ifDetail,
            },
            rules: [
              {
                required: true,
                message: "请选择开发模式",
                trigger: "blur",
              },
            ],
          },
          {
            type: "textarea",
            label: "备注",
            name: "memo",
            rules: [
              {
                min: 1,
                max: 200,
                message: "长度不超过 200 个字符",
                trigger: "blur",
              },
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
    handleAdd() {
      console.log("新增");
      this.visibleDialog = true;
    },
    handleLook() {
      console.log("查看");
    },
    submitFormEvent() {
      this.$refs.dialogForm.validate().then((res) => {
        const formData = {
          ...this.dialogForm,
        };
        // 向后台发送请求
        // departmentSaveOrUpdate(formData).then((res) => {
        //   this.visibleDialog = false;
        //   this.freshTable();
        //   this.dialogForm = this.$options.data().dialogForm;
        // });
      });
    },
  },
};
