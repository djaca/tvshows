<template>
  <div>
    <div class="text-center text-xl mb-2">
      <span v-text="$store.getters['Show/show'].name"></span> -
      <span>Season {{ $route.params.season }}</span>
    </div>

    <div v-if="loading">Loading...</div>

    <div class="mx-2" v-else>
      <div class="flex flex-wrap -m-2">

        <div v-for="episode in episodes"
             :key="episode.episode_number"
             class="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 px-3 mb-4 flex flex-col p-2"
        >
          <episode-card
            :episode="episode"
            @getTorrents="getTorrents"
            @getSubtitles="getSubtitles"
            @toggleWatch="toggleWatch"
            :torrent="torrentsVuex.find(t => t.episode === episode.episode_number)"
            :subtitle="subtitles.find(t => t.episode === episode.episode_number)"
            :watched="watchedEpisodes.includes(episode.episode_number)"
          ></episode-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import EpisodeCard from '@/components/EpisodeCard'
  import TorrentsModal from '@/components/Modals/Torrents'
  import SubtitlesModal from '@/components/Modals/Subtitles'
  import { searchZooqle } from '@/api/zooqle'
  import { getImdbId } from '@/api/tmdb'
  import { searchTitlovi } from '@/api/titlovi'
  import { library } from '@fortawesome/fontawesome-svg-core'
  import { faDownload } from '@fortawesome/free-solid-svg-icons'

  library.add(faDownload)

  export default {
    name: 'season',

    components: {EpisodeCard, TorrentsModal, SubtitlesModal},

    data () {
      return {
        loading: false,
        results: {
          subtitles: []
        }
      }
    },

    computed: {
      episodes () {
        return this.$store.getters['Show/episodes']
      },

      watchedEpisodes () {
        return this.$store.getters['Watch/watchedEpisodes'](this.$route.params)
      },

      subtitles () {
        return this.$store.getters['Subtitles/subtitles'](this.$route.params)
      },

      torrentsVuex () {
        return this.$store.getters['Torrents/torrents'](this.$route.params)
      }
    },

    methods: {
      getSeason () {
        this.loading = true
        this.$store.dispatch('Show/getSeason', {
          id: this.$route.params.id,
          season: this.$route.params.season
        })
          .then(() => (this.loading = false))
          .catch(err => console.log(err))
      },

      toggleWatch (episode) {
        this.$store.dispatch('Watch/toggleWatch', episode)
      },

      getTorrents (episode) {
        let name = this.$store.getters['Show/show'].name

        name += episode.season_number <= 9 ? ' S0' + episode.season_number : ' S' + episode.season_number
        name += episode.episode_number <= 9 ? 'E0' + episode.episode_number : 'E' + episode.episode_number

        searchZooqle(name)
          .then(torrents => {
            this.$modal.show(TorrentsModal, {
              torrents: torrents.sort((a, b) => b.seeders - a.seeders).splice(0, 10)
            }, {
              height: 'auto',
              width: '60%'
            })
          })
          .catch(resp => console.log(resp))
      },

      getSubtitles (episode) {
        this.$modal.show(SubtitlesModal, {
          subtitles: this.results.subtitles.filter(s => s.episode === episode.episode_number),
          episode: episode.episode_number
        }, {
          height: 'auto',
          width: '60%'
        })
      },

      searchSubtitles () {
        getImdbId(this.$route.params.id)
          .then(resp => {
            return searchTitlovi({imdb_id: resp.imdb_id, season: this.$route.params.season})
              .then(subtitles => {
                this.results.subtitles = subtitles
              })
          })
          .catch(err => console.log(err))
      }
    },

    mounted () {
      this.getSeason()

      this.searchSubtitles()
    }
  }
</script>
