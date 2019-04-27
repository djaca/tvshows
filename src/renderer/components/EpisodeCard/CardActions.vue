<template>
  <div class="mt-2 overflow-hidden">
    <template v-for="(torrent, type) in torrents">
      <button
        class="downloadTorrentBtn"
        @click="download(torrent)"
      >
        {{ type }}
      </button>

    </template>

    <button
      class="text-nepal hover:text-oxford-blue float-right"
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
</template>

<script>
  export default {
    name: 'CardActions',

    props: ['torrents', 'episode'],

    computed: {
      episodeNumber () {
        return this.episode.episode_number
      },

      seasonNumber () {
        return this.episode.season_number
      },

      torrent () {
        return this.$store.getters['Torrents/torrent'](this.seasonNumber, this.episodeNumber)
      },

      subtitle () {
        return this.$store.getters['Subtitles/subtitle'](this.seasonNumber, this.episodeNumber)
      }
    },

    methods: {
      download (torrent) {
        this.$store.dispatch('Torrents/download', {
          ...torrent,
          show: this.$store.getters['Shows/show'].name,
          id: this.$route.params.id,
          name: this.episode.name,
          season: this.seasonNumber,
          episode: this.episodeNumber
        })
      },

      toggleWatch () {
        this.$store.dispatch('Watch/toggleWatch', {
          id: this.episode.show_id,
          season: this.seasonNumber,
          episode: this.episodeNumber
        })
      },

      getSubtitles () {
        this.$emit('get-subtitles', this.episodeNumber)
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
