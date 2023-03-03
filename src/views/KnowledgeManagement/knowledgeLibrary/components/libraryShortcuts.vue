<template>
  <div class="libraryShortcuts">
    <hl-dialog :dialogConfig="dialogConfig" v-model="visible">
      <div class="container">
        <div class="left">
          <el-input
            clearable
            placeholder="请输入知识库名称"
            prefix-icon="el-icon-search"
            v-model="searchForm.content"
            @keyup.enter.native="searchKnowledgeLibrary"
            @clear="searchKnowledgeLibrary"
          >
          </el-input>
          <div class="allRoom">
            <span>全部知识库</span>
          </div>
          <div class="knowledgeLibrary">
            <hl-scroll>
              <ul>
                <li
                  v-for="item in knowledgeLibraryList"
                  :key="item.id"
                  :class="{ active: item.id === knowledgeActiveId }"
                  @click="selectKnowledgeLibrary(item)"
                >
                  <img :src="folderIcon" />
                  <span>{{ item.knowledgeName }}</span>
                </li>
              </ul>
            </hl-scroll>
          </div>
        </div>
        <div class="right">
          <div class="chooseRoom">
            <span>全部目录</span>
          </div>
          <div class="libraryDirectory">
            <hl-scroll class="scrollContain">
              <el-tree
                ref="tree"
                node-key="id"
                highlight-current
                :default-expand-all="true"
                :expand-on-click-node="false"
                :data="data"
                :props="defaultProps"
                @node-click="handleNodeClick"
              >
                <div class="custom-tree-node" slot-scope="{ node, data }">
                  <div class="titleArea">
<!--                    <i class="el-icon-folder" v-if="data.titleType === 1"></i>-->
<!--                    <i class="el-icon-link" v-if="data.titleType === 4"></i>-->
<!--                    <i class="el-icon-document"  v-if="data.titleType === 2 || data.titleType === 3"></i>-->
                    <span class="title">{{ node.label }}</span>
                    <div
                      v-if="data.titleType !== 1"
                      class="disabled"
                      @click.stop
                    >
                    </div>
                  </div>
                </div>
              </el-tree>
            </hl-scroll>
          </div>
        </div>
      </div>
      <div class="extraForm" v-if="newType.includes(commandType)">
        <hl-form
          ref="dialogForm"
          v-model="dialogForm"
          :form-config="dialogFormConfig"
        ></hl-form>
      </div>
      <template v-else>
        <div class="upload">
          <library-directory-upload
            :extraParams="{
              id: '',
              parentId: currentLibraryId,
              knowledgeId: knowledgeActiveId,
            }"
            @success="uploadSuccess"
          >
            <el-button type="primary">上传</el-button>
          </library-directory-upload>
          <el-button style="margin-left: 14px" type="primary" plain @click="closeEvent">取消</el-button>
        </div>
      </template>
    </hl-dialog>
  </div>
</template>
<script>
import libraryDirectoryUpload from "@/views/KnowledgeManagement/knowledgeLibrary/components/libraryDirectoryUpload";
import {knowledgeLibraryDirectory, knowledgeLibraryList, saveOrUpdate,} from "@/api/knowledgeLibrary";
import {message} from "@/utils/notice";

export default {
  components: { libraryDirectoryUpload },
  props: {
    commandType: String,
    dialogName: String,
    visibleDialog: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      visible: this.visibleDialog,
      newType: ["newFolder", "newFile", "newLink"],
      newTypeList: {
        newFolder: 1,
        newFile: 2,
        newLink: 4,
      },
      folderIcon: require("@/assets/imgs/folder.svg"),
      //知识库列表
      searchForm: {
        content: "",
        searchHistoryParam: "knowledgeLibrary",
      },
      knowledgeLibraryList: [],
      knowledgeActiveId: "",
      knowledgeActiveName: "",
      //目录树结构
      data: [],
      defaultProps: {
        children: "childrenTitle",
        label: "titleName",
      },
      currentLibraryId: "",
      dialogForm: {
        titleName: "",
        externalSrc: "",
      },
    };
  },
  computed: {
    dialogConfig() {
      return {
        height: this.commandType === "newLink" ? 520 : 460,
        extend: {
          width: "800px",
          title: this.dialogName,
          close: this.closeEvent,
        },
        btnData: this.newType.includes(this.commandType)
          ? [
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
            ]
          : null,
      };
    },
    dialogFormConfig() {
      return {
        layout: "flow",
        apiRequest: false,
        extend: {
          labelWidth: "90px",
          labelPosition: "right",
        },
        data: [
          {
            type: "input",
            label: this.dialogName.split("新建")[1] + "名称",
            name: "titleName",
            rules: [
              {
                required: true,
                message: `请输入${this.dialogName.split("新建")[1] + "名称"}`,
                trigger: "blur",
              },
              {
                min: 1,
                max: 30,
                message: "长度不超过 30 个字符",
                trigger: "blur",
              },
            ],
          },
          {
            type: "input",
            label: "链接地址",
            name: "externalSrc",
            extend: {
              maxlength: 200,
            },
            rules: [
              { required: true, message: "请输入链接地址", trigger: "blur" },
              { min: 1, max: 200, message: "长度不超过 200 个字符", trigger: "blur" },
            ],
            visible: this.commandType === "newLink",
          },
        ],
      };
    },
  },
  watch: {
    visibleDialog: {
      handler: function (val) {
        this.visible = val;
      },
      immediate: true,
    },
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      const params = { ...this.searchForm };
      this.knowledgeLibraryList = await knowledgeLibraryList(params);
      this.selectKnowledgeLibrary(this.knowledgeLibraryList[0]);
    },
    async selectKnowledgeLibrary(item) {
      this.knowledgeActiveId = item.id;
      this.knowledgeActiveName = item.knowledgeName;
      const params_ = {
        content: "",
        searchHistoryParam: "",
        knowledgeId: this.knowledgeActiveId,
      };
      this.data = await knowledgeLibraryDirectory(params_);
    },
    searchKnowledgeLibrary() {
      this.init();
    },
    handleNodeClick(data) {
      if (this.currentLibraryId === data.id) {
        this.currentLibraryId = "";
        this.$refs.tree.setCurrentKey(null);
      } else {
        this.currentLibraryId = data.id;
      }
    },
    closeEvent() {
      this.$emit("closeDialog");
    },
    submitEvent() {
      this.$refs.dialogForm.validate().then((res) => {
        const formData = {
          ...this.dialogForm,
          knowledgeId: this.knowledgeActiveId,
          parentId: this.currentLibraryId,
          titleType: this.newTypeList[this.commandType],
        };
        saveOrUpdate(formData).then((res) => {
          this.$emit("closeDialog");
          message({ msg: "操作成功", type: "success" });
          this.$router.push({
            path: "/knowledgeLibraryDetail",
            query: {
              id: this.knowledgeActiveId,
              knowledgeName: this.knowledgeActiveName,
            },
          });
        });
      });
    },
    uploadSuccess() {
      this.$emit("closeDialog");
      message({ msg: "操作成功", type: "success" });
    },
  },
};
</script>
<style lang="scss" scoped>
div.libraryShortcuts {
  ::v-deep .el-tree-node__content {
    height: 30px;
    position: relative;
    background: #fff;
    .title {
      margin-left: 10px;
    }
    .disabled {
      cursor: not-allowed;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 2;
    }
  }
  div.container {
    width: 100%;
    height: 390px;
    margin-bottom: 20px;
    border: 1px solid #acb0b8;
    div.left {
      float: left;
      width: 50%;
      border-right: 1px solid #acb0b8;
      .el-input {
        display: block;
        width: calc(100% - 26px);
        height: 32px;
        line-height: 32px;
        margin: 13px auto 10px;
      }
      .allRoom {
        height: 20px;
        line-height: 20px;
        margin-bottom: 10px;
        padding: 0 13px;
        span {
          font-size: 14px;
          color: #000000;
          font-weight: 600;
        }
      }
      .knowledgeLibrary {
        height: 304px;
        ul {
          height: 100%;
          li {
            height: 40px;
            line-height: 40px;
            padding: 0 20px;
            display: flex;
            justify-content: start;
            align-items: center;
            cursor: pointer;
            img {
              margin-right: 10px;
            }
            span {
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              flex-basis: 80%;
            }
            &.active {
              background: #e1eaff;
            }
          }
        }
      }
    }
    div.right {
      float: left;
      width: calc(50% - 1px);
      .chooseRoom {
        height: 20px;
        line-height: 20px;
        margin: 20px 20px 10px;
        span {
          font-size: 14px;
          color: #000000;
          font-weight: 600;
        }
      }
      .libraryDirectory {
        height: 340px;
        .scrollContain {
          height: 99%;
        }
        .custom-tree-node {
          width: 100%;
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
      }
    }
  }
  div.extraForm {
    height: 32px;
    line-height: 32px;
  }
  .upload {
    width: 130px;
    margin: 0 auto;
    margin-top: 42px;
    display: flex;
    justify-content: center;
  }
}
</style>
