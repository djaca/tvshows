export default {
  methods: {
    goTo (name, params) {
      this.$router.push({name, params})
    }
  }
}
