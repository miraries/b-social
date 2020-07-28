import axios from 'axios'
import store from '@/store'
import router from '@/router'
import Swal from 'sweetalert2'

axios.interceptors.request.use(request => {
  const token = store.getters.token

  if (token) {
    request.headers.common['Authorization'] = `Bearer ${token}`
  }

  return request
})

axios.interceptors.response.use(response => response, error => {
  const { status } = error.response

  if (status >= 500) {
    Swal.fire({
      type: 'error',
      title: 'Server error',
      text: 'Try again later'
    })
  }

  if (status === 401 && store.getters['auth/check']) {
    Swal.fire({
      type: 'warning',
      title: 'Session expired',
      text: 'Please login to continue',
      confirmButtonText: 'Login',
    }).then(() => {
      store.commit('auth/LOGOUT')

      router.push({ name: 'login' })
    })
  }

  return Promise.reject(error)
})