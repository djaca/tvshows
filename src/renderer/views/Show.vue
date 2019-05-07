<template>
  <div v-if="show">
    <heading/>

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
  import { mapGetters, mapActions } from 'vuex'

  export default {
    name: 'Show',

    components: { Heading, VTilesContainer },

    mixins: [goTo],

    computed: {
      ...mapGetters('Shows', ['show']),

      id () {
        return this.$route.params.id
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
      ...mapActions('Shows', ['fetchShow']),

      getShow () {
        if (this.show && this.show.id === parseInt(this.id)) {
          return
        }

        let loader = this.$loading.show()

        this.fetchShow(this.id)
          .catch(err => (console.log(err)))
          .finally(() => (loader.hide()))
      }
    },

    watch: {
      '$route': 'getShow'
    },

    mounted () {
      this.getShow()
    }
  }
</script>
