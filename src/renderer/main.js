import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import '@/plugins/font-awesome'
import '@/plugins/toastr'
import '@/plugins/loading'
import '@/plugins/modal'
import '@/plugins/vuex-sync'
import '@/assets/styles.css'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
