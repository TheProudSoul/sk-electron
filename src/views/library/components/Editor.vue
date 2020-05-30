<template>
  <editor
    @focus="onEditorFocus"
    @blur="onEditorBlur"
    @change="onEditorChange"
    @stateChange="onEditorStateChange"
    initialEditType="wysiwyg"
    :options="editorOptions"
    ref="toastuiEditor"
    height="100%"
  ></editor>
</template>

<script>
import "codemirror/lib/codemirror.css";
import "@toast-ui/editor/dist/toastui-editor.css";

import { Editor } from "@toast-ui/vue-editor";
import { mapState, mapMutations } from "vuex";

export default {
  components: {
    editor: Editor
  },
  data: () => ({
    editorOptions: {
      hideModeSwitch: true,
      usageStatistics: false,
      useCommandShortcut: true
    }
  }),
  computed: {
    ...mapState({
      isChange: state => state.library.isChange,
      content: state => state.library.content
    })
  },
  methods: {
    ...mapMutations({
      setChange: "setChange"
    }),
    onEditorFocus() {
      console.log("onEditorFocus");
    },
    onEditorBlur() {
      console.log("onEditorBlur");
    },
    writeFile() {
      if (this.isChange) {
        this.$store.dispatch(
          "writeCurrentFile",
          this.$refs.toastuiEditor.invoke("getMarkdown")
        );
      }
      this.setChange(false);
    },
    onEditorChange() {
      if (
        !this.change &&
        this.$refs.toastuiEditor.invoke("getMarkdown") != this.content
      )
        this.setChange(true);
    },
    changeMode() {
      if (this.$refs.toastuiEditor.editor.isMarkdownMode())
        this.$refs.toastuiEditor.invoke("changeMode", "wysiwyg");
      else this.$refs.toastuiEditor.invoke("changeMode", "markdown");
    },
    setMarkdown(md) {
      this.$refs.toastuiEditor.invoke("setMarkdown", md, false);
    },
    setContent() {
      this.setMarkdown(this.content);
      this.setChange(false);
      // setTimeout(() => this.setChange(false), 150);
    },
    onEditorStateChange() {
      console.log("onEditorStateChange");
    }
  }
};
</script>

<style scoped>
/* .tui-editor-defaultUI-toolbar {
  background-color: #424242;
} */
/* .tui-editor-contents h1,
.tui-editor-contents h2,
.tui-editor-contents h3,
.tui-editor-contents h4,
.tui-editor-contents h5,
.tui-editor-contents h6,
.tui-editor-contents ul,
.tui-editor-contents menu,
.tui-editor-contents ol,
.tui-editor-contents dir,
.tui-editor-contents table {
  font-weight: bold;
  color: #fff;
} */
/* .tui-editor-contents,
.tui-editor-contents * {
  color: #fff;
  background-color: #424242;
}
.tui-editor-defaultUI {
  color: #FFFFFF !important;
  background-color: #121212 !important;
} */
</style>