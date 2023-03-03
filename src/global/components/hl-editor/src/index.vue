<template>
  <div class="H-editor">
    <Toolbar
      v-if="showToolBar"
      class="toolbar"
      :editor="editor"
      :defaultConfig="toolbarConfig"
      :mode="mode"
    />
    <Editor
      class="editor"
      :style="{ height: height + 'px' }"
      v-model="html"
      :defaultConfig="editorConfig"
      :mode="mode"
      @onCreated="onCreated"
      @onChange="onChange"
    />
  </div>
</template>
<script>
import { DomEditor } from "@wangeditor/editor";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import "@wangeditor/editor/dist/css/style.css";
export default {
  name: "hl-editor",
  components: { Editor, Toolbar },
  props: {
    height: {
      type: Number,
      default: 300,
    },
    showToolBar: {
      type: Boolean,
      default: true,
    },
    value: {
      type: String,
      default: "",
    },
  },
  model: {
    prop: "value",
    event: "change",
  },
  data() {
    return {
      editor: null,
      html: "<p></p>",
      toolbarConfig: {
        excludeKeys: ["through", "code", "todo", "emotion", "codeBlock"],
      },
      editorConfig: { placeholder: "请输入内容..." },
      mode: "default", // or 'simple'
    };
  },
  methods: {
    onCreated(editor) {
      this.editor = Object.seal(editor); // 一定要用 Object.seal() ，否则会报错
      this.html = "<p>" + this.value + "</p>";
    },
    onChange(editor) {
      const html = editor.getHtml();
      this.$emit("change", html);
      // const toolbar = DomEditor.getToolbar(editor);
      // console.log("工具栏配置", toolbar.getConfig().toolbarKeys);
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
div.H-editor {
  border: 1px solid #ccc;
  z-index: 1002;
  > .toolbar {
    border-bottom: 1px solid #ccc;
  }
  > .editor {
    overflow-y: hidden;
  }
}
</style>
