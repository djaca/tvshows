import { mapActions } from 'vuex'

export default {
  methods: {
    ...mapActions('Torrent', ['download']),

    doDownload (magnet) {
      this.download({
        id: this.item.id,
        episodeName: this.item.name,
        episode: this.item.episode,
        magnet
      })

      this.$emit('close')
    }
  }
}
