function page (path) {
  return () => import(/* webpackChunkName: '' */ `@/views/${path}`).then(m => m.default || m)
}

export default [
  // { path: '/', name: 'welcome', component: page('welcome.vue') },

  { path: '/', name: 'feed', component: page('feed.vue') },
  { path: '/login', name: 'login', component: page('login.vue') },
  { path: '/register', name: 'register', component: page('register.vue') },
  { path: '/register', name: 'register', component: page('register.vue') },

  { path: '*', component: page('404.vue') }
]