import torrentStream from 'torrent-stream'
import { formatBytes } from '@/utilities'
const { app } = require('electron').remote

let engine = null
let timer = null

const state = {
  torrent: null,
  size: 0,
  speed: 0,
  downloaded: 0
}

const getters = {
  selectedTorrent: state => state.torrent,

  downloading: state => !!state.torrent,

  fileSize: state => formatBytes(state.size, true),

  downloadSpeed: state => formatBytes(state.speed),

  remaining: state => {
    let remaining = ((state.downloaded / state.size) * 100).toFixed(2)

    return remaining > 1 && remaining <= 100 ? remaining : 0
  }
}

const mutations = {
  SET_TORRENT (state, torrent) {
    state.torrent = torrent
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
  download ({ commit, dispatch, rootGetters }, torrent) {
    dispatch('clear')
      .then(() => {
        commit('SET_TORRENT', torrent)
      })

    engine = torrentStream(torrent.magnet, { path: `${app.getPath('downloads')}/TVShows` })

    engine.on('ready', () => {
      const file = engine.files[0]

      file.createReadStream()

      commit('SET_SIZE', file.length)

      timer = setInterval(() => {
        commit('SET_DOWNLOAD_INFO', { speed: engine.swarm.downloadSpeed(), downloaded: engine.swarm.downloaded })
      }, 1000)

      dispatch('Torrents/add', {
        ...torrent,
        path: `${app.getPath('downloads')}/TVShows/${file.path}`
      }, { root: true })
    })

    engine.on('idle', () => {
      console.log('idle')

      dispatch('clear')
    })
  },

  cancel ({ state, dispatch }) {
    return new Promise(async resolve => {
      await dispatch('Torrents/remove', { id: state.torrent.id }, { root: true })

      dispatch('clear')

      resolve()
    })
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

      commit('SET_TORRENT', null)
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
