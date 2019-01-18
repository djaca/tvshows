import { getShow, getEpisodes, getImdbId } from '@/api/tmdb'
import axios from 'axios'
import groupBy from 'lodash/groupBy'

const state = {
  data: null,
  episodes: [],
  torrents: []
}

const getters = {
  show: state => state.data,

  episodes: state => state.episodes,

  torrents: state => (season) => state.torrents[season]
}

const mutations = {
  SET (state, payload) {
    state.data = payload
  },

  SET_EPISODES (state, payload) {
    state.episodes = payload
  },

  SET_TORRENTS (state, payload) {
    state.torrents = payload
  }
}

const actions = {
  getTorrents ({commit, state}) {
    getImdbId(state.data.id)
      .then(resp => {
        return resp.imdb_id
      })
      .then(id => {
        axios.get(`https://tv-v2.api-fetch.website/show/${id}`)
          .then(({data}) => {
            commit('SET_TORRENTS', groupBy(data.episodes, 'season'))
          })
      })
      .catch(err => console.log(err))
  },

  get ({dispatch, commit}, id) {
    return new Promise((resolve, reject) => {
      getShow(id)
        .then(resp => {
          commit('SET', resp)
          resolve()
        })
        .catch(err => {
          reject(err)
        })
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
