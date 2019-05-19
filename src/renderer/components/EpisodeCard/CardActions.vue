<template>
  <div class="mt-2 overflow-hidden">
    <button
      v-for="(torrent, type) in availableTorrents"
      :key="type"
      class="downloadTorrentBtn"
      @click="doDownload(torrent)"
    >
      {{ type }}
    </button>

    <button
      class="downloadTorrentBtn"
      @click="getTorrents"
    >
      <font-awesome-icon
        icon="magnet"
        size="lg"
      ></font-awesome-icon>
    </button>

    <button
      :class="['downloadTorrentBtn', { 'border-green': subtitle }]"
      @click="getSubtitles"
    >
      <font-awesome-icon
        icon="closed-captioning"
        size="lg"
      />
    </button>

    <button
      class="downloadTorrentBtn"
      v-if="torrent"
      @click="play"
    >
      <font-awesome-icon
        icon="play"
        size="lg"
      />
    </button>

    <button
      class="text-nepal hover:text-oxford-blue float-right"
      @click="toggleWatch"
    >
      <font-awesome-icon
        icon="eye"
        size="lg"
      />
    </button>
  </div>
</template>

<script>
  import SubtitlesModal from '@/components/Modals/Subtitles'
  import TorrentsModal from '@/components/Modals/Torrents'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    name: 'CardActions',

    props: ['availableTorrents', 'episode'],

    computed: {
      ...mapGetters('Subtitles', ['getSubtitleFor']),

      ...mapGetters('Torrents', ['findTorrent']),

      ...mapGetters('Shows', ['show']),

      episodeNumber () {
        return this.episode.episode_number
      },

      seasonNumber () {
        return this.episode.season_number
      },

      torrent () {
        return this.findTorrent(this.seasonNumber, this.episodeNumber)
      },

      subtitle () {
        return this.getSubtitleFor(this.seasonNumber, this.episodeNumber)
      }
    },

    methods: {
      ...mapActions('Torrent', ['download']),

      ...mapActions('Watch', ['toggle']),

      doDownload (torrent) {
        this.download({
          ...torrent,
          show: this.show.name,
          id: this.$route.params.id,
          name: this.episode.name,
          season: this.seasonNumber,
          episode: this.episodeNumber
        })
      },

      toggleWatch () {
        this.toggle({
          id: this.episode.show_id,
          season: this.seasonNumber,
          episode: this.episodeNumber
        })
      },

      getSubtitles () {
        this.$modal.show(SubtitlesModal, {
          episode: this.episodeNumber
        }, {
          height: 'auto',
          width: '60%'
        })
      },

      getTorrents () {
        this.$modal.show(TorrentsModal, {
          episode: this.episodeNumber,
          episodeName: this.episode.name
        }, {
          height: 'auto',
          width: '60%'
        })
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

<style scoped>

</style>
