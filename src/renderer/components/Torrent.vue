<template>
  <div
    class="w-1/3 mb-4 fixed pin-b bg-ebony-clay text-nepal"
    style="right: 0;left: 0;margin-right: auto;margin-left: auto;"
    v-show="downloading"
  >
    <div class="p-2">
      <div class="flex">
        <div class="flex-1 grow" v-if="selectedTorrent">
          <div class="text-lg">{{ selectedTorrent.show }} - {{ selectedTorrent.name }}</div>
          <div class="text-xs">
            <div>Season {{ selectedTorrent.season }}</div>
            <div>Episode {{ selectedTorrent.episode }}</div>
            <button class="downloadTorrentBtn mt-2" @click="play" v-if="torrent">
              <font-awesome-icon icon="play"></font-awesome-icon>
            </button>
          </div>
        </div>
        <div class="w-1/4 text-sm">
          <table>
            <tr>
              <td><font-awesome-icon icon="hdd" color="#323E4F"></font-awesome-icon></td>
              <td><span v-text="fileSize"></span></td>
            </tr>
            <tr>
              <td><font-awesome-icon icon="long-arrow-alt-down" color="#1BB934"></font-awesome-icon></td>
              <td><span v-text="downloadSpeed"></span></td>
            </tr>
          </table>
        </div>
      </div>

      <div class="shadow-md w-full bg-nepal mt-2">
        <div class="bg-malachite text-xs leading-none py-1 text-center font-bold text-oxford-blue" :style="{width: remainingFormatted}">
          {{ remainingFormatted }}
        </div>
      </div>

      <span class="absolute p-1" style="top: 0; right: 0">
        <button class="hover:text-grey" @click="cancel">
          <font-awesome-icon icon="times" color="#E1112C"></font-awesome-icon>
        </button>
      </span>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'Torrent',

    computed: {
      ...mapGetters('Torrents', ['selectedTorrent', 'downloading', 'fileSize', 'downloadSpeed', 'remaining']),

      remainingFormatted () {
        return `${this.remaining}%`
      },

      torrent () {
        if (this.selectedTorrent) {
          return this.$store.getters['Torrents/torrent'](this.selectedTorrent.season, this.selectedTorrent.episode, this.selectedTorrent.id)
        }
      },

      subtitle () {
        return this.$store.getters['Subtitles/subtitle'](this.selectedTorrent.season, this.selectedTorrent.episode, this.selectedTorrent.id)
      }
    },

    methods: {
      cancel () {
        this.$store.dispatch('Torrents/cancel')
      },

      play () {
        if (this.subtitle) {
          this.$electron.shell.openItem(this.subtitle.path)
        }

        this.$electron.shell.openItem(this.torrent.path)
      }
    },

    beforeDestroy () {
      if (this.downloading) {
        this.cancel()
      }
    }
  }
</script>

<style scoped>
  table {
    border-collapse: separate;
    border-spacing: 3px 0;
  }
</style>
