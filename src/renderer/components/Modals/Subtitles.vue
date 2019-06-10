<template>
  <div class="p-4 bg-ebony-clay-2 border border-ebony-clay-2 text-nepal">
    <table class="table w-full">
      <thead>
      <tr>
        <th
          v-for="(header, i) in headers"
          :key="i"
          v-text="header"
        ></th>
      </tr>
      </thead>

      <tbody>
      <tr
        v-for="(subtitle, i) in subtitles(episodeNumber)"
        :key="i"
      >
        <td v-text="subtitle.versions"></td>
        <td>
          <button
            v-if="!exists(subtitle.id)"
            class="text-nepal hover:text-oxford-blue"
            @click="doDownload(subtitle.id)"
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
        <td v-text="subtitle.language"></td>
        <td v-text="subtitle.author"></td>
        <td v-text="subtitle.downloadCount"></td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'

  export default {
    name: 'Subtitles',

    props: ['episodeId', 'episodeNumber'],

    data () {
      return {
        headers: ['Version', '', 'Language', 'Author', 'Downloaded']
      }
    },

    computed: {
      ...mapGetters('Show', ['subtitles']),

      ...mapGetters('Subtitles', ['findSubtitleByEpisodeId']),

      subtitle () {
        return this.findSubtitleByEpisodeId(this.episodeId)
      }
    },

    methods: {
      ...mapActions('Subtitles', ['download']),

      async doDownload (urlId) {
        try {
          await this.download({ id: this.episodeId, urlId })

          this.$emit('close')

          this.$toastr('success', 'Subtitle downloaded', 'Success')
        } catch (e) {
          this.$toastr('error', 'Can`t download subtitle', 'Error')

          console.log(e)
        }
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
