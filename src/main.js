import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import api from './utils/api'
import init from './utils/init'
import load from './utils/load'
require('@/utils/db').schema

Vue.config.productionTip = false
Vue.prototype.$http = api

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),

  // 储存登录状态
  created() {

    if(localStorage.getItem("Initialized")==null){
      // 初始化
      init();
    }
    load();

  }
}).$mount('#app')
