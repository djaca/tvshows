<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden flex-1 flex flex-col" :class="{'opacity-25': watched}">
    <div class="bg-cover h-48" :style="image"></div>

    <div class="p-4 flex-1 flex flex-col">
      <div class="mb-4">
        <h3 class="text-2xl" v-text="episode.name"></h3>
        <div class="text-xs">{{ date }}</div>
      </div>
      <div class="mb-4 text-grey-darker text-sm flex-1">
        <p v-text="episode.overview"></p>
      </div>

      <div class="border-t border-grey-light">
        <div class="mt-2">
          <button class="text-blue float-right" @click="toggleWatch">
            <font-awesome-icon icon="eye" size="lg"></font-awesome-icon>
          </button>
          <button @click="getTorrents">torrents</button>
          <button @click="getSubtitles">subtitles</button>
          <button @click="play" v-if="torrent">Watch</button>
          <button @click="openSubtitle" v-if="subtitle">Open subtitle file</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { library } from '@fortawesome/fontawesome-svg-core'
  import { faEye } from '@fortawesome/free-solid-svg-icons'
  import { shell } from 'electron'
  library.add(faEye)

  export default {
    name: 'episode-card',

    props: {
      episode: Object,
      watched: Boolean,
      subtitle: {
        required: false,
        type: Object
      },
      torrent: {
        required: false,
        type: Object
      }
    },

    computed: {
      image () {
        if (this.episode.still_path) {
          return {backgroundImage: `url('https://image.tmdb.org/t/p/w300${this.episode.still_path}')`}
        }
      },

      date () {
        return this.humanTime(this.episode.air_date)
      }
    },

    methods: {
      toggleWatch () {
        this.$emit('toggleWatch', this.episode)
      },

      getTorrents () {
        this.$emit('getTorrents', this.episode)
      },

      getSubtitles () {
        this.$emit('getSubtitles', this.episode)
      },

      openSubtitle () {
        this.$electron.shell.openItem(this.subtitle.path)
      },

      play () {
        if (this.subtitle) {
          this.openSubtitle()
        }

        shell.openItem(`${this.$store.getters['Torrents/downloadPath']}/${this.torrent.path}`)
      }
    }
  }
</script>
