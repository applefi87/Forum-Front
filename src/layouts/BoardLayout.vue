<template >
  <q-layout view="hHh lpR fff" id="m">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn class="lt-md" dense flat round icon="menu" @click="toggleLeftDrawer" />
        <q-toolbar-title>
          <q-btn flat @click="router.push('/630485bbbead5775ea3bc4aa')">
            <q-avatar class="gt-sm q-mr-sm">
              <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
            </q-avatar>
            師大課程版首頁
          </q-btn>
        </q-toolbar-title>
        <q-select class="langSelect gt-md" v-model="locale" :options="localeOptions" label="Language:" borderless
          emit-value map-options />
        <!-- https://quasar.dev/vue-components/button-dropdown -->
        <q-btn-dropdown v-if="users.token" class="info " dense flat label='個人資料'>
          <div class="row no-wrap q-pa-md">
            <q-btn label='變更密碼' color="primary" flat class="q-ml-sm" to="/changePWD" />
          </div>
          <div class="row no-wrap q-pa-md">
            <q-btn :label='t("logout")' color="primary c-w" @click="logout" flat class="q-ml-sm" />
          </div>
        </q-btn-dropdown>
        <q-btn-dropdown v-else class="login" dense flat icon="login" :label='t("login")' dropdown-icon="none"
          v-model="loginState">
          <div class="row no-wrap q-pa-md">
            <div class="column">
              <q-form @submit.prevent="login" class="q-gutter-xs">
                <q-input filled v-model="loginForm.account" :label='t("account")' lazy-rules
                  :rules="[val => val && val.length > 0 || t('cantNull')]" />
                <q-input filled v-model="loginForm.password" :label='t("password")' lazy-rules
                  :rules="[val => val && val.length > 0 || t('cantNull')]" :type="isPwd ? 'password' : 'text'">
                  <template v-slot:append>
                    <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                      @click="isPwd = !isPwd" />
                  </template>
                </q-input>
                <div>
                  <div style="height:50px">
                    <q-checkbox v-model="loginForm.keepLogin" :label='t("keepLogin")' size="xs" color="green" />
                    <q-btn label="忘記密碼?" type="submit" color="primary" class="f-r" flat to="/forgetPWD" />
                  </div>
                  <q-btn :label='t("login")' type="submit" color="primary" />
                  <q-btn :label='t("register")' color="primary" flat class="q-ml-sm" @click="registerState = true" />
                </div>
              </q-form>
            </div>
          </div>
        </q-btn-dropdown>

        <q-btn class="lt-lg" dense flat round icon="settings" @click="toggleRightDrawer" />
      </q-toolbar>
    </q-header>
    <!-- ******************************************************** -->
    <q-drawer v-model='leftDrawerState' side="left" persistent bordered no-swipe-open no-swipe-close show-if-above
      :breakpoint="767" style="height: 100% ;display:flex;flex-direction: column">
      <h5 class="q-my-lg">{{ title }}{{ time }}</h5>
      <div style="height: 100% ;display:flex;flex-direction: column; justify-content: space-between;">
        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="board">
            <div v-if="hasChild" class="searchRows">
              <q-select outlined v-model="filterUnique" :options="filterUniqueOptions" label="學期" dense options-dense
                :behavior="$q.platform.is.ios === true ? 'dialog' : 'menu'" />
              <div>
                <q-select outlined v-model="filterC0" :options="filterOptions" label="開課系所" dense options-dense
                  :disable="filterAll" :behavior="$q.platform.is.ios === true ? 'dialog' : 'menu'" />
                <q-checkbox v-model="filterAll" label="全部系所" />
              </div>
              <br>
              <q-btn :loading="getChildboardLoading" color="red" @click="getChildboard" label="查詢">
                <template v-slot:getChildboardLoading>
                  Loading...
                </template>
              </q-btn>
              <div style="text-align: right">
                <q-btn v-if="users.role === 0" label='新增板塊' color="orange" class="q-ml-sm"
                  :to="'/board/uploadBoard/' + route.params.id" />
              </div>
            </div>
            <div v-if="hasArticle">
              <!-- 先不過濾全抓  要評價再顯示table供選-->
              <!-- <q-select outlined v-model="filterUnique" :options="filterUniqueOptions" label="學期" dense options-dense
          :behavior="$q.platform.is.ios === true ? 'dialog' : 'menu'" />
        <q-select outlined v-model="filterC0" :options="filterOptions" label="開課系所" dense options-dense
          :disable="filterAll" :behavior="$q.platform.is.ios === true ? 'dialog' : 'menu'" />
        <q-checkbox v-model="filterAll" label="全部系所" /> -->
              <br>
              <q-btn v-if="users.token" @click="publishArticleState = true" color="orange" label="給評價" />
              <q-btn v-else @click="loginDropdownState = true" color="orange" label="給評價" />
            </div>
          </q-tab-panel>
          <q-tab-panel name="article">
            <div class="text-h6">Alarms</div>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </q-tab-panel>
          <q-tab-panel name="edit">
            <div class="text-h6">Movies</div>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </q-tab-panel>
        </q-tab-panels>
        <q-tabs v-model="tab" indicator-color="transparent" active-color="white" active-bg-color="teal-4"
          class="bg-teal text-grey-5 shadow-2" dense>
          <q-tab name="board" label="board" />
          <q-tab name="article" label="article" />
          <q-tab name="edit" label="edit" />
        </q-tabs>
      </div>
    </q-drawer>
    <q-drawer v-model='rightDrawerState' side="right" bordered :width="300" no-swipe-open no-swipe-close>
      <q-select v-model="locale" :options="localeOptions" label="Language:" borderless emit-value map-options />
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
    <!--****************** 彈出視窗 ------>
    <!-- 註冊對話框 -->
    <registerDialog></registerDialog>
    <!-- 發布文章框 -->
    <publishArticle></publishArticle>
  </q-layout>
</template>

<script setup>
import { ref, reactive, shallowRef, provide, readonly } from 'vue'
import registerDialog from 'src/components/registerDialog.vue'
import publishArticle from 'src/components/publishArticle.vue'
import { useQuasar } from 'quasar'
import notify from 'src/utils/notify'
import { useI18n } from 'vue-i18n'
import { useUserStore } from 'src/stores/user'
// import { useBoardStore } from 'src/stores/board'
import { useRoute, useRouter } from 'vue-router'
import { api } from 'src/boot/axios'
const route = useRoute()
const router = useRouter()
const users = useUserStore()
// *********************************************************************Header
// 增加多國語言可選+讀取預設語言
const isPwd = ref(true)
const registerState = ref(false)
const loginState = ref(false)
const publishArticleState = ref(false)
const localeOptions = [
  { value: 'en-US', label: 'English' },
  { value: 'zh-TW', label: '繁體中文' }
]
const { locale, t } = useI18n({ useScope: 'global' })
locale.value = useQuasar().lang.getLocale()
// 切換左右選單顯示
const leftDrawerState = ref(false)
const rightDrawerState = ref(false)
const toggleLeftDrawer = () => {
  leftDrawerState.value = !leftDrawerState.value
}
const toggleRightDrawer = () => {
  rightDrawerState.value = !rightDrawerState.value
}
// ********************
const loginForm = reactive({ account: 'testadmin', password: 'testadminA0', keepLogin: false })
// ****************登陸****
const login = async () => {
  const rep = await users.login(loginForm)
  notify(rep)
  if (rep.success) {
    loginForm.account = ''
    loginForm.password = ''
    loginForm.keepLogin = false
    router.push('/')
  }
}
//* ***************登出****
const logout = async () => {
  const rep = await users.logout()
  notify(rep)
}
// *********************************************左側介面+子版清單************************
// #透過網址，取得版的資訊+過濾功能
const tab = ref('board')
const title = ref('')
const hasChild = ref(false)
const hasArticle = ref(false)
const board = reactive({})
const boards = reactive([])
const article = reactive({})
const articles = reactive([])
const filterC0 = ref('')
const filterAll = ref(false)
const filterOptions = shallowRef([])
// 之後再自動抓
const filterUnique = ref('')
const filterUniqueOptions = shallowRef([])
const time = ref(0)
const init = async (id) => {
  time.value = Date.now()
  // id 是為了頁內跳轉，有時網址變了不會觸發init，所以改function
  try {
    boards.length = 0
    const { data } = await api.get('/board/' + (id || route.params.id || '63044667fad0c0b669bbafdd'))
    if (data.result) {
      // 清空物件與加入物件的美妙
      for (const k in board) delete board[k]
      Object.assign(board, data.result)
      //
      title.value = data.result.title
      if (data.result.childBoard.active) {
        hasChild.value = true
        filterOptions.value = data.result.childBoard.rule.display.filter?.dataCol?.c0 || [0]
        filterUniqueOptions.value = data.result.childBoard.rule.display.filter?.uniqueCol?.c80 || [0]
        filterUnique.value = filterUniqueOptions.value[0]
      } else {
        filterOptions.value = []
        filterUniqueOptions.value = []
        hasChild.value = false
      }
      // 處理文章(規則去他母版抓)
      // 有成功才顯示不然清除
      const getArticles = async () => {
        // 要有母版
        if (data.result.parent) {
          const parent = await api.get('/board/' + data.result.parent)
          for (const k in article) delete article[k]
          Object.assign(article, parent.data.result.childBoard?.article)
          // article = parent.data.result.childBoard?.article
          console.log('母版是' + parent.data.result.title)
          // 母版要開放文章
          if (article.active) {
            console.log('有文章區')
            hasArticle.value = true
            // ********************************************* 取得文章 ************************
            const { data } = await api.get('/article/' + (id || route.params.id))
            articles.length = 0
            articles.push(...data.result)
          }
          return
        }
        hasArticle.value = false
        for (const k in article) {
          delete article[k]
        }
      }
      getArticles()
    }
    filterC0.value = filterOptions.value[0]
    time.value = Date.now() - time.value
    //
  } catch (error) {
    console.log(error)
    router.push('/404')
  }
}
init()
// *********************************************取得子版************************
const getChildboardLoading = ref(false)
const getChildboard = async () => {
  try {
    getChildboardLoading.value = true
    const encodedFilter = encodeURI(JSON.stringify({
      filterData: [{
        col: 'c0',
        text: filterC0.value,
        all: filterAll.value
      }],
      filterUnique: [{
        col: 'c80',
        text: filterUnique.value
      }]
    }))
    const { data } = await api.get('/board/childs/' + (route.params.id ? route.params.id : '62fc99277f3adbe07e542a58') + '?' + 'test=' + encodedFilter)
    boards.length = 0
    boards.push(...data.result)
  } catch (error) {
    console.log(error)
  }
  getChildboardLoading.value = false
}
provide('registerState', registerState)
provide('publishArticleState', publishArticleState)
provide('board', readonly(board))
provide('boards', readonly(boards))
provide('articles', readonly(articles))
provide('hasChild', readonly(hasChild))
provide('hasArticle', readonly(hasArticle))
provide('article', readonly(article))
// *********************************************子文章************************
</script>
<style lang="sass" scoped >
.q-header
  height: 48px
.f-r
  float: right
.c-w
  &:deep(.block)
    color: black
// $
@import 'src/css/mixin.sass'
.searchRows > .row
  margin-bottom: 30px
.langSelect
  width: 100px
  &:deep() *
    color: white
.f-r
  float: right
.c-w
  &:deep(.block)
    color: black
.q-drawer-container
  &:deep(.q-drawer)
    top: 48px
    @include xs
      width: 90% !important
  &:deep(.q-drawer__backdrop)
    z-index: 1999 !important
</style>
