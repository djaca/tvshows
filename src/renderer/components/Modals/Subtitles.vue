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
          <button v-if="!exists(subtitle.id)" class="text-blue" @click="download(subtitle.id)">
            <font-awesome-icon icon="download" size="lg"></font-awesome-icon>
          </button>

          <button v-else class="text-blue" @click="open">
            <font-awesome-icon icon="file-archive" size="lg"></font-awesome-icon>
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

    computed: {
      subtitle () {
        return this.$store.getters['Subtitles/subtitle'](parseInt(this.$route.params.season), this.episode)
      }
    },

    methods: {
      download (id) {
        this.$store.dispatch('Subtitles/download', {
          urlId: id,
          id: parseInt(this.$route.params.id),
          season: parseInt(this.$route.params.season),
          episode: this.episode
        })

        this.$emit('close')
      },

      open () {
        this.$electron.shell.openItem(this.subtitle.path)
      },

      exists (id) {
        if (this.subtitle) {
          console.log(id, this.subtitle.urlId)
          return id === this.subtitle.urlId
        }
      }
    }
  }
</script>
