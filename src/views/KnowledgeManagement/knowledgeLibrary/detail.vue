<template>
  <div class="knowledgeLibDetail">
    <div class="baseView">
      <el-row :gutter="10">
        <el-col :span="5">
          <div class="treeArea">
            <library-directory ref="directory" @openFile="openFile" />
            <div class="recycleBin" @click="showRecycleBin = true">
              <i class="el-icon-delete"></i>
              <span>回收站</span>
            </div>
          </div>
        </el-col>
        <el-col :span="19">
          <div class="content">
            <template v-if="!showRecycleBin">
              <hl-empty class="noData" v-if="type === 0" />
              <library-folder
                v-if="type === 1"
                :title="title"
                :fileNum="fileNum"
              />
              <library-editor
                v-if="type === 2"
                :title_="title"
                :content_="content"
                :id="directoryId"
                @handleChangeTitle="handleChangeTitle"
              />
              <library-view
                v-if="type === 3"
                :title_="title"
                :id="directoryId"
                :pdfUrl="pdfUrl"
                @setNewVersion="setNewVersion"
              />
              <library-link
                v-if="type === 4"
                :title_="title"
                :pdfUrl="externalSrc"
              />
            </template>
            <library-recycle-bin
              v-else
              @handleReturn="showRecycleBin = false"
              @handleRecover="handleRecover"
            />
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import libraryDirectory from "./components/libraryDirectory";
import LibraryFolder from "@/views/KnowledgeManagement/knowledgeLibrary/components/libraryFolder";
import libraryEditor from "@/views/KnowledgeManagement/knowledgeLibrary/components/libraryEditor";
import libraryView from "@/views/KnowledgeManagement/knowledgeLibrary/components/libraryView";
import libraryRecycleBin from "@/views/KnowledgeManagement/knowledgeLibrary/components/libraryRecycleBin";
import libraryLink from "@/views/KnowledgeManagement/knowledgeLibrary/components/libraryLink";
import { reviewFiles } from "@/api/knowledgeLibrary";
export default {
  components: {
    LibraryFolder,
    libraryDirectory,
    libraryView,
    libraryEditor,
    libraryRecycleBin,
    libraryLink,
  },
  data() {
    return {
      showRecycleBin: false,
      title: "",
      directoryId: "",
      type: 0,
      fileNum: 0,
      content: "",
      pdfUrl: "",
      externalSrc: "",
    };
  },
  methods: {
    setNewVersion() {
      this.$refs["directory"].init(this.directoryId);
    },
    handleRecover() {
      this.$refs["directory"].init();
    },
    handleChangeTitle(id) {
      this.$refs["directory"].init(id);
    },
    openFile({ titleName, titleType, id }) {
      this.showRecycleBin = false;
      reviewFiles({ id }).then((res) => {
        this.title = titleName;
        this.directoryId = id;
        this.type = titleType;
        const { data } = res;
        if (titleType === 1) {
          this.fileNum = data;
        } else if (titleType === 2) {
          this.content = data;
        } else if (titleType === 3) {
          const { FileViewUrl, filePath } = data;
          const origin = window.location.origin;
          this.pdfUrl = FileViewUrl + origin + "/department_entrance/api/" + filePath;
        } else if (titleType === 4) {
          const { externalSrc } = res;
          this.externalSrc = externalSrc;
        }
      });
    },
  },
};
</script>
<style scoped lang="scss">
div.knowledgeLibDetail {
  div.baseView {
    overflow-x: hidden;
    height: calc(100% - 20px);
    .el-row {
      height: 100%;
      .el-col {
        height: 100%;
        div.treeArea {
          height: 100%;
          padding: 20px 5px;
          box-sizing: border-box;
          background: #fff;
          position: relative;
          div.recycleBin {
            width: 208px;
            height: 40px;
            line-height: 40px;
            border-radius: 30px;
            text-align: center;
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            cursor: pointer;
            font-size: 14px;
            background: #deeefb;
            color: #338fed;
            i {
              margin-right: 10px;
            }
            &:hover {
              background: #fcddde;
              color: #ed3030;
            }
          }
        }
        div.content {
          height: 100%;
          background: #f3f4f7;
          .noData {
            padding-top: 300px;
          }
        }
      }
    }
  }
}
</style>
