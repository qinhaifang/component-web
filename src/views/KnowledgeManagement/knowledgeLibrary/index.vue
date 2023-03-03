<template>
  <div class="knowledgeLibrary">
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
      <el-dropdown @command="handleCommand" trigger="click">
        <el-button type="primary">新增</el-button>
        <el-dropdown-menu slot="dropdown">
          <template v-if="knowledgeLibraryList.length">
            <el-dropdown-item v-hasPermi="['knowledgeLibrary:newFile']" command="newFolder">新建文件夹</el-dropdown-item>
            <el-dropdown-item v-hasPermi="['knowledgeLibrary:newFile']" command="newFile">新建文档</el-dropdown-item>
            <el-dropdown-item v-hasPermi="['knowledgeLibrary:newFile']" command="newLink">新建链接</el-dropdown-item>
            <el-dropdown-item v-hasPermi="['knowledgeLibrary:uploadFile']" command="uploadFile">上传文档</el-dropdown-item>
          </template>
          <el-dropdown-item v-hasPermi="['knowledgeLibrary:add']" command="newKnowledgeLibrary">新增知识库</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="container">
      <hl-scroll class="scrollContainer">
        <template v-if="knowledgeLibraryList.length">
          <el-row :gutter="30">
            <el-col :span="4" v-for="(data, index) in knowledgeLibraryList" :key="data.id">
              <library-card
                :data="data"
                :index_="index"
                @deleteKnowledgeLibrary="handleDel"
                @editKnowledgeLibrary="handleEdit"
                @click.native="openKnowledgeLibDetail(data)"
              />
            </el-col>
          </el-row>
        </template>
        <hl-empty class="emptyDom" v-else :imageSize="80"></hl-empty>
      </hl-scroll>
    </div>
    <hl-dialog :dialogConfig="dialogConfig" v-model="visibleDialog">
      <hl-form
        ref="dialogForm"
        v-model="dialogForm"
        :form-config="dialogFormConfig"
      ></hl-form>
    </hl-dialog>
    <libraryShortcuts
      v-if="visibleDialog_"
      :commandType="commandType"
      :visibleDialog="visibleDialog_"
      :dialogName="dialogName"
      @closeDialog="visibleDialog_ = false"
    />
  </div>
</template>
<script>
import libraryCard from "@/views/KnowledgeManagement/knowledgeLibrary/components/libraryCard";
import libraryShortcuts from "@/views/KnowledgeManagement/knowledgeLibrary/components/libraryShortcuts";
import {
  knowledgeLibraryList,
  knowledgeLibraryDeleteById,
  knowledgeLibrarySaveOrUpdate
} from "@/api/knowledgeLibrary";
import mixins from "@/views/mixins";
export default {
  components: { libraryCard, libraryShortcuts },
  mixins: [mixins],
  data() {
    return {
      searchForm: {
        content: "",
        searchHistoryParam: "knowledgeLibrary",
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
      knowledgeLibraryList: [],
      // 弹框配置
      apiRequest: true,
      visibleDialog: false, // 弹框默认不展示
      dialogTitle: "新增演示站",
      dialogFormParams: {},
      dialogForm: {
        id: "",
        knowledgeName: "",
        baseType: "",
        adminList: [],
        userList: [],
        memo: "",
      },
      //新增到
      commandType: "",
      visibleDialog_: false,
      dialogName: "",
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
              url: "/knowledge/search", // 接口路径
              params: {
                content: "", // 传给后台得值
                searchHistoryParam: "knowledgeLibrary", // 查询历史参数  给后台传的唯一值
              },
            },
            extend: {
              placeholder: "请输入知识库名称",
              callback: this.handleSearch,
            },
          },
        ],
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
          },
          {
            text: "取消",
            extend: {
              plain: true,
            },
            clickEvent: this.closeEvent,
          },
        ],
      };
    },
    /**form配置 */
    dialogFormConfig() {
      return {
        layout: "flow",
        apiRequest: this.apiRequest,
        extend: {
          labelWidth: "65px",
          labelPosition: "right",
        },
        http: {
          url: "/knowledge/findById",
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
            label: "名称",
            name: "knowledgeName",
            rules: [
              { required: true, message: "请输入知识库名称", trigger: "blur" },
              { min: 1, max: 30, message: "长度不超过 30 个字符", trigger: "blur" },
            ],
          },
          {
            type: "select",
            label: "管理",
            name: "adminList",
            extend: {
              multiple: true,
            },
            props: {
              value: "id",
              label: "workerName",
            },
            http: {
              url: "/system/workerUser/findAll",
              method: "post",
              onSuccess: (res) => {
                // res.unshift({
                //   id: "",
                //   workerName: "全部人员",
                // });
                return res;
              },
            },
            rules: [
              { required: true, message: "请选择管理人员", trigger: "blur" },
            ],
          },
          {
            type: "select",
            label: "可读",
            name: "userList",
            extend: {
              multiple: true,
            },
            props: {
              value: "id",
              label: "workerName",
            },
            http: {
              url: "/system/workerUser/findAll",
              method: "post",
              onSuccess: (res) => {
                return res;
              },
            },
            rules: [
              { required: true, message: "请选择可读人员", trigger: "blur" },
            ],
          },
          {
            type: "textarea",
            label: "简介",
            name: "memo",
            rules: [
              { min: 1, max: 200, message: "长度不超过 200 个字符", trigger: "blur" },
            ],
            extend: {
              autosize: {
                minRows: 3,
              },
            },
          },
        ],
      };
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      const params = { ...this.searchForm };
      knowledgeLibraryList(params).then((res) => {
        this.knowledgeLibraryList = res;
      });
    },
    handleCommand(command) {
      const commandNameMap = {
        newFolder: "新建文件夹",
        newFile: "新建文档",
        newLink: "新建链接",
        uploadFolder: "上传文件夹",
        uploadFile: "上传文档",
      };
      if (command === "newKnowledgeLibrary") {
        this.newKnowledgeLibrary();
      } else {
        this.commandType = command;
        this.visibleDialog_ = true;
        this.dialogName = commandNameMap[command];
      }
    },
    // 新增
    newKnowledgeLibrary() {
      this.dialogForm = this.$options.data().dialogForm;
      this.dialogTitle = "新增知识库";
      this.dialogFormParams = { id: "" };
      this.visibleDialog = true;
      this.apiRequest = false;
      this.$refs.form.resetForm();
    },
    // 编辑
    handleEdit(id) {
      this.dialogTitle = "编辑知识库";
      this.apiRequest = true;
      this.dialogFormParams = { id: id };
      this.visibleDialog = true;
    },
    // 删除
    handleDel(id) {
      this.$notice.confirm({
        msg: "删除后，该页面及其子页面将进入本知识库回收站，180天内可被恢复",
        title: "删除",
        params: { id },
        onSubmit: this.handleDel_,
      });
    },
    handleDel_(params) {
      knowledgeLibraryDeleteById(params).then(() => {
        this.init();
      });
    },
    // 点击确定
    submitEvent() {
      this.$refs.dialogForm.validate().then((res) => {
        const formData = {
          ...this.dialogForm,
        };
        // 向后台发送请求
        knowledgeLibrarySaveOrUpdate(formData).then((res) => {
          this.visibleDialog = false;
          this.dialogForm = this.$options.data().dialogForm;
          this.init();
        });
      });
    },
    // 点击取消
    closeEvent() {
      this.visibleDialog = false;
    },
    // 点击重置
    handleReset() {
      this.$refs.form.resetForm();
      this.init();
    },
    // 点击查询
    handleSearch() {
      this.init();
    },
    openKnowledgeLibDetail(data) {
      const { id, knowledgeName } = data;
      this.$router.push({
        path: "/knowledgeLibraryDetail",
        query: { id, knowledgeName },
      });
    },
  },
};
</script>
<style scoped lang="scss">
div.container {
  //搜索栏79px, 屏幕底部20px
  height: calc(100% - 99px);
  padding: 30px;
  box-sizing: border-box;
  box-shadow: 0 2px 4px 0 rgb(0 0 0 / 5%);
  border-radius: 2px;
  background: #fff;
  div.scrollContainer {
    position: relative;
  }
  .emptyDom {
    width: 200px;
    height: 100px;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
  }
}
</style>
