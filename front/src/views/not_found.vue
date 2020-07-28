<template>
  <v-row
    align="center"
    justify="center"
  >
    <v-col
      cols="12"
      sm="8"
      md="4"
    >
      <v-alert type="error">
        Page not found
      </v-alert>
      <div class="d-flex justify-end">
        <v-btn :to="{name: 'home'}">
          Go home
        </v-btn>
      </div>
    </v-col>
  </v-row>
</template>

<script>
  export default {
    name: "PageNotFound",
    layout: 'basic',
    metaInfo() {
      return {title: 'Not found'}
    },
  }
</script>

<style scoped>

</style>