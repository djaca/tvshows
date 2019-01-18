<template>
  <div
    class="w-1/3 bg-white mb-4 fixed pin-b shadow-lg"
    style="right: 0;left: 0;margin-right: auto;margin-left: auto;"
    v-show="engine"
  >
    <div class="p-2" v-if="torrent">
      <div class="flex">
        <div class="flex-1 grow">
          <div class="text-lg">{{ torrent.show }} - {{ torrent.name }}</div>
          <div class="text-xs" v-show="show">
            <div>Season {{ torrent.season }}</div>
            <div>Episode {{ torrent.episode }}</div>
          </div>
        </div>
        <div class="w-1/4 text-sm" v-show="show">
          <table>
            <tr>
              <td><font-awesome-icon icon="hdd" color="grey"></font-awesome-icon></td>
              <td><span v-text="formatBytes(fileSize, 2, true)"></span></td>
            </tr>
            <tr>
              <td><font-awesome-icon icon="long-arrow-alt-down" color="green"></font-awesome-icon></td>
              <td><span v-text="formatBytes(downloadSpeed)"></span></td>
            </tr>
          </table>
        </div>
      </div>

      <div class="shadow-md w-full bg-grey-lighter mt-2">
        <div class="bg-green text-xs leading-none py-1 text-center font-bold text-black" :style="{width: remaining}">
          {{ remaining }}
        </div>
      </div>

      <span class="absolute p-1" style="top: 0; right: 0">
        <button class="hover:text-grey" @click="toggleShow">
          <font-awesome-icon :icon="show ? 'chevron-down' : 'chevron-up'"></font-awesome-icon>
        </button>
      </span>
    </div>
  </div>
</template>

<script>
  import torrentStream from 'torrent-stream'
  import { library } from '@fortawesome/fontawesome-svg-core'
  import { faHdd, faLongArrowAltDown, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'
  library.add(faHdd, faLongArrowAltDown, faChevronDown, faChevronUp)

  export default {
    name: 'Torrent',

    watch: {
      torrent (newVal) {
        if (newVal) {
          this.streamTorrent(newVal.url)
        }
      }
    },

    data () {
      return {
        show: true,
        timer: '',
        engine: null,
        fileSize: 0,
        downloadSpeed: 0,
        downloaded: 0
      }
    },

    computed: {
      torrent () {
        return this.$store.state.Torrent.torrent
      },

      remaining () {
        let t = ((this.downloaded / this.fileSize) * 100).toFixed(2)

        if (t > 1 && t <= 100) {
          return ((this.downloaded / this.fileSize) * 100).toFixed(2) + '%'
        }

        return '0%'
      }
    },

    methods: {
      toggleShow () {
        this.show = !this.show
      },

      streamTorrent (magnet) {
        if (this.engine) {
          this.engineDestroy()
        }

        this.engine = torrentStream(magnet, {path: this.$store.getters['Torrents/downloadPath']})

        this.engine.on('ready', () => {
          let file = this.engine.files.sort((a, b) => b.length - a.length)
            .filter(file => file.name.match(/\.(avi|AVI|wmv|WMV|flv|FLV|mpg|MPG|mp4|MP4|mkv)$/i))[0]

          file.createReadStream()
          this.fileSize = file.length

          let torrent = {
            id: this.torrent.id,
            season: this.torrent.season,
            episode: this.torrent.episode,
            path: file.path,
            name: file.name
          }
          this.$store.dispatch('Torrents/add', torrent)

          this.timer = setInterval(() => {
            if (!this.engine) {
              clearInterval(this.timer)
              return
            }
            this.downloadSpeed = this.engine.swarm.downloadSpeed()
            this.downloaded = this.engine.swarm.downloaded
          }, 1000)

          this.engine.on('idle', () => {
            console.log('idle')
            this.engineDestroy()
            this.$store.dispatch('Torrent/download', null)
          })
        })
      },

      engineDestroy () {
        clearInterval(this.timer)
        this.timer = ''
        if (this.engine) {
          this.engine.destroy()
          this.engine = null
        }
        this.downloadSpeed = 0
        this.fileSize = 0
        console.log('Engine destroyed!')
      },

      formatBytes (a, round = false) {
        if (a === 0) {
          return '0 Bytes'
        }
        let c = 1024
        let d = 2
        let e = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
        let f = Math.floor(Math.log(a) / Math.log(c))

        if (round) {
          return Math.floor(parseFloat((a / Math.pow(c, f)).toFixed(d))) + ' ' + e[f]
        }

        return parseFloat((a / Math.pow(c, f)).toFixed(d)) + ' ' + e[f]
      }
    },

    beforeDestroy () {
      clearInterval(this.timer)
    }
  }
</script>

<style scoped>
  table {
    border-collapse: separate;
    border-spacing: 3px 0;
  }
</style>
