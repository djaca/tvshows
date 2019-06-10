import Vue from 'vue'
import VueToastr from '@deveodk/vue-toastr'
import '@deveodk/vue-toastr/dist/@deveodk/vue-toastr.css'

Vue.use(VueToastr, {
  defaultPosition: 'toast-top-right',
  defaultTimeout: 3000,
  closeOnHover: false
})
