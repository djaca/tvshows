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
        v-for="(subtitle, i) in subtitles"
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

    props: {
      episode: Number
    },

    data () {
      return {
        headers: ['Version', '', 'Language', 'Author', 'Downloaded']
      }
    },

    computed: {
      ...mapGetters('Shows', ['seasonSubtitles']),

      ...mapGetters('Subtitles', ['findSubtitle']),

      season () {
        return parseInt(this.$route.params.season)
      },

      subtitles () {
        return this.seasonSubtitles(this.episode)
      },

      subtitle () {
        return this.findSubtitle(this.season, this.episode)
      }
    },

    methods: {
      ...mapActions('Subtitles', ['download']),

      doDownload (id) {
        this.download({
          urlId: id,
          id: parseInt(this.$route.params.id),
          season: this.season,
          episode: this.episode
        })

        this.$emit('close')
      },

      open () {
        this.$electron.shell.openItem(this.subtitle.path)
      },

      exists (id) {
        if (this.subtitle) {
          return this.subtitle.urlId === id
        }
      }
    }
  }
</script>
