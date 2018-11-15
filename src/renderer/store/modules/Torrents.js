const {app} = require('electron').remote

const state = {
  downloadPath: `${app.getPath('downloads')}/TVShows`,

  data: [
    // {
    //   episode: 1,
    //   name: 'The.Big.Bang.Theory.S12E01.HDTV.x264-KILLERS.mkv',
    //   path: 'The.Big.Bang.Theory.S12E01.HDTV.x264-KILLERS[rarbg]/The.Big.Bang.Theory.S12E01.HDTV.x264-KILLERS.mkv',
    //   season: 12,
    //   showId: 1418
    // }
  ]
}

const getters = {
  downloadPath: state => state.downloadPath,

  torrents: state => params => {
    let torrents = state.data.filter(t => t.showId === parseInt(params.id) && t.season === parseInt(params.season))

    return torrents || []
  }
}

const mutations = {
  ADD (state, payload) {
    let found = state.data.findIndex(t => t.showId === payload.showId && t.season === payload.season && t.episode === payload.episode)

    if (found !== -1) {
      state.data.splice(found, 1)
    }

    state.data.push(payload)
  },

  REMOVE (state, {id, season, episode}) {
    let found = state.data.findIndex(t => t.showId === id && t.season === season && t.episode === episode)

    if (found !== -1) {
      state.data.splice(found, 1)
    }
  }
}

const actions = {
  add ({commit}, torrent) {
    commit('ADD', torrent)
  },

  remove ({commit}, payload) {
    commit('REMOVE', payload)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
