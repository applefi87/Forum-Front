<template >
  <q-layout view="hHh lpR fff" id="m">
    <q-header elevated class="bg-primary text-white">
      <headerPage :leftDrawerActive="leftDrawerActive"></headerPage>
    </q-header>
    <!-- ******************************************************** -->
    <q-drawer v-model='leftDrawerState' side="left" persistent bordered show-if-above :breakpoint="768"
      style="height: 100% ;display:flex;flex-direction: column">
      <h6 class="q-my-lg q-mx-md title">{{ title }}
      </h6>
      <q-tabs v-model="tab" indicator-color="transparent" active-color="white" active-bg-color="orange" align="justify"
        :breakpoint="0" class="bg-orange-8 text-grey-5 " dense mobile-arrows v-if="users.role === 0">
        <q-tab name="boards" :label="t('boards')" v-if="hasChild" />
        <q-tab name="articles" :label="t('articles')" v-if="hasArticle" />
        <q-tab name="edit" :label="t('edit')" v-if="users.role === 0" />
      </q-tabs>
      <chartInfo v-if="boardInfoForm.amount > 0" :form="boardInfoForm" />
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
          <q-input borderless dense v-model="search" :placeholder="t('search')" outlined>
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
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
          <!-- <q-btn v-if="hasChild" :label='t("addChildBoards")' color="primary" class="q-ml-sm"
              :to="'/board/uploadBoard/' + route.params.id" /> -->
        </q-tab-panel>
      </q-tab-panels>

    </q-drawer>
    <q-drawer v-model='rightDrawerState' side="right" bordered :width="300" no-swipe-open no-swipe-close>
      <q-select v-model="locale" :options="localeOptions" label="Language:" borderless emit-value map-options />
    </q-drawer>
    <q-page-container style="height: 100% !important ;background: #999">
      <boardPage v-if="tab === 'boards'" class="wh100 q-pa-lg gt-sm">
      </boardPage>
      <boardPage v-if="tab === 'boards'" class="wh100 lt-md">
      </boardPage>
      <articlePage v-if="tab === 'articles'" class="wh100 q-pa-lg gt-sm">
      </articlePage>
      <articlePage v-if="tab === 'articles'" class="wh100 lt-md">
      </articlePage>
      <uploadBoardPage v-if="tab === 'edit'" class="wh100 q-pa-lg">
      </uploadBoardPage>
    </q-page-container>
    <!--****************** 彈出視窗 ------>
    <!-- 發布文章框 -->
    <publishArticle></publishArticle>
    <viewArticle></viewArticle>
    <editArticlePage></editArticlePage>
    <q-dialog v-model="userInfoState">
      <chartInfo :form="userInfoForm" />
    </q-dialog>
  </q-layout>
</template>

<script setup>
import uploadBoardPage from 'pages/admin/uploadBoardPage.vue'
import articlePage from 'pages/articlePage.vue'
import boardPage from 'pages/boardPage.vue'
import headerPage from 'components/Header/HeaderPage.vue'
import chartInfo from 'components/chartInfo.vue'
import { ref, reactive, watch, computed, shallowRef, provide, readonly, inject } from 'vue'
import publishArticle from 'src/components/publishArticle.vue'
import viewArticle from 'src/components/viewArticle.vue'
import editArticlePage from 'src/components/editArticlePage.vue'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { useUserStore } from 'src/stores/user'
// import { useBoardStore } from 'src/stores/board'
import { useRoute, useRouter } from 'vue-router'
import { api, apiAuth } from 'src/boot/axios'
const route = useRoute()
const router = useRouter()
const users = useUserStore()
//
const leftDrawerState = inject('leftDrawerState')
const rightDrawerState = inject('rightDrawerState')
const loginState = inject('loginState')
const langWord = inject('langWord')
const search = ref('')
const leftDrawerActive = true
const publishArticleState = ref(false)
const editArticleState = ref(false)
const editArticleContent = reactive({})
const userInfoState = ref(false)
const userInfoForm = reactive({ titleTitle: '', title: '', averageTitle: 'averageGiveScore', chartTitle: '', scoreSum: 0, amount: 0, datas: [] })
// *********************************************************************Header
// 增加多國語言可選+讀取預設語言
const localeOptions = [
  { value: 'en-US', label: 'English' },
  { value: 'zh-TW', label: '繁體中文' }
]
const { locale, t } = useI18n({ useScope: 'global' })
if (!users.local) users.local = useQuasar().lang.getLocale()
locale.value = users.local
watch(locale, () => {
  users.local = locale.value
})

const boardInfoForm = reactive({ chartTitle: 'scoreChart', averageTitle: 'averageScore', scoreSum: 0, amount: 0, datas: [] })
// *********************************************左側介面+子版清單************************
// #透過網址，取得版的資訊+過濾功能
const tab = ref('boards')
const hasChild = ref(false)
const hasArticle = ref(false)
const board = reactive({})
const boards = reactive([])
const parent = reactive({})
const articleRule = reactive({})
const article = reactive([])
const articles = reactive([])
// 給articlePage用的
const articleMsg = reactive({ datas: [], _id: '', isSelf: false })
const viewArticleState = ref(false)
const filterC0 = ref('')
const filterAll = ref(false)
const filterOptions = shallowRef([])
// 之後再自動抓
const filterUnique = ref('')
const filterUniqueOptions = shallowRef([])
// 每次進到新版統一的步驟
const init = async () => {
  // console.log('init')
  // id 是為了頁內跳轉，有時網址變了不會觸發init，所以改function
  try {
    boards.length = 0
    const { data } = await api.get('/board/' + route.params.id)
    // 初始化就檢測JWTcookie決定是否有登陸(只有後端能讀cookie),並更新整個也面的登錄判斷點(token
    if (data.result) {
      // 左方該版資訊
      const createLeftDrawer = async () => {
        // 重整該版資訊
        for (const k in board) delete board[k]
        Object.assign(board, data.result)
        // // console.log(data.result)
        // *****如果有被評分 顯示被評分資訊與圖表
        if (data.result.beScored?.amount >= 0) {
          boardInfoForm.scoreSum = data.result.beScored.scoreSum
          boardInfoForm.amount = data.result.beScored.amount
          boardInfoForm.datas.length = 0
          boardInfoForm.datas.push(...data.result.beScored.scoreChart)
        } else {
          boardInfoForm.amount = undefined
        }
        // *****有子板?，顯示都有的UniqueOptions、filterOptions
        const filter = data.result.childBoard.rule?.display?.filter
        hasChild.value = data.result.childBoard.active
        filterOptions.value = filter?.dataCols?.c0?.l || ['']
        filterC0.value = filterOptions.value.includes(filter?.dataCols?.c0?.d) ? filter?.dataCols?.c0?.d : (filterOptions.value[0] || '')
        filterUniqueOptions.value = filter?.uniqueCols?.c80?.l || ['']
        filterUnique.value = filterUniqueOptions.value.includes(filter?.uniqueCols?.c80?.d) ? filter?.uniqueCols?.c80?.d : (filterUniqueOptions.value[0] || '')
        // *****有文章?(他的母版-開放他有文章區)
        try {
          let findArticle = false
          const parentID = data.result.parent
          if (parentID) {
            const { data } = await api.get('/board/' + parentID)
            for (const k in parent) delete parent[k]
            Object.assign(parent, data.result)
            for (const k in articleRule) delete articleRule[k]
            Object.assign(articleRule, parent.childBoard?.article)
            // 母版要開放文章
            if (articleRule.active) {
              // console.log('有文章區')
              hasArticle.value = true
              findArticle = true
            }
          }
          if (!findArticle) {
            // 不然就清空不顯示
            hasArticle.value = false
            for (const k in articleRule) {
              delete articleRule[k]
            }
          }
        } catch (error) {
          // console.log(error.response.data)
        }
      }
      await createLeftDrawer()
      // 如果該分頁沒有tab，顯示下個tab
      if (hasChild.value) {
        tab.value = 'boards'
      } else if (hasArticle.value) {
        tab.value = 'articles'
      } else {
        tab.value = 'edit'
      }
    } else {
      boardInfoForm.score = null
    }
  } catch (error) {
    // console.log(error)
    router.push('/404')
  }
}
init()
const title = computed(() => {
  // 給board未讀取到的時間緩衝避免報錯
  if (board?.colData) {
    //  有母版就抓母版設定來顯示標題文字
    if (parent?.childBoard?.rule?.titleCol) {
      return board.colData[parent.childBoard.rule.titleCol[langWord.value]]
    } else if (board.titleCol) {
      // 不然就會是從自己資料抓
      return board.colData[board.titleCol[langWord.value]]
    }
  }
  return ''
})

// 雖然目前都開新分頁，原本這樣可避免id便頁面不跳轉，保險還是留著
watch(() => route.params, (to, from) => {
  // 因為是在layout做，確保是板的情況在因應:id更新重跑，不然不用
  if (route.name === 'boards') {
    init()
  }
})
// *
// ********* 取得文章 (tab要是articles 不然不浪費資源)*******
const getArticles = async () => {
  try {
    const { data } = await apiAuth.get('/article/' + route.params.id)
    articles.length = 0
    articles.push(...data.result)
  } catch (error) {
    // console.log(error.response.data)
  }
}
// 進articles的tab才載入，加快初始速度，同時載入過不重複載入
watch(tab, (to, from) => {
  if (tab.value === 'articles' && articles.length <= 0) {
    getArticles()
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
      }],
      search: [{
        col: 'c40',
        text: search.value
      }]
    }))
    const { data } = await api.get('/board/childs/' + (route.params.id ? route.params.id : '62fc99277f3adbe07e542a58') + '?test=' + encodedFilter)
    boards.length = 0
    // console.log(data)
    // 查詢完左側隱藏(若電腦版不能被隱藏，會出問題)
    if (document.documentElement.scrollWidth < 768) {
      leftDrawerState.value = false
    }
    boards.push(...data.result)
  } catch (error) {
    // console.log(error.response.data)
  }
  getChildboardLoading.value = false
}
provide('publishArticleState', publishArticleState)
provide('board', readonly(board))
provide('boards', readonly(boards))
provide('parent', readonly(parent))
provide('articles', articles)
provide('article', article)
provide('articleMsg', articleMsg)
provide('hasChild', readonly(hasChild))
provide('hasArticle', readonly(hasArticle))
provide('articleRule', readonly(articleRule))
provide('viewArticleState', viewArticleState)
provide('editArticleContent', editArticleContent)
provide('editArticleState', editArticleState)
provide('userInfoState', userInfoState)
provide('userInfoForm', userInfoForm)
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
// 處理圖表太大問題
.q-card
  min-width: 250px
.wh100
  width: 100%
  height: 100%
.title
  overflow: hidden
  text-overflow: ellipsis
  display: -webkit-box
  -webkit-line-clamp: 3
  -webkit-box-orient: vertical
</style>
