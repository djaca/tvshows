import { getPopularShows, search } from '../../api/tmdb'

const state = {
  text: null,
  results: null,
  popular: [],
  page: 1
}

const getters = {
  hasPopularShows: state => state.popular.length >= 1
}

const mutations = {
  SET (state, payload) {
    state.popular = state.popular.concat(payload)

    state.page++
  },

  SET_RESULTS (state, payload) {
    state.results = payload
  },

  SET_TEXT (state, value) {
    state.text = value
  }
}

const actions = {
  getPopular ({commit, state}) {
    return new Promise((resolve, reject) => {
      getPopularShows(state.page)
        .then(({results}) => {
          commit('SET', results)

          resolve()
        })
        .catch(err => reject(err))
    })
  },

  search ({commit, state}) {
    return new Promise((resolve, reject) => {
      search(state.text)
        .then(({results}) => {
          commit('SET_RESULTS', results)

          resolve()
        })
        .catch(err => reject(err))
    })
  },

  clearSearch ({commit}) {
    commit('SET_TEXT', null)

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
