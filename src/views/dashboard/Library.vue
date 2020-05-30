<template>
  <v-container id="dashboard-library" fluid fill-height>
    <v-col align-self="start" cols="12">
      <v-row justify="space-between" align="center">
        <v-col class="mx-4" md="4">
          <div class="font-weight-bold display-1 py-4 align-center">Library</div>
        </v-col>
        <v-col>
          <div class="text-center">
            <v-btn rounded class="primary darken-2" dark>NEW LIBRARY</v-btn>
          </div>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" sm="12">
          <v-container fluid>
            <v-row>
              <v-col
                v-for="library in libraries"
                :key="library.id"
                class="d-flex child-flex"
                md="4" sm="6" xs="12"
              >
                <v-hover v-slot:default="{ hover }">
                  <v-card
                    :elevation="hover ? 12 : 2"
                    :class="{ 'on-hover': hover }"
                    class="primary darken-3"
                    dark
                    min-width="100"
                    max-width="500"
                    @click="openLibrary(library)">
                    <v-responsive :aspect-ratio="16/9">
        <v-card-text class="display-1 text-center font-weight-bold">{{library.name}}</v-card-text>
      </v-responsive>
                  </v-card>
                </v-hover>
              </v-col>
            </v-row>
          </v-container>
        </v-col>
      </v-row>
    </v-col>
  </v-container>
</template>

<script>
import { mapMutations } from 'vuex';
export default {
  data: () => ({
    colors: ["#385F73", "#1F7087", "#952175"],
    libraries: [
      {
        id: 1,
        name: "default"
      }
    ]
  }),
  methods: {
    ...mapMutations({commitCurrentLibrary:'commitCurrentLibrary',}),

    openLibrary(library) {
      this.commitCurrentLibrary(library);
      this.$router.push("/library");
    }
  }
};
</script>