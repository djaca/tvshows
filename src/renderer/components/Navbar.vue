<template>
  <header class="bg-oxford-blue md:flex md:items-center md:justify-between p-4 pb-0 shadow-md md:pb-4 mb-5">
    <div class="flex items-center justify-between mb-4 md:mb-0">
      <h4 class="leading-none text-lg text-nepal">
        <router-link
          to="/"
          class="no-underline text-nepal hover:text-black"
        >
          TV Shows
        </router-link>
      </h4>

      <a class="text-black hover:text-orange md:hidden" href="#">
        <i class="fa fa-2x fa-bars"></i>
      </a>
    </div>

    <nav>
      <ul class="list-reset md:flex md:items-center">
        <li :class="['md:ml-4', {invisible: !$route.params.season}]">
          <router-link
            v-if="$route.params.id"
            :to="{name: 'show', params: { id: $route.params.id }}"
            class="text-nepal hover:text-black"
          >
            <font-awesome-icon
              icon="arrow-left"
              size="lg"
            ></font-awesome-icon>
          </router-link>
        </li>

        <li class="md:ml-4">
          <router-link
            to="/browse"
            class="block py-2 text-nepal hover:text-black md:border-none md:p-0"
          >
            <font-awesome-icon
              icon="search"
              size="lg"
            ></font-awesome-icon>
          </router-link>
        </li>
      </ul>
    </nav>

  </header>
</template>

<script>
  import { library } from '@fortawesome/fontawesome-svg-core'
  import { faSearch, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
  library.add(faSearch, faArrowLeft)

  export default {
    name: 'Navbar'
  }
</script>

<style scoped>

</style>
