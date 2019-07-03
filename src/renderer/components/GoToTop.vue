<template>
  <go-top
    :size="50"
    bg-color="#8EACC5"
    fg-color="#232D3D"
    ripple-bg="#232D3D"
  ></go-top>
</template>

<script>
  import GoTop from '@inotom/vue-go-top'

  export default {
    name: 'GoToTop',

    components: { GoTop }
  }
</script>
