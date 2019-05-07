import { ipcRenderer } from 'electron'
import { downloadLink } from '@/api/titlovi'

const state = {
  data: []
}

const getters = {
  findSubtitle: (state, getters, rootState, rootGetters) => (season, episode, id = rootGetters['Shows/show'].id) =>
    state.data.find(s => s.id === parseInt(id) && s.season === season && s.episode === episode)
}

const mutations = {
  ADD (state, payload) {
    let index = state.data.findIndex(t => {
      return t.id === payload.id && t.season === payload.season && t.episode === payload.episode
    })

    if (index !== -1) {
      state.data.splice(index, 1)
    }

    state.data.push(payload)
  },

  REMOVE (state, { id, season, episode }) {
    let index = state.data.findIndex(t => t.id === id && t.season === season && t.episode === episode)

    if (index !== -1) {
      state.data.splice(index, 1)
    }
  }
}

const actions = {
  add ({ commit }, payload) {
    commit('ADD', payload)
  },

  remove ({ commit }, payload) {
    commit('REMOVE', payload)
  },

  download ({ commit, dispatch }, { id, season, episode, urlId }) {
    ipcRenderer.send('download-subtitle', {
      id,
      season,
      episode,
      url: downloadLink + urlId
    })

    ipcRenderer.on('subtitle-downloaded', (event, payload) => {
      // todo: handle file path
      dispatch('add', { ...payload, urlId })
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
