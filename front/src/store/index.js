import Vue from 'vue'
import Vuex from 'vuex'
import Cookies from 'js-cookie'
import axios from '../plugins/axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,
    token: Cookies.get('token'),
    global_snackbar: {
      type: '',
      text: '',
      visible: false
    },
    notifications: []
  },
  getters: {
    user: state => state.user,
    token: state => state.token,
    check: state => state.user !== null,
    notifications: state => state.notifications.reverse()
  },
  mutations: {
    saveToken(state, {token, remember}) {
      state.token = token
      Cookies.set('token', token, {expires: remember ? 365 : null})
    },
    updateUser(state, {user}) {
      state.user = user
    },
    logout(state) {
      state.user = null
      state.token = null

      Cookies.remove('token')
    },
    setGlobalSnackbar(state, {type, text}) {
      state.global_snackbar.type = type;
      state.global_snackbar.text = text;
      state.global_snackbar.visible = true;
    },
    addCommentNotification(state, message) {
      state.notifications.push(message)
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
      commit('setGlobalSnackbar', {
        type: 'info', text: 'Logged out'
      })
    },

    socket_commentNotification({commit}, notification) {
      console.log('[notification-socket]', {notification})
      commit('addCommentNotification', notification);
      commit('setGlobalSnackbar', {
        type: 'pink', text: 'You have a new notification!'
      })
    }
  },
  modules: {}
})
