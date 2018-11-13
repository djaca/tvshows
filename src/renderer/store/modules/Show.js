import { getShow, getEpisodes } from '@/api/tmdb'

const state = {
  data: null,
  episodes: []
}

const getters = {
  show: state => state.data,

  episodes: state => state.episodes
}

const mutations = {
  SET (state, payload) {
    state.data = payload
  },

  SET_EPISODES (state, payload) {
    state.episodes = payload
  }
}

const actions = {
  get ({dispatch, commit}, id) {
    return new Promise((resolve, reject) => {
      getShow(id)
        .then(resp => {
          commit('SET', resp)
          resolve()
        })
        .catch(err => reject(err))
    })
  },

  getSeason ({commit, state}, {id, season}) {
    return new Promise((resolve, reject) => {
      getEpisodes(id, season)
        .then(resp => {
          commit('SET_EPISODES', resp.episodes)
          resolve()
        })
        .catch(err => reject(err))
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
