import Vue from 'vue'
import axios from 'axios'
import App from './App'
import router from './router'
import store from './store'
import { sync } from 'vuex-router-sync'
import VModal from 'vue-js-modal'
import { DateTime } from 'luxon'
import Loading from 'vue-loading-overlay'
import VueToastr from '@deveodk/vue-toastr'
import '@/plugins/font-awesome'
import 'vue-loading-overlay/dist/vue-loading.css'
import '@/assets/styles.css'

sync(store, router)

Vue.use(VueToastr, {
  defaultPosition: 'toast-top-right',
  defaultTimeout: 3000,
  closeOnHover: false
})

Vue.use(VModal, { dynamic: true, injectModalsContainer: true })

Vue.use(Loading, {
  backgroundColor: '#232D3D',
  color: '#8EACC5',
  width: 80,
  height: 80
})

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

Vue.prototype.humanTime = date => DateTime.fromISO(date).toLocaleString(DateTime.DATE_MED)

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
