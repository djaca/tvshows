const state = {
  data: []
}

const getters = {
  isWatched: (state, getters, rootState) => episode => {
    let show = state.data.find(s => s.id === rootState.route.params.id && s.season === rootState.route.params.season)

    return show ? show.episodes.includes(episode) : false
  }
}

const mutations = {
  WATCH (state, { index, id, season, episode }) {
    typeof index !== 'undefined'
      ? state.data[index].episodes.push(episode)
      : state.data.push({
        id,
        season,
        episodes: [episode]
      })
  },

  UNWATCH (state, { index, episode }) {
    state.data[index].episodes.splice(state.data[index].episodes.findIndex(e => e === episode), 1)
  }
}

const actions = {
  toggle ({ commit, state, rootState }, episode) {
    let id = rootState.route.params.id
    let season = rootState.route.params.season

    let index = state.data.findIndex(s => s.season === season && s.id === id)

    index !== -1
      ? commit(state.data[index].episodes.includes(episode) ? 'UNWATCH' : 'WATCH', { index, episode })
      : commit('WATCH', { id, season, episode })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
