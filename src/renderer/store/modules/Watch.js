const state = {
  data: []
}

const getters = {
  watchedEpisodes: state => params => {
    let watchedEpisodes = state.data.filter(s => s.id === parseInt(params.id)).find(s => s.season === parseInt(params.season))

    return watchedEpisodes ? watchedEpisodes.episodes : []
  }
}

const mutations = {
  WATCH (state, payload) {
    if (payload.index) {
      state.data[payload.index].episodes.push(payload.episode)
    } else {
      state.data.push({id: payload.id, season: payload.season, episodes: [payload.episode]})
    }
  },

  UNWATCH (state, {index, episode}) {
    state.data[index].episodes.splice(state.data[index].episodes.findIndex(e => e === episode), 1)
  }
}

const actions = {
  toggleWatch ({dispatch, commit, state}, payload) {
    const data = {
      id: payload.show_id,
      season: payload.season_number,
      episode: payload.episode_number
    }

    let index = state.data.findIndex(s => s.season === data.season && s.id === data.id)

    if (index !== -1) {
      let watchedSeason = state.data[index]

      if (watchedSeason.episodes.includes(data.episode)) {
        commit('UNWATCH', {index, 'episode': data.episode})
      } else {
        commit('WATCH', {index, 'episode': data.episode})
        dispatch('Torrents/remove', data, {root: true})
        dispatch('Subtitles/remove', data, {root: true})
      }
    } else {
      commit('WATCH', data)
      dispatch('Torrents/remove', data, {root: true})
      dispatch('Subtitles/remove', data, {root: true})
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
