<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden flex-1 flex flex-col" :class="{'opacity-25': watched}">
    <div
      class="bg-cover h-48"
      :style="{ backgroundImage: `url('https://image.tmdb.org/t/p/w342${episode.still_path}')` }"
    ></div>
    <div class="p-4 flex-1 flex flex-col" style="
">
      <h3 class="mb-4 text-2xl" v-text="episode.name"></h3>
      <div class="mb-4 text-grey-darker text-sm flex-1">
        <p>{{ episode.overview }}</p>
      </div>

      <div class="border-t border-grey-light mb-1"></div>
      <div>
        <button class="text-blue float-right" @click="toggleWatch">
          <font-awesome-icon icon="eye" size="lg"></font-awesome-icon>
        </button>
        <button @click="getTorrents" v-if="!torrent">torrents</button>
        <!-- For now, disallow multi torrents for same episode -->
        <button @click="playVideo" v-else>Play</button>
      </div>
    </div>
  </div>
</template>

<script>
  import { library } from '@fortawesome/fontawesome-svg-core'
  import { faEye } from '@fortawesome/free-solid-svg-icons'

  library.add(faEye)

  export default {
    name: 'v-card',

    props: {
      episode: Object,
      watched: Boolean,
      torrent: {
        required: false
      }
    },

    methods: {
      toggleWatch () {
        this.$emit('toggleWatch', this.episode)
      },

      getTorrents () {
        this.$emit('getTorrents', this.episode)
      },

      playVideo () {
        if (this.torrent) {
          require('electron').shell.openItem(`${this.$store.getters['Torrents/downloadPath']}/${this.torrent.path}`)
        }
      }
    }
  }
</script>
