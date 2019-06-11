<template>
  <table>
    <thead>
    <slot name="columns">
      <th v-for="column in columns">{{ column }}</th>
    </slot>
    </thead>
    <tbody>
    <template v-for="item in items">
      <tr>
        <slot :row="item">
          <td
            v-for="column in columns"
          >
            {{ item[column] }}
          </td>
        </slot>
      </tr>
    </template>
    </tbody>
  </table>
</template>

<script>
  export default {
    name: 'VTable',

    props: {
      columns: {
        type: Array,
        default: () => []
      },

      items: {
        type: Array,
        default: () => []
      }
    }
  }
</script>
