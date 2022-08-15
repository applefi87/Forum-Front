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
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('src/pages/ErrorNotFound.vue')
  }
]

export default routes
