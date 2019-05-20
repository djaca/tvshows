const state = {
  items: []
}

const getters = {
  findTorrent: state => id => state.items.find(i => i.id === id)
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
  async add ({ commit, state, dispatch }, payload) {
    await dispatch('remove', payload)

    commit('ADD', payload)
  },

  remove ({ commit, state }, payload) {
    return new Promise(resolve => {
      let index = state.items.findIndex(t => t.id === payload.id)

      if (index !== -1) {
        commit('REMOVE', index)
      }

      resolve()
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
