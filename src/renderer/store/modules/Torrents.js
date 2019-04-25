import torrentStream from 'torrent-stream'
const { app } = require('electron').remote

let engine = null
let timer = null

function formatBytes (a, round = false) {
  if (a === 0) {
    return '0 Bytes'
  }
  let c = 1024
  let d = 2
  let e = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  let f = Math.floor(Math.log(a) / Math.log(c))

  if (round) {
    return Math.floor(parseFloat((a / Math.pow(c, f)).toFixed(d))) + ' ' + e[f]
  }

  return parseFloat((a / Math.pow(c, f)).toFixed(d)) + ' ' + e[f]
}

const state = {
  items: [],
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
  },

  torrent: (state, getters, rootState, rootGetters) => (season, episode, id = rootGetters['Shows/show'].id) =>
    state.items.find(t => t.id === id && t.season === season && t.episode === episode)
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
  },

  TOGGLE (state, payload) {
    let index = state.items.findIndex(t => t.id === payload.id && t.season === payload.season && t.episode === payload.episode)

    index === -1 ? state.items.push(payload) : state.items.splice(index, 1)
  }
}

const actions = {
  download ({ commit, dispatch, rootGetters }, torrent) {
    dispatch('clear')

    commit('SET_TORRENT', torrent)

    engine = torrentStream(torrent.url, {path: `${app.getPath('downloads')}/TVShows`})

    engine.on('ready', () => {
      const file = engine.files[0]

      file.createReadStream()

      commit('SET_SIZE', file.length)

      timer = setInterval(() => {
        commit('SET_DOWNLOAD_INFO', { speed: engine.swarm.downloadSpeed(), downloaded: engine.swarm.downloaded })
      }, 1000)

      let data = {
        id: torrent.id,
        season: torrent.season,
        episode: torrent.episode,
        path: `${app.getPath('downloads')}/TVShows/${file.path}`,
        name: file.name
      }

      commit('TOGGLE', data)
    })

    engine.on('idle', () => {
      console.log('idle')

      dispatch('clear')
    })
  },

  cancel ({ commit, state, dispatch }) {
    commit('TOGGLE', {
      id: state.torrent.id,
      season: state.torrent.season,
      episode: state.torrent.episode
    })

    dispatch('clear')
  },

  clear ({ commit }) {
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
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
