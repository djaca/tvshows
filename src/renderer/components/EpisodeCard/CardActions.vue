<template>
  <div class="mt-2 overflow-hidden">
    <button
      v-for="(torrent, type) in torrents(item.episode)"
      :key="type"
      class="button"
      @click="doDownload(torrent.url)"
    >
      {{ type }}
    </button>

    <button
      class="button"
      @click="openTorrentsModal"
    >
      <font-awesome-icon
        icon="magnet"
        size="lg"
      ></font-awesome-icon>
    </button>

    <button
      :class="['button', { 'border-green-500': subtitle }]"
      @click="openSubtitlesModal"
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
  import Subtitles from '@/components/Modals/Subtitles'
  import Torrents from '@/components/Modals/Torrents'
  import downloadTorrent from '@/mixins/downloadTorrent'
  import { mapGetters } from 'vuex'

  const modals = {
    'torrents': Torrents,
    'subtitles': Subtitles
  }

  export default {
    name: 'CardActions',

    props: ['item'],

    mixins: [downloadTorrent],

    computed: {
      ...mapGetters('Subtitles', ['findSubtitleByEpisodeId']),

      ...mapGetters('Torrents', ['findTorrent']),

      ...mapGetters('Show', ['id', 'torrents']),

      torrent () {
        return this.findTorrent(this.item.id)
      },

      subtitle () {
        return this.findSubtitleByEpisodeId(this.item.id)
      }
    },

    methods: {
      openSubtitlesModal () {
        this.openModal('subtitles')
      },

      openTorrentsModal () {
        this.openModal('torrents')
      },

      openModal (name) {
        this.$modal.show(modals[name], {
          item: this.item
        }, {
          height: 'auto',
          width: '60%',
          scrollable: true
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
