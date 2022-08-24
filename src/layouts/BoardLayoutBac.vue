<template >
  <q-drawer v-model='leftDrawerState' side="left" persistent bordered no-swipe-open no-swipe-close class="141">
    <div style="height: 100% ;display:flex;flex-direction: column; justify-content: space-between;">
      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="board">
          <h5 class="q-my-lg">{{ title }}{{ time }}</h5>
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

      <q-tabs v-model="tab" indicator-color="transparent" active-color="white" class="bg-teal text-grey-5 shadow-2"
        dense>
        <q-tab name="board" label="board" />
        <q-tab name="article" label="article" />
        <q-tab name="edit" label="edit" />
      </q-tabs>
    </div>

  </q-drawer>
  <q-page-container>
    <router-view />
  </q-page-container>
  <!--****************** 彈出視窗 ------>
  <!-- 發布文章框 -->
  <publishArticle></publishArticle>
</template>

<script setup>
import { ref, reactive, shallowRef, provide, readonly, inject } from 'vue'
import publishArticle from 'src/components/publishArticle.vue'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { useUserStore } from 'src/stores/user'
import { useRoute, useRouter } from 'vue-router'
import { api } from 'src/boot/axios'
const route = useRoute()
const router = useRouter()
const users = useUserStore()
// ***
const leftDrawerState = inject('leftDrawerState')
const loginDropdownState = inject('loginDropdownState')
const tab = ref('board')
//
const publishArticleState = ref(false)
const localeOptions = [
  { value: 'en-US', label: 'English' },
  { value: 'zh-TW', label: '繁體中文' }
]
const { locale, t } = useI18n({ useScope: 'global' })
locale.value = useQuasar().lang.getLocale()

// *********************************************左側介面+子版清單************************
// #透過網址，取得版的資訊+過濾功能
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
  time.value = Date.now()

  try {
    boards.length = 0
    const { data } = await api.get('/board/' + route.params.id)
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
            const { data } = await api.get('/article/' + route.params.id)
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
    const { data } = await api.get('/board/childs/' + (route.params.id + '?test=' + encodedFilter))
    boards.length = 0
    boards.push(...data.result)
    router.push('/board/' + route.params.id)
  } catch (error) {
    console.log(error)
  }
  getChildboardLoading.value = false
}
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

</style>
<!-- login 待處理同IP登陸5次要等15分鐘 (目前可一直試) -->
