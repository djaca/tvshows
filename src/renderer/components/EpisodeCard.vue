<template>
  <div
    class="bg-ebony-clay rounded-lg shadow-md overflow-hidden flex-1 flex flex-col"
    :class="{'opacity-25': isWatched(episode)}"
  >
    <div
      class="bg-cover h-48"
      :style="image"
    >
      <button
        class="text-nepal hover:text-oxford-blue float-right mr-2 mt-2"
        @click="toggle(episode)"
      >
        <font-awesome-icon
          icon="eye"
          size="lg"
        />
      </button>
    </div>

    <div
      class="p-4 flex-1 flex flex-col text-nepal"
    >
      <div
        class="mb-4"
      >
        <h3
          class="text-2xl"
          v-text="item.name"
        ></h3>

        <div
          class="text-xs"
          v-text="humanTime(item.air_date)"
        ></div>
      </div>

      <div
        class="mb-4 text-sm flex-1"
      >
        <p
          v-text="item.overview"
        ></p>
      </div>

      <div
        class="mb-1"
      >
        <span
          class="text-xs float-right"
        >
          Episode {{ episode }}
        </span>
      </div>

      <div
        class="border-t border-grey-light text-sm"
      >
        <card-actions
          :item="{
            id: item.id,
            name: item.name,
            episode: item.episode_number
          }"
        />
      </div>
    </div>
  </div>
</template>

<script>
  import CardActions from '@/components/EpisodeCard/CardActions'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    name: 'episode-card',

    components: { CardActions },

    props: {
      item: {
        required: true,
        type: Object
      }
    },

    computed: {
      ...mapGetters('Watch', ['isWatched']),

      ...mapGetters('Show', ['date']),

      episode () {
        return this.item.episode_number
      },

      season () {
        return this.item.season_number
      },

      image () {
        if (this.item.still_path) {
          return { backgroundImage: `url('https://image.tmdb.org/t/p/w300${this.item.still_path}')` }
        }
      }
    },

    methods: {
      ...mapActions('Watch', ['toggle'])
    }
  }
</script>
