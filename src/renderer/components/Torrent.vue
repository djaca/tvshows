<template>
  <div
    class="w-1/3 mb-4 fixed pin-b bg-ebony-clay text-nepal"
    style="right: 0;left: 0;margin-right: auto;margin-left: auto;"
    v-show="downloading"
  >
    <div class="p-2">
      <div class="flex">
        <div
          class="flex-1 grow"
          v-if="selectedTorrent"
        >
          <div class="text-lg">{{ selectedTorrent.showName }} - {{ selectedTorrent.episodeName }}
          </div>
          <div class="text-xs">
            <div>Season {{ selectedTorrent.season }}</div>
            <div>Episode {{ selectedTorrent.episode }}</div>
            <button
              class="downloadTorrentBtn mt-2"
              @click="play"
              v-if="torrent"
            >
              <font-awesome-icon icon="play" />
            </button>
          </div>
        </div>
        <div class="w-1/4 text-sm">
          <table>
            <tr>
              <td>
                <font-awesome-icon
                  icon="hdd"
                  color="#323E4F"
                />
              </td>
              <td>
                <span v-text="fileSize"></span>
              </td>
            </tr>
            <tr>
              <td>
                <font-awesome-icon
                  icon="long-arrow-alt-down"
                  color="#1BB934"
                />
              </td>
              <td>
                <span v-text="downloadSpeed"></span>
              </td>
            </tr>
          </table>
        </div>
      </div>

      <div class="shadow-md w-full bg-nepal mt-2">
        <div
          class="bg-malachite text-xs leading-none py-1 text-center font-bold text-oxford-blue"
          :style="{width: remainingFormatted}"
          v-text="remainingFormatted"
        ></div>
      </div>

      <span
        class="absolute p-1"
        style="top: 0; right: 0"
      >
        <button
          class="hover:text-grey"
          @click="cancelDownloading"
        >
          <font-awesome-icon
            icon="times"
            color="#E1112C"
          />
        </button>
      </span>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'

  export default {
    name: 'Torrent',

    computed: {
      ...mapGetters('Torrents', ['findTorrent']),

      ...mapGetters('Torrent', ['selectedTorrent', 'downloading', 'fileSize', 'downloadSpeed', 'remaining']),

      ...mapGetters('Subtitles', ['findSubtitleByEpisodeId']),

      remainingFormatted () {
        return `${this.remaining}%`
      },

      torrent () {
        if (this.selectedTorrent) {
          return this.findTorrent(this.selectedTorrent.id)
        }
      },

      subtitle () {
        return this.findSubtitleByEpisodeId(this.selectedTorrent.id)
      }
    },

    methods: {
      ...mapActions('Torrent', ['cancel']),

      async cancelDownloading () {
        await this.cancel()

        this.$toastr('info', 'Torrent download canceled', 'Info')
      },

      play () {
        if (this.subtitle) {
          this.open(this.subtitle.path)
        }

        this.open(this.torrent.path)
      },

      open (item) {
        this.$electron.shell.openItem(item)
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
