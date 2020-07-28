function page (path) {
  return () => import(/* webpackChunkName: '' */ `@/views/${path}`).then(m => m.default || m)
}

export default [
  // { path: '/', name: 'welcome', component: page('welcome.vue') },

  { path: '/home', name: 'home', component: page('feed.vue') },
  { path: '/', component: page('feed.vue'), alias: 'home' },

  { path: '/feed', name: 'filteredFeed', component: page('filtered_feed.vue') },
  { path: '/user_feed/:id', name: 'userFeed', component: page('user_feed.vue') },
  
  { path: '/login', name: 'login', component: page('login.vue') },
  { path: '/register', name: 'register', component: page('register.vue') },

  { path: '*', component: page('not_found.vue') }
]