<template>
  <v-app>
    <v-navigation-drawer mobile-break-point="0" v-model="drawer" :width="300" app>
      <v-card class="mx-auto" max-width="500">
        <v-sheet tile class="py-1 px-3 primary darken-3">
          <v-row align="center">
            <v-col cols="2">
              <v-btn fab small @click="back">
                <v-icon>mdi-arrow-left</v-icon>
              </v-btn>
            </v-col>
            <v-col cols="5">
              <div class="headline font-weight-bold" style="color: white">{{currentLibrary.name}}</div>
            </v-col>
          </v-row>
          <v-text-field
            v-model="search"
            label="Search Library"
            dark
            flat
            dense
            solo-inverted
            hide-details
            clearable
            clear-icon="mdi-close-circle-outline"
          ></v-text-field>
          <v-checkbox
            class="mt-0"
            v-model="caseSensitive"
            dark
            hide-details
            label="Case sensitive search"
          ></v-checkbox>
          <v-col cols="12" class="pa-1">
            <v-btn-toggle class="mt-3" dense background-color="primary">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn @click="showInFolder" v-on="on">
                    <v-icon>mdi-open-in-new</v-icon>
                  </v-btn>
                </template>
                <span>Show In File Explorer</span>
              </v-tooltip>

              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn @click="createFolder" v-on="on">
                    <v-icon>mdi-folder-plus-outline</v-icon>
                  </v-btn>
                </template>
                <span>New Folder</span>
              </v-tooltip>

              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn @click="createFile" v-on="on">
                    <v-icon>mdi-text-box-plus-outline</v-icon>
                  </v-btn>
                </template>
                <span>New File</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn @click="saveFile" :disabled="!isChange" v-on="on">
                    <v-icon>mdi-content-save-outline</v-icon>
                  </v-btn>
                </template>
                <span>Save Current</span>
              </v-tooltip>
            </v-btn-toggle>
          </v-col>
        </v-sheet>
      </v-card>
      <v-treeview
        color="primary"
        return-object
        dense
        rounded
        hoverable
        :items="fileList"
        item-text="title"
        item-key="pathname"
        :search="search"
        :filter="filter"
        :active.sync="selectItem"
        @update:active="updateActive"
        activatable
        openOnClick
      >
        <template v-slot:prepend="{ item, open }">
          <v-icon v-if="item.isDir">{{ open ? 'mdi-folder-open' : 'mdi-folder' }}</v-icon>
          <v-icon v-else>mdi-file-document-outline</v-icon>
        </template>
        <template v-slot:append="{ item }">
          <v-menu :position-x="0" :position-y="0" absolute offset-y>
            <template v-slot:activator="{ on }">
              <v-btn icon v-on="on" fab x-small>
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>

            <!-- 右键菜单 -->
            <v-list dense >
              <v-list-item-group v-model="activeItem" color="primary">
              <v-list-item
                v-for="cxtItem in contextmenuItems"
                :key="cxtItem.id"
                @click.stop="doOperation(item, cxtItem.id)"
              >
                <v-list-item-title>
                  <v-icon>mdi-{{cxtItem.icon}}</v-icon>
                  {{ cxtItem.title }}
                </v-list-item-title>
              </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-menu>
        </template>
      </v-treeview>
    </v-navigation-drawer>
    <v-app-bar elevation="1" :height="35" dense style="-webkit-app-region: drag" app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" style="-webkit-app-region: no-drag"></v-app-bar-nav-icon>
      <v-spacer></v-spacer>
      <v-toolbar-title>
        {{currentFileTitle}}
        <span v-show="isChange" style="color:grey">*</span>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon @click="min" style="-webkit-app-region: no-drag">
        <v-icon>mdi-window-minimize</v-icon>
      </v-btn>
      <v-btn icon @click="max" style="-webkit-app-region: no-drag">
        <v-icon>mdi-window-maximize</v-icon>
      </v-btn>
      <v-btn icon @click="close" style="-webkit-app-region: no-drag">
        <v-icon>mdi-window-close</v-icon>
      </v-btn>
    </v-app-bar>
    <v-content>
      <Editor ref="editor" />
    </v-content>
    <v-footer inset app>
      <v-btn icon color="primary" x-small @click="changeMode()">
        <v-icon size="18">mdi-vector-link</v-icon>
      </v-btn>
    </v-footer>

    <v-dialog v-model="nameDialog" @keydown.enter="newLink" max-width="300">
      <v-card>
        <v-card-title class="headline">Enter the name</v-card-title>
        <v-card-text>
          <v-text-field
            :loading="nameloading"
            :rules="nameRules"
            :error-messages="nameError"
            clearable
            v-model="name"
          ></v-text-field>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="grey darken-1" text @click="nameDialog = false">Cancel</v-btn>
          <v-btn color="primary darken-1" text @click="newLink">Commit</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="deleteDialog" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">Action Confirm</v-card-title>
        <v-card-text>Are you sure you want to DELETE?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary darken-1" text @click="deleteDialog = false">cancel</v-btn>
          <v-btn color="red darken-1" text @click="deleteCtx()">
            <v-icon>mdi-delete</v-icon>commit
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import { mapState, mapGetters, mapMutations } from "vuex";
import { ipcRenderer, shell } from "electron";
import Editor from "./components/Editor";
import FileWatcher from "@/utils/fileWatcher";
import * as fileCRUD from "@/utils/fileCRUD";
import db from "@/utils/db";
import path from "path";

export default {
  components: { Editor },
  data: () => ({
    selectItem: [],
    contextmenuItems: [
      { id: 0, title: "New File", icon: "text-box-plus-outline" },
      { id: 2, title: "New Folder", icon: "folder-plus-outline" },
      { id: 5, title: "Rename", icon: "form-textbox" },
      { id: 1, title: "Move To Trash", icon: "delete-outline" }
    ],
    drawer: true,
    caseSensitive: false,
    search: null,
    deleteDialog: false,
    nameDialog: false,
    nameloading: false,
    name: "",
    nameRules: [
      value => !!value || "Required.",
      value => (value || "").length <= 100 || "Max 100 characters"
    ],
    nameError: "",
    cxtIndex: 0,
    cxtItem: null,
    activeItem: null
  }),
  computed: {
    ...mapGetters({
      currentFileTitle: "currentFileTitle"
    }),
    ...mapState({
      isLogin: state => state.account.isLogin,
      currentLibrary: state => state.library.currentLibrary,
      isChange: state => state.library.isChange,
      fileList: state => state.library.fileList,
      userDefault: state => state.fileJournal.userDefault,
      currentFile: state => state.library.currentFile
    }),
    filter() {
      return this.caseSensitive
        ? (item, search, textKey) => item[textKey].indexOf(search) > -1
        : undefined;
    }
  },
  watch: {
    name() {
      this.nameError = "";
    },
    currentLibrary() {
      if (currentLibrary) {
        this.setFileList([]);
        FileWatcher(this.userDefault);
      }
    }
  },
  methods: {
    ...mapMutations({
      commitCurrentFile: "commitCurrentFile",
      setFileList: "commitFileList",
      unlink: "unlink",
      deleteNode: "REMOVE_NODE_MUTATION"
    }),
    changeMode() {
      this.$refs.editor.changeMode();
    },
    close: () => ipcRenderer.send("close"),
    max: () => ipcRenderer.send("maximize"),
    min: () => ipcRenderer.send("minimize"),
    back() {
      // this.commitCurrentFile(null);
      this.$router.push("/");
    },
    doOperation(item, cxtIndex) {
      this.cxtIndex = cxtIndex;
      this.cxtItem = item;
      this.name = "";
      switch (cxtIndex) {
        case 1: {
          // Move To Trash
          if (this.cxtItem.isDir) this.cxtIndex = 3;
          this.deleteDialog = true;
          break;
        }
        case 5: {
          if (!this.cxtItem.isDir) this.name = this.cxtItem.title.slice(0, -3);
        }
        default: {
          // 0:New File
          // 2:New Folder
          // 5:Rename
          this.nameDialog = true;
          break;
        }
      }
    },
    newLink() {
      switch (this.cxtIndex) {
        case 0: {
          let relativePath = '';
          if (this.cxtItem.isDir) {
            relativePath = path.join(this.cxtItem.pathname, this.name + ".md");
          } else {
            relativePath = path.join(
              path.dirname(this.cxtItem.pathname),
              this.name + ".md"
            );
          }
          let filepath = path.join(this.userDefault, relativePath);
          if (fileCRUD.checkRepeat(filepath)) {
            this.nameError = "This path is existed!";
          } else {
            this.nameloading = true;
            fileCRUD.createFile(filepath);
            db.fileJournalDao.insert(relativePath, 0, "");
            this.nameloading = false;
            this.nameDialog = false;
          }
          break;
        }
        case 2: {
          let relativePath = '';
          if (this.cxtItem.isDir) {
            relativePath = path.join(this.cxtItem.pathname, this.name);
          } else {
            relativePath = path.join(
              path.dirname(this.cxtItem.pathname),
              this.name
            );
          }
          let filepath = path.join(this.userDefault, relativePath);
          if (fileCRUD.checkRepeat(filepath)) {
            this.nameError = "This path is existed!";
          } else {
            this.nameloading = true;
            fileCRUD.createFolder(filepath);
            db.fileJournalDao.insert(relativePath, 2, "");
            this.nameloading = false;
            this.nameDialog = false;
          }
          break;
        }
        case 5: {
          let relativePath = path.join(
            path.dirname(this.cxtItem.pathname),
            this.name
          );
          if (!this.cxtItem.isDir) relativePath = relativePath + ".md";
          let newFilePath = path.join(this.userDefault, relativePath);
          if (fileCRUD.checkRepeat(newFilePath)) {
            this.nameError = "This path is existed!";
          } else {
            this.nameloading = true;
            fileCRUD.move(
              path.join(this.userDefault, this.cxtItem.pathname),
              newFilePath
            );
            db.fileJournalDao.insert(relativePath, 5, this.cxtItem.pathname);
            this.nameloading = false;
            this.nameDialog = false;
          }
          break;
        }
      }
    },
    deleteCtx() {
      if (this.currentFile == this.cxtItem) {
        this.$refs.editor.setMarkdown("");
        this.commitCurrentFile(null);
      }
      this.unlink(this.cxtItem.pathname);
      db.fileJournalDao.insert(this.cxtItem.pathname, this.cxtIndex, "");
      this.deleteDialog = false;
    },
    updateActive(active) {
      if (
        active[0] &&
        !active[0].isDir &&
        (!this.currentFile || active[0].pathname != this.currentFile.pathname)
      ) {
        this.$store.dispatch("setCurrentFile", active[0]);
        this.$refs.editor.setContent();
      } else {
        if (this.currentFile) this.selectItem = [this.currentFile];
      }
      // if (path[0] && path[0] != this.currentFilePath) {
      // }
    },
    showInFolder() {
      if (this.currentFile)
        shell.showItemInFolder(
          path.join(this.userDefault, this.currentFile.pathname)
        );
      else shell.openItem(this.userDefault);
    },
    createFolder() {
      this.name = "";
      this.cxtIndex = 2;
      this.cxtItem = { isDir: true, pathname: "" };
      this.nameDialog = true;
    },
    createFile() {
      this.name = "";
      this.cxtIndex = 0;
      this.cxtItem = { isDir: true, pathname: "" };
      this.nameDialog = true;
    },
    saveFile() {
      if (this.isChange) {
        this.$refs.editor.writeFile();
      }
    }
  },
  mounted() {
    this.setFileList([]);
    FileWatcher(this.userDefault);
  }
};
</script>

<style>
.v-treeview-node.v-treeview-node--rounded .v-treeview-node__root {
  margin: 0;
  font-size: 14px;
}
</style>