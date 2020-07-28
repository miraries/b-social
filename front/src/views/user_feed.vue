<template>
  <div>
    <Posts :all="true"/>
  </div>
</template>

<script>
  import Posts from "@/components/Posts";

  export default {
    name: 'UserFeed',
    layout: 'full',
    middleware: 'auth',
    metaInfo() {
      return {title: 'User feed'}
    },
    components: {
      Posts
    }
  }
</script>
