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
            label: "项目节点：",
            width: 352,
            name: "status",
            options: this.dicts.projectNode,
          },
          {
            type: "autocomplete",
            width: 300,
            labelWidth: "0",
            name: "content",
            http: {
              url: "/system/role/search", // 接口路径
              params: {
                searchHistoryParam: "preSaleSet", // 查询历史参数  给后台传的唯一值
                content: "", // 传给后台得值
              },
            },
            extend: {
              placeholder: "请输入文件名称",
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
            name: "menuName",
            label: "文件名称",
            extend: { sortable: false },
          },
          {
            name: "orderNumString",
            label: "项目节点",
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
    handleDel(item) {
      console.log("删除");
    },
    handleEdit() {
      console.log("编辑");
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
