<template>
  <div>
    <v-row>
      <v-col md="3" offset="3" class="mt-3">
        <h1>Your feed</h1>
      </v-col>
    </v-row>
    <Posts :all="false"/>
  </div>
</template>

<script>
  import Posts from "@/components/Posts";

  export default {
    name: 'Feed',
    layout: 'full',
    middleware: 'auth',
    components: {
      Posts
    },
    metaInfo() {
      return {title: 'Feed'}
    },
  }
</script>
