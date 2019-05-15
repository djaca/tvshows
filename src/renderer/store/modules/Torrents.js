const state = {
  items: []
}

const getters = {
  findTorrent: (state, getters, rootState, rootGetters) => (season, episode, id = rootGetters['Shows/show'].id) =>
    state.items.find(t => t.id === id && t.season === season && t.episode === episode)
}

const mutations = {
  ADD (state, payload) {
    state.items.push(payload)
  },

  REMOVE (state, index) {
    state.items.splice(index, 1)
  }
}

const actions = {
  add ({ commit, state }, payload) {
    let index = state.items.findIndex(t => t.id === payload.id && t.season === payload.season && t.episode === payload.episode)

    if (index !== -1) {
      commit('REMOVE', index)
    }

    commit('ADD', payload)
  },

  remove ({ commit, state }, payload) {
    let index = state.items.findIndex(t => t.id === payload.id && t.season === payload.season && t.episode === payload.episode)

    commit('REMOVE', index)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
