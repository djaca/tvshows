import torrentStream from 'torrent-stream'
import { formatBytes } from '@/utilities'

const { app } = require('electron').remote

let engine = null
let timer = null
const path = `${app.getPath('downloads')}/TVShows`

const state = {
  id: null,
  size: 0,
  speed: 0,
  downloaded: 0
}

const getters = {
  id: state => state.id,

  downloading: state => !!state.id,

  fileSize: state => formatBytes(state.size, true),

  downloadSpeed: state => formatBytes(state.speed),

  remaining: state => {
    let remaining = ((state.downloaded / state.size) * 100).toFixed(2)

    return `${remaining > 1 && remaining <= 100 ? remaining : 0}%`
  }
}

const mutations = {
  SET_ID (state, id) {
    state.id = id
  },

  SET_DOWNLOAD_INFO (state, { speed, downloaded }) {
    state.speed = speed
    state.downloaded = downloaded
  },

  SET_SIZE (state, size) {
    state.size = size
  }
}

const actions = {
  download ({ commit, dispatch, rootState }, { id, episodeName, episode, magnet }) {
    dispatch('clear')
      .then(() => {
        commit('SET_ID', id)
      })

    engine = torrentStream(magnet, { path })

    engine.on('ready', () => {
      if (!engine) {
        return
      }

      const file = engine.files.sort((a, b) => b.length - a.length)[0]

      file.createReadStream()

      commit('SET_SIZE', file.length)

      timer = setInterval(() => {
        commit('SET_DOWNLOAD_INFO', { speed: engine.swarm.downloadSpeed(), downloaded: engine.swarm.downloaded })
      }, 1000)

      dispatch('Torrents/add', {
        id,
        showId: rootState.route.params.id,
        episode,
        season: rootState.route.params.season,
        showName: rootState.Show.name,
        episodeName,
        path: `${path}/${file.path}`
      }, { root: true })
    })

    engine.on('idle', () => {
      dispatch('clear')
    })
  },

  cancel ({ state, dispatch }) {
    dispatch('Torrents/remove', { id: state.id }, { root: true })

    dispatch('clear')

    this._vm.$toastr('info', 'Torrent download canceled')
  },

  clear ({ commit }) {
    return new Promise(resolve => {
      if (engine) {
        engine.destroy()
        engine = null
      }

      if (timer) {
        clearInterval(timer)
        timer = null
      }

      commit('SET_ID', null)
      commit('SET_DOWNLOAD_INFO', { speed: 0, downloaded: 0 })
      commit('SET_SIZE', 0)

      resolve()
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
