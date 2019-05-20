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
        v-for="(torrent, index) in torrents"
        :key="index"
      >
        <td v-text="torrent.title"></td>
        <td>
          <button
            class="text-nepal hover:text-oxford-blue"
            @click="doDownload(torrent)"
          >
            <font-awesome-icon
              icon="download"
              size="lg"/>
          </button>
        </td>
        <td v-text="torrent.size"></td>
        <td v-text="torrent.seeders"></td>
        <td v-text="torrent.leechers"></td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  import { searchTorrents } from '@/api/thePirateBay'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    name: 'Torrents',

    props: ['episode'],

    data () {
      return {
        headers: ['title', '', 'size', 'seeders', 'leechers'],
        torrents: []
      }
    },

    computed: {
      ...mapGetters('Shows', ['show']),

      query () {
        let name = this.show.name
        let season = `S${this.episode.season_number <= 9 ? '0' : ''}${this.episode.season_number}`
        let episode = `E${this.episode.episode_number <= 9 ? '0' : ''}${this.episode.episode_number}`

        return `${name} ${season}${episode}`
      }
    },

    methods: {
      ...mapActions('Torrent', ['download']),

      getTorrents () {
        searchTorrents(this.query)
          .then(data => {
            this.torrents = data
          })
          .catch(e => console.log(e))
      },

      doDownload ({ magnet }) {
        this.download({
          id: this.episode.id,
          showId: this.show.id,
          showName: this.show.name,
          episodeName: this.episode.name,
          season: this.episode.season_number,
          episode: this.episode.episode_number,
          magnet: magnet
        })
      }
    },

    mounted () {
      this.getTorrents()
    }
  }
</script>
