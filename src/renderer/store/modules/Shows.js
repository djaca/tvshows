import { getEpisodes, getImdbId, getShow } from '@/api/tmdb'
import { getTorrentsFor } from '@/api/tvApi'
import { searchTitlovi } from '@/api/titlovi'
import groupBy from 'lodash/groupBy'

const state = {
  items: [],
  current: null,
  episodes: [],
  torrents: [],
  seasonSubtitles: [],
  imdbId: null
}

const getters = {
  shows: state => [...state.items].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)),

  exists: (state) => id => state.items.some(show => show.id === id),

  show: state => state.current,

  episodes: state => state.episodes,

  torrents: state => (season, episode) => state.torrents[season] ? state.torrents[season].find(e => e.episode === episode) : [],

  seasonSubtitles: state => episode => state.seasonSubtitles.filter(s => s.episode === episode)
}

const mutations = {
  ADD (state, payload) {
    state.items.push(payload)
  },

  REMOVE (state, id) {
    state.items.splice(state.items.findIndex(show => show.id === id), 1)
  },

  SET (state, payload) {
    state.current = payload
  },

  SET_EPISODES (state, payload) {
    state.episodes = payload
  },

  SET_TORRENTS (state, payload) {
    state.torrents = payload
  },

  SET_SUBTITLES (state, payload) {
    state.seasonSubtitles = payload
  },

  SET_IMDB_ID (state, imdbId) {
    state.imdbId = imdbId
  }
}

const actions = {
  add ({ commit, state }) {
    commit('ADD', {
      id: state.current.id,
      name: state.current.name,
      img: state.current.poster_path,
      created_at: new Date()
    })
  },

  remove ({ commit }, id) {
    commit('REMOVE', id)
  },

  fetchShow ({ commit }, id) {
    commit('SET', null)

    return new Promise((resolve, reject) => {
      getShow(id)
        .then(resp => {
          commit('SET', resp)

          resolve()
        })
        .then(() => {
          return getImdbId(id)
            .then(resp => {
              commit('SET_IMDB_ID', resp.imdb_id)

              return resp.imdb_id
            })
        })
        .then(imdbId => {
          getTorrentsFor(imdbId)
            .then(({ data }) => {
              if (data) {
                commit('SET_TORRENTS', groupBy(data.episodes, 'season'))
              }
            })
        })
        .catch(err => {
          reject(err)
        })
    })
  },

  fetchSeason ({ commit, state }, season) {
    commit('SET_EPISODES', [])

    return new Promise((resolve, reject) => {
      getEpisodes(state.current.id, season)
        .then(({ episodes }) => {
          commit('SET_EPISODES', episodes)

          resolve()

          return state.imdbId
        })
        .then(imdbId => {
          return searchTitlovi({ imdbId, season })
            .then(subtitles => {
              commit('SET_SUBTITLES', subtitles)
            })
        })
        .catch(err => {
          reject(err)
        })
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
