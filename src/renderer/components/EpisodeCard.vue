<template>
  <div
    class="bg-ebony-clay rounded-lg shadow-md overflow-hidden flex-1 flex flex-col"
    :class="{'opacity-25': watched}"
  >
    <div class="bg-cover h-48" :style="image"></div>

    <div class="p-4 flex-1 flex flex-col text-nepal">
      <div class="mb-4">
        <h3 class="text-2xl" v-text="episode.name"></h3>
        <div class="text-xs" v-text="date"></div>
      </div>
      <div class="mb-4 text-sm flex-1">
        <p v-text="episode.overview"></p>
      </div>

      <div class="mb-1">
        <span class="text-xs float-right">Episode {{ episodeNumber }}</span>
      </div>

      <div
        class="border-t border-grey-light text-sm"
        v-if="torrents"
      >
        <card-actions
          :torrents="torrents.torrents"
          :episode="episode"
          @get-subtitles="getSubtitles"
        />
      </div>
    </div>
  </div>
</template>

<script>
  import CardActions from '@/components/EpisodeCard/CardActions'

  export default {
    name: 'episode-card',

    components: { CardActions },

    props: {
      episode: Object
    },

    computed: {
      episodeNumber () {
        return this.episode.episode_number
      },

      seasonNumber () {
        return this.episode.season_number
      },

      watched () {
        return this.$store.getters['Watch/watched'](this.seasonNumber, this.episodeNumber)
      },

      torrents () {
        return this.$store.getters['Shows/torrents'](this.seasonNumber, this.episodeNumber)
      },

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
      getSubtitles () {
        this.$emit('get-subtitles', this.episodeNumber)
      }
    }
  }
</script>
