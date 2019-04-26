<template>
  <div class="flex flex-wrap -mx-2">
    <template>
      <v-tile
        v-for="item in items"
        :img="item.img"
        :key="item.id"
        @click="$emit('click', item)"
      ></v-tile>
    </template>
  </div>
</template>

<script>
  import VTile from '@/components/VTile'

  export default {
    name: 'VTilesContainer',

    components: { VTile },

    props: {
      items: {
        required: true,
        type: Array
      }
    }

  }
</script>

<style scoped>

</style>
