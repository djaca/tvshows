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
            @click="doDownload(torrent.magnet)"
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
  import downloadTorrent from '@/mixins/downloadTorrent'
  import { mapGetters } from 'vuex'

  export default {
    name: 'Torrents',

    props: ['item'],

    mixins: [downloadTorrent],

    data () {
      return {
        headers: ['title', '', 'size', 'seeders', 'leechers'],
        torrents: []
      }
    },

    computed: {
      ...mapGetters('Show', ['id', 'name']),

      query () {
        let season = `S${this.$route.params.season <= 9 ? '0' : ''}${this.$route.params.season}`
        let episode = `E${this.item.episode_number <= 9 ? '0' : ''}${this.item.episode_number}`

        return `${this.name} ${season}${episode}`
      }
    },

    methods: {
      getTorrents () {
        searchTorrents(this.query)
          .then(data => {
            this.torrents = data
          })
          .catch(err => {
            this.$toastr('error', 'Can`t fetch torrents', 'Error')

            console.log(err)
          })
      }
    },

    mounted () {
      this.getTorrents()
    }
  }
</script>
