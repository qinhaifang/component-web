<template>
  <div class="libraryView">
    <div class="tools">
      <div class="title">
        <span>{{ title_ }}</span>
      </div>
      <div class="toolsContainer">
        <el-button
          v-hasPermi="['knowledgeLibrary:downloadFile']"
          type="primary"
          style="margin-right: 10px"
          @click="handleDownload"
          >下载</el-button
        >
        <library-directory-upload
          v-hasPermi="['knowledgeLibrary:updateFile']"
          style="margin-right: 10px"
          :extraParams="{ id, parentId: null, knowledgeId: knowledgeLibraryId }"
          @success="uploadSuccess"
        >
          <el-button type="primary">更新</el-button>
        </library-directory-upload>
        <el-dropdown>
          <el-button type="primary">历史版本</el-button>
          <el-dropdown-menu slot="dropdown" :append-to-body="false">
            <hl-scroll style="max-height: 450px">
              <el-dropdown-item v-for="(item, index) in historyVersionList" :key="item.id">
                <div class="fileContainer">
                  <div class="fileOperate">
                    <span class="fileName" @click="handleCheckFile(item.id)">{{ item.fileName }}</span>
                    <div class="status" v-if="index === 0">最新版</div>
                    <div v-else class="operateArea">
                      <span
                        v-hasPermi="['knowledgeLibrary:downloadFile']"
                        class="download"
                        @click="handleDownloadHistoryVersionFile(item.id)"
                        >下载</span
                      >
                      <span
                        class="setNew"
                        @click="handleSetNewVersionFile(item.id)"
                        >设为最新版</span
                      >
                    </div>
                  </div>
                  <div class="fileInfo">
                    <span>{{ item.createTime }}&nbsp;更新</span>
                    <span>{{ item.fileSize }}</span>
                    <span>{{ item.createUserName }}</span>
                  </div>
                </div>
              </el-dropdown-item>
            </hl-scroll>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div class="iframeView" v-loading="loading">
      <iframe ref="iframe" frameborder="0"></iframe>
    </div>
  </div>
</template>
<script>
import libraryDirectoryUpload from "@/views/KnowledgeManagement/knowledgeLibrary/components/libraryDirectoryUpload";
import {
  downLoadFiles,
  downloadHistoryFile,
  findHistoryList,
  setNewVersion,
  reviewHistoryFiles,
} from "@/api/knowledgeLibrary";
export default {
  components: { libraryDirectoryUpload },
  props: {
    id: String,
    title_: String,
    pdfUrl: String,
  },
  data() {
    return {
      knowledgeLibraryId: this.$route.query.id,
      historyVersionList: [],
      loading: true,
    };
  },
  watch: {
    id: {
      handler: function () {
        this.initPdfView();
        this.handleHistoryVersion();
      },
    },
    pdfUrl: {
      handler: function () {
        this.initPdfView();
      },
    },
  },
  mounted() {
    this.initPdfView();
    this.handleHistoryVersion();
  },
  methods: {
    initPdfView() {
      this.loading = true;
      let iframe = this.$refs.iframe;
      iframe.onload = () => {
        this.loading = false;
      };
      iframe.src = this.pdfUrl;
    },
    //下载
    handleDownload() {
      downLoadFiles({ id: this.id }).then((res) => {
        const { name, url } = res;
        const elink = document.createElement("a");
        elink.download = name;
        elink.style.display = "none";
        elink.href = "/department_entrance/api/" + url;
        document.body.appendChild(elink);
        elink.click();
        URL.revokeObjectURL(elink.href); // 释放URL 对象
        document.body.removeChild(elink);
      });
    },
    //更新成功
    uploadSuccess() {
      this.handleHistoryVersion();
      this.$emit("setNewVersion");
    },
    //历史版本
    handleHistoryVersion() {
      findHistoryList({ titleId: this.id }).then((res) => {
        this.historyVersionList = res;
      });
    },
    handleDownloadHistoryVersionFile(id) {
      downloadHistoryFile({ id }).then((res) => {
        const { name, url } = res;
        const elink = document.createElement("a");
        elink.download = name;
        elink.style.display = "none";
        elink.href = "/department_entrance/api/" + url;
        document.body.appendChild(elink);
        elink.click();
        URL.revokeObjectURL(elink.href); // 释放URL 对象
        document.body.removeChild(elink);
      });
    },
    handleSetNewVersionFile(id) {
      setNewVersion({ id }).then((res) => {
        this.handleHistoryVersion();
        this.$emit("setNewVersion");
      });
    },
    handleCheckFile(id) {
      reviewHistoryFiles({ id }).then(({ data }) => {
        const { FileViewUrl, filePath } = data;
        const origin = window.location.origin;
        const pdfUrl = FileViewUrl + origin + "/department_entrance/api/" + filePath;
        window.open(pdfUrl, "_blank");
      });
    },
  },
};
</script>
<style lang="scss" scoped>
div.libraryView {
  height: 100%;
  overflow: hidden;
  .tools {
    height: 68px;
    margin-bottom: 10px;
    padding: 0 20px;
    background: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .title {
      font-size: 16px;
      color: #000000;
      font-weight: bold;
    }
    .toolsContainer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .el-dropdown-menu__item {
        cursor: default !important;
      }
      .fileContainer {
        width: 425px;
        padding: 10px 20px;
        div.fileOperate {
          line-height: 20px;
          margin-bottom: 4px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          span.fileName {
            flex-basis: 70%;
            color: #000000;
            font-size: 14px;
            cursor: pointer;
          }
          div.status {
            width: 60px;
            height: 20px;
            line-height: 20px;
            text-align: center;
            background: #ff8100;
            border-radius: 10px;
            color: #fff;
          }
          div.operateArea {
            span.download {
              margin-right: 10px;
              color: #2f8ded;
              cursor: pointer;
            }
            span.setNew {
              color: #2f8ded;
              cursor: pointer;
            }
          }
        }
        div.fileInfo {
          height: 20px;
          line-height: 20px;
          font-size: 12px;
          color: #999999;
          span:nth-child(n + 1) {
            margin-right: 20px;
          }
        }
      }
    }
  }
  .iframeView {
    width: 100%;
    height: calc(100% - 78px);
  }
  iframe {
    width: 100%;
    height: 100%;
  }
}
</style>
