const state = {
  data: []
}

const getters = {
  shows: state => state.data,

  exists: (state) => id => state.data.some(show => show.id === id)
}

const mutations = {
  SET (state, payload) {
    state.data.push(...payload)
  },

  ADD (state, payload) {
    state.data.push(payload)
  },

  REMOVE (state, id) {
    state.data.splice(state.data.findIndex(show => show.id === id), 1)
  }
}

const actions = {
  add ({commit}, show) {
    let data = {id: show.id, name: show.name, img: show.poster_path}

    commit('ADD', data)
  },

  remove ({commit}, id) {
    commit('REMOVE', id)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
