const state = {
  items: []
}

const getters = {
  shows: state => [...state.items].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)),

  exists: state => id => state.items.some(show => show.id === id)
}

const mutations = {
  ADD (state, payload) {
    state.items.push(payload)
  },

  REMOVE (state, id) {
    state.items.splice(state.items.findIndex(show => show.id === id), 1)
  }
}

const actions = {
  add ({ commit, rootState }) {
    commit('ADD', {
      id: rootState.Show.id,
      name: rootState.Show.name,
      img: rootState.Show.img,
      created_at: new Date()
    })

    this._vm.$toastr('info', 'Show added to library')
  },

  remove ({ commit, rootState }) {
    commit('REMOVE', rootState.Show.id)

    this._vm.$toastr('info', 'Show removed from library')
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
