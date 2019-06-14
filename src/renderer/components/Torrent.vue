<template>
  <div
    class="w-1/3 mb-4 fixed bottom-0 bg-ebony-clay text-nepal mx-auto left-0 right-0"
    v-show="downloading"
  >
    <div
      class="p-2"
    >
      <div
        class="flex"
        v-if="torrent"
      >
        <div
          class="flex-1"
        >
          <div
            class="text-lg"
          >
            {{ torrent.showName }} - {{ torrent.episodeName }}
          </div>

          <div
            class="text-xs"
          >
            <div>
              Season {{ torrent.season }}
            </div>

            <div>
              Episode {{ torrent.episode }}
            </div>
          </div>
        </div>

        <div
          class="w-1/4 text-sm"
        >
          <table>
            <tr>
              <td
                class="text-nepal"
              >
                <font-awesome-icon
                  icon="hdd"
                />
              </td>
              <td>
                <span
                  v-text="fileSize"
                ></span>
              </td>
            </tr>
            <tr>
              <td
                class="text-green-500"
              >
                <font-awesome-icon
                  icon="long-arrow-alt-down"
                />
              </td>
              <td>
                <span
                  v-text="downloadSpeed"
                ></span>
              </td>
            </tr>
            <tr>
              <td>
                <button
                  class="button mt-2"
                  @click="play"
                  v-if="torrent"
                >
                  <font-awesome-icon
                    icon="play"
                  />
                </button>
              </td>
            </tr>
          </table>
        </div>
      </div>

      <div
        v-else
      >
        Fetching metadata...
      </div>

      <div
        class="shadow-md w-full bg-nepal mt-2"
      >
        <div
          class="bg-malachite text-xs leading-none py-1 text-center font-bold text-oxford-blue"
          :style="{ width: remaining }"
          v-text="remaining"
        ></div>
      </div>

      <div
        class="absolute top-0 right-0 pr-2 pt-1"
      >
        <button
          class="text-red-500 hover:text-red-800"
          @click="cancel"
        >
          <font-awesome-icon
            icon="times"
          />
        </button>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'

  export default {
    name: 'Torrent',

    computed: {
      ...mapGetters('Torrents', ['findTorrent']),

      ...mapGetters('Torrent', ['id', 'downloading', 'fileSize', 'downloadSpeed', 'remaining']),

      ...mapGetters('Subtitles', ['findSubtitleByEpisodeId']),

      torrent () {
        if (this.id) {
          return this.findTorrent(this.id)
        }
      },

      subtitle () {
        return this.findSubtitleByEpisodeId(this.id)
      }
    },

    methods: {
      ...mapActions('Torrent', ['cancel']),

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
