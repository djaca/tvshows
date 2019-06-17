import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import { DateTime } from 'luxon'
import '@/plugins'
import '@/assets/styles.css'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false
Vue.prototype.humanTime = date => DateTime.fromISO(date).toLocaleString(DateTime.DATE_MED)

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
