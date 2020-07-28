<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawerRight"
      app
      right
    >
      <v-list>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="font-weight-medium text-h5">
              Notifications
            </v-list-item-title>
            <span class="subtitle-1">
              <span>{{ $socket.connected ? 'Connected' : 'Disconnected' }}</span>
            </span>
          </v-list-item-content>
        </v-list-item>
        <v-list-item three-line v-for="{ user, comment } in $store.getters.notifications" :key="comment.id">
          <v-list-item-content>
            <v-list-item-title class="d-flex">
              <FollowDialog :user="user" :useBtn="false" class="mr-1"/>
              <span class="text-wrap">left you a comment</span>
            </v-list-item-title>
            <v-list-item-subtitle class="subtitle-2">
              {{ comment.text }}
            </v-list-item-subtitle>
            <v-list-item-subtitle class="indigo--text text--lighten-2 text-caption">
              {{ ago(comment.createdAt) }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-navigation-drawer v-model="drawer" clipped floating app>
      <v-list dense>
        <v-list-item :to="{ name: 'home' }">
          <v-list-item-action>
            <v-icon>mdi-home</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item :to="{ name: 'filteredFeed'}">
          <v-list-item-action>
            <v-icon>mdi-comment-quote</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Your feed</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item :to="{ name: 'createPost' }">
          <v-list-item-action>
            <v-icon>mdi-comment-text</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>New post</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-action>
            <v-icon>mdi-comment-text-multiple</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Your posts</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="logout">
          <v-list-item-action>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      app
      :color="$vuetify.theme.dark ? darkBarColor : lightBarColor"
      :clipped-left="true"
      dark
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>bSocial · 
        <span class="font-weight-bold">
          {{ $store.getters.user.name }}
        </span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon :light="!$vuetify.theme.dark" style="outline: none" @click="toggleDark">
        <v-icon>mdi-weather-night</v-icon>
      </v-btn>
      <v-btn icon @click="drawerRight = !drawerRight">
        <v-icon>{{ drawerRight ? 'mdi-bell' : 'mdi-bell-outline' }}</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view/>
    </v-main>

    <v-snackbar
      v-model="snackbar.visible"
      bottom
      :color="snackbar.type"
      :timeout="5000"
    >{{ snackbar.text }}
      <template v-slot:action="{ attrs }">
        <v-btn
          text
          v-bind="attrs"
          @click="snackbar.visible = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script>
  import moment from 'moment'
  import FollowDialog from '@/components/FollowDialog'

  export default {
    name: 'FullLayout',
    components: {
      FollowDialog
    },
    data: () => ({
      drawer: null,
      drawerRight: false,
      lightBarColor: "#5f72d9",
      darkBarColor: "#131a42"
    }),
    methods: {
      toggleDark() {
        const isDark = this.$vuetify.theme.dark;
        this.$vuetify.theme.dark = !isDark;

        // Use only for PWAs, disabled for this project
        // document
        //   .querySelector("meta[name=theme-color]")
        //   .setAttribute(
        //     "content",
        //     isDark ? this.darkBarColor : this.lightBarColor
        //   );
      },
      async logout() {
        await this.$store.dispatch('logout')

        this.$router.push({name: 'login'})
      },
      setupSocketIo() {
        this.$socket.client.open();
      },
      ago(timestamp) {
        return moment(timestamp).fromNow()
      }
    },
    computed: {
      snackbar() {
        return this.$store.state.global_snackbar;
      }
    },
    created() {
      this.setupSocketIo()
      this.$vuetify.theme.dark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
    }
  };
</script>
