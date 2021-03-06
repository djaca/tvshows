import { getEpisodes, getImdbId, getShow } from '@/api/tmdb'
import { getTorrentsFor } from '@/api/tvApi'
import { searchTitlovi } from '@/api/titlovi'
import groupBy from 'lodash/groupBy'
import mapKeys from 'lodash/mapKeys'
import mapValues from 'lodash/mapValues'
import omitDeep from 'omit-deep'
import { formatDate } from '../../utilities'
import router from '../../router'

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

  torrents: (state, getters, rootState) => episode => state.torrents[rootState.route.params.season]
    ? state.torrents[rootState.route.params.season][episode]
    : [],

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
    state.torrents = payload
  },

  SET_SUBTITLES (state, payload) {
    state.subtitles = groupBy(payload, 'episode')
  }
}

const actions = {
  async fetch ({ commit, dispatch, state, rootState }) {
    if (state.id === parseInt(rootState.route.params.id)) {
      return
    }

    let loader = this._vm.$loading.show()

    commit('RESET')

    commit('SET_ID', parseInt(rootState.route.params.id))

    try {
      await dispatch('getImdbId')

      dispatch('fetchPrimaryTorrents')

      commit('SET_DETAILS', await getShow(state.id))
    } catch (err) {
      router.push({ name: 'home' })

      this._vm.$toastr('error', 'Can`t connect to TMDb')

      console.log(err)
    }

    loader.hide()
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

      commit('SET_TORRENTS', parseTorrents(data))
    } catch (err) {
      this._vm.$toastr('error', 'Can`t fetch torrents')

      console.log(err)
    }
  },

  async fetchSeason ({ commit, dispatch, state, rootState }) {
    let loader = this._vm.$loading.show()

    commit('SET_EPISODES', [])

    try {
      dispatch('getSubtitles')

      const { episodes } = await getEpisodes(state.id, rootState.route.params.season)

      commit('SET_EPISODES', episodes)
    } catch (e) {
      router.push({ name: 'home' })

      this._vm.$toastr('error', 'Can`t get episodes')

      console.log(e)
    }

    loader.hide()
  },

  async getSubtitles ({ commit, state, rootState }) {
    try {
      const data = await searchTitlovi({ imdbId: state.imdbId, season: rootState.route.params.season })

      commit('SET_SUBTITLES', data)
    } catch (err) {
      this._vm.$toastr('error', 'Can`t fetch subtitles')

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

function parseTorrents (data) {
  let items = data.episodes.map(e => ({ episode: e.episode, ...e.torrents, season: e.season }))

  return omitDeep(mapValues(groupBy(items, 'season'), arr => mapKeys(arr, t => (t.episode))), ['season', 'episode'])
}
