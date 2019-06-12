<template>
  <div
    class="p-4 bg-ebony-clay-2 border border-ebony-clay-2 text-nepal"
  >
    <v-table
      class="table w-full"
      :columns="columns"
      :items="torrents"
    >
      <template
        slot-scope="{ row }"
      >
        <td>
          {{ row.title }}
        </td>
        <td>
          <button
            class="text-nepal hover:text-oxford-blue"
            @click="doDownload(row.magnet)"
          >
            <font-awesome-icon
              icon="download"
              size="lg"/>
          </button>
        </td>
        <td>
          {{ row.size }}
        </td>
        <td>
          {{ row.seeders }}
        </td>
        <td>
          {{ row.leechers }}
        </td>
      </template>
    </v-table>
  </div>
</template>

<script>
  import VTable from '@/components/VTable'
  import { searchTorrents } from '@/api/thePirateBay'
  import downloadTorrent from '@/mixins/downloadTorrent'
  import { mapGetters } from 'vuex'

  export default {
    name: 'Torrents',

    components: { VTable },

    props: ['item'],

    mixins: [downloadTorrent],

    data () {
      return {
        columns: ['title', '', 'size', 'seeders', 'leechers'],
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
      async getTorrents () {
        try {
          this.torrents = await searchTorrents(this.query)
        } catch (err) {
          this.$toastr('error', 'Can`t fetch torrents', 'Error')

          console.log(err)
        }
      }
    },

    mounted () {
      this.getTorrents()
    }
  }
</script>
