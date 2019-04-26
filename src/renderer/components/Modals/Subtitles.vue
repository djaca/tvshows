<template>
  <div class="p-4 bg-ebony-clay-2 border border-ebony-clay-2">
    <table class="w-full text-left">
      <thead>
      <tr>
        <th class="py-3 px-4 bg-transparent font-sans font-medium uppercase text-sm text-nepal border-b border-ebony-clay">
          Versions
        </th>
        <th class="py-3 px-4 bg-transparent font-sans font-medium uppercase text-sm text-nepal border-b border-ebony-clay"></th>
        <th class="py-3 px-4 bg-transparent font-sans font-medium uppercase text-sm text-nepal border-b border-ebony-clay w-32">
          Language
        </th>
        <th
          class="py-3 px-4 bg-transparent font-sans font-medium uppercase text-sm text-nepal border-b border-ebony-clay">
          Author
        </th>
        <th
          class="py-3 px-4 bg-transparent font-sans font-medium uppercase text-sm text-nepal border-b border-ebony-clay">
          Downloaded
        </th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="subtitle in subtitles" class="text-nepal">
        <td class="py-3 px-4 border-b border-ebony-clay">{{ subtitle.versions }}</td>
        <td class="py-3 px-4 border-b border-ebony-clay text-center">
          <button v-if="!exists(subtitle.id)" class="text-nepal hover:text-oxford-blue" @click="download(subtitle.id)">
            <font-awesome-icon icon="download" size="lg"></font-awesome-icon>
          </button>

          <button v-else class="text-nepal hover:text-oxford-blue" @click="open">
            <font-awesome-icon icon="file-archive" size="lg"></font-awesome-icon>
          </button>
        </td>
        <td class="py-3 px-4 border-b border-ebony-clay">{{ subtitle.language }}</td>
        <td class="py-3 px-4 border-b border-ebony-clay">{{ subtitle.author }}</td>
        <td class="py-3 px-4 border-b border-ebony-clay">{{ subtitle.downloadCount }}</td>
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
          return id === this.subtitle.urlId
        }
      }
    }
  }
</script>
