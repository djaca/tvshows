<template>
  <div
    class="bg-ebony-clay rounded-lg shadow-md overflow-hidden flex-1 flex flex-col"
    :class="{'opacity-25': watched}"
  >
    <div class="bg-cover h-48" :style="image"></div>

    <div class="p-4 flex-1 flex flex-col text-nepal">
      <div class="mb-4">
        <h3 class="text-2xl" v-text="item.name"></h3>
        <div class="text-xs" v-text="date"></div>
      </div>
      <div class="mb-4 text-sm flex-1">
        <p v-text="item.overview"></p>
      </div>

      <div class="mb-1">
        <span class="text-xs float-right">Episode {{ episode }}</span>
      </div>

      <div
        class="border-t border-grey-light text-sm"
        v-if="torrents"
      >
        <card-actions
          :torrents="torrents.torrents"
          :episode="item"
          @get-subtitles="getSubtitles"
        />
      </div>
    </div>
  </div>
</template>

<script>
  import CardActions from '@/components/EpisodeCard/CardActions'
  import SubtitlesModal from '@/components/Modals/Subtitles'
  import { mapGetters } from 'vuex'

  export default {
    name: 'episode-card',

    components: { CardActions },

    props: {
      item: {
        required: true,
        type: Object
      }
    },

    computed: {
      ...mapGetters('Watch', ['isWatched']),

      episode () {
        return this.item.episode_number
      },

      season () {
        return this.item.season_number
      },

      watched () {
        return this.isWatched(this.season, this.episode)
      },

      torrents () {
        return this.$store.getters['Shows/torrents'](this.season, this.episode)
      },

      image () {
        if (this.item.still_path) {
          return { backgroundImage: `url('https://image.tmdb.org/t/p/w300${this.item.still_path}')` }
        }
      },

      date () {
        return this.humanTime(this.item.air_date)
      }
    },

    methods: {
      getSubtitles () {
        this.$modal.show(SubtitlesModal, {
          episode: this.episode
        }, {
          height: 'auto',
          width: '60%'
        })
      }
    }
  }
</script>
