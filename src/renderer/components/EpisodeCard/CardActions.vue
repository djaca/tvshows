<template>
  <div class="mt-2 overflow-hidden">
    <button
      v-for="(torrent, type) in availableTorrents"
      :key="type"
      class="button"
      @click="doDownload(torrent.url)"
    >
      {{ type }}
    </button>

    <button
      class="button"
      @click="getTorrents"
    >
      <font-awesome-icon
        icon="magnet"
        size="lg"
      ></font-awesome-icon>
    </button>

    <button
      :class="['button', { 'border-green-500': subtitle }]"
      @click="getSubtitles"
    >
      <font-awesome-icon
        icon="closed-captioning"
        size="lg"
      />
    </button>

    <button
      class="button"
      v-if="torrent"
      @click="play"
    >
      <font-awesome-icon
        icon="play"
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
      ...mapGetters('Subtitles', ['findSubtitleByEpisodeId']),

      ...mapGetters('Torrents', ['findTorrent']),

      ...mapGetters('Shows', ['show']),

      episodeNumber () {
        return this.episode.episode_number
      },

      seasonNumber () {
        return this.episode.season_number
      },

      torrent () {
        return this.findTorrent(this.episode.id)
      },

      subtitle () {
        return this.findSubtitleByEpisodeId(this.episode.id)
      }
    },

    methods: {
      ...mapActions('Torrent', ['download']),

      doDownload (magnet) {
        this.download({
          id: this.episode.id,
          showId: this.show.id,
          showName: this.show.name,
          episodeName: this.episode.name,
          season: this.seasonNumber,
          episode: this.episodeNumber,
          magnet
        })
      },

      getSubtitles () {
        this.$modal.show(SubtitlesModal, {
          episodeId: this.episode.id,
          episodeNumber: this.episode.episode_number
        }, {
          height: 'auto',
          width: '60%',
          scrollable: true
        })
      },

      getTorrents () {
        this.$modal.show(TorrentsModal, {
          episode: this.episode
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
