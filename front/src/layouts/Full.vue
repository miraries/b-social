<template>
    <v-app id="inspire">
        <v-navigation-drawer v-model="drawer" :clipped="true" :floating="true" app>
            <v-list dense>
                <v-list-item :to="'/'">
                    <v-list-item-action>
                        <v-icon>mdi-home</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>Home</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item :to="'about'">
                    <v-list-item-action>
                        <v-icon>mdi-contact-mail</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>About</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item :to="'zone-list'">
                    <v-list-item-action>
                        <v-icon>mdi-map-outline</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>Zone List</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item :to="'vehicle-list'">
                    <v-list-item-action>
                        <v-icon>mdi-moped</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>Vehicle List</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item :to="'vehicle-map'">
                    <v-list-item-action>
                        <v-icon>mdi-map</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>Vehicle Map</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item :to="'vehicle-riding-map'">
                    <v-list-item-action>
                        <v-icon>mdi-map-marker-distance</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>Vehicle Real Time Map</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item :to="'api-explorer'">
                    <v-list-item-action>
                        <v-icon>mdi-xbox-controller</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>API Explorer</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item :to="'multi-client'">
                    <v-list-item-action>
                        <v-icon>mdi-fingerprint</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>Multi Client</v-list-item-title>
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
            <v-toolbar-title>VOI Mapper</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon :light="!$vuetify.theme.dark" style="outline: none">
                <v-icon @click="toggleDark">mdi-weather-night</v-icon>
            </v-btn>
        </v-app-bar>

        <v-content>
            <v-container fluid>
                <v-fade-transition mode="out-in">
                    <router-view />
                </v-fade-transition>
            </v-container>
        </v-content>
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
        >{{ snackbar.text }}</v-snackbar>
    </v-app>
</template>

<script>
export default {
  name: 'FullLayout',
    props: {
        source: String
    },
    data: () => ({
        drawer: null,
        lightBarColor: "#ec6859",
        darkBarColor: "#5b130b"
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
