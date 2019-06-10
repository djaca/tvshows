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
  import downloadTorrent from '@/mixins/downloadTorrent'
  import { mapGetters } from 'vuex'

  export default {
    name: 'CardActions',

    props: ['item'],

    mixins: [downloadTorrent],

    computed: {
      ...mapGetters('Subtitles', ['findSubtitleByEpisodeId']),

      ...mapGetters('Torrents', ['findTorrent']),

      ...mapGetters('Show', ['id', 'torrents']),

      episodeNumber () {
        return this.item.episode_number
      },

      seasonNumber () {
        return this.item.season_number
      },

      availableTorrents () {
        return this.torrents(this.seasonNumber, this.episodeNumber).torrents
      },

      torrent () {
        return this.findTorrent(this.item.id)
      },

      subtitle () {
        return this.findSubtitleByEpisodeId(this.item.id)
      }
    },

    methods: {
      getSubtitles () {
        this.$modal.show(SubtitlesModal, {
          episodeId: this.item.id,
          episodeNumber: this.item.episode_number
        }, {
          height: 'auto',
          width: '60%',
          scrollable: true
        })
      },

      getTorrents () {
        this.$modal.show(TorrentsModal, {
          item: this.item
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
