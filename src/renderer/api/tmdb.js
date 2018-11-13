import request from 'request-promise'

const remote = request.defaults({
  json: true
})

const baseUrl = 'https://api.themoviedb.org/3'
const key = `api_key=${process.env.TMDB_KEY}`
const lang = 'language=en-US'

export function getPopularShows (page) {
  return remote.get(`${baseUrl}/tv/popular?${key}&${lang}&page=${page}&include_adult=false`)
}

export function search (query) {
  return remote.get(`${baseUrl}/search/multi?${key}&${lang}&query=${query}&page=1&include_adult=false`)
}

export function getShow (id) {
  return remote.get(`${baseUrl}/tv/${id}?${key}&${lang}`)
}

export function getEpisodes (id, season) {
  return remote.get(`${baseUrl}/tv/${id}/season/${season}?${key}&${lang}`)
}

// https://api.themoviedb.org/3/tv/1418/external_ids?api_key=5579fa8b31d9d5eb6d527d9ff84becad&language=en-US

export function getImdbId (id) {
  return remote.get(`${baseUrl}/tv/${id}/external_ids?${key}`)
}
