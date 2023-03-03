<template>
  <div class="editorArea">
    <div class="toolbar">
      <Toolbar :editor="editor" :defaultConfig="toolbarConfig" />
    </div>
    <div class="editorContent">
      <div class="editorContainer">
        <div id="saveInfo" v-if="saveTime">保存于{{ saveTime }}</div>
        <div id="title-container">
          <el-input v-model="title" @input="handleChangeTitle"></el-input>
        </div>
        <div id="editor-text-area">
          <Editor
            v-model="content"
            :defaultConfig="editorConfig"
            @onCreated="onCreated"
            @onChange="onChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { DomEditor } from "@wangeditor/editor";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import "@wangeditor/editor/dist/css/style.css";
import { saveFile } from "@/api/knowledgeLibrary";
import { importFile } from "@/api/common";
import { message } from "@/utils/notice";
export default {
  components: { Editor, Toolbar },
  props: {
    id: {
      type: String,
      default: "",
    },
    title_: {
      type: String,
      default: "",
    },
    content_: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      timer: null,
      saveTime: "",
      editor: null,
      toolbarConfig: {
        excludeKeys: [
          "through",
          "code",
          "todo", //待办
          "emotion",
          "codeBlock",
          "fullScreen",
          "redo",
          "undo",
          "group-video", //图片
        ],
        insertKeys: {
          index: 24, // 自定义插入的位置
          keys: ["uploadAttachment"], // “上传附件”菜单
        },
      },
      title: "",
      content: "",
      editorConfig: {
        placeholder: "请输入内容...",
        // 在编辑器中，点击选中“附件”节点时，要弹出的菜单
        hoverbarKeys: {
          attachment: {
            menuKeys: ["downloadAttachment"], // “下载附件”菜单
          },
        },
        MENU_CONF: {
          // “上传附件”菜单的配置
          uploadAttachment: {
            // 用户自定义上传
            customUpload(file, insertFn) {
              let formData = new FormData();
              formData.append("file", file);
              importFile("/bizfile/uploadFile", formData)
                .then((res) => {
                  const { filePath, virtualPath } = res;
                  insertFn(
                    `${file.name}`,
                    "/department_entrance/api/" + virtualPath
                  );
                })
                .catch((error) => {});
            },
            // 插入到编辑器后的回调
            onInsertedAttachment(elem) {
              console.log("inserted attachment", elem);
            },
          },
          // 上传图片
          uploadImage: {
            // 小于2Mb就插入 base64 格式
            base64LimitSize: 2 * 1024 * 1024,
            customUpload(file, insertFn) {
              var formData = new FormData();
              formData.append("file", file);
              importFile("/bizfile/uploadFile", formData)
                .then((res) => {
                  const { virtualPath } = res;
                  insertFn("/department_entrance/api/" + virtualPath);
                })
                .catch((error) => {});
            },
          },
        },
      },
    };
  },
  watch: {
    id: {
      handler: function () {
        this.title = this.title_;
        this.content = this.content_;
      },
    },
    title_: {
      handler: function () {
        this.title = this.title_;
      },
    },
  },
  methods: {
    onCreated(editor) {
      this.editor = Object.seal(editor); // 一定要用 Object.seal() ，否则会报错
      this.title = this.title_;
      this.content = this.content_;
    },
    onChange(editor) {
      const html = editor.getHtml();
      const toolbar = DomEditor.getToolbar(editor);
      // console.log("工具栏配置", toolbar.getConfig().toolbarKeys);
      this.debounce();
    },
    handleChangeTitle(val) {
      this.debounce(() => {
        this.$emit("handleChangeTitle", this.id);
      });
    },
    debounce(callBack = null) {
      let that = this;
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => {
        if (!this.title) {
          message({ msg: "文档标题不能为空", type: "error" });
          return;
        }
        const params = {
          id: this.id,
          titleName: this.title,
          richText: this.content,
        };
        saveFile(params).then((res) => {
          const date_ = new Date();
          const h = date_.getHours();
          let minutes = date_.getMinutes();
          minutes = minutes > 9 ? minutes : "0" + minutes;
          that.saveTime = h + ":" + minutes;
          if (callBack) callBack();
        });
      }, 2000);
    },
  },
  beforeDestroy() {
    const editor = this.editor;
    if (editor == null) return;
    editor.destroy(); // 组件销毁时，及时销毁编辑器
  },
};
</script>
<style lang="scss" scoped>
div.editorArea {
  height: 100%;
  div.toolbar {
    border-bottom: 1px solid #e8e8e8;
  }
  div.editorContent {
    height: calc(100% - 41px);
    background-color: rgb(245, 245, 245);
    overflow-y: auto;
    position: relative;
    div.editorContainer {
      width: 850px;
      margin: 30px auto 30px auto;
      background-color: #fff;
      padding: 20px 50px 50px 50px;
      border: 1px solid #e8e8e8;
      box-shadow: 0 2px 10px rgb(0 0 0 / 12%);
      position: relative;
      #saveInfo {
        width: 80px;
        position: absolute;
        right: 0;
        top: 10px;
      }
      #title-container {
        padding: 20px 0;
        border-bottom: 1px solid #e8e8e8;
        .el-input {
          height: 30px;
          line-height: 30px;
          ::v-deep .el-input__inner {
            font-size: 24px;
            border: 0 !important;
            outline: none;
            width: 100%;
            line-height: 1;
            padding: 0;
          }
        }
      }
      #editor-text-area {
        min-height: 900px;
        margin-top: 20px;
      }
    }
  }
}
</style>
