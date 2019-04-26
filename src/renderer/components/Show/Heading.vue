<template>
  <div class="mx-2 flex" v-if="show">
    <div class="w-1/2 sm:w-1/4 md:w-1/5 lg:w-1/6 xl:w-1/8 p-2">
      <img
        :src="`https://image.tmdb.org/t/p/w342${show.poster_path}`"
        :alt="show.name"
        class="-mx-2"
      >
    </div>

    <div class="w-2/3 text-nepal">
      <div class="text-4xl mb-4" v-text="show.name"></div>

      <div class="mb-6 flex justify-between">
        <span v-text="genre"></span>
        <span v-text="date"></span>
        <span v-text="runtime"></span>
        <span v-text="rating"></span>
        <span v-text="status"></span>
      </div>

      <div v-text="show.overview"></div>
    </div>

    <div>
      <button
        class="text-blue"
        @click="addShow"
        v-if="!exists"
      >
        <font-awesome-icon icon="plus" size="2x"></font-awesome-icon>
      </button>
      <button
        class="text-red"
        @click="removeShow"
        v-else
      >
        <font-awesome-icon icon="minus" size="2x"></font-awesome-icon>
      </button>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import { library } from '@fortawesome/fontawesome-svg-core'
  import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons'

  library.add(faPlus, faMinus)

  export default {
    name: 'Heading',

    computed: {
      ...mapGetters('Shows', ['show']),

      genre () {
        return this.show.genres.map(elem => elem.name).join(' | ')
      },

      date () {
        return this.humanTime(this.show.first_air_date)
      },

      runtime () {
        return `${this.show.episode_run_time[0]} min`
      },

      rating () {
        return `Rating: ${this.show.vote_average}`
      },

      status () {
        return this.show.status
      },

      exists () {
        return this.$store.getters['Shows/exists'](this.show.id)
      }
    },

    methods: {
      ...mapActions('Shows', ['add', 'remove']),

      addShow () {
        this.add(this.show)
      },

      removeShow () {
        this.remove(this.show.id)
      }
    }
  }
</script>
