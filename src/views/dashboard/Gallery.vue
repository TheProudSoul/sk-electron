<template>
  <v-container id="vc-table" fluid tag="section">
    <v-col cols="12" class="pa-8">
      <v-card>
        <v-container fluid>
          <v-row>
            <v-col
              v-for="image in gallerys"
              :key="image.id"
              class="d-flex child-flex"
              md="4"
              sm="6"
              xs="12"
            >
              <v-card flat tile>
                <v-hover v-slot:default="{ hover }">
                  <v-img
                    :src="image.imageUrl"
                    :lazy-src="image.scaleUrl"
                    class="grey lighten-2 white--text align-end"
                    gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                    min-width="200px"
                    aspect-ratio="1"
                  >
                    <v-fade-transition>
                      <v-overlay v-if="hover" absolute color="primary">
                        <v-btn @click="imgClick(image.imageUrl)">Open in browser</v-btn>
                      </v-overlay>
                    </v-fade-transition>
                    <template v-slot:placeholder>
                      <v-row class="fill-height ma-0" align="center" justify="center">
                        <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                      </v-row>
                    </template>
                  </v-img>
                </v-hover>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn icon @click="handleCopy(image.imageUrl)" v-on="on">
                        <v-icon color="primary">mdi-content-copy</v-icon>
                      </v-btn>
                    </template>
                  <span>Copy image address</span>
                  </v-tooltip>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                    <v-btn icon @click.stop="openDeleteDialog(image.id)" v-on="on">
                      <v-icon color="red">mdi-delete</v-icon>
                    </v-btn>
                    </template>
                  <span>Delete image</span>
                  </v-tooltip>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
      <div class="text-center">
        <v-pagination
          class="pt-8"
          v-model="currentPage"
          :length="pageNum"
          @input="handleCurrentChange"
          :total-visible="5"
          prev-icon="mdi-menu-left"
          next-icon="mdi-menu-right"
        ></v-pagination>
      </div>
    </v-col>
    <v-snackbar v-model="snackbar" :timeout="timeout">
      {{ text }}
      <v-btn color="blue" text @click="snackbar = false">Close</v-btn>
    </v-snackbar>
    <v-dialog
      v-model="deleteDialog"
      @keydown.enter="handleDelete(image.id)"
      persistent
      max-width="300"
    >
      <v-card>
        <v-card-title class="headline">Action Confirm</v-card-title>
        <v-card-text>Are you sure you want to DELETE?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary darken-1" text @click="deleteDialog = false">CENCEL</v-btn>
          <v-btn color="red darken-1" :loading="deleteLoading" text @click="handleDelete(deleteId)">
            <v-icon>mdi-delete</v-icon>YES
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { clipboard, shell } from "electron";
export default {
  name: "gallery",
  data: () => ({
    absolute: true,
    deleteDialog: false,
    text: `图片 URL 已复制到剪切板`,
    snackbar: false,
    timeout: 2000,

    overlay: false,
    gallerys: [],
    currentPage: 1,
    // pageNum: 1,
    pageSize: 9,
    total: 0,
    deleteId: 0,
    deleteLoading: false
  }),
  mounted() {
    this.getGallerys();
    this.getTotal();
  },
  computed: {
    pageNum: function() {
      return Math.ceil(this.total / this.pageSize);
    }
  },
  methods: {
    getGallerys() {
      this.$http.imageApi
        .fetchList(this.currentPage, this.pageSize)
        .then(res => {
          if (res.errCode == "00") {
            this.gallerys = res.data;
          }
        });
    },
    getTotal() {
      this.$http.imageApi.getCount().then(res => {
        console.log(res);
        this.total = res;
      });
    },
    handleCurrentChange(val) {
      this.getGallerys();
    },
    handleCopy(url) {
      clipboard.writeText(url);
      this.snackbar = true;
    },
    handleDelete(id) {
      this.deleteLoading = true;
      this.$http.imageApi.deleteOne(id).then(res => {
        if (res.errCode == "00") {
          this.total--;
          this.gallerys.splice(
            this.gallerys.findIndex(e => e.id === id),
            1
          );
        }
        this.deleteLoading = false;
        this.deleteDialog = false;
      });
    },
    imgClick(url) {
      shell.openExternal(url);
    },
    openDeleteDialog(id) {
      this.deleteId = id;
      this.deleteDialog = true;
    }
  }
};
</script>