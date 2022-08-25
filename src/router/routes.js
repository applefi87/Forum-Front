const routes = [
  {
    path: '/',
    displayName: 'home',
    name: 'home',
    component: () => import('layouts/HomeLayout.vue'),
    children: [
      { path: 'changePWD', name: 'changePWD', displayName: 'changePWD', component: () => import('pages/changePWDPage.vue') },
      { path: 'forgetPWD', name: 'forgetPWD', displayName: 'forgetPWD', component: () => import('pages/forgetPWDPage.vue') },
      { path: 'admin', name: 'admin', displayName: 'admin', component: () => import('layouts/adminLogin.vue') }
    ]
  },
  {
    path: '/board/',
    name: 'board',
    displayName: 'board',
    component: () => import('layouts/BoardLayout.vue'),
    children: [
      { path: 'uploadBoard/:id', name: 'uploadBoard', displayName: 'uploadBoard', component: () => import('pages/uploadBoardPage.vue') },
      { path: 'articles/:id', name: 'articles', displayName: 'articles', component: () => import('pages/articlePage.vue') },
      { path: ':id', name: 'boards', displayName: 'boards', component: () => import('pages/boardPage.vue') }
    ]
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
