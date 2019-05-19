import { ipcRenderer } from 'electron'

const state = {
  data: []
}

const getters = {
  getSubtitleFor: (state, getters, rootState, rootGetters) => (season, episode, id = rootGetters['Shows/show'].id) =>
    state.data.find(s => s.showId === parseInt(id) && s.season === season && s.episode === episode)
}

const mutations = {
  ADD (state, payload) {
    state.data.push(payload)
  },

  REMOVE (state, index) {
    state.data.splice(index, 1)
  }
}

const actions = {
  remove ({ state, commit }, { showId, season, episode }) {
    let index = state.data.findIndex(s => s.showId === showId && s.season === season && s.episode === episode)

    if (index !== -1) {
      commit('REMOVE', index)
    }
  },

  download ({ commit, dispatch }, { id, season, episode, showId }) {
    ipcRenderer.send('download-subtitle', { id })

    ipcRenderer.once('subtitle-downloaded', (event, { path }) => {
      dispatch('remove', { showId, season, episode })

      commit('ADD', { id: parseInt(id), season, episode, showId, path })
    })

    ipcRenderer.on('download-subtitle-error', (event, err) => {
      console.log(err)
    })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
