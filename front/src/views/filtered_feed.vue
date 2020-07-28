<template>
  <div>
    <v-row>
      <v-col md="3" offset="3" class="mt-10">
        <h1 class="display-2 indigo--text">Your feed</h1>
        <h1 class="subtitle-1 indigo--text">Posts from people you follow</h1>
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
