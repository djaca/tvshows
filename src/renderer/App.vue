<template>
  <div id="app">
    <div id="nav" class="text-center">
      <router-link to="/">Home</router-link> |
      <router-link to="/browse">Browse</router-link>

      <span v-if="$route.params.season" class="float-left">
        <router-link :to="{name: 'show', params: { id: $route.params.id }}">Back</router-link>
      </span>

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
  #nav {
    padding: 30px;
  }

  #nav a {
    font-weight: bold;
    color: #2c3e50;
  }

  #nav a.router-link-exact-active {
    color: #42b983;
  }
</style>
