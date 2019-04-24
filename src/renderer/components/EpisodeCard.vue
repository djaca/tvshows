<template>
  <div
    class="bg-white rounded-lg shadow-md overflow-hidden flex-1 flex flex-col"
    :class="{'opacity-25': watched}"
  >
    <div class="bg-cover h-48" :style="image"></div>

    <div class="p-4 flex-1 flex flex-col">
      <div class="mb-4">
        <h3 class="text-2xl" v-text="episode.name"></h3>
        <div class="text-xs" v-text="date"></div>
      </div>
      <div class="mb-4 text-grey-darker text-sm flex-1">
        <p v-text="episode.overview"></p>
      </div>

      <div class="mb-1">
        <span class="text-xs float-right">Episode {{ episodeNumber }}</span>
      </div>

      <div
        class="border-t border-grey-light text-sm"
        v-if="torrents"
      >
        <div
          class="mt-2"
        >
          <template v-for="(torrent, type) in torrents.torrents">
            <button
              class="downloadTorrentBtn"
              @click="download(torrent)"
            >
              {{ type }}
            </button>

          </template>
          <button
            class="text-blue float-right"
            @click="toggleWatch"
          >
            <font-awesome-icon
              icon="eye"
              size="lg"
            ></font-awesome-icon>
          </button>
          <button
            class="downloadTorrentBtn"
            @click="getSubtitles"
          >
            <font-awesome-icon
              icon="closed-captioning"
              size="lg"
            ></font-awesome-icon>
          </button>
          <button @click="play" v-if="torrent">Watch</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { library } from '@fortawesome/fontawesome-svg-core'
  import { faEye, faClosedCaptioning, faFileArchive } from '@fortawesome/free-solid-svg-icons'
  library.add(faEye, faClosedCaptioning, faFileArchive)

  export default {
    name: 'episode-card',

    props: {
      episode: Object
    },

    computed: {
      episodeNumber () {
        return this.episode.episode_number
      },

      seasonNumber () {
        return this.episode.season_number
      },

      watched () {
        return this.$store.getters['Watch/watched'](this.seasonNumber, this.episodeNumber)
      },

      torrents () {
        return this.$store.getters['Shows/torrents'](this.seasonNumber, this.episodeNumber)
      },

      torrent () {
        return this.$store.getters['Torrents/torrent'](this.seasonNumber, this.episodeNumber)
      },

      subtitle () {
        return this.$store.getters['Subtitles/subtitle'](this.seasonNumber, this.episodeNumber)
      },

      showId () {
        return this.$route.params.id
      },

      image () {
        if (this.episode.still_path) {
          return {backgroundImage: `url('https://image.tmdb.org/t/p/w300${this.episode.still_path}')`}
        }
      },

      date () {
        return this.humanTime(this.episode.air_date)
      }
    },

    methods: {
      download (torrent) {
        this.$store.dispatch('Torrents/download', {
          ...torrent,
          episode: this.episodeNumber,
          season: this.seasonNumber,
          id: this.showId,
          name: this.episode.name,
          show: this.$store.getters['Shows/show'].name
        })
      },

      toggleWatch () {
        this.$store.dispatch('Watch/toggleWatch', {
          id: this.episode.show_id,
          season: this.episode.season_number,
          episode: this.episode.episode_number
        })
      },

      getSubtitles () {
        this.$emit('getSubtitles', this.episodeNumber)
      },

      play () {
        if (this.subtitle) {
          this.$electron.shell.openItem(this.subtitle.path)
        }

        this.$electron.shell.openItem(this.torrent.path)
      }
    }
  }
</script>
