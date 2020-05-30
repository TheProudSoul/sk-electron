<template>
  <v-container id="vc-table" fluid tag="section">
    <v-sheet
      class="pa-7 primary darken-3 text-start v-card--material__heading mb-n6"
      dark
      width="100% "
    >
      <v-row justify="space-between" align="center">
        <div class="headline font-weight-thin" v-text="text" />
        <v-dialog v-model="createDialog" @keydown.enter="create" persistent max-width="300px">
          <template v-slot:activator="{ on }">
            <v-btn class="ma-2" outlined fab icon small v-on="on">
              <v-icon>mdi-plus-thick</v-icon>
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">New Version</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-text-field
                    label="Version Name"
                    v-model="name"
                    hint="e.g. Version One"
                    clearable
                    :rules="nameRules"
                    :loading="createloading"
                    :error-messages="createError"
                  ></v-text-field>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="createDialog = false">Close</v-btn>
              <v-btn color="blue darken-1" text @click="create">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </v-sheet>
    <v-card icon="mdi-clipboard-text" title="Simple Table" class="px-5 py-3">
      <v-simple-table>
        <thead>
          <tr>
            <th class="primary--text">ID</th>
            <th class="primary--text">Name</th>
            <th class="primary--text">TIME</th>
            <th class="primary--text text-right">Operations</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="item in data" :key="item.id">
            <td>{{item.id}}</td>
            <td>{{item.name}}</td>
            <td>{{item.time}}</td>
            <td>
              <v-row justify="end">
                <v-btn icon @click="downloadVersion(item.id)">
                  <v-icon>mdi-download</v-icon>
                </v-btn>
                <v-btn icon @click.stop="openDeleteDialog(item.id)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </v-row>
            </td>
          </tr>
        </tbody>
      </v-simple-table>
    </v-card>

    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>

    <v-dialog v-model="deleteDialog" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">Action Confirm</v-card-title>
        <v-card-text>Are you sure you want to DELETE?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary darken-1" text @click="deleteDialog = false">CANCEL</v-btn>
          <v-btn
            color="red darken-1"
            :loading="deleteLoading"
            text
            @click="deleteVersion(deleteId)"
          >
            <v-icon>mdi-delete</v-icon>YES
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  name: "VersionControl",
  data: () => ({
    data: [],
    text: "Saved Versions",
    createDialog: false,
    createError: "",
    createloading: false,
    deleteDialog: false,
    name: "",
    nameRules: [
      value => !!value || "Required.",
      value => (value || "").length <= 100 || "Max 100 characters"
    ],
    overlay: true,
    deleteLoading: false,
    deleteId: 0
  }),
  created() {
    this.fetchListData();
    this.overlay = false;
  },
  watch: {
    name() {
      this.createError = "";
    }
  },
  methods: {
    fetchListData() {
      this.$http.versionControlApi.fetchList().then(res => {
        this.data = res.data;
      });
    },
    create() {
      this.createloading = true;
      this.$http.versionControlApi.createOne(this.name).then(res => {
        this.createloading = false;
        if (res.errCode == "00") {
          this.createDialog = false;
          this.name = "";
          this.fetchListData();
        } else {
          this.createError = res.errMsg;
        }
      });
      this.createloading = false;
    },
    downloadVersion(id) {
      this.$http.versionControlApi.downloadVersion(id);
    },
    deleteVersion(id) {
      this.deleteLoading = true;
      this.$http.versionControlApi.deleteVersion(id).then(res => {
        if (res.errCode == "00") {
          this.deleteLoading = false;
          this.deleteDialog = false;
          this.fetchListData();
        }
      });
    },
    openDeleteDialog(id) {
      this.deleteId = id;
      this.deleteDialog = true;
    }
  }
};
</script>

<style>
</style>