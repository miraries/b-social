<template>
  <v-row
    align="center"
    justify="center"
  >
    <v-col
      cols="12"
      sm="8"
      md="4"
    >
      <h1 class="font-weight-black indigo--text text-h2">
        bSocial
      </h1>
      <h1 class="font-weight-black indigo--text mb-6 text-subtitle-1 text--lighten-2">
        Your favorite social network
      </h1>
      <v-form @submit.prevent="login">
        <v-card class="elevation-12">
          <v-toolbar
            color="grey darken-4"
            dark
            flat
          >
            <v-toolbar-title>Login to your account</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-card-text>
            <v-text-field
              label="E-mail"
              name="email"
              prepend-icon="mdi-account"
              type="text"
              v-model="email"
              :error="hasError"
            ></v-text-field>

            <v-text-field
              id="password"
              label="Password"
              name="password"
              prepend-icon="mdi-lock"
              type="password"
              v-model="password"
              :error="hasError"
            ></v-text-field>

            <v-alert v-if="error" type="error">
              {{ error }}
            </v-alert>
          </v-card-text>
          <v-card-actions class="pa-6">
            <router-link :to="{name: 'register'}" id="registerLink">
              No account? Register here.
            </router-link>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              type="submit"
            >
              Login
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-col>
  </v-row>
</template>

<script>
  import axios from 'axios'

  export default {
    name: 'Login',
    middleware: 'guest',
    layout: 'basic',
    metaInfo() {
      return {title: 'Login'}
    },
    data: () => ({
      email: '',
      password: '',
      error: null
    }),
    computed: {
      hasError() {
        return !!this.error;
      }
    },
    methods: {
      async login() {
        try {
          const {data} = await axios.post('/api/auth/login', {
            email: this.email,
            password: this.password
          })

          await this.$store.dispatch('saveToken', {
            token: data.token
          })

          await this.$store.dispatch('fetchUser')

          this.$store.commit('setGlobalSnackbar', {
            type: 'info', text: 'Logged in'
          })

          this.$router.push({name: 'home'})
        } catch (error) {
          this.error = error.response.data.error
        }
      }
    }
  }
</script>

<style>
  #registerLink {
    text-decoration: none;
  }

  #registerLink:hover {
    text-decoration: underline;
  }
</style>
