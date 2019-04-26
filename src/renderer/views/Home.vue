<template>
  <div>
    <v-tiles-container
      v-if="shows.length > 0"
      :items="shows"
      @click="goTo"
    />

    <div v-else>No shows yet</div>
  </div>
</template>

<script>
  import VTilesContainer from '@/components/VTilesContainer'
  import { mapGetters } from 'vuex'

  export default {
    name: 'home',

    components: { VTilesContainer },

    computed: {
      ...mapGetters('Shows', ['shows'])
    },

    methods: {
      goTo ({ id }) {
        this.$router.push({name: 'show', params: { id }})
      }
    }
  }
</script>
