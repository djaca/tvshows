import { ipcRenderer } from 'electron'

const state = {
  data: []
}

const getters = {
  findSubtitleByEpisodeId: state => id => state.data.find(s => s.episodeId === id)
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
  remove ({ state, commit }, id) {
    let index = state.data.findIndex(s => s.episodeId === id)

    if (index !== -1) {
      commit('REMOVE', index)
    }
  },

  download ({ commit, dispatch }, { id, urlId }) {
    return new Promise(resolve => {
      ipcRenderer.send('download-subtitle', { urlId })

      ipcRenderer.once('subtitle-downloaded', (event, { path }) => {
        dispatch('remove', id)

        commit('ADD', { id: urlId, episodeId: id, path })

        this._vm.$toastr('success', 'Subtitle downloaded')

        resolve()
      })

      ipcRenderer.on('download-subtitle-error', (event, err) => {
        this._vm.$toastr('error', 'Can`t download subtitle')

        console.log(err)
      })
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
