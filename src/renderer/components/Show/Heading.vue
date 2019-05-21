<template>
  <div
    class="mx-2 flex"
    v-if="show"
  >
    <div class="w-1/2 sm:w-1/4 md:w-1/5 lg:w-1/6 xl:w-1/8 p-2">
      <img
        :src="img"
        :alt="name"
        class="-mx-2"
      >
    </div>

    <div class="w-2/3 text-nepal">
      <div
        class="text-4xl mb-4"
        v-text="name"
      ></div>

      <div class="mb-6 flex justify-between">
        <span v-text="genre"></span>
        <span v-text="date"></span>
        <span v-text="runtime"></span>
        <span v-text="rating"></span>
        <span v-text="status"></span>
      </div>

      <div v-text="overview"></div>
    </div>

    <div>
      <button
        class="text-blue"
        @click="addShow"
        v-if="!exists(show.id)"
      >
        <font-awesome-icon
          icon="plus"
          size="2x"
        />
      </button>

      <button
        class="text-red"
        @click="removeShow(show.id)"
        v-else
      >
        <font-awesome-icon
          icon="minus"
          size="2x"/>
      </button>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'

  export default {
    name: 'Heading',

    computed: {
      ...mapGetters('Shows', ['show', 'exists']),

      name () {
        return this.show.name
      },

      genre () {
        return this.show.genres.map(genre => genre.name).join(' | ')
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

      overview () {
        return this.show.overview
      },

      img () {
        return `https://image.tmdb.org/t/p/w342${this.show.poster_path}`
      }
    },

    methods: {
      ...mapActions('Shows', ['add', 'remove']),

      addShow () {
        this.add()

        this.$toastr('info', 'Show added to library')
      },

      removeShow (id) {
        this.remove(id)

        this.$toastr('info', 'Show removed from library')
      }
    }
  }
</script>
