<template>
  <div class="w-1/3 bg-white mb-4 fixed pin-b" style="right: 0;left: 0;margin-right: auto;margin-left: auto;" v-show="engine">
    <div class="border p-2" v-if="torrent">
      <div>
        <div v-text="torrent.show"></div>
        <div v-text="torrent.name"></div>
      </div>
      <div v-if="downloadSpeed" v-text="formatBytes(downloadSpeed)"></div>
      <div v-if="downloaded" v-text="formatBytes(downloaded)"></div>
      <div v-if="fileSize">
        <font-awesome-icon icon="hdd" size="lg"></font-awesome-icon>
        <span v-text="formatBytes(fileSize)"></span>
      </div>
      <div class="shadow w-full bg-grey-light mt-2">
        <div class="bg-teal text-xs leading-none py-1 text-center font-medium text-white" :style="{width: remaining}">
          {{ remaining }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import torrentStream from 'torrent-stream'
  import { library } from '@fortawesome/fontawesome-svg-core'
  import { faHdd } from '@fortawesome/free-solid-svg-icons'
  library.add(faHdd)

  export default {
    name: 'Torrent',

    watch: {
      torrent (newVal, oldVal) {
        if (newVal) {
          this.streamTorrent(newVal.url)
        }
      }
    },

    data () {
      return {
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
      }
    },

    methods: {
      streamTorrent (magnet) {
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
            this.$store.dispatch('Torrent/download', null)
            clearInterval(this.timer)
            this.timer = ''
            if (this.engine) {
              this.engine.destroy()
              this.engine = null
            }
            this.downloadSpeed = null
            this.downloaded = null
            this.fileSize = null
            console.log('Engine destroyed!')
          })
        })
      },

      formatBytes (a, b) {
        if (a === 0) {
          return '0 Bytes'
        }
        let c = 1024
        let d = b || 2
        let e = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
        let f = Math.floor(Math.log(a) / Math.log(c))

        return parseFloat((a / Math.pow(c, f)).toFixed(d)) + ' ' + e[f]
      }
    },

    beforeDestroy () {
      clearInterval(this.timer)
    }
  }
</script>
