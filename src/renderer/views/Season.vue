<template>
  <div>
    <div class="text-center text-xl mb-2">
      <span v-text="show.name" v-if="show"></span> -
      <span>Season {{ $route.params.season }}</span>
    </div>

    <div class="mx-2" v-if="episodes">
      <div class="flex flex-wrap -m-2">

        <div v-for="episode in episodes"
             :key="episode.episode_number"
             class="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 px-3 mb-4 flex flex-col p-2"
        >
          <episode-card
            :episode="episode"
            @getSubtitles="getSubtitles"
            @toggleWatch="toggleWatch"
            :torrents="torrentsVuex.find(t => t.episode === episode.episode_number)"
            :torrent="torrents.find(t => t.episode === episode.episode_number)"
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
  import SubtitlesModal from '@/components/Modals/Subtitles'
  import { getImdbId } from '@/api/tmdb'
  import { searchTitlovi } from '@/api/titlovi'
  import { library } from '@fortawesome/fontawesome-svg-core'
  import { faDownload } from '@fortawesome/free-solid-svg-icons'

  library.add(faDownload)

  export default {
    name: 'season',

    components: {EpisodeCard, SubtitlesModal},

    data () {
      return {
        loading: false,
        results: {
          subtitles: []
        }
      }
    },

    computed: {
      show () {
        return this.$store.getters['Show/show']
      },

      episodes () {
        return this.$store.getters['Show/episodes']
      },

      watchedEpisodes () {
        return this.$store.getters['Watch/watchedEpisodes'](this.$route.params)
      },

      subtitles () {
        return this.$store.getters['Subtitles/subtitles'](this.$route.params)
      },

      torrents () {
        return this.$store.getters['Torrents/torrents']
          .filter(t => t.id === this.show.id && t.season === this.$route.params.season)
      },

      torrentsVuex () {
        return this.$store.getters['Show/torrents'](this.$route.params.season)
      }
    },

    watch: {
      '$route': 'getSeason'
    },

    methods: {
      getSeason () {
        let loader = this.$loading.show()

        this.$store.dispatch('Show/getSeason', {
          id: this.show.id,
          season: this.$route.params.season
        })
          .catch(err => console.log(err))
          .finally(() => loader.hide())
      },

      toggleWatch (episode) {
        this.$store.dispatch('Watch/toggleWatch', episode)
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
        getImdbId(this.show.id)
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
      if (!this.show) {
        this.$router.push({name: 'show', params: {id: this.show.id}})

        return
      }

      this.getSeason()

      this.searchSubtitles()
    }
  }
</script>
