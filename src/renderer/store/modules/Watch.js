const state = {
  data: []
}

const getters = {
  isWatched: (state, getters, rootState, rootGetters) => (season, episode) => {
    let show = state.data.find(s => s.id === rootGetters['Show/id'] && s.season === season)

    return show ? show.episodes.includes(episode) : false
  }
}

const mutations = {
  WATCH (state, { index, id, season, episode }) {
    if (typeof index === 'undefined') {
      state.data.push({
        id,
        season,
        episodes: [episode]
      })

      return
    }

    state.data[index].episodes.push(episode)
  },

  UNWATCH (state, { index, episode }) {
    state.data[index].episodes.splice(state.data[index].episodes.findIndex(e => e === episode), 1)
  }
}

const actions = {
  toggle ({ dispatch, commit, state }, payload) {
    let index = state.data.findIndex(s => s.season === payload.season && s.id === payload.id)

    if (index === -1) {
      commit('WATCH', payload)

      return
    }

    if (state.data[index].episodes.includes(payload.episode)) {
      commit('UNWATCH', { index, episode: payload.episode })

      return
    }

    commit('WATCH', { index, episode: payload.episode })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
