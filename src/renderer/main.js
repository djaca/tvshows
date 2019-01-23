import Vue from 'vue'
import axios from 'axios'
import App from './App'
import router from './router'
import store from './store'
import '@/assets/styles.css'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import VModal from 'vue-js-modal'
import { DateTime } from 'luxon'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'

Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.use(VModal, { dynamic: true, injectModalsContainer: true })

Vue.use(Loading)

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

const {ipcRenderer} = require('electron')
ipcRenderer.on('subtitle-downloaded', (event, payload) => {
  // todo: handle file path
  store.dispatch('Subtitles/add', payload)
})

ipcRenderer.on('download-subtitle-error', (event, err) => {
  console.log(err)
})
