import { mapGetters } from "vuex";
export default {
  data() {
    return {
      variable: 0, //内容高度变量
      heightGap: 60 + 34 + 68 + 68 + 20,
      clientHeight: document.body.clientHeight,
    };
  },
  computed: {
    ...mapGetters(["sidebar"]),
    //内容高度
    tableHeight() {
      return this.clientHeight - this.heightGap - this.variable;
    },
    isCollapse() {
      return !this.sidebar.opened;
    },
  },
  mounted() {
    window.onresize = () => {
      return (() => {
        this.clientHeight = document.body.clientHeight;
      })();
    };
  },
  methods: {
    closeEvent() {
      this.visibleDialog = false;
    },
    // 点击重置
    handleReset() {
      this.$refs.form && this.$refs.form.resetForm();
      this.$refs.forms && this.$refs.forms.resetForm();
      this.freshTable();
    },
    // 点击查询
    handleSearch() {
      this.tableConfig.http.params = this.searchForm;
      this.freshTable();
    },
    freshTable() {
      this.$refs.tables && this.$refs.tables.getTableData(true, "", true);
    },
  },
};
