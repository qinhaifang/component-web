<template>
  <div class="libraryRecycleBin">
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
      <hl-scroll>
        <hl-table ref="tables" :table-config="tableConfig"></hl-table>
      </hl-scroll>
    </div>
  </div>
</template>
<script>
import { directoryDeleteCompletely, directoryRecovery, parentExist } from "@/api/knowledgeLibrary";
import mixins from "@/views/mixins";
export default {
  mixins: [mixins],
  data() {
    return {
      searchForm: {
        knowledgeId: this.$route.query.id,
        content: "",
        searchHistoryParam: "libraryRecycleBin",
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
        {
          text: "返回",
          plain: true,
          clickEvent: this.handleReturn,
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
              url: "/knowledge/title/searchDel", // 接口路径
              params: {
                knowledgeId: this.$route.query.id,
                content: "",
                searchHistoryParam: "libraryRecycleBin",
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
        autoHeight: false,
        noPagination: true,
        extend: {
          "row-key": "id", //行唯一标记
          "tree-props": {
            children: "childrenTitle",
            hasChildren: "hasChildren",
          },
          stripe: false,
        },
        data: [
          {
            name: "titleName",
            label: "名称",
          },
          {
            name: "titleType",
            label: "类型",
            formatter: true,
            options: this.dicts.fileTypeList,
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
              },
              {
                content: "彻底删除",
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
          url: "/knowledge/title/findDelListByParam",
          params: this.searchForm,
          onSuccess: (res) => {
            return res;
          },
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
      directoryDeleteCompletely(params).then(() => {
        this.freshTable();
      });
    },
    // 恢复
    async handleRecover(item) {
      let msg = "";
      const isParentExist = await parentExist({ id: item.id });
      if (isParentExist !== 1) {
        msg = "原父级页面不存在或你没有其编辑权限，该页面将恢复到知识库一级目录，确认恢复";
      } else {
        msg = "确定要恢复么";
      }
      this.$notice.confirm({
        msg: msg,
        title: "恢复",
        params: { id: item.id, isParentExist },
        onSubmit: this.handleRecover_,
      });
    },
    async handleRecover_({ id, isParentExist }) {
      const params_ = {
        id,
        knowledgeId: this.$route.query.id,
        parentId: isParentExist !== 1 ? "0" : null,
      };
      directoryRecovery(params_).then(() => {
        this.freshTable();
        this.$emit("handleRecover");
      });
    },
    handleReturn() {
      this.$emit("handleReturn");
    },
  },
};
</script>
<style scoped lang="scss">
div.libraryRecycleBin {
  height: 100%;
  .table {
    height: calc(100% - 79px);
  }
}
</style>
