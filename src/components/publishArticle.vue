<template >
  <q-dialog v-model="publishArticleState" persistent v-if="categoryList.length > 0">
    <div>
      <q-form class="q-gutter-md" @submit.prevent="publish()">
        <q-select v-if="uniqueList?.length > 0" outlined v-model="unique" :options="uniqueList" label="學期/班" dense
          options-dense :behavior="$q.platform.is.ios === true ? 'dialog' : 'menu'" />
        <q-select outlined v-model="selectCat" :options="categoryCodeList" label="文章分類" dense options-dense
          :behavior="$q.platform.is.ios === true ? 'dialog' : 'menu'" />
        <q-select outlined v-model="privacy" :options="privacyList" :label="t('privacy')" dense options-dense
          :behavior="$q.platform.is.ios === true ? 'dialog' : 'menu'" />
        <table v-if="category">
          <!-- 評分 -->
          <tr v-if="category && category.c === 1">
            <td>評分</td>
            <td>
              <q-rating v-model="form.f1.score" size="2em" color="grey" color-selected="yellow" />
            </td>
          </tr>
          <!-- tag -->
          <tr v-if="category.tagActive">
            <td>Tag</td>
            <td>
              <q-option-group :options="category.tagOption.map(o => { return { label: o, value: o } })" type="checkbox"
                v-model="form['f' + selectCat.value].tags" />
            </td>
          </tr>
          <!-- 標題 -->
          <tr>
            <td>{{ category.titleCol }}</td>
            <td>
              <q-input v-model="form['f' + selectCat.value].title" :rules="titleVal">
              </q-input>
            </td>
          </tr>
          <!-- 其他col -->
          <tr v-for="col in (category.cols?.length > 0 ? category.cols : [])" :key="col">
            <td>{{ t(col.n) }}</td>
            <td>
              <q-input v-model="form['f' + selectCat.value].cols[col.n]">
              </q-input>
            </td>
          </tr>
          <!-- content(放最後) -->
          <tr>
            <td>{{ category.contentCol }}</td>
            <td>
              <q-input v-model="form['f' + selectCat.value].content" :rules="contentVal">
              </q-input>
            </td>
          </tr>
        </table>
        <q-btn :label="t('submit')" type="submit"></q-btn>
      </q-form>
    </div>
  </q-dialog>
</template>

<script setup scoped>
import { ref, reactive, inject, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { apiAuth } from 'src/boot/axios'
import { useRoute } from 'vue-router'
const route = useRoute()
// import { useArticleStore } from 'src/stores/article'
const { t } = useI18n()
// const articles = useArticleStore()
// 初始變數
const publishArticleState = inject('publishArticleState')
// 版有unique資料
const board = inject('board')
// 母版有能留言的規則
const article = inject('article')
// ************************************************************
// 有3個板，就產生3個表單 totalForm.f1 2 3
// 用for 建置 加上讀取規則自動產生
// 如果換版>watch，把原本全清除for[key]，重新建
const form = reactive({})
const unique = ref('')
// const uniqueList = reactive([])
const selectCat = ref(null)
const privacyList = computed(() => { return [{ label: t('showAll'), value: 1 }, { label: t('anonymous'), value: 0 }] })
const privacy = ref(privacyList.value[0])
// 先抓取文章分類+設個預設的
const categoryList = reactive([])
const categoryCodeList = computed(() =>
  article?.category?.map(c => { return { label: c.n, value: c.c } })
)
// ***************給vue元件用 不用重複算
const category = computed(() => categoryList.find(c => {
  return c.c === selectCat?.value?.value
}))
// 獨立選單建立
const uniqueList = computed(() => {
  console.log(board.uniqueData)
  console.log(board?.uniqueData?.length)
  if (board?.uniqueData?.length > 0) {
    return board.uniqueData.map(u => {
      return {
        label: t('semester') + ':' + (u.c80 || t('none')) + ',' + t('time') + ':' + ((u.c85[0] && u.c85[0] !== '無') ? u.c85[0] : t('none')) + ',' + t('location') + ':' + ((u.c85[1] && u.c85[1] !== '無') ? u.c85[1] : t('none')), value: u._id
      }
    })
  }
  return []
})

// *********************

// form 基礎object建立(依照article) 剩下vue會自動form.xxx 建立
watch(article, () => {
  // 用if因為子元件先跑完母元件才post 重仔頁面會有一段時間沒資料報錯, 要有值才使賦值
  if (article?.category?.length > 0) {
    categoryList.length = 0
    categoryList.push(...article.category)
    // 對應加上form.fx
    categoryList?.forEach(f => {
      form['f' + f.c] = { title: 'wdaaaaaaaaaaaaa', content: 'wwwwwwwwwwwwwwww' }
      const formIn = form['f' + f.c]
      if (f.c === 1) formIn.score = 5
      if (f.tagActive) {
        formIn.tags = []
      }
      if (f.cols?.length > 0) {
        formIn.cols = {}
        for (const col of f.cols) {
          formIn.cols[col.n] = ''
        }
        formIn.tags = []
      }
    })
    // 預設第一個
    selectCat.value = { label: categoryList[0].n, value: categoryList[0].c }
  }
})
//
const titleVal = [
  val => (val && val.length >= 5 && val.length <= 30) || '需5~30字之間'
]
const contentVal = [
  val => (val && val.length >= 10 && val.length <= 500) || '需10~500字之間'
]
// ****************發布****
const publish = async () => {
  if (route.params.id) {
    try {
      const submit = JSON.parse(JSON.stringify(form['f' + selectCat.value.value]))
      submit.privacy = privacy.value
      submit.category = selectCat.value.value
      submit.uniqueId = unique.value.value
      const { data } = await apiAuth.post('/article/create/' + (route.params.id ? route.params.id : '62fc99277f3adbe07e542a58'), form)
    } catch (error) {
      console.log(error.response.data)
    }
  }
}

</script>

<style lang="sass">
.q-form
  background: white
.q-option-group
  display: flex
  flex-wrap: wrap
</style>
