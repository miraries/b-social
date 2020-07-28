<template>
  <v-card flat>
    <v-card-title>{{ comment.user.name }}</v-card-title>
    <v-card-subtitle>{{ ago }}</v-card-subtitle>
    <v-card-text>{{ comment.text }}</v-card-text>
  </v-card>
</template>
<script>
  import moment from 'moment'

  export default {
    name: 'Comment',
    props: {
      commentData: {
        type: Object,
        validator: function (value) {
          const providedKeys = Object.keys(value)
          const required = ['id', 'userId', 'text', 'createdAt', 'updatedAt', 'user']

          return required.every(requiredKey => providedKeys.includes(requiredKey))
        }
      }
    },
    computed: {
      comment() {
        return this.commentData;
      },
      user() {
        return this.commentData.user;
      },
      ago() {
        return moment(this.comment.createdAt).fromNow()
      }
    }
  }
</script>
