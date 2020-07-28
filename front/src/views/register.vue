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
      <v-form @submit.prevent="register" v-model="valid">
        <v-card class="elevation-12">
          <v-toolbar
            color="grey darken-4"
            dark
            flat
          >
            <v-toolbar-title>Register</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-card-text>
            <v-text-field
              label="Name"
              name="name"
              prepend-icon="mdi-account"
              type="text"
              v-model="name"
              :rules="nameRules"
            ></v-text-field>

            <v-text-field
              label="E-mail"
              name="email"
              prepend-icon="mdi-at"
              type="email"
              v-model="email"
              :rules="emailRules"
              required
              :error-messages="errors.email"
            ></v-text-field>

            <v-text-field
              id="password"
              label="Password"
              name="password"
              prepend-icon="mdi-lock"
              type="password"
              v-model="password"
              :rules="passwordRules"
            ></v-text-field>

            <v-text-field
              id="passwordConfirm"
              label="Confirm password"
              name="password_confirm"
              prepend-icon="mdi-lock-alert"
              type="password"
              v-model="confirmPassword"
              :rules="passwordConfirmationRule"
            ></v-text-field>

            <!--            <v-alert v-if="error" type="error">-->
            <!--              {{ error }}-->
            <!--            </v-alert>-->
          </v-card-text>
          <v-card-actions class="pa-6">
            <router-link :to="{name: 'login'}" id="loginLink">
              Have an account? Login here.
            </router-link>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              type="submit"
              :disabled="!valid"
            >
              Register
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-col>
  </v-row>
</template>

<script>
  import axios from 'axios'
  import Swal from 'sweetalert2'

  export default {
    name: 'Register',
    middleware: 'guest',
    layout: 'basic',
    metaInfo() {
      return {title: 'Register'}
    },
    data() {
      return {
        valid: false,
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        apiErrors: [],
        emailRules: [
          v => !!v || 'E-mail is required',
          v => /.+@.+/.test(v) || 'E-mail must be valid',
        ],
        nameRules: [
          v => !!v || 'Name is required',
          v => v.length <= 128 || 'Name must be less than 128 characters',
        ],
        passwordRules: [
          v => !!v || 'Password is required',
          v => v.length >= 8 || 'Password must have at least 8 characters'
        ]
      }
    },
    computed: {
      passwordConfirmationRule() {
        return [(this.password === this.confirmPassword) || 'Password must match']
      },
      errors() {
        if(this.apiErrors?.error)
          return {email: this.apiErrors?.error}

        return this.apiErrors?.details ?? {}
      }
    },

    methods: {
      async register() {
        try {
          const {data} = await axios.post('/api/auth/register', {
            name: this.name,
            email: this.email,
            password: this.password
          })

          await this.$store.dispatch('saveToken', {
            token: data.token
          })

          await this.$store.dispatch('updateUser', {user: data.user})

          Swal.fire(
            'Registered!',
            'You are automatically logged in',
            'success'
          )

          this.$router.push({name: 'home'})
        } catch (error) {
          this.apiErrors = error.response.data
        }
      }
    }
  }
</script>

<style>
  #loginLink {
    text-decoration: none;
  }

  #loginLink:hover {
    text-decoration: underline;
  }
</style>