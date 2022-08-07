const routes = [
  {
    path: '/',
    displayName: 'main',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', displayName: 'mainPage', component: () => import('pages/IndexPage.vue') },
      { path: 'forgetPWD', displayName: 'forgetPWD', component: () => import('pages/forgetPWDPage.vue') }
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
