<template>
  <div>
    <div class="w-1/2 mx-auto">
      <form @submit.prevent="doSearch">
        <div class="flex items-center border-b border-b-2 border-nepal py-2">
          <input
            class="appearance-none bg-transparent border-none w-full text-nepal mr-3 py-1 px-2 leading-tight focus:outline-none"
            type="text"
            placeholder="Search TMDB"
            v-model="query"
          >

          <button
            class="flex-no-shrink border-transparent border-4 text-nepal hover:text-ebony-clay-2 text-sm px-2 rounded"
            type="button"
            @click="clearSearchField"
            v-if="showClearBtn"
          >
           <span class="text-red-dark">
              <font-awesome-icon
                icon="times"
                size="lg"
              />
           </span>
          </button>

          <button
            class="flex-no-shrink bg-transparent hover:text-oxford-blue text-nepal"
            type="button"
            @click="doSearch"
            :disabled="!query"
            :class="{ 'opacity-50 cursor-not-allowed': !query }"
          >
            <font-awesome-icon
              icon="search"
              size="lg"
            />
          </button>
        </div>
      </form>
    </div>

    <div id="results">
      <div class="mt-5">
        <v-tiles-container
          :items="items"
          @click="goTo('show', { id: $event.id })"
        />
      </div>

      <div class="my-6 text-center">
        <button
          class="w-1/3 bg-ebony-clay-2 hover:bg-ebony-clay text-nepal font-semibold py-2 px-4 border border-ebony-clay hover:border-transparent"
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
  import VTilesContainer from '@/components/VTilesContainer'
  import { mapState, mapMutations, mapGetters, mapActions } from 'vuex'
  import goTo from '@/mixins/route'

  export default {
    name: 'browse',

    components: { VTilesContainer },

    mixins: [goTo],

    data () {
      return {
        shows: null,
        loader: null
      }
    },

    computed: {
      items () {
        return this.shows
          ? this.shows.map(s => {
            return {
              id: s.id,
              img: s.poster_path
            }
          })
          : []
      },

      ...mapState('Browse', ['text', 'popular', 'results']),

      ...mapGetters('Browse', ['hasPopularShows']),

      query: {
        get () {
          return this.text
        },

        set (value) {
          this.SET_TEXT(value.trim())
        }
      },

      showClearBtn () {
        return !!this.query
      }
    },

    methods: {
      ...mapMutations('Browse', ['SET_TEXT']),

      ...mapActions('Browse', ['getPopular', 'search', 'clearSearch']),

      getPopularShows () {
        let loader = this.$loading.show()

        this.getPopular()
          .then(() => (this.shows = this.popular))
          .catch(err => {
            this.$toastr('error', 'Can`t connect to TMDb', 'Error')

            console.log(err)
          })
          .finally(() => (loader.hide()))
      },

      clearSearchField () {
        this.clearSearch()

        this.shows = this.popular
      },

      doSearch () {
        if (this.query && this.query !== ' ') {
          let loader = this.$loading.show()

          this.search()
            .then(() => (this.shows = this.results))
            .catch(err => {
              this.$toastr('error', 'Can`t search TMDb', 'Error')

              console.log(err)
            })
            .finally(() => (loader.hide()))
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
