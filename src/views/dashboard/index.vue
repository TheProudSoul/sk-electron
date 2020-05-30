<template>
  <v-app id="dashboard">
    <v-navigation-drawer mobile-break-point="0" v-model="drawer" :width="260" clipped app>
      <v-row align="center" justify="center">
        <div class="font-weight-bold headline py-4">Super Knowledge</div>
      </v-row>
      <v-row align="center" justify="center">
        <v-avatar tile :size="100">
          <img src="@/assets/logo.png" alt="logo" />
        </v-avatar>
      </v-row>
      <v-row align="center" justify="center">
        <v-switch
          :label="(!$vuetify.theme.dark ? 'Light' : 'Dark') + ' Theme'"
          v-model="$vuetify.theme.dark"
        />
      </v-row>
      <v-list nav dense>
        <v-divider />
        <v-list-item-group v-model="group" color="primary">
          <v-subheader>Basement</v-subheader>
          <v-list-item to="/" :key="1">
            <v-list-item-icon>
              <v-icon>mdi-home</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Library</v-list-item-title>
          </v-list-item>
          <template v-if="isLogin">
            <v-list-item to="/version-control" :key="2">
              <v-list-item-icon>
                <v-icon>mdi-source-merge</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Version Control</v-list-item-title>
            </v-list-item>
            <v-divider />
            <v-subheader>PicBed</v-subheader>
            <v-list-item to="/picbed/upload" :key="3">
              <v-list-item-icon>
                <v-icon>mdi-cloud-upload</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Image Upload</v-list-item-title>
            </v-list-item>
            <v-list-item to="/picbed/gallery" :key="4">
              <v-list-item-icon>
                <v-icon>mdi-folder-multiple-image</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Gallery</v-list-item-title>
            </v-list-item>
          </template>
          <v-divider />
          <v-subheader>System</v-subheader>
          <v-list-item to="/settings" :key="5">
            <v-list-item-icon>
              <v-icon>mdi-cog</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Settings</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
        <template v-if="isLogin">
          <v-dialog v-model="logoutDialog" persistent max-width="290">
            <template v-slot:activator="{ on }">
              <v-list-item v-on="on">
                <v-list-item-icon>
                  <v-icon>mdi-export</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Logout</v-list-item-title>
              </v-list-item>
            </template>
            <v-card>
              <v-card-title class="headline">Action Confirm</v-card-title>
              <v-card-text>Are you sure you want to LOGOUT?</v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary darken-1" text @click="logoutDialog = false">CANCEL</v-btn>
                <v-btn color="red darken-1" text @click="logout()">COMMIT</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </template>
        <template v-else>
          <v-dialog v-model="loginDialog" @keydown.enter="login" persistent max-width="500">
            <template v-slot:activator="{ on }">
              <v-list-item v-on="on" @click="loginloading=false">
                <v-list-item-icon>
                  <v-icon>mdi-login</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Login</v-list-item-title>
              </v-list-item>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">Login</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        label="Email*"
                        v-model="loginForm.email"
                        type="email"
                        :rules="emailRules"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        label="Password*"
                        v-model="loginForm.password"
                        :loading="loginloading"
                        type="password"
                        :rules="passwordRules"
                        :error-messages="loginError"
                        required
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="loginDialog = false">Close</v-btn>
                <v-btn color="blue darken-1" text @click="login">Submit</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </template>
      </v-list>
      <template v-slot:append v-if="isLogin">
        <v-row class="user-info" align="center">
          <v-avatar class="primary darken-1 mr-2 ml-6 mb-2">
            <span class="white--text headline">{{avatar}}</span>
          </v-avatar>
          <strong v-html="username"></strong>
          <span class="grey--text">&nbsp;({{ email }})</span>
        </v-row>
      </template>
    </v-navigation-drawer>
    <v-app-bar flat elevation="1" :height="35" style="-webkit-app-region: drag" clipped-left app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" style="-webkit-app-region: no-drag"></v-app-bar-nav-icon>
      <v-spacer></v-spacer>
      <v-toolbar-title class="pl-12">
        <h5>Super Knowledge</h5>
      </v-toolbar-title>
      <v-spacer></v-spacer>

      <!-- <v-btn
        icon
        small
        outlined
        @click="min"
        style="-webkit-app-region: no-drag; margin-right: 8px"
      >
        <v-icon>mdi-window-minimize</v-icon>
      </v-btn>
      <v-btn
        icon
        small
        outlined
        @click="max"
        style="-webkit-app-region: no-drag; margin-right: 8px"
      >
        <v-icon>mdi-window-maximize</v-icon>
      </v-btn>
      <v-btn icon small outlined @click="close" style="-webkit-app-region: no-drag">
        <v-icon>mdi-window-close</v-icon>
      </v-btn>-->
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
      <router-view />
    </v-content>
  </v-app>
</template>

<script>
import { ipcRenderer } from "electron";
import { mapState, mapGetters, mapMutations } from "vuex";
export default {
  data: () => ({
    emailRules: [
      value => !!value || "Required.",
      value => (value || "").length <= 20 || "Max 20 characters",
      value => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return pattern.test(value) || "Invalid e-mail.";
      }
    ],
    passwordRules: [
      value => !!value || "Required.",
      value => (value || "").length <= 20 || "Max 20 characters",
      value => (value || "").length >= 8 || "Min 8 characters"
    ],
    loginError: "",
    drawer: true,
    group: 1,
    logoutDialog: false,
    loginDialog: false,
    loginForm: {
      email: "",
      password: ""
    },
    loginloading: false
  }),
  watch: {
    email() {
      this.loginError = "";
    },
    password() {
      this.loginError = "";
    }
  },
  computed: {
    ...mapState({
      isLogin: state => state.account.isLogin,
      username: state => state.account.username,
      email: state => state.account.email
    }),
    ...mapGetters({
      avatar: "avatar"
    })
  },
  methods: {
    login() {
      this.loginloading = true;
      this.$http.userApi.login(this.loginForm).then(res => {
        this.loginloading = false;
        if (res.errCode == "00") {
          this.$store.dispatch("login", res.data);
          this.loginDialog = false;
        } else {
          this.loginError = res.errMsg;
        }
      });
    },
    logout() {
      this.$store.dispatch("logout");
      this.logoutDialog = false;
      if (this.$route.name !== "dashboard-library") this.$router.push("/");
    },
    close: () => ipcRenderer.send("close"),
    max: () => ipcRenderer.send("maximize"),
    min: () => ipcRenderer.send("minimize")
  }
};
</script>

<style>
</style>