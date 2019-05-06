const state = {
  items: []
}

const getters = {
  torrent: (state, getters, rootState, rootGetters) => (season, episode, id = rootGetters['Shows/show'].id) =>
    state.items.find(t => t.id === String(id) && t.season === season && t.episode === episode)
}

const mutations = {
  ADD (state, payload) {
    let index = state.items.findIndex(t => t.id === payload.id && t.season === payload.season && t.episode === payload.episode)

    if (index !== -1) {
      state.items.splice(index, 1)
    }

    state.items.push(payload)
  }
}

const actions = {
  //
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
