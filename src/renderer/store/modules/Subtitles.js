import { ipcRenderer } from 'electron'
import { downloadLink } from '@/api/titlovi'

const state = {
  data: []
}

const getters = {
  subtitle: (state, getters, rootState, rootGetters) => (season, episode) =>
    state.data.find(s => s.id === rootGetters['Shows/show'].id && s.season === season && s.episode === episode)
}

const mutations = {
  ADD (state, payload) {
    let found = state.data.findIndex(t => t.id === payload.id && t.season === payload.season && t.episode === payload.episode)

    if (found !== -1) {
      state.data.splice(found, 1)
    }

    state.data.push(payload)
  },

  REMOVE (state, {id, season, episode}) {
    let found = state.data.findIndex(t => t.id === id && t.season === season && t.episode === episode)

    if (found !== -1) {
      state.data.splice(found, 1)
    }
  }
}

const actions = {
  add ({commit}, payload) {
    commit('ADD', payload)
  },

  remove ({commit}, payload) {
    commit('REMOVE', payload)
  },

  download ({commit, dispatch}, {urlId, id, season, episode}) {
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
