<template>
  <div class="px-2">
    <div class="flex flex-wrap -mx-2" v-if="shows.length > 0">
      <div class="w-1/2 sm:w-1/4 md:w-1/5 lg:w-1/6 xl:w-1/8 px-2 mb-2" v-for="show in shows" :key="show.id">
        <router-link :to="{ name: 'show', params: { id: show.id }}">
          <img :src="`https://image.tmdb.org/t/p/w342${show.img}`" alt="">
        </router-link>
      </div>
    </div>
    <div v-else>No shows yet</div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'home',

    computed: {
      ...mapGetters('Shows', ['shows'])
    }
  }
</script>
