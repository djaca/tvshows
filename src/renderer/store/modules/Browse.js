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
  getPopular ({ commit, state }) {
    return new Promise(async resolve => {
      let loader = this._vm.$loading.show()

      try {
        let { results } = await getPopularShows(state.page)

        commit('SET', results)

        resolve()
      } catch (err) {
        this._vm.$toastr('error', 'Can`t connect to TMDb')

        console.log(err)
      }

      loader.hide()
    })
  },

  search ({ commit, state }) {
    return new Promise(async resolve => {
      let loader = this._vm.$loading.show()

      try {
        let { results } = await search(state.text)

        commit('SET_RESULTS', results)

        resolve()
      } catch (err) {
        this._vm.$toastr('error', 'Can`t connect to TMDb')

        console.log(err)
      }

      loader.hide()
    })
  },

  clearSearch ({ commit }) {
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
