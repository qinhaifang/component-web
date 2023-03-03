<template>
  <div class="container positionRelative">
    <div
      class="searchContainer"
      v-if="searchConfig && JSON.stringify(searchConfig) != '{}'"
    >
      <div class="isFlex" v-if="searchConfig.left">
        <hl-form
          v-model="searchForm"
          ref="form"
          class="marginRight14"
          :form-config="searchFormConfig"
        ></hl-form>
        <hl-popover v-if="searchConfig.left.popoverConfig">
          <hl-form
            v-model="searchForm"
            ref="forms"
            :form-config="searchConfig.left.popoverConfig"
          ></hl-form
        ></hl-popover>
        <hl-button :buttonConfig="leftButtonConfig"></hl-button>
      </div>
      <hl-button
        v-if="searchConfig.right"
        :buttonConfig="rightButtonConfig"
      ></hl-button>
    </div>
    <div class="table" v-if="showFlag">
      <hl-table ref="tables" :table-config="tableConfig"></hl-table>
    </div>
    <hl-dialog :dialogConfig="dialogConfigParams" v-model="visible">
      <hl-form
        v-for="(form, num) in dialogConfigParams.data"
        :key="num"
        class="dialogForm"
        :class="
          num == dialogConfigParams.data.length - 1 ? 'marginBottom20' : ''
        "
        v-model="dialogForm"
        :form-config="form"
      ></hl-form>
    </hl-dialog>
  </div>
</template>
<script>
import { deepClone } from "@/utils/util";
export default {
  name: "hlPage",
  props: {
    pageConfig: {
      type: Object,
      default: () => {
        return {};
      },
    },
    dialogConfig: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  watch: {
    pageConfig: {
      handler(pageConfig) {
        const { searchConfig, tableConfig } = pageConfig;
        this.initSearchConfig(searchConfig);
        this.initTableConfig(tableConfig);
      },
      deep: true,
    },
    dialogConfig: {
      handler(dialogConfig) {
        this.initDialog(dialogConfig);
      },
      deep: true,
    },
  },
  data() {
    return {
      showFlag: false,
      searchForm: {},
      searchConfig: {},
      tableConfig: {},
      dialogConfigParams: {},
      leftButtonConfig: [],
      rightButtonConfig: [],
      visibleFlag: false,
      // 新增弹框配置
      dialogForm: {},
      visible: false,
    };
  },
  computed: {},
  mounted() {
    this.initData();
  },
  methods: {
    //表格刷新
    refreshTable() {
      this.$refs.tables && this.$refs.tables.getTableData(true);
    },
    //按钮执行前的回调方法
    beforeBtn(button) {
      const { dontOpen } = button;
      if (!dontOpen) this.visible = true;
    },
    //初始化searchConfig方法
    initSearchConfig(searchConfig) {
      if (!searchConfig) return;
      const { left, right } = searchConfig;
      if (left) {
        let leftButtonConfig = left.buttonConfig;
        if (!Array.isArray(leftButtonConfig)) {
          leftButtonConfig = [leftButtonConfig];
        }
        leftButtonConfig.map((item) => {
          const { btnType } = item;
          switch (btnType) {
            //search 代表搜索按钮
            case "search":
              this.$set(item, "beforeClick", () => {
                this.tableConfig.http.params = this.searchForm;
                this.refreshTable();
              });
              break;
            //reset 代表重置按钮
            case "reset":
              this.$set(item, "beforeClick", () => {
                this.$refs.form && this.$refs.form.resetForm();
                this.$refs.forms && this.$refs.forms.resetForm();
                this.refreshTable();
              });
              break;
          }
        });
        this.leftButtonConfig = leftButtonConfig;

        if (left.formConfig) {
          left.formConfig.data.map((item) => {
            //如果是搜索框时,callbackFlag为true,回车可以查询接口
            if (
              item.type === "autocomplete" &&
              item.extend &&
              item.extend.callbackFlag
            ) {
              item.extend.callback = () => {
                this.tableConfig.http.params = this.searchForm;
                this.refreshTable();
              };
            }
          });
          this.searchFormConfig = left.formConfig;
        }
      }

      if (right) {
        let { buttonConfig } = right;

        if (!Array.isArray(buttonConfig)) {
          buttonConfig = [buttonConfig];
        }
        //搜索区域右侧按钮加点击回调
        buttonConfig.map((item) => {
          const { btnType } = item;
          switch (btnType) {
            //exportExcel 代表导出Excel
            case "exportExcel":
              this.$set(item, "beforeClick", () => {
                this.$fetch({
                  url: item.url, // 配置过来的请求地址
                  params: {
                    ...this.searchForm,
                    pageSize: 0,
                    pageNum: 1,
                  },
                  config: { showLoading: true },
                  responseType: "blob",
                  method: "post",
                }).then((res) => {
                  if (res) {
                    let blob = new Blob([res.data], {
                      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8",
                    }); // res就是接口返回的文件流了
                    let objectUrl = URL.createObjectURL(blob);
                    const elink = document.createElement("a");
                    elink.download = decodeURI(res.headers["filename"]); // 下载文件名称
                    elink.style.display = "none";
                    elink.href = objectUrl;
                    document.body.appendChild(elink);
                    elink.click();
                    URL.revokeObjectURL(elink.href); // 释放URL 对象
                    document.body.removeChild(elink);
                  }
                });
              });
              break;
          }
        });
        this.rightButtonConfig = buttonConfig;
      }

      this.searchConfig = searchConfig;
    },
    //初始化表格配置
    initTableConfig(tableConfig) {
      if (!tableConfig) return;
      if (tableConfig.http && tableConfig.http.params) {
        this.searchForm = deepClone(tableConfig.http.params);
      }

      tableConfig.data.map((item) => {
        //表格按钮加点击回调
        if (item.type === "operation") {
          item.data.map((item) => {
            this.$set(item, "beforeClick", this.beforeBtn);
          });
        }
      });
      this.tableConfig = tableConfig;
    },
    //返回弹框内表单数据
    returnDialogForm() {
      return this.dialogForm;
    },
    //初始化弹框
    initDialog(dialogConfig) {
      if (!dialogConfig) return;
      if (!dialogConfig.btnData) return;

      let { dialogForm } = dialogConfig;

      //弹框关闭回调
      if (dialogConfig.extend) {
        dialogConfig.extend.close = () => {
          this.visible = false;
        };
      }

      this.dialogForm = deepClone(dialogForm);
      //弹框按钮点击回调
      dialogConfig.btnData.map((item) => {
        this.$set(item, "beforeClick", () => {
          this.visible = false;
        });
      });
      this.dialogConfigParams = dialogConfig;
    },
    initData() {
      this.showFlag = false;
      if (this.pageConfig) {
        const { searchConfig, tableConfig } = this.pageConfig;
        this.initSearchConfig(searchConfig);
        this.initTableConfig(tableConfig);
      }
      this.initDialog(this.dialogConfig);
      this.$nextTick(() => {
        this.showFlag = true;
      });
    },
  },
};
</script>

<style lang="scss"></style>
