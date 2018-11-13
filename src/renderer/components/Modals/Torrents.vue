<template>
  <div class="p-4">
    <table class="w-full text-left">
      <thead>
      <tr>
        <th class="py-3 px-4 bg-grey-lighter font-sans font-medium uppercase text-sm text-grey border-b border-grey-light">
          Name
        </th>
        <th class="py-3 px-4 bg-grey-lighter font-sans font-medium uppercase text-sm text-grey border-b border-grey-light"></th>
        <th class="py-3 px-4 bg-grey-lighter font-sans font-medium uppercase text-sm text-grey border-b border-grey-light w-32">
          Size
        </th>
        <th class="py-3 px-4 bg-grey-lighter font-sans font-medium uppercase text-sm text-grey border-b border-grey-light">
          Seeders
        </th>
        <th class="py-3 px-4 bg-grey-lighter font-sans font-medium uppercase text-sm text-grey border-b border-grey-light">
          Leechers
        </th>
      </tr>
      </thead>
      <tbody>
      <tr class="hover:bg-blue-lightest" v-for="torrent in torrents">
        <td class="py-3 px-4 border-b border-grey-light">{{ torrent.name }}</td>
        <td class="py-3 px-4 border-b border-grey-light text-center">
          <button class="text-blue float-right" @click="downloadTorrent(torrent)">
            <font-awesome-icon icon="download" size="lg"></font-awesome-icon>
          </button>
        </td>
        <td class="py-3 px-4 border-b border-grey-light">{{ torrent.size }}</td>
        <td class="py-3 px-4 border-b border-grey-light">{{ torrent.seeders }}</td>
        <td class="py-3 px-4 border-b border-grey-light">{{ torrent.leechers }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  export default {
    name: 'Torrents',

    props: {
      torrents: Array
    },

    methods: {
      downloadTorrent (torrent) {
        this.$store.dispatch('Torrent/download', torrent)

        this.$emit('close')
      }
    }
  }
</script>
