import Vue from 'vue'
import Vuex from 'vuex'
import Cookies from 'js-cookie'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,
    token: Cookies.get('token')
  },
  getters: {
    user: state => state.user,
    token: state => state.token,
    check: state => state.user !== null
  },
  mutations: {
    saveToken(state, {token, remember}) {
      state.token = token
      Cookies.set('token', token, {expires: remember ? 365 : null})
    },

    logout(state) {
      state.user = null
      state.token = null

      Cookies.remove('token')
    },

    updateUser(state, {user}) {
      state.user = user
    }
  },
  actions: {
    saveToken({commit}, payload) {
      commit('saveToken', payload)
    },

    async fetchUser({commit}) {
      try {
        const {data} = await axios.get('/api/users/profile')

        commit('updateUser', {user: data})
      } catch (e) {
        console.log(e)
      }
    },

    async logout({commit}) {
      try {
        await axios.post('/api/auth/logout')
      } catch (e) {
        console.log(e)
      }

      commit('logout')
    }
  },
  modules: {}
})
