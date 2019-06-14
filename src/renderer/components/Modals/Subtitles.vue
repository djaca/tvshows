<template>
  <div class="p-4 bg-ebony-clay-2 border border-ebony-clay-2 text-nepal">
    <v-table
      class="table w-full"
      :columns="columns"
      :items="subtitles(episodeNumber)"
    >
      <template
        slot-scope="{ row }"
      >
        <td>
          {{ row.versions }}
        </td>
        <td>
          <button
            v-if="!exists(row.id)"
            class="text-nepal hover:text-oxford-blue"
            @click="doDownload(row.id)"
          >
            <font-awesome-icon
              icon="download"
              size="lg"/>
          </button>

          <button
            v-else
            class="text-nepal hover:text-oxford-blue"
            @click="open"
          >
            <font-awesome-icon
              icon="file-archive"
              size="lg"
            />
          </button>
        </td>
        <td>
          {{ row.language }}
        </td>
        <td>
          {{ row.author }}
        </td>
        <td>
          {{ row.downloadCount }}
        </td>
      </template>
    </v-table>
  </div>
</template>

<script>
  import VTable from '@/components/VTable'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    name: 'Subtitles',

    components: { VTable },

    props: ['episodeId', 'episodeNumber'],

    data () {
      return {
        columns: ['version', '', 'language', 'author', 'downloaded']
      }
    },

    computed: {
      ...mapGetters('Show', ['subtitles']),

      sub () {
        return this.subtitles
      },

      ...mapGetters('Subtitles', ['findSubtitleByEpisodeId']),

      subtitle () {
        return this.findSubtitleByEpisodeId(this.episodeId)
      }
    },

    methods: {
      ...mapActions('Subtitles', ['download']),

      async doDownload (urlId) {
        await this.download({ id: this.episodeId, urlId })

        this.$emit('close')
      },

      open () {
        this.$electron.shell.openItem(this.subtitle.path)
      },

      exists (id) {
        if (this.subtitle) {
          return this.subtitle.id === id
        }
      }
    }
  }
</script>
