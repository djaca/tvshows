<template>
  <div id="app" class="bg-mirage min-h-screen">
    <navbar></navbar>

    <div class="mx-auto px-2">
      <router-view></router-view>
    </div>

    <div style="height: 5rem" class="flex items-center">
      <div class="w-12 h-12">
        <img src="~@/assets/tmdb-logo.png" alt="tmdb_logo">
      </div>
    </div>

    <torrent></torrent>
  </div>
</template>

<script>
  import Navbar from '@/components/Navbar'
  import Torrent from '@/components/Torrent'

  export default {
    name: 'app',

    components: { Torrent, Navbar }
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
  }
</style>
