<template>
  <div class="recycleBinLibrary">
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
    </div>
    <div class="table">
      <hl-table ref="tables" :table-config="tableConfig"></hl-table>
    </div>
  </div>
</template>
<script>
import { deleteCompletelyById, recoveryById } from "@/api/knowledgeLibrary";
import mixins from "@/views/mixins";
export default {
  mixins: [mixins],
  data() {
    return {
      searchForm: {
        content: "",
        searchHistoryParam: "recycleBinLibrary",
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
              url: "/knowledge/recyclesearch", // 接口路径
              params: {
                content: "", // 传给后台得值
                searchHistoryParam: "recycleBinLibrary", // 查询历史参数  给后台传的唯一值
              },
            },
            extend: {
              placeholder: "请输入名称、创建人进行搜索",
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
            name: "knowledgeName",
            label: "名称",
          },
          {
            name: "createUserName",
            label: "创建人",
          },
          {
            name: "dayRemaining",
            label: "剩余天数",
          },
          {
            name: "operation",
            label: "操作",
            type: "operation",
            data: [
              {
                content: "恢复",
                icon: "icontuihui",
                visibleIcon: true,
                visibleTooltip: true,
                clickEvent: this.handleRecover,
                permissions: ["recycleBinLibrary:Recover"],
              },
              {
                content: "彻底删除",
                icon: "iconshanchu",
                visibleIcon: true,
                visibleTooltip: true,
                type: "danger",
                clickEvent: this.handleDel,
                permissions: ["recycleBinLibrary:delete"],
              },
            ],
          },
        ],
        http: {
          url: "/knowledge/findDelListByParam",
          params: this.searchForm,
        },
      };
    },
  },
  mounted() {},
  methods: {
    // 删除
    handleDel(item) {
      this.$notice.confirm({
        msg: "确定要彻底删除么？",
        title: "彻底删除",
        params: { id: item.id },
        onSubmit: this.handleDel_,
      });
    },
    handleDel_(params) {
      deleteCompletelyById(params).then(() => {
        this.freshTable();
      });
    },
    // 恢复
    handleRecover(item) {
      this.$notice.confirm({
        msg: "确定要恢复么？",
        title: "恢复",
        params: { id: item.id },
        onSubmit: this.handleRecover_,
      });
    },
    handleRecover_(params) {
      recoveryById(params).then(() => {
        this.freshTable();
      });
    },
  },
};
</script>
<style scoped lang="scss"></style>
