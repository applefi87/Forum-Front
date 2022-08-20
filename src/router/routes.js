const routes = [
  {
    path: '/',
    displayName: 'main',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: 'forgetPWD', displayName: 'forgetPWD', component: () => import('pages/forgetPWDPage.vue') },
      { path: 'changePWD', displayName: 'changePWD', component: () => import('pages/changePWDPage.vue') },
      { path: ':id', displayName: 'mainPage', component: () => import('pages/IndexPage.vue') }
    ]
  },
  {
    path: '/admin',
    displayName: 'admin',
    component: () => import('layouts/adminLogin.vue')
  },
  {
    path: '/404',
    name: '404',
    component: () => import('src/pages/ErrorNotFound.vue'),
    meta: {
      title: '購物網 | 404',
      login: false,
      admin: false
    }
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    redirect: '/404'
  }
]

export default routes
