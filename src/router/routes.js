const routes = [
  {
    path: '/',
    displayName: 'main',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: 'changePWD', displayName: 'changePWD', component: () => import('pages/changePWDPage.vue') },
      { path: 'forgetPWD', displayName: 'forgetPWD', component: () => import('pages/forgetPWDPage.vue') },
      {
        path: 'board/',
        displayName: 'board',
        component: () => import('layouts/BoardLayout.vue'),
        children: [
          { path: 'uploadBoard/:id', displayName: 'uploadBoard', component: () => import('pages/uploadBoardPage.vue') },
          { path: ':id', displayName: 'mainPage', component: () => import('pages/IndexPage.vue') }]
      }

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
