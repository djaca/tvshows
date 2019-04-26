<template>
  <div class="w-1/2 sm:w-1/4 md:w-1/5 lg:w-1/6 xl:w-48 px-2 mb-2" @click="$emit('click')">
    <div class="cursor-pointer">
      <img :src="`https://image.tmdb.org/t/p/w342${img}`" alt="">
    </div>
  </div>
</template>

<script>
  export default {
    name: 'VTile',

    props: {
      img: {
        type: String,
        required: false,
        default: null
      }
    }
  }
</script>

<style scoped>

</style>
