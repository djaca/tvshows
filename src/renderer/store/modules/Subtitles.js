import { ipcRenderer } from 'electron'

const state = {
  data: []
}

const getters = {
  subtitles: state => params => {
    return state.data.filter(t => t.showId === parseInt(params.id) && t.season === parseInt(params.season))
  }
}

const mutations = {
  ADD (state, payload) {
    let found = state.data.findIndex(t => t.showId === payload.showId && t.season === payload.season && t.episode === payload.episode)

    if (found !== -1) {
      state.data.splice(found, 1)
    }

    state.data.push(payload)
  }
}

const actions = {
  add ({commit}, payload) {
    commit('ADD', payload)
  },

  download ({commit}, {urlId, showId, season, episode}) {
    ipcRenderer.send('download-subtitle', {
      showId,
      season,
      episode,
      url: `https://titlovi.com/download/?type=1&mediaid=${urlId}`
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
