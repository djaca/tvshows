<template>
  <div v-if="show">
    <heading></heading>

    <div class="mt-5">
      <v-tiles-container
        :items="items"
        @click="goTo('season', { id: show.id, season: $event.id })"
      />
    </div>
  </div>
</template>

<script>
  import Heading from '@/components/Show/Heading'
  import VTilesContainer from '@/components/VTilesContainer'
  import goTo from '@/mixins/route'

  export default {
    name: 'Show',

    components: { Heading, VTilesContainer },

    mixins: [goTo],

    computed: {
      show () {
        return this.$store.getters['Shows/show']
      },

      items () {
        return this.show.seasons.map(s => {
          return {
            id: s.season_number,
            img: s.poster_path
          }
        })
      }
    },

    methods: {
      getShow () {
        if (this.show && this.show.id === parseInt(this.$route.params.id)) {
          return
        }

        let loader = this.$loading.show()

        this.$store.dispatch('Shows/get', this.$route.params.id)
          .catch(err => console.log(err))
          .finally(() => {
            loader.hide()
          })
      }
    },

    watch: {
      '$route': 'getShow'
    },

    created () {
      this.getShow()
    }
  }
</script>
