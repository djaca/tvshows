<template>
  <div>
    <!-- todo: add loading icon and maybe in vuex -->
    <div v-if="loading">Loading...</div>

    <div class="mx-2" v-else>
      <heading :show="show"></heading>

      <div class="mt-5">
        <div class="px-2">
          <div class="flex flex-wrap -mx-2">
            <div
              class="w-1/2 sm:w-1/4 md:w-1/5 lg:w-1/6 xl:w-1/8 px-2 mb-2"
              v-for="season in show.seasons"
              :key="season.id"
            >
              <router-link :to="{ name: 'season', params: { id: show.id, season: season.season_number }}">
                <img :src="`https://image.tmdb.org/t/p/w342${season.poster_path}`" alt="">
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Heading from '@/components/Show/Heading'

  export default {
    name: 'Show',

    components: {Heading},

    data () {
      return {
        loading: false
      }
    },

    computed: {
      show () {
        return this.$store.getters['Show/show']
      }
    },

    methods: {
      fetchData () {
        this.loading = true

        if (this.show && this.show.id === parseInt(this.$route.params.id)) {
          this.loading = false
          return
        }

        this.$store.dispatch('Show/get', this.$route.params.id)
          .then(() => (this.loading = false))
          .catch(err => console.log(err))
      }
    },

    watch: {
      '$route': 'fetchData'
    },

    created () {
      this.fetchData()
    }
  }
</script>

<style scoped>

</style>
