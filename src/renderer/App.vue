<template>
  <div
    class="bg-mirage min-h-screen"
  >
    <navbar />

    <div
      class="mx-auto px-2"
    >
      <router-view />
    </div>

    <div
      class="h-32 flex items-center"
    >
      <div
        class="w-12 h-12"
      >
        <img
          src="~@/assets/tmdb-logo.png"
          alt="tmdb_logo"
        >
      </div>
    </div>

    <torrent />
  </div>
</template>

<script>
  import Navbar from '@/components/App/Navbar'
  import Torrent from '@/components/Torrent'

  export default {
    name: 'App',

    components: { Torrent, Navbar }
  }
</script>
