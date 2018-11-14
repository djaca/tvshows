<template>
  <div id="app">
    <div id="nav" class="pt-6 mx-2 flex justify-between">
      <div :class="{invisible: !$route.params.season}">
        <router-link :to="{name: 'show', params: { id: $route.params.id }}">Back</router-link>
      </div>

      <div>
        <router-link to="/">Home</router-link> |
        <router-link to="/browse">Browse</router-link>
      </div>

      <div class="w-12 h-12 float-right">
        <img src="~@/assets/tmdb-logo.png" alt="tmdb_logo">
      </div>
    </div>

    <router-view></router-view>

    <torrent></torrent>
  </div>
</template>
<script>
  import Torrent from '@/components/Torrent'

  export default {
    name: 'app',

    components: { Torrent }
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
  }

  #nav a {
    font-weight: bold;
    color: #2c3e50;
    text-decoration: none;
  }

  #nav a:hover {
    text-decoration: underline;
  }

  #nav a.router-link-exact-active {
    color: #42b983;
  }
</style>
