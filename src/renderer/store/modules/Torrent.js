const state = {
  torrent: null
}

const getters = {
  //
}

const mutations = {
  SET_TORRENT (state, torrent) {
    state.torrent = torrent
  }
}

const actions = {
  download (ctx, torrent) {
    ctx.commit('SET_TORRENT', torrent)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
