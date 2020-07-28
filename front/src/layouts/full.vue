<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" :clipped="true" :floating="true" app>
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
      <v-toolbar-title>bSocial</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon :light="!$vuetify.theme.dark" style="outline: none">
        <v-icon @click="toggleDark">mdi-weather-night</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view/>
    </v-main>
    <!-- <v-footer
  color="indigo"
  app
>
  <span class="white--text">&copy; 2019</span>
    </v-footer>-->
    <v-snackbar
      v-model="snackbar.visible"
      bottom
      :color="snackbar.type"
      :timeout="5000"
    >{{ snackbar.text }}
    </v-snackbar>
  </v-app>
</template>

<script>
  export default {
    name: 'FullLayout',
    data: () => ({
      drawer: null,
      lightBarColor: "#5f72d9",
      darkBarColor: "#131a42"
    }),
    methods: {
      toggleDark() {
        const isDark = this.$vuetify.theme.dark;
        this.$vuetify.theme.dark = !isDark;
        document
          .querySelector("meta[name=theme-color]")
          .setAttribute(
            "content",
            isDark ? this.darkBarColor : this.lightBarColor
          );
      },
      async logout() {
        await this.$store.dispatch('logout')

        this.$router.push({name: 'login'})
      }
    },
    computed: {
      snackbar() {
        return this.$store.state.global_snackbar;
      }
    },
    created() {
      this.$vuetify.theme.dark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
    }
  };
</script>
