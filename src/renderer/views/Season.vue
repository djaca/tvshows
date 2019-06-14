<template>
  <div>
    <div
      class="text-center text-nepal text-3xl my-4"
      v-text="title"
    ></div>

    <div
      class="mx-2"
      v-if="episodes"
    >
      <div class="flex flex-wrap -m-2">
        <div
          class="w-full xl:w-1/5 px-3 mb-4 flex flex-col p-2"
          v-for="episode in episodes"
          :key="episode.episode_number"
        >
          <episode-card
            :item="episode"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import EpisodeCard from '@/components/EpisodeCard'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    name: 'Season',

    components: { EpisodeCard },

    computed: {
      ...mapGetters('Show', ['name', 'episodes']),

      season () {
        return this.$route.params.season
      },

      title () {
        return `${this.name} - Season ${this.season}`
      }
    },

    watch: {
      '$route': 'fetchSeason'
    },

    methods: {
      ...mapActions('Show', ['fetchSeason'])
    },

    mounted () {
      this.name.length > 0
        ? this.fetchSeason()
        : this.$router.push({ name: 'home' })
    }
  }
</script>
