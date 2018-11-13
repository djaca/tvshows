<template>
  <div class="p-4">
    <table class="w-full text-left">
      <thead>
      <tr>
        <th class="py-3 px-4 bg-grey-lighter font-sans font-medium uppercase text-sm text-grey border-b border-grey-light">
          Versions
        </th>
        <th class="py-3 px-4 bg-grey-lighter font-sans font-medium uppercase text-sm text-grey border-b border-grey-light"></th>
        <th class="py-3 px-4 bg-grey-lighter font-sans font-medium uppercase text-sm text-grey border-b border-grey-light w-32">
          Language
        </th>
        <th
          class="py-3 px-4 bg-grey-lighter font-sans font-medium uppercase text-sm text-grey border-b border-grey-light">
          Author
        </th>
        <th
          class="py-3 px-4 bg-grey-lighter font-sans font-medium uppercase text-sm text-grey border-b border-grey-light">
          Downloaded
        </th>
      </tr>
      </thead>
      <tbody>
      <tr class="hover:bg-blue-lightest" v-for="subtitle in subtitles">
        <td class="py-3 px-4 border-b border-grey-light">{{ subtitle.versions }}</td>
        <td class="py-3 px-4 border-b border-grey-light text-center">
          <button class="text-blue float-right" @click="downloadSubtitle(subtitle.id)">
            <font-awesome-icon icon="download" size="lg"></font-awesome-icon>
          </button>
        </td>
        <td class="py-3 px-4 border-b border-grey-light">{{ subtitle.language }}</td>
        <td class="py-3 px-4 border-b border-grey-light">{{ subtitle.author }}</td>
        <td class="py-3 px-4 border-b border-grey-light">{{ subtitle.downloadCount }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  export default {
    name: 'Subtitles',

    props: {
      subtitles: Array,
      episode: Number
    },

    methods: {
      downloadSubtitle (id) {
        this.$store.dispatch('Subtitles/download', {
          urlId: id,
          showId: parseInt(this.$route.params.id),
          season: parseInt(this.$route.params.season),
          episode: this.episode
        })

        this.$emit('close')
      }
    }
  }
</script>
