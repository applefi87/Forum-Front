<template >
  <q-dialog v-model="publishArticleState" persistent v-if="categoryList.length > 0">
    <div>
      <!-- <q-form class="q-gutter-md" @submit.prevent="publish()">
        <q-select outlined v-model="selectCategory" :options="categoryList" label="文章分類" dense options-dense
          :behavior="$q.platform.is.ios === true ? 'dialog' : 'menu'" />
        <table>
          <tr>
            <td>{{ categoryList[selectCategory] }}</td>
            <td>
              <q-input v-model="form['f' + selectCategory]" :rules="titleVal">
              </q-input>
            </td>
          </tr>
        </table>
      </q-form> -->
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
const selectCategory = ref(1)
// 先抓取文章分類+設個預設的
const categoryList = reactive([])
const categoryCodeList = computed(() => { return article?.category?.map(c => c.c) })
// const formCategory = ref(categoryList?.value)
// 使用者選的文章分類

// form 基礎object建立(依照article) 剩下vue會自動form.xxx 建立
watch(article, () => {
  console.log(article.category)
  // 用if因為子元件先跑完母元件才post 重仔頁面會有一段時間沒資料報錯, 要有值才使賦值
  if (article?.category?.length > 0) {
    console.log('in')
    categoryList.length = 0
    categoryList.push(...article.category)
    categoryList?.forEach(f => {
      form['f' + f.c] = { title: '', content: '' }
    })
    selectCategory.value = 4
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
</style>
