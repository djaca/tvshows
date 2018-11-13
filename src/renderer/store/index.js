import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'

// import { createPersistedState, createSharedMutations } from 'vuex-electron'

import modules from './modules'

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
  reducer: (state) => ({
    Shows: state.Shows,
    Watch: state.Watch
  })
})

Vue.use(Vuex)

export default new Vuex.Store({
  modules,
  plugins: [
    vuexLocal.plugin
    // createPersistedState(),
    // createSharedMutations()
  ],
  strict: process.env.NODE_ENV !== 'production'
})
