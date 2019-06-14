<template>
  <div v-if="seasons.length > 0">
    <heading/>

    <div class="mt-5">
      <v-tiles-container
        :items="seasons"
        @click="goTo('season', { id: $route.params.id, season: $event.id })"
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
      ...mapGetters('Show', ['seasons'])
    },

    methods: {
      ...mapActions('Show', ['fetch'])
    },

    watch: {
      '$route': 'fetch'
    },

    beforeMount () {
      this.fetch()
    }
  }
</script>
