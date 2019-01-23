import axios from 'axios'

export function getTorrentsFor (id) {
  return axios.get(`https://tv-v2.api-fetch.website/show/${id}`)
}
