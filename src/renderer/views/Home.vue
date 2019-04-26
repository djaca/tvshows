<template>
  <div>
    <v-tiles-container
      v-if="shows.length > 0"
      :items="shows"
      @click="goTo('show', { id: $event.id })"
    />

    <div v-else>No shows yet</div>
  </div>
</template>

<script>
  import VTilesContainer from '@/components/VTilesContainer'
  import { mapGetters } from 'vuex'
  import goTo from '@/mixins/route'

  export default {
    name: 'home',

    components: { VTilesContainer },

    mixins: [goTo],

    computed: {
      ...mapGetters('Shows', ['shows'])
    }
  }
</script>
