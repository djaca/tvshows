<template>
  <div>
    <div class="w-1/2 mx-auto">
      <form @submit.prevent="doSearch">
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
            @click="doSearch"
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
        <div class="flex flex-wrap -mx-2">
          <template>
            <v-tile
              v-for="show in shows"
              :item="show"
              :key="show.id"
              @click="goTo(show.id)"
            ></v-tile>
          </template>
        </div>
      </div>

      <div class="my-6 text-center">
        <button
          class="w-1/3 g-transparent hover:bg-grey-light text-grey-dark font-semibold hover:text-white py-2 px-4 border border-grey hover:border-transparent"
          @click="getPopularShows"
          v-show="hasPopularShows"
        >
          Load more
        </button>
      </div>
    </div>
  </div>
</template>

<script>
  import VTile from '@/components/VTile'
  import { mapState, mapGetters, mapActions } from 'vuex'

  export default {
    name: 'browse',

    components: {VTile},

    data () {
      return {
        shows: null,
        loader: null
      }
    },

    computed: {
      ...mapState('Browse', ['text', 'popular', 'results']),

      ...mapGetters('Browse', ['hasPopularShows']),

      query: {
        get () {
          return this.text
        },

        set (value) {
          this.$store.commit('Browse/SET_TEXT', value.trim())
        }
      },

      showClearBtn () {
        return !!this.query
      }
    },

    methods: {
      ...mapActions('Browse', ['getPopular', 'search', 'clearSearch']),

      goTo (id) {
        this.$router.push({name: 'show', params: {id}})
      },

      getPopularShows () {
        this.loader = this.$loading.show()

        this.getPopular()
          .then(() => (this.shows = this.popular))
          .catch(err => console.log(err))
          .finally(() => this.loader.hide())
      },

      clearSearchField () {
        this.clearSearch()

        this.shows = this.popular
      },

      doSearch () {
        if (this.query && this.query !== ' ') {
          this.loader = this.$loading.show()

          this.search()
            .then(() => (this.shows = this.results))
            .catch(err => console.log(err))
            .finally(() => this.loader.hide())
        }
      }
    },

    mounted () {
      if (!this.shows) {
        this.results
          ? this.shows = this.results
          : !this.hasPopularShows ? this.getPopularShows() : this.shows = this.popular
      }
    }
  }
</script>
