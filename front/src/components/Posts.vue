<template>
  <div class="mb-10">
    <v-row justify="center">
      <v-col md="6" class="">
        <transition-group name="fade">
          <Post v-for="post in posts" :postData="post" :key="post.id" class="mb-6"/>
        </transition-group>
      </v-col>
    </v-row>
    <v-row justify="center">
      <p v-if="end && !loading">
        No more posts.
        {{ !posts.length ? 'Try following someone!' : ''}}
      </p>
      <v-btn v-else color="primary" :loading="loading" @click="loadMore">Load more</v-btn>
    </v-row>
  </div>
</template>

<script>
  import axios from 'axios';
  import Post from './Post'

  export default {
    name: 'Posts',
    components: {
      Post
    },
    props: {
      all: {
        type: Boolean,
        default: true
      }
    },
    data: () => ({
      posts: [],
      loading: true,
      page: 0
    }),
    async created() {
      await this.fetch()
      this.page = 1
    },
    computed: {
      end() {
        return this.page * 5 >= this.posts.length
      }
    },
    methods: {
      async fetch() {
        this.loading = true;
        const {data: responseData} = await axios.get('/api/posts', {
          params: {
            all: this.all,
            page: this.page
          }
        })

        this.posts = [...this.posts, ...responseData.data];
        this.loading = false;
      },
      loadMore() {
        this.page++
        this.fetch()
      }
    }
  }
</script>

<style>
  .list-complete-item {
    transition: all 1s;
    display: inline-block;
    margin-right: 10px;
  }

  .list-complete-enter, .list-complete-leave-to {
    opacity: 0;
    transform: translateY(30px);
  }

  .list-complete-leave-active {
    position: absolute;
  }
</style>