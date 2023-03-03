<template>
  <div class="testLibrary">
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
          permissions: ['testLibrary:edit'],
        }"
      ></hl-button>
    </div>
    <div class="table">
      <hl-table ref="tables" :table-config="tableConfig"></hl-table>
    </div>
    <new-library
      v-if="visibleDialog"
      :visibleDialog="visibleDialog"
      :dialogTitle="dialogTitle"
      :ifDetail="ifDetail"
      :dialogFormParams="dialogFormParams"
      @closeDialog="visibleDialog = false"
      @saved="saved"
    />
  </div>
</template>
<script>
import mixins from "@/views/mixins";
import NewLibrary from "@/views/ProductLibraryManagement/components/newLibrary";
import { testLibraryDeleteById } from "@/api/ProductLibraryManagement";
export default {
  components: { NewLibrary },
  mixins: [mixins],
  data() {
    return {
      apiRequest: true,
      searchForm: {
        productType: "2",
        content: "",
        searchHistoryParam: "testLibrary",
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
      visibleDialog: false,
      dialogTitle: "",
      ifDetail: false,
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
            type: "autocomplete",
            width: 300,
            labelWidth: "0",
            name: "content",
            http: {
              url: "/product/search", // 接口路径
              params: {
                productType: "2",
                content: "", // 传给后台得值
                searchHistoryParam: "testLibrary", // 查询历史参数  给后台传的唯一值
              },
            },
            extend: {
              placeholder: "请输入平台名称、地址、负责人",
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
            name: "proaductName",
            label: "平台名称",
          },
          {
            name: "proaductAddress",
            label: "部署地址",
          },
          {
            name: "responsibility",
            label: "负责人",
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
                permissions: ["testLibrary:check"],
              },
              {
                content: "编辑",
                icon: "iconbianji",
                visibleIcon: true,
                visibleTooltip: true,
                clickEvent: this.handleEdit,
                permissions: ["testLibrary:edit"],
              },
              {
                content: "删除",
                icon: "iconshanchu",
                visibleIcon: true,
                visibleTooltip: true,
                type: "danger",
                clickEvent: this.handleDel,
                permissions: ["testLibrary:delete"],
              },
            ],
          },
        ],
        http: {
          url: "/product/findListByParam",
          params: this.searchForm,
        },
      };
    },
  },
  mounted() {},
  methods: {
    // 新增
    handleAdd() {
      this.ifDetail = false;
      this.dialogTitle = "新增测试站";
      this.dialogFormParams = { id: "" };
      this.visibleDialog = true;
    },
    // 查看
    handleDetail(item) {
      this.ifDetail = true;
      this.dialogTitle = "查看测试站";
      this.dialogFormParams = { id: item.id };
      this.visibleDialog = true;
    },
    // 编辑
    handleEdit(item) {
      this.ifDetail = false;
      this.dialogTitle = "编辑测试站";
      this.dialogFormParams = { id: item.id };
      this.visibleDialog = true;
    },
    saved() {
      this.$refs.form && this.$refs.form.resetForm();
      this.$refs.forms && this.$refs.forms.resetForm();
      this.freshTable();
      this.visibleDialog = false;
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
      testLibraryDeleteById(params).then(() => {
        this.freshTable();
      });
    },
  },
};
</script>
<style scoped lang="scss"></style>
