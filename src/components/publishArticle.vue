<template >
  <q-dialog v-model="publishArticleState" persistent v-if="categoryList.length > 0">
    <div>
      <q-form class="q-gutter-md" @submit.prevent="publish()">
        <q-select outlined v-model="selectCat" :options="categoryCodeList" label="文章分類" dense options-dense
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
          <!-- <tr v-if="category.cols?.length > 0"> -->
          <tr v-for="col in (category.cols?.length > 0 ? category.cols : [])" :key="col">
            <td>{{ t(col.n) }}</td>
            <td>
              <q-input v-model="form['f' + selectCat.value].title" :rules="titleVal">
              </q-input>
            </td>
          </tr>
          <!-- content(放最後) -->
          <tr>
            <td>{{ category.contentCol }}</td>
            <td>
              <q-input v-model="form['f' + selectCat.value].content" :rules="titleVal">
              </q-input>
            </td>
          </tr>
        </table>
      </q-form>
    </div>
  </q-dialog>
</template>

<script setup scoped>
import { ref, reactive, inject, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUserStore } from 'src/stores/user'
import notify from '../utils/notify'
const { t } = useI18n()
const users = useUserStore()
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
const selectCat = ref(null)
// 先抓取文章分類+設個預設的
const categoryList = reactive([])
const categoryCodeList = computed(() =>
  article?.category?.map(c => { return { label: c.n, value: c.c } })
)
// 給vue元件用 不用重複算
const category = computed(() => categoryList.find(c => {
  return c.c === selectCat?.value?.value
}))
// const formCategory = ref(categoryList?.value)
// 使用者選的文章分類

// form 基礎object建立(依照article) 剩下vue會自動form.xxx 建立
watch(article, () => {
  // 用if因為子元件先跑完母元件才post 重仔頁面會有一段時間沒資料報錯, 要有值才使賦值
  if (article?.category?.length > 0) {
    categoryList.length = 0
    categoryList.push(...article.category)
    // 對應加上form.fx
    categoryList?.forEach(f => {
      form['f' + f.c] = { title: '', content: '' }
      const formIn = form['f' + f.c]
      if (f.c === 1) formIn.score = 5
      if (f.tagActive) {
        formIn.tags = []
      }
    })
    // 預設第一個
    selectCat.value = { label: categoryList[0].n, value: categoryList[0].c }
  }
})
//
const titleVal = [
  val => (val && val.length >= 5 && val.length <= 30) || '長度需介於5~30字之間'
]
// ****************發布****
const publish = async () => {
  notify()
}

</script>

<style lang="sass">
.q-form
  background: white
.q-option-group
  display: flex
  flex-wrap: wrap
</style>
