<template>
  <div>
    <div
      class="text-center text-nepal text-3xl my-4"
      v-text="title"
      v-if="show"
    ></div>

    <div class="mx-2" v-if="episodes">
      <div class="flex flex-wrap -m-2">

        <div
          class="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 px-3 mb-4 flex flex-col p-2"
          v-for="episode in episodes"
          :key="episode.episode_number"
        >
          <episode-card :item="episode"></episode-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import EpisodeCard from '@/components/EpisodeCard'
  import { mapGetters } from 'vuex'

  export default {
    name: 'Season',

    components: { EpisodeCard },

    data () {
      return {
        loader: null
      }
    },

    computed: {
      ...mapGetters('Shows', ['show', 'episodes']),

      season () {
        return this.$route.params.season
      },

      title () {
        return `${this.show.name} - Season ${this.season}`
      }
    },

    watch: {
      '$route': 'getSeason'
    },

    methods: {
      getSeason () {
        this.loader = this.$loading.show()

        this.$store.dispatch('Shows/getSeason', this.season)
          .catch(err => console.log(err))
          .finally(() => this.loader.hide())
      }
    },

    mounted () {
      this.show ? this.getSeason() : this.$router.push({ name: 'home' })
    }
  }
</script>
