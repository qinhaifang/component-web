<template>
  <div class="libraryManage">
    <div class="knowledgeLibraryName">{{ knowledgeLibraryName }}</div>
    <div class="bar">
      <span>目录</span>
      <el-dropdown @command="handleCommandTopLevel">
        <span class="el-dropdown-link">
          <i class="el-icon-plus"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="newFolder" v-hasPermi="['knowledgeLibrary:newFile']">新建文件夹</el-dropdown-item>
          <el-dropdown-item command="newFile" v-hasPermi="['knowledgeLibrary:newFile']">新建文档</el-dropdown-item>
          <el-dropdown-item command="newLink" v-hasPermi="['knowledgeLibrary:newFile']">新建链接</el-dropdown-item>
          <el-dropdown-item command="upFile" v-hasPermi="['knowledgeLibrary:uploadFile']">
            <library-directory-upload
              :extraParams="{ id: '', parentId: '0', knowledgeId: knowledgeLibraryId }"
              @success="uploadSuccess"
            >
              <span>上传文档</span>
            </library-directory-upload>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <hl-scroll class="scrollContainer">
      <el-tree
        ref="tree"
        node-key="id"
        highlight-current
        :default-expand-all="true"
        :expand-on-click-node="false"
        :data="data"
        :props="defaultProps"
        @node-click="handleNodeClick"
        @node-drag-start="handleDragStart"
        @node-drag-enter="handleDragEnter"
        @node-drag-leave="handleDragLeave"
        @node-drag-over="handleDragOver"
        @node-drag-end="handleDragEnd"
        @node-drop="handleDrop"
        :allow-drop="allowDrop"
        :allow-drag="allowDrag"
        draggable
      >
        <div class="custom-tree-node" slot-scope="{ node, data }">
          <div class="titleArea">
            <i class="el-icon-folder" v-if="data.titleType === 1"></i>
            <i class="el-icon-link" v-if="data.titleType === 4"></i>
            <i class="el-icon-document"  v-if="data.titleType === 2 || data.titleType === 3"></i>
            <el-input
              ref="titleName"
              class="titleName"
              v-if="isEditCurrentLibraryName && currentLibraryId === data.id"
              v-model="currentLibraryName"
              placeholder="请输入名称"
              @blur="rename_"
              @keyup.enter.native="rename_"
            ></el-input>
            <span class="titleName" v-else>{{ node.label }}</span>
          </div>
          <el-dropdown
            class="dropdownArea"
            @command="handleCommand"
            v-if="currentLibraryId === data.id"
          >
            <span class="el-dropdown-link">
              <i class="el-icon-more"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-if="data.titleType === 1" command="newFolder" v-hasPermi="['knowledgeLibrary:newFile']">新建文件夹</el-dropdown-item>
              <el-dropdown-item v-if="data.titleType === 1" command="newFile" v-hasPermi="['knowledgeLibrary:newFile']">新建文档</el-dropdown-item>
              <el-dropdown-item v-if="data.titleType === 1" command="newLink" v-hasPermi="['knowledgeLibrary:newFile']">新建链接</el-dropdown-item>
              <el-dropdown-item v-if="data.titleType === 1" command="upFile" v-hasPermi="['knowledgeLibrary:uploadFile']">
                <library-directory-upload
                  :extraParams="{ id: '', parentId: data.id, knowledgeId: knowledgeLibraryId }"
                  @success="uploadSuccess"
                >
                  <span>上传文档</span>
                </library-directory-upload>
              </el-dropdown-item>
<!--              <el-dropdown-item v-if="data.titleType === 4" command="reLink" v-hasPermi="['knowledgeLibrary:renameFile']">修改链接</el-dropdown-item>-->
              <el-dropdown-item command="rename" v-hasPermi="['knowledgeLibrary:renameFile']">重命名</el-dropdown-item>
              <el-dropdown-item command="delete" v-hasPermi="['knowledgeLibrary:deleteFile']">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-tree>
    </hl-scroll>
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
  knowledgeLibraryDirectory,
  knowledgeLibraryTitleSort,
  deleteById,
  renameById,
  saveOrUpdate,
} from "@/api/knowledgeLibrary";
import libraryDirectoryUpload from "./libraryDirectoryUpload";
import { message } from "@/utils/notice";
export default {
  components: { libraryDirectoryUpload },
  data() {
    return {
      knowledgeLibraryId: this.$route.query.id,
      knowledgeLibraryName: this.$route.query.knowledgeName,
      //修改用户名
      currentLibraryId: "",
      currentLibraryName: "",
      currentLibraryType: "",
      isEditCurrentLibraryName: false,
      //树配置
      data: [],
      defaultProps: {
        children: "childrenTitle",
        label: "titleName",
      },
      //新建文档/文件夹
      visibleDialog: false,
      //是否新建顶层文档/文件夹
      isNewTopLevelFile: false,
      // 新增弹框配置
      dialogForm: {
        titleName: "",
        externalSrc: "",
        titleType: "",
      },
      //修改链接
      externalSrc: "",
    };
  },
  computed: {
    dialogConfig() {
      return {
        height: 170,
        extend: {
          width: "445px",
          title: "新建目录",
          close: this.closeEvent,
        },
        btnData: [
          {
            text: "确定",
            clickEvent: this.submitEvent,
          },
          {
            text: "取消",
            extend: { plain: true },
            clickEvent: this.closeEvent,
          },
        ],
      };
    },
    dialogFormConfig() {
      return {
        layout: "flow",
        apiRequest: false,
        extend: {
          labelWidth: "65px",
          labelPosition: "right",
        },
        data: [
          {
            type: "input",
            label: "目录名称",
            name: "titleName",
            rules: [
              { required: true, message: "请输入目录名称", trigger: "blur" },
              { min: 1, max: 30, message: "长度不超过 30 个字符", trigger: "blur" },
            ],
          },
          {
            type: "input",
            label: "目录链接",
            name: "externalSrc",
            extend: {
              maxlength: 200,
            },
            rules: [
              { required: true, message: "请输入目录链接", trigger: "blur" },
              { min: 1, max: 200, message: "长度不超过 200 个字符", trigger: "blur" },
            ],
            visible: this.dialogForm.titleType === 4,
          },
          {
            type: "select",
            label: "目录类型",
            name: "titleType",
            options: this.dicts.fileTypeList.filter((item) => item.value !== 3),
            rules: [
              { required: true, message: "请选择目录类型", trigger: "change" },
            ],
          },
        ],
      };
    },
  },
  async mounted() {
    this.init();
  },
  methods: {
    handleDragStart(node, ev) {
      // console.log("drag start", node);
    },
    handleDragEnter(draggingNode, dropNode, ev) {
      // console.log("tree drag enter: ", dropNode.label);
    },
    handleDragLeave(draggingNode, dropNode, ev) {
      // console.log("tree drag leave: ", dropNode.label);
    },
    handleDragOver(draggingNode, dropNode, ev) {
      // console.log("tree drag over: ", dropNode.label);
    },
    handleDragEnd(draggingNode, dropNode, dropType, ev) {
      // console.log("tree drag end: ", dropNode && dropNode.label, dropType);
    },
    handleDrop(draggingNode, dropNode, dropType, ev) {
      //拖拽成功完成时触发的事件
      const sourceId = draggingNode.data.id;
      const targetId = dropNode.data.id;
      const dragType = dropType;
      knowledgeLibraryTitleSort({ sourceId, targetId, dragType }).then(
        (res) => {
          this.init(sourceId);
        }
      );
    },
    allowDrop(draggingNode, dropNode, type) {
      //拖拽时判定目标节点能否被放置
      const { data } = dropNode;
      const { titleType } = data;
      return !(titleType !== 1 && type === "inner");
    },
    allowDrag(draggingNode) {
      //判断节点能否被拖拽
      return true;
    },
    async init(id = undefined) {
      this.data = await knowledgeLibraryDirectory({
        knowledgeId: this.knowledgeLibraryId,
      });
      this.$nextTick(() => {
        if (!id) {
          if (this.data.length) {
            this.$refs.tree.setCurrentKey(this.data[0].id);
            this.handleNodeClick(this.data[0]);
          }
        } else {
          this.$refs.tree.setCurrentKey(id);
          this.handleNodeClick(this.$refs.tree.getNode(id)["data"]);
        }
      });
    },
    handleNodeClick(data) {
      if (this.isEditCurrentLibraryName) {
        return;
      }
      const { id, titleName, titleType } = data;
      this.currentLibraryId = id;
      this.currentLibraryName = titleName;
      this.currentLibraryType = titleType;
      this.$emit("openFile", { titleName, titleType, id });
    },
    //根目录操作
    handleCommandTopLevel(command) {
      if (command === "newFolder") {
        this.visibleDialog = true;
        this.dialogForm.titleType = 1;
        this.isNewTopLevelFile = true;
      } else if (command === "newFile") {
        this.visibleDialog = true;
        this.dialogForm.titleType = 2;
        this.isNewTopLevelFile = true;
      } else if (command === "newLink") {
        this.visibleDialog = true;
        this.dialogForm.titleType = 4;
        this.isNewTopLevelFile = true;
      } else {
        //上传
      }
    },
    handleCommand(command) {
      eval("this." + command + "()");
    },
    newFolder() {
      this.visibleDialog = true;
      this.dialogForm.titleType = 1;
    },
    newFile() {
      this.visibleDialog = true;
      this.dialogForm.titleType = 2;
    },
    newLink() {
      this.visibleDialog = true;
      this.dialogForm.titleType = 4;
    },
    upFile() {
      console.log("上传文件");
    },
    reLink() {
      this.visibleDialog = true;
      this.dialogForm.titleName = this.currentLibraryName;
      this.dialogForm.externalSrc = this.externalSrc;
      this.dialogForm.titleType = 4;
    },
    rename() {
      this.isEditCurrentLibraryName = true;
      this.$nextTick(function () {
        this.$refs.titleName.focus();
      });
    },
    rename_() {
      if (!this.currentLibraryName) {
        message({ msg: "名称不能为空", type: "error" });
        return;
      }
      const params = {
        id: this.currentLibraryId,
        titleName: this.currentLibraryName,
      };
      renameById(params).then(async (res) => {
        this.isEditCurrentLibraryName = false;
        this.init(this.currentLibraryId);
      });
    },
    delete() {
      let that = this;
      this.$notice.confirm({
        msg: "删除后，该页面及其子页面将进入本知识库回收站，180天内可被恢复",
        title: "删除",
        params: {
          id: this.currentLibraryId,
          knowledgeId: this.knowledgeLibraryId,
        },
        onSubmit: function (params) {
          deleteById(params).then((res) => {
            that.init();
          });
        },
      });
    },
    // 点击确定
    submitEvent() {
      this.$refs.dialogForm.validate().then((res) => {
        const formData = {
          ...this.dialogForm,
          knowledgeId: this.knowledgeLibraryId,
          parentId: this.isNewTopLevelFile ? "" : this.currentLibraryId,
        };
        saveOrUpdate(formData).then((res) => {
          this.visibleDialog = false;
          this.isNewTopLevelFile = false;
          this.dialogForm = {
            titleName: "",
            titleType: "",
            externalSrc: "",
          };
          this.init();
        });
      });
    },
    // 点击取消
    closeEvent() {
      this.visibleDialog = false;
      this.isNewTopLevelFile = false;
      this.dialogForm = {
        titleName: "",
        titleType: "",
        externalSrc: "",
      };
    },
    uploadSuccess() {
      this.init();
    },
  },
};
</script>
<style lang="scss" scoped>
div.libraryManage {
  height: 100%;
  .scrollContainer {
    height: calc(100% - 125px);
  }
  .knowledgeLibraryName {
    font-size: 16px;
    color: #000000;
    font-weight: bold;
    padding-left: 15px;
    margin-bottom: 20px;
  }
  .bar {
    padding: 0 15px;
    height: 20px;
    margin-bottom: 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    color: #666666;
    font-weight: 400;
    span:last-child {
      cursor: pointer;
    }
  }
  .custom-tree-node {
    width: calc(100% - 30px);
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 15px;
    div.titleArea {
      width: calc(100% - 20px);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      .titleName {
        width: calc(100% - 24px);
        margin-left: 10px;
      }
    }
  }
  .el-tree {
    padding-left: 6px;
    ::v-deep .el-tree-node__content {
      width: 100%;
      height: 40px;
      .el-tree-node__expand-icon {
        padding: 6px 9px;
      }
    }
  }
}
</style>
