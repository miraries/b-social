<template>
  <v-card
    class="mx-auto"
  >
    <v-card-title>
      <FollowDialog :user="user"/>
      <span class="text-subtitle-2 ml-4">{{ ago }}</span>
    </v-card-title>

    <v-divider class="mx-4"></v-divider>

    <v-card-text style="padding-bottom: 0;">
      <div class="text--primary">
        {{ post.text }}
      </div>

      <v-divider class="mt-6" v-if="showComments"></v-divider>

      <AddComment class="mt-6" :postId="post.id" @valid="commentValid = $event" @text="commentText = $event"/>

      <transition name="fade">
        <div v-if="showComments" class="mt-3">
          <Comment v-for="comment in comments" :commentData="comment" :key="comment.id"/>
        </div>
      </transition>
    </v-card-text>

    <v-card-actions style="padding-top: 0;">
      <v-spacer/>
      <v-btn
        color="secondary"
        @click="showComments = !showComments"
        :disabled="!hasComments"
      >
        {{ hasComments ? showComments ? 'Hide' : 'Show' : 'No'}} Comments ({{ comments.length }})
      </v-btn>
      <v-btn
        color="primary"
        :disabled="!commentValid"
        @click="addComment"
      >
        Add Comment
      </v-btn>
    </v-card-actions>

  </v-card>
</template>

<script>
  import axios from 'axios'
  import moment from 'moment'
  import Comment from "./Comment";
  import AddComment from "./AddComment";
  import FollowDialog from './FollowDialog'

  // import Comment from '@/components/Comments'

  export default {
    name: 'Post',
    components: {
      AddComment,
      Comment,
      FollowDialog
    },
    props: {
      postData: {
        type: Object,
        validator: function (value) {
          const providedKeys = Object.keys(value)
          const required = ['id', 'userId', 'text', 'createdAt', 'updatedAt', 'user', 'comments']

          return required.every(requiredKey => providedKeys.includes(requiredKey))
        }
      }
    },
    data() {
      return {
        showComments: false,
        commentValid: false,
        commentText: null,
        comments: this.postData.comments
      }
    },
    methods: {
      async addComment() {
        const {data} = await axios.post(`/api/posts/${this.post.id}/comments`, {
          text: this.commentText
        })

        this.comments.push(data)
        this.showComments = true

        this.$store.commit('setGlobalSnackbar', {
          type: 'info', text: 'Added comment'
        })
      }
    },
    computed: {
      post() {
        return this.postData;
      },
      hasComments() {
        return !!this.comments.length
      },
      user() {
        return this.postData.user;
      },
      ago() {
        return moment(this.post.createdAt).fromNow()
      }
    }
  }
</script>

<style>
  #userLink {
    text-decoration: none;
  }

  #userLink:hover {
    text-decoration: underline;
  }

  .fade-enter-active {
    transition: opacity .5s;
  }

  .fade-leave-active {
    transition: opacity .1s;
  }

  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>