import { getEpisodes, getImdbId, getShow } from '@/api/tmdb'
import { getTorrentsFor } from '@/api/tvApi'
import { searchTitlovi } from '@/api/titlovi'
import groupBy from 'lodash/groupBy'
import { formatDate } from '../../utilities'

const state = {
  id: null,
  imdbId: null,
  name: '',
  genres: [],
  date: '',
  runtime: '',
  rating: '',
  status: '',
  overview: '',
  img: '',
  seasons: [],
  episodes: [],
  torrents: [],
  subtitles: []
}

const getters = {
  id: state => state.id,

  name: state => state.name,

  genre: state => state.genres.map(genre => genre.name).join(' | '),

  date: state => formatDate(state.date),

  runtime: state => `${state.runtime} min`,

  rating: state => `Rating: ${state.rating}`,

  status: state => state.status,

  overview: state => state.overview,

  img: state => `https://image.tmdb.org/t/p/w342${state.img}`,

  seasons: state => state.seasons.map(s => { return { id: s.season_number, img: s.poster_path } }),

  episodes: state => state.episodes,

  torrents: state => (season, episode) => state.torrents[season] ? state.torrents[season].find(e => e.episode === episode) : [],

  subtitles: state => episode => state.subtitles[episode]
}

const mutations = {
  RESET (state) {
    state.id = null
    state.imdbId = null
    state.name = ''
    state.genres = []
    state.date = ''
    state.runtime = ''
    state.rating = ''
    state.status = ''
    state.overview = ''
    state.img = ''
    state.seasons = []
    state.episodes = []
    state.torrents = []
    state.subtitles = []
  },

  SET_DETAILS (state, payload) {
    state.id = payload.id
    state.name = payload.name
    state.genres = payload.genres
    state.date = payload.first_air_date
    state.runtime = payload.episode_run_time[0]
    state.rating = payload.vote_average
    state.status = payload.status
    state.overview = payload.overview
    state.img = payload.poster_path
    state.seasons = payload.seasons
    state.episodes = []
    state.subtitles = []
  },

  SET_ID (state, payload) {
    state.id = payload
  },

  SET_IMDB_ID (state, payload) {
    state.imdbId = payload
  },

  SET_EPISODES (state, payload) {
    state.episodes = payload
  },

  SET_TORRENTS (state, payload) {
    state.torrents = groupBy(payload, 'season')
  },

  SET_SUBTITLES (state, payload) {
    state.subtitles = groupBy(payload, 'episode')
  }
}

const actions = {
  fetch ({ commit, dispatch, state, rootState }) {
    if (state.id === parseInt(rootState.route.params.id)) {
      return
    }

    commit('RESET')

    commit('SET_ID', parseInt(rootState.route.params.id))

    return new Promise(async (resolve, reject) => {
      try {
        await dispatch('getImdbId')

        dispatch('fetchPrimaryTorrents')

        commit('SET_DETAILS', await getShow(state.id))

        resolve()
      } catch (e) {
        reject(e)
      }
    })
  },

  getImdbId ({ commit, rootState }) {
    return new Promise(async (resolve, reject) => {
      try {
        const data = await getImdbId(rootState.route.params.id)

        commit('SET_IMDB_ID', data.imdb_id)

        resolve()
      } catch (err) {
        reject(err)
      }
    })
  },

  async fetchPrimaryTorrents ({ commit, state }) {
    try {
      const { data } = await getTorrentsFor(state.imdbId)

      commit('SET_TORRENTS', data.episodes)
    } catch (err) {
      console.log(err)
    }
  },

  fetchSeason ({ commit, dispatch, state, rootState }) {
    commit('SET_EPISODES', [])

    return new Promise(async (resolve, reject) => {
      try {
        dispatch('getSubtitles')

        const { episodes } = await getEpisodes(state.id, rootState.route.params.season)

        commit('SET_EPISODES', episodes)

        resolve()
      } catch (e) {
        reject(e)
      }
    })
  },

  async getSubtitles ({ commit, state, rootState }) {
    try {
      const data = await searchTitlovi({ imdbId: state.imdbId, season: rootState.route.params.season })

      commit('SET_SUBTITLES', data)
    } catch (err) {
      console.log(err)
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
