<template>
  <div class="w-1/3 bg-white mb-4 fixed pin-b" style="right: 0;left: 0;margin-right: auto;margin-left: auto;" v-show="engine">
    <div class="border p-2">
      <div v-if="torrent" v-text="torrent.name"></div>
      <div v-if="downloadSpeed" v-text="formatBytes(downloadSpeed)"></div>
      <div v-if="downloaded" v-text="formatBytes(downloaded)"></div>
      <div v-if="fileSize" v-text="formatBytes(fileSize)"></div>
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

  export default {
    name: 'Torrent',

    watch: {
      torrent (newVal, oldVal) {
        if (newVal) {
          this.streamTorrent(newVal.magnet)
        }
      }
    },

    data () {
      return {
        timer: '',
        engine: null,
        fileSize: null,
        downloadSpeed: null,
        downloaded: null
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

          let ptn = require('parse-torrent-name')
          let ptnFileName = ptn(file.name)
          let torrent = {
            showId: this.$store.getters['Show/show'].id,
            season: ptnFileName.season,
            episode: ptnFileName.episode,
            path: file.path,
            name: file.name
          }
          this.$store.dispatch('Torrents/add', torrent)

          this.timer = setInterval(() => {
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
