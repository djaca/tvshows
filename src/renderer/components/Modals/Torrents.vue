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
  import { mapGetters } from 'vuex'

  export default {
    name: 'Torrents',

    props: ['episode', 'episodeName'],

    data () {
      return {
        headers: ['title', '', 'size', 'seeders', 'leechers'],
        torrents: []
      }
    },

    computed: {
      ...mapGetters('Shows', ['show'])
    },

    methods: {
      queryForTorrentSearch () {
        let season = this.$route.params.season
        let episode = this.episode

        return `${this.show.name} S${season <= 9 ? '0' : ''}${season}E${episode <= 9 ? '0' : ''}${episode}`
      },

      getTorrents () {
        searchTorrents(this.queryForTorrentSearch())
          .then(resp => {
            this.torrents = resp
          })
          .catch(e => console.log(e))
      },

      doDownload (torrent) {
        let data = {
          seeders: torrent.seeders,
          leechers: torrent.leechers,
          magnet: torrent.magnet,
          showName: this.show.name,
          episodeName: this.episodeName
        }

        console.log(data)
        // ...torrent,
        // episode: this.episodeNumber,
        //   season: this.seasonNumber,
        //   id: this.showId,
        //   name: this.episode.name,
        //   show: this.show.name
      }
    },

    mounted () {
      this.getTorrents()
    }
  }
</script>
