<template>
  <div>
    <div class="mx-2" v-if="show">
      <heading :show="show"></heading>

      <div class="mt-5">
        <div class="px-2">
          <div class="flex flex-wrap -mx-2">
            <template v-for="season in show.seasons">
              <v-tile
                :item="season"
                :key="season.id"
                @click="goTo(season.season_number)"
              ></v-tile>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Heading from '@/components/Show/Heading'
  import VTile from '@/components/VTile'

  export default {
    name: 'Show',

    components: { Heading, VTile },

    computed: {
      show () {
        return this.$store.getters['Shows/show']
      }
    },

    methods: {
      goTo (season) {
        this.$router.push({ name: 'season', params: { id: this.show.id, season } })
      },

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
