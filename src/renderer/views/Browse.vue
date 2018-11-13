<template>
  <div>
    <div class="w-1/2 mx-auto">
      <form @submit.prevent="search">
        <div class="flex items-center border-b border-b-2 border-teal py-2">
          <input
            class="appearance-none bg-transparent border-none w-full text-grey-darker mr-3 py-1 px-2 leading-tight focus:outline-none"
            type="text"
            placeholder="Search TMDB"
            v-model="query"
          >

          <button
            class="flex-no-shrink border-transparent border-4 text-teal hover:text-teal-darker text-sm py-1 px-2 rounded"
            type="button"
            @click="clearSearchField"
            v-if="showClearBtn"
          >
            Cancel
          </button>

          <button
            class="flex-no-shrink bg-teal hover:bg-teal-dark border-teal hover:border-teal-dark text-sm border-4 text-white py-1 px-2 rounded"
            type="button"
            @click="search"
            :disabled="!query"
            :class="{ 'opacity-50 cursor-not-allowed': !query }"
          >
            Search
          </button>
        </div>
      </form>
    </div>

    <div id="results">
      <div class="mt-5">

        <div class="px-2">
          <div class="flex flex-wrap -mx-2">
            <div class="w-1/2 sm:w-1/4 md:w-1/5 lg:w-1/6 xl:w-1/8 px-2 mb-2" v-for="show in shows" :key="show.id">
              <router-link :to="{ name: 'show', params: { id: show.id }}">
                <img :src="`https://image.tmdb.org/t/p/w342${show.poster_path}`" alt="">
              </router-link>
            </div>
          </div>
        </div>

        <div class="my-6">
          <button
            class="w-full g-transparent hover:bg-grey-light text-grey-dark font-semibold hover:text-white py-2 px-4 border border-grey hover:border-transparent"
            @click="loadMore"
            v-show="hasPopularShows"
          >
            Load more
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'browse',

    data () {
      return {
        shows: null
      }
    },

    computed: {
      query: {
        get () {
          return this.$store.state.Browse.query
        },
        set (value) {
          this.$store.commit('Browse/SET_QUERY', value)
        }
      },

      popular () {
        return this.$store.state.Browse.popular
      },

      results () {
        return this.$store.state.Browse.results
      },

      hasPopularShows () {
        return this.$store.getters['Browse/hasPopularShows']
      },

      showClearBtn () {
        return !!this.query
      }
    },

    methods: {
      loadMore () {
        this.$store.dispatch('Browse/popular')
          .then(() => (this.shows = this.popular))
          .catch(err => console.log(err))
      },

      clearSearchField () {
        this.$store.dispatch('Browse/clearSearch')
        this.shows = this.popular
      },

      search () {
        let query = this.query.trim()

        if (query && query !== ' ') {
          return this.$store.dispatch('Browse/search')
            .then(() => (this.shows = this.results))
            .catch(err => console.log(err))
        }
      }
    },

    mounted () {
      if (!this.shows) {
        if (this.results) {
          this.shows = this.results
        } else {
          if (!this.hasPopularShows) {
            this.$store.dispatch('Browse/popular')
              .then(() => (this.shows = this.popular))
              .catch(err => console.log(err))
          }
          this.shows = this.popular
        }
      }
    }
  }
</script>
