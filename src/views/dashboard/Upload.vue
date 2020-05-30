<template>
  <v-container fluid fill-height>
    <v-row justify="center">
        <v-col align="center" cols="6">

          <v-row class="mb-6" align="center">
            <div
              id="upload-area"
              :class="{ 'is-dragover': dragover }"
              @drop.prevent="onDrop"
              @dragover.prevent="dragover = true"
              @dragleave.prevent="dragover = false"
            >
              <div id="upload-dragger" @click="openUplodWindow">
                <v-row align="center" justify="center" style="height:100%">
                  <v-col>
                    <v-row justify="center" cols="12">
                      <v-icon size="50">mdi-cloud-upload</v-icon>
                    </v-row>
                    <v-row justify="center" cols="12">
                      <div class="upload-dragger__text">
                        将文件拖到此处，或
                        <span>点击上传</span>
                      </div>
                    </v-row>
                  </v-col>
                </v-row>
                <input type="file" id="file-uploader" @change="onChange" multiple />
              </div>
            </div>
          </v-row>

          <v-row class="mb-6" align="center" justify="center">
            <v-btn-toggle color="primary" v-model="pasteStyle" rounded>
              <v-btn value="Markdown">Markdown</v-btn>
              <v-btn value="HTML">HTML</v-btn>
              <v-btn value="URL">URL</v-btn>
              <v-btn value="UBB">UBB</v-btn>
            </v-btn-toggle>
          </v-row>

          <v-row class="mb-6" align="center" sm="6">
            <v-text-field
              append-icon="mdi-content-copy"
              name="input-10-2"
              type="url"
              solo
              v-model="pasteText"
              class="input-group--focused"
              @click:append="pasteTextClick"
            ></v-text-field>
          </v-row>

        </v-col>
    </v-row>

    <v-snackbar v-model="snackbar" :timeout="timeout">
      {{ text }}
      <v-btn color="blue" text @click="snackbar = false">Close</v-btn>
    </v-snackbar>
  </v-container>
</template>

<script>
import { clipboard } from "electron";
import FormData from "form-data";

export default {
  data: () => ({
    dragover: false,
    text: `图片 URL 已复制到剪切板`,
    snackbar: false,
    timeout: 1000,
    pasteStyle: "Markdown",
    imageUrl: ""
  }),
  computed: {
    pasteText: function() {
      if (this.imageUrl === "") return "";
      switch (this.pasteStyle) {
        case "Markdown":
          return `![](${this.imageUrl})`;
        case "HTML":
          return `<img src="${this.imageUrl}"/>`;
        case "URL":
          return this.imageUrl;
        case "UBB":
          return `[IMG]${this.imageUrl}`;
      }
    }
  },
  methods: {
    openUplodWindow() {
      document.getElementById("file-uploader").click();
    },
    onChange(e) {
      const form = new FormData();
      // Second argument  can take Buffer or Stream (lazily read during the request) too.
      // Third argument is filename if you want to simulate a file upload. Otherwise omit.
      form.append("file", e.target.files[0]);
      let imageUrl = "";
      this.showProgress = true;
      this.$http.imageApi.upload(form).then(res => {
          if (res.errCode == "00") {
            this.imageUrl = res.data;
            this.text = "上传成功"
            this.snackbar = true
          } else {
            this.text = res.errMsg
            this.snackbar = true
          }
          this.showProgress = false;
        });
      this.imageUrl = imageUrl;
      document.getElementById("file-uploader").value = "";
    },
    uploadClipboardFile() {},

    pasteTextClick() {
      clipboard.writeText(this.pasteText);
      this.text = `图片 URL 已复制到剪切板`
      this.snackbar = true;
    }
  }
};
</script>

<style scoped>
#upload-area {
  height: 220px;
  text-align: center;
  place-self: center;
  width: 450px;
  /* margin: 0 auto;    */
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}
#upload-dragger {
  height: 100%;
  border: 2px dashed;
  border-radius: 8px;
}
#upload-dragger:hover,
is-dragover {
  border: 2px dashed #fff;
  background-color: rgba(0, 0, 0, 0.7);
  color: #fff;
}

span {
  color: #409eff;
}

#file-uploader {
  display: none;
}
</style>