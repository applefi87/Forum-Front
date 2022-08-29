<template >
  <q-layout view="hHh lpR fff" id="m">
    <q-header elevated class="bg-primary text-white">
      <headerPage :leftDrawerActive="leftDrawerActive"></headerPage>
    </q-header>
    <!-- ******************************************************** -->
    <q-drawer v-model='leftDrawerState' side="left" persistent bordered no-swipe-open no-swipe-close show-if-above
      :breakpoint="767" style="height: 100% ;display:flex;flex-direction: column">
      <h6 class="q-my-lg q-mx-md muitiline" style="-webkit-line-clamp: 3;">{{  title  }}
      </h6>
      <chartInfo v-if="boardInfoForm.score && boardInfoForm.score >= 0" :form="boardInfoForm" />
      <div style="display:flex;flex-direction: column; justify-content: space-between; flex-grow: 1">
        <q-tab-panels v-model="tab">
          <q-tab-panel name="boards" v-if="hasChild" class="searchRows">
            <q-select outlined v-model="filterUnique" :options="filterUniqueOptions" label="學期" dense options-dense
              :behavior="$q.platform.is.ios === true ? 'dialog' : 'menu'" />
            <div>
              <q-select outlined v-model="filterC0" :options="filterOptions" label="開課系所" dense options-dense
                :disable="filterAll" :behavior="$q.platform.is.ios === true ? 'dialog' : 'menu'" />
              <q-checkbox v-model="filterAll" :label="t('all')" />
            </div>
            <br>
            <q-btn :loading="getChildboardLoading" color="primary" @click="getChildboard" :label="t('search')">
              <template v-slot:getChildboardLoading>
                Loading...
              </template>
            </q-btn>
          </q-tab-panel>
          <q-tab-panel name="articles" v-if="hasArticle">
            <!-- 先不過濾全抓  要評價再顯示table供選-->
            <!-- <q-select outlined v-model="filterUnique" :options="filterUniqueOptions" label="學期" dense options-dense
          :behavior="$q.platform.is.ios === true ? 'dialog' : 'menu'" />
        <q-select outlined v-model="filterC0" :options="filterOptions" label="開課系所" dense options-dense
          :disable="filterAll" :behavior="$q.platform.is.ios === true ? 'dialog' : 'menu'" />
        <q-checkbox v-model="filterAll" label="全部系所" /> -->
            <br>
            <q-btn v-if="users.token" @click="publishArticleState = true" color="primary" :label="t('review')" />
            <q-btn v-else @click="loginState = true" color="primary" :label="t('review')" />
          </q-tab-panel>
          <q-tab-panel name="edit" v-if="users.role === 0">
            <q-btn v-if="hasChild" :label='t("addChildBoards")' color="primary" class="q-ml-sm"
              :to="'/board/uploadBoard/' + route.params.id" />
          </q-tab-panel>
        </q-tab-panels>
        <q-tabs v-if="users.role === 0" v-model="tab" indicator-color="transparent" active-color="white"
          active-bg-color="orange" align="justify" :breakpoint="0" class="bg-orange-8 text-grey-5 " dense>
          <q-tab name="boards" :label="t('boards')" v-if="hasChild" />
          <q-tab name="articles" :label="t('articles')" v-if="hasArticle" />
          <q-tab name="edit" :label="t('edit')" v-if="users.role === 0" />
        </q-tabs>
      </div>
    </q-drawer>
    <q-drawer v-model='rightDrawerState' side="right" bordered :width="300" no-swipe-open no-swipe-close>
      <q-select v-model="locale" :options="localeOptions" label="Language:" borderless emit-value map-options />
    </q-drawer>
    <q-page-container>
      <router-view class="q-pa-lg" />
    </q-page-container>
    <!--****************** 彈出視窗 ------>
    <!-- 發布文章框 -->
    <publishArticle></publishArticle>
  </q-layout>
</template>

<script setup>
import headerPage from 'components/Header/HeaderPage.vue'
import chartInfo from 'components/chartInfo.vue'
import { ref, reactive, watch, shallowRef, provide, readonly, inject } from 'vue'
import publishArticle from 'src/components/publishArticle.vue'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { useUserStore } from 'src/stores/user'
// import { useBoardStore } from 'src/stores/board'
import { useRoute, useRouter } from 'vue-router'
import { api, apiAuth } from 'src/boot/axios'
const leftDrawerState = inject('leftDrawerState')
const rightDrawerState = inject('rightDrawerState')
const loginState = inject('loginState')

const leftDrawerActive = true
const route = useRoute()
const router = useRouter()
const users = useUserStore()
// *********************************************************************Header
// 增加多國語言可選+讀取預設語言
const publishArticleState = ref(false)
const localeOptions = [
  { value: 'en-US', label: 'English' },
  { value: 'zh-TW', label: '繁體中文' }
]
const { locale, t } = useI18n({ useScope: 'global' })
locale.value = users.local || useQuasar().lang.getLocale()
watch(locale, () => {
  users.local = locale.value
})
const boardInfoForm = reactive({ chartTitle: '課程評分', averageTitle: '課程平均分數', score: 0, amount: 0, datas: [] })
// *********************************************左側介面+子版清單************************
// #透過網址，取得版的資訊+過濾功能
const tab = ref('boards')
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
const init = async () => {
  console.log('init')
  time.value = Date.now()
  // id 是為了頁內跳轉，有時網址變了不會觸發init，所以改function
  try {
    boards.length = 0
    const { data } = await api.get('/board/' + route.params.id)
    if (data.result) {
      const createBoardsFilter = () => {
        // 清空物件與加入物件的美妙
        for (const k in board) delete board[k]
        Object.assign(board, data.result)
        //
        title.value = data.result.title
        if (data.result.beScored?.score && data.result.beScored.score >= 0) {
          // boardInfoForm.title = data.result.title
          boardInfoForm.score = data.result.beScored.score
          boardInfoForm.amount = data.result.beScored.amount
          boardInfoForm.datas.length = 0
          boardInfoForm.datas.push(...data.result.beScored.scoreChart)
        }
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
      }
      createBoardsFilter()
      // 處理文章(規則去他母版抓)
      // 有成功才顯示不然清除
      const checkArticles = async () => {
        try {
          if (data.result.parent) {
            const parent = await api.get('/board/' + data.result.parent)
            for (const k in article) delete article[k]
            Object.assign(article, parent.data.result.childBoard?.article)
            console.log('母版是' + parent.data.result.title)
            // 母版要開放文章
            if (article.active) {
              console.log('有文章區')
              hasArticle.value = true
            }
          } else {
            hasArticle.value = false
            for (const k in article) {
              delete article[k]
            }
          }
        } catch (error) {
          console.log(error.response.data)
        }
        // 要有母版
      }
      await checkArticles()
      // 抓第一個分頁顯示
      if (!hasChild.value) {
        if (!hasArticle.value) {
          tab.value = 'edit'
          router.push('/board/uploadBoard/' + route.params.id)
        } else {
          tab.value = 'articles'
          router.push('/board/articles/' + route.params.id)
        }
      }
      // 調整tab
      switch (route.name) {
        case 'uploadBoard':
          tab.value = 'edit'
          break
        case 'articles':
          tab.value = 'articles'
          break
        case 'boards':
          tab.value = 'boards'
          break
        default:
          console.log('error')
      }
      // ********* 取得文章 (tab要是articles 不然不浪費資源)*******
      const getArticles = async () => {
        try {
          const { data } = await apiAuth.get('/article/' + route.params.id)
          articles.length = 0
          articles.push(...data.result)
        } catch (error) {
          console.log(error.response.data)
        }
      }
      if (tab.value === 'articles') getArticles()
    } else {
      boardInfoForm.score = null
    }
    // 判斷是否有版/文章 微調
    filterC0.value = filterOptions.value[0]
    time.value = Date.now() - time.value
    //
  } catch (error) {
    console.log(error)
    router.push('/404')
  }
}
init()
// *
watch(tab, (newV, oldV) => {
  switch (tab.value) {
    case 'edit':
      console.log('changed edit')
      router.push('/board/uploadBoard/' + route.params.id)
      // expected output: "Mangoes and papayas are $2.79 a pound."
      break
    case 'articles':
      console.log('changed articles')
      router.push('/board/articles/' + route.params.id)
      // expected output: "Mangoes and papayas are $2.79 a pound."
      break
    case 'boards':
      console.log('changed boards')
      router.push('/board/' + route.params.id)
    // expected output: "Mangoes and papayas are $2.79 a pound."
  }
})
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
    const { data } = await api.get('/board/childs/' + (route.params.id ? route.params.id : '62fc99277f3adbe07e542a58') + '?test=' + encodedFilter)
    boards.length = 0
    // 查詢完左側隱藏(若電腦版不能被隱藏，會出問題)
    if (document.documentElement.scrollWidth < 768) {
      leftDrawerState.value = false
    }
    boards.push(...data.result)
  } catch (error) {
    console.log(error.response.data)
  }
  getChildboardLoading.value = false
}
provide('publishArticleState', publishArticleState)
provide('board', readonly(board))
provide('boards', readonly(boards))
provide('articles', articles)
provide('hasChild', readonly(hasChild))
provide('hasArticle', readonly(hasArticle))
provide('article', readonly(article))
// *********************************************子文章************************
</script>
<style lang="sass" scoped >
.q-header
  height: 48px
.searchRows > .row
  margin-bottom: 30px
.q-drawer-container
  &:deep(.q-drawer)
    top: 48px
    width: 85% !important
    max-width: 300px
  &:deep(.q-drawer__backdrop)
    z-index: 1999 !important

</style>
