<template>
  <div class="text-center">
    <v-menu
      v-model="menu"
      :close-on-content-click="false"
      :nudge-width="200"
      offset-x
    >
      <template v-slot:activator="{ on, attrs }">
        <!--        <a-->
        <!--          class="headline text&#45;&#45;primary"-->
        <!--          id="userLink"-->
        <!--          v-bind="attrs"-->
        <!--          v-on="on"-->
        <!--        >-->
        <!--          {{ post.user.name }}-->
        <!--        </a>-->
        <v-btn
          color="indigo"
          text
          v-bind="attrs"
          v-on="on"
        >
          {{ user.name }}
        </v-btn>
      </template>

      <v-card>
        <v-list>
          <v-list-item>
            <v-list-item-avatar>
              <img src="https://cdn.vuetifyjs.com/images/john.jpg" alt="John">
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>{{ user.name }} {{ yourself ? '(You)' : '' }}</v-list-item-title>
              <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-action v-if="!yourself">
              <v-progress-circular
                indeterminate
                color="red"
                v-if="loading"
              ></v-progress-circular>
              <v-btn
                v-else
                :class="followed ? 'red--text' : ''"
                icon
                @click="toggleFollow"
              >
                <v-icon>mdi-heart</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list>
          <v-list-item>
            <v-list-item-title>Joined {{ joinedAt }}</v-list-item-title>
          </v-list-item>
        </v-list>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn text @click="menu = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
  </div>
</template>

<script>
  import moment from 'moment'
  import axios from 'axios'

  export default {
    name: 'FollowDialog',
    props: {
      user: {
        type: Object,
        required: true
      }
    },
    data: () => ({
      loading: true,
      followed: true,
      menu: false,
    }),
    computed: {
      joinedAt() {
        return moment(this.user.createdAt).from()
      },
      yourself() {
        return this.$store.getters.user.id === this.user.id
      }
    },
    watch: {
      menu() {
        this.checkFollow()
      }
    },
    methods: {
      async checkFollow() {
        if (this.yourself)
          return false

        this.loading = true
        const {data} = await axios.get(`/api/users/${this.user.id}/follow`)

        this.followed = data.isFollowing
        this.loading = false
      },
      async toggleFollow() {
        try {
          this.loading = true
          const method = this.followed ? 'unfollow' : 'follow'

          const {data} = await axios.post(`/api/users/${this.user.id}/${method}`)

          this.followed = !this.followed
          this.$store.commit('setGlobalSnackbar', {
            type: 'info', text: data.message
          })
        } catch (error) {
          this.$store.commit('setGlobalSnackbar', {
            type: 'error', text: error.response.message ?? 'Server Error'
          })
        } finally {
          this.loading = false
        }
      }
    }
  }
</script>

<style>

</style>