import { getPopularShows, search } from '../../api/tmdb'

const state = {
  query: '',
  results: null,
  popular: [],
  count: 1
}

const getters = {
  hasPopularShows: state => state.popular.length >= 1
}

const mutations = {
  SET (state, payload) {
    state.popular = state.popular.concat(payload)
    state.count++
  },

  SET_RESULTS (state, payload) {
    state.results = payload
  },

  SET_QUERY (state, value) {
    state.query = value
  }
}

const actions = {
  popular ({commit, state}) {
    return new Promise((resolve, reject) => {
      getPopularShows(state.count)
        .then(resp => {
          commit('SET', resp.results)
          resolve()
        })
        .catch(err => reject(err))
    })
  },

  search ({commit, state}) {
    return new Promise((resolve, reject) => {
      search(state.query)
        .then(resp => {
          commit('SET_RESULTS', resp.results)
          resolve()
        })
        .catch(err => reject(err))
    })
  },

  clearSearch ({commit}) {
    commit('SET_QUERY', '')
    commit('SET_RESULTS', null)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
