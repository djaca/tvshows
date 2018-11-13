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
  TOGGLE (state, {id, season, episode}) {
    let watchedSeason = state.data.find(s => s.season === season && s.id === id)

    if (watchedSeason) {
      if (watchedSeason.episodes.includes(episode)) {
        watchedSeason.episodes.splice(watchedSeason.episodes.findIndex(e => e === episode), 1)
      } else {
        watchedSeason.episodes.push(episode)
      }
    }

    state.data.push({id, season, episodes: [episode]})
  }
}

const actions = {
  toggleWatch ({commit}, payload) {
    commit('TOGGLE', {
      id: payload.show_id,
      season: payload.season_number,
      episode: payload.episode_number
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
